const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "shop.db"));

db.serialize(() => {

  // Tabela produktów
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL CHECK(price>=0),
      quantity INTEGER NOT NULL CHECK(quantity>=0),
      image TEXT,
      alt TEXT
    )
  `);

  // Tabela koszyka
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity>0),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Tabela uwag/feedback
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Seedowanie przykładowych produktów
  db.get("SELECT COUNT(*) AS count FROM products", (err,row)=>{
    if(row.count === 0){
      const products = [
        { name:"Laptop Pro 15", description:"Wydajny laptop 16GB RAM SSD 512GB", price:4999.99, quantity:5,
          image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8", alt:"Srebrny laptop na biurku" },
        { name:"Smartfon X200", description:"Smartfon AMOLED 108MP aparat", price:2999.99, quantity:8,
          image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", alt:"Czarny smartfon na stole" },
        { name:"Słuchawki bezprzewodowe", description:"Słuchawki z ANC i 30h baterii", price:599.99, quantity:12,
          image:"https://images.unsplash.com/photo-1518444028785-8fbcd101ebb9", alt:"Czarne słuchawki bezprzewodowe" },
        { name:"Klawiatura RGB", description:"Gamingowa klawiatura mechaniczna", price:349.99, quantity:7,
          image:"https://images.unsplash.com/photo-1518770660439-4636190af475", alt:"Podświetlana klawiatura" },
        { name:"Monitor 27\" 4K", description:"Monitor IPS 4K do grafiki", price:1899.99, quantity:4,
          image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3", alt:"Duży monitor na biurku" }
      ];
      products.forEach(p=>{
        db.run(`INSERT INTO products (name,description,price,quantity,image,alt) VALUES (?,?,?,?,?,?)`,
          [p.name,p.description,p.price,p.quantity,p.image,p.alt]);
      });
      console.log("Seedowane produkty dodane.");
    }
  });

});

module.exports = db;
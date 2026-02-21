require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./models/db");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

// ================== FRONT ==================
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"public/index.html")));
app.get("/cart", (req,res)=>res.sendFile(path.join(__dirname,"public/cart.html")));
app.get("/product/:id", (req,res)=>res.sendFile(path.join(__dirname,"public/product.html")));

// ================== API PRODUCTS ==================
app.get("/api/products", (req,res,next)=>{
  const sort = req.query.sort==="price"?"price":"name";
  db.all(`SELECT * FROM products ORDER BY ${sort} ASC`, (err,rows)=>{
    if(err) return next(err);
    res.json(rows);
  });
});

app.get("/api/products/:id", (req,res,next)=>{
  db.get("SELECT * FROM products WHERE id=?", [req.params.id], (err,row)=>{
    if(err) return next(err);
    if(!row) return res.status(404).json({error:"Nie znaleziono produktu"});
    res.json(row);
  });
});

app.post("/api/products", (req,res,next)=>{
  const {name,description,price,quantity,image,alt}=req.body;
  if(!name || price<0 || quantity<0) return res.status(400).json({error:"Niepoprawne dane"});
  db.run(`INSERT INTO products (name,description,price,quantity,image,alt) VALUES (?,?,?,?,?,?)`,
    [name,description,price,quantity,image,alt], function(err){
      if(err) return next(err);
      res.status(201).json({id:this.lastID});
    });
});

app.put("/api/products/:id", (req,res,next)=>{
  const {name,description,price,quantity,image,alt}=req.body;
  if(!name || price<0 || quantity<0) return res.status(400).json({error:"Niepoprawne dane"});
  db.run(`UPDATE products SET name=?,description=?,price=?,quantity=?,image=?,alt=? WHERE id=?`,
    [name,description,price,quantity,image,alt,req.params.id], (err)=>{
      if(err) return next(err);
      res.json({ok:true});
    });
});

app.delete("/api/products/:id",(req,res,next)=>{
  db.run("DELETE FROM products WHERE id=?",[req.params.id], (err)=>{
    if(err) return next(err);
    res.json({ok:true});
  });
});

// ================== API CART ==================
app.get("/api/cart",(req,res,next)=>{
  db.all(`
    SELECT cart.id, cart.quantity, products.name, products.price, products.image, products.alt, products.quantity AS stock
    FROM cart JOIN products ON cart.product_id = products.id
  `,(err,rows)=>{
    if(err) return next(err);
    res.json(rows);
  });
});

app.post("/api/cart",(req,res,next)=>{
  const {product_id,quantity}=req.body;
  if(!product_id || quantity<1) return res.status(400).json({error:"Niepoprawne dane"});
  db.get("SELECT quantity FROM products WHERE id=?",[product_id],(err,prod)=>{
    if(err) return next(err);
    if(!prod) return res.status(404).json({error:"Produkt nie istnieje"});
    if(quantity>prod.quantity) return res.status(400).json({error:"Brak wystarczającej ilości"});
    db.get("SELECT * FROM cart WHERE product_id=?",[product_id],(err,row)=>{
      if(err) return next(err);
      if(row){
        const newQty = row.quantity + quantity;
        if(newQty>prod.quantity) return res.status(400).json({error:"Nie można więcej niż w magazynie"});
        db.run("UPDATE cart SET quantity=? WHERE product_id=?",[newQty,product_id],err2=>{
          if(err2) return next(err2);
          res.json({ok:true});
        });
      } else {
        db.run("INSERT INTO cart (product_id,quantity) VALUES (?,?)",[product_id,quantity], err2=>{
          if(err2) return next(err2);
          db.run("UPDATE products SET quantity = quantity - ? WHERE id=?",[quantity, product_id], err3=>{
            if(err3) return next(err3);
            res.json({ok:true});
          });
        });
      }
    });
  });
});

app.put("/api/cart/:id",(req,res,next)=>{
  const {quantity}=req.body;
  if(quantity<1) return res.status(400).json({error:"Niepoprawna ilość"});
  db.get("SELECT product_id FROM cart WHERE id=?",[req.params.id],(err,row)=>{
    if(err) return next(err);
    if(!row) return res.status(404).json({error:"Nie znaleziono w koszyku"});
    db.get("SELECT quantity FROM products WHERE id=?",[row.product_id],(err,prod)=>{
      if(err) return next(err);
      if(quantity>prod.quantity) return res.status(400).json({error:"Nie można więcej niż w magazynie"});
      db.run("UPDATE cart SET quantity=? WHERE id=?",[quantity,req.params.id],err2=>{
        if(err2) return next(err2);
        res.json({ok:true});
      });
    });
  });
});

app.delete("/api/cart/:id",(req,res,next)=>{
  db.run("DELETE FROM cart WHERE id=?",[req.params.id],err=>{
    if(err) return next(err);
    res.json({ok:true});
  });
});

// ================== API FEEDBACK ==================

// Pobierz wszystkie uwagi dla produktu
app.get("/api/feedback/:product_id", (req,res,next)=>{
  const product_id = req.params.product_id;
  db.all("SELECT * FROM feedback WHERE product_id=? ORDER BY created_at DESC",[product_id],(err,rows)=>{
    if(err) return next(err);
    res.json(rows);
  });
});

// Dodaj nową uwagę
app.post("/api/feedback", (req,res,next)=>{
  const {product_id, name, message} = req.body;
  if(!product_id || !name || !message) return res.status(400).json({error:"Niepoprawne dane"});
  db.run("INSERT INTO feedback (product_id,name,message) VALUES (?,?,?)",[product_id,name,message],function(err){
    if(err) return next(err);
    res.status(201).json({id:this.lastID});
  });
});

// ===== Middleware błędów =====
app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({error:"Błąd serwera"});
});

app.listen(PORT,()=>console.log(`Server na http://localhost:${PORT}`));
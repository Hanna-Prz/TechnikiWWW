// =======================
// Ładowanie produktów
// =======================
async function loadProducts(sort='name'){
  try {
    const res = await fetch(`/api/products?sort=${sort}`);
    const products = await res.json();

    const container = document.getElementById('products') || document.getElementById('product-detail');
    if(!container) return;

    container.innerHTML='';

    if(container.id==='products'){
      products.forEach(p=>{
        const div = document.createElement('div');
        div.className='product';
        div.innerHTML=`
          <h3>${p.name}</h3>
          <img src="${p.image}" alt="${p.alt}">
          <p>${p.description}</p>
          <p class="price">${p.price.toFixed(2)} zł</p>
          <p class="stock ${p.quantity===0?'out-stock':p.quantity<5?'low-stock':''}">
            ${p.quantity===0?'Brak w magazynie':p.quantity<5?'Ostatnie sztuki: '+p.quantity:'Dostępne: '+p.quantity}
          </p>
          <button onclick="addToCart(${p.id})" ${p.quantity===0?'disabled':''}>
            ${p.quantity===0?'Brak':'Dodaj do koszyka'}
          </button>
          <button onclick="window.location='product.html?id=${p.id}'">
            Szczegóły
          </button>
        `;
        container.appendChild(div);
      });
    } else if(container.id==='product-detail' && window.productId){
      const product = products.find(p=>p.id==window.productId);
      if(!product){ container.innerHTML='<p>Nie znaleziono produktu</p>'; return; }

      container.innerHTML=`
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.alt}">
        <p>${product.description}</p>
        <p class="price">${product.price.toFixed(2)} zł</p>
        <p class="stock ${product.quantity===0?'out-stock':product.quantity<5?'low-stock':''}">
          ${product.quantity===0?'Brak w magazynie':product.quantity<5?'Ostatnie sztuki: '+product.quantity:'Dostępne: '+product.quantity}
        </p>
        <input type="number" id="qty" min="1" max="${product.quantity}" value="1">
        <button onclick="addToCart(${product.id})" ${product.quantity===0?'disabled':''}>
          ${product.quantity===0?'Brak':'Dodaj do koszyka'}
        </button>
      `;
    }

  } catch(err){
    console.error('Błąd ładowania produktów:', err);
  }
}

// =======================
// Dodawanie do koszyka
// =======================
async function addToCart(id){
  const qtyInput = document.getElementById('qty');
  const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

  try {
    const res = await fetch('/api/cart',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({product_id:id,quantity})
    });
    const data = await res.json();

    if(data.ok){
      alert('Dodano do koszyka');

      // Odśwież produkty
      await loadProducts();

      // Jeśli koszyk jest wyświetlany, odśwież koszyk
      const cartContainer = document.getElementById('cart');
      if(cartContainer) {
        await loadCart();
      }

      // Jeśli jesteśmy na stronie produktu, odśwież max qty
      const productQtyInput = document.getElementById('qty');
      if(productQtyInput){
        const res2 = await fetch(`/api/products/${id}`);
        const product = await res2.json();
        productQtyInput.max = product.quantity;
        if(product.quantity === 0){
          productQtyInput.disabled = true;
          document.querySelector('#product-detail button').disabled = true;
          document.querySelector('#product-detail button').innerText = 'Brak';
        }
      }

    } else {
      alert(data.error || 'Błąd');
    }

  } catch(err){
    console.error('Błąd dodawania do koszyka:', err);
  }
}

// =======================
// Feedback
// =======================
async function loadFeedback(){
  if(!window.productId) return;
  try {
    const res = await fetch(`/api/feedback/${window.productId}`);
    const feedbacks = await res.json();
    const container = document.getElementById('feedback-list');
    container.innerHTML = '';

    if(feedbacks.length === 0){
      container.innerHTML = '<p>Brak opinii</p>';
      return;
    }

    feedbacks.forEach(f=>{
      const div = document.createElement('div');
      div.className = 'feedback';
      div.innerHTML = `
        <p><strong>${f.name}</strong> (${new Date(f.created_at).toLocaleString()}):</p>
        <p>${f.message}</p>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch(err){
    console.error('Błąd ładowania opinii:', err);
  }
}

// Formularz feedback
const feedbackForm = document.getElementById('feedback-form');
if(feedbackForm){
  feedbackForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('fb-name').value.trim();
    const message = document.getElementById('fb-message').value.trim();
    if(!name || !message) return alert('Uzupełnij wszystkie pola');

    try {
      const res = await fetch('/api/feedback',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({product_id: window.productId, name, message})
      });
      const data = await res.json();
      if(data.id){
        document.getElementById('fb-name').value='';
        document.getElementById('fb-message').value='';
        await loadFeedback();
      } else {
        alert(data.error || 'Błąd');
      }
    } catch(err){
      console.error('Błąd wysyłania opinii:', err);
    }
  });
}

// =======================
// Sortowanie
// =======================
const sortSelect = document.getElementById('sort');
if(sortSelect) sortSelect.addEventListener('change', ()=> loadProducts(sortSelect.value));

// =======================
// Start
// =======================
window.addEventListener('load',()=>{
  loadProducts();
  if(window.productId) loadFeedback();
});
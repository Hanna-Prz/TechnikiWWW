async function loadCart(){
  const res = await fetch('/api/cart');
  const cart = await res.json();
  const container = document.getElementById('cart');
  container.innerHTML='';
  if(cart.length===0){ container.innerHTML="<h2>Koszyk jest pusty 🛒</h2>"; document.getElementById('total').innerText=""; return; }

  let total=0;
  cart.forEach(item=>{
    total+=item.price*item.quantity;
    const div=document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <h3>${item.name}</h3>
      <img src="${item.image}" alt="${item.alt}">
      <p>Cena: ${item.price.toFixed(2)} zł</p>
      <p>Ilość: ${item.quantity}</p>
      <button onclick="removeItem(${item.id})">Usuń</button>
    `;
    container.appendChild(div);
  });
  document.getElementById('total').innerText=`Łącznie: ${total.toFixed(2)} zł`;
}

async function removeItem(id){
  const res=await fetch(`/api/cart/${id}`,{method:'DELETE'});
  const data=await res.json();
  if(data.ok) loadCart();
  else alert(data.error);
}

window.addEventListener('load',loadCart);

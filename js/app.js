/* ========= INIT ========= */
function init(){
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if(!users.find(u=>u.username==="Admin")){
    users.push({username:"Admin",password:"Earth888",role:"admin"});
  }
  localStorage.setItem("users",JSON.stringify(users));

  if(!localStorage.getItem("products")){
    const products=[
      {id:1,name:"Gaming Mouse RGB",price:890,stock:15,
       img:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
       desc:"เมาส์เกมมิ่ง RGB ปรับ DPI ได้ 7200"},
      {id:2,name:"Mechanical Keyboard",price:1990,stock:10,
       img:"https://images.unsplash.com/photo-1625130694338-4110ba634e59?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
       desc:"คีย์บอร์ด Mechanical Blue Switch"},
      {id:3,name:"Gaming Headset",price:1590,stock:8,
       img:"https://media-cdn.bnn.in.th/4828/097855145710-1-square_medium.jpg",
       desc:"หูฟังเกมมิ่ง 7.1 Surround"},
      {id:4,name:"27\" Monitor 144Hz",price:7990,stock:5,
       img:"https://www.jib.co.th/img_master/product/original/2023031413521158404_1.jpg",
       desc:"จอ 27 นิ้ว 144Hz IPS"},
      {id:5,name:"Laptop Stand Aluminum",price:650,stock:20,
       img:"https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2022/07/ergotrend-aluminum-laptop-riser-01-laptop-stand-cover-view.jpg",
       desc:"แท่นวางโน้ตบุ๊กอลูมิเนียม"}
    ];
    localStorage.setItem("products",JSON.stringify(products));
  }

  if(!localStorage.getItem("sales")){
    localStorage.setItem("sales",JSON.stringify([]));
  }
}

/* ========= AUTH ========= */
function login(e){
  e.preventDefault();
  const u=document.getElementById("username").value.trim();
  const p=document.getElementById("password").value.trim();
  const users=JSON.parse(localStorage.getItem("users"));
  const user=users.find(x=>x.username===u && x.password===p);
  if(user){
    localStorage.setItem("currentUser",JSON.stringify(user));
    window.location.href = user.role==="admin" ? "admin.html" : "shop.html";
  }else alert("Wrong Username or Password");
}
function register(e){
  e.preventDefault();
  const email=document.getElementById("regEmail").value.trim();
  const username=document.getElementById("regUsername").value.trim();
  const password=document.getElementById("regPassword").value.trim();
  let users=JSON.parse(localStorage.getItem("users"));
  if(users.find(u=>u.username===username)){
    alert("Username already exists");return;
  }
  users.push({username,password,email,role:"user"});
  localStorage.setItem("users",JSON.stringify(users));
  alert("Register Success! Please login.");
  window.location.href="login.html";
}
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href="index.html";
}
function checkAdmin(){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  if(!user || user.role!=="admin") window.location.href="login.html";
}

/* ========= SHOP ========= */
function loadProducts(){
  const products=JSON.parse(localStorage.getItem("products"));
  const box=document.getElementById("productList");
  box.innerHTML="";
  products.forEach(p=>{
    box.innerHTML+=`
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p>${p.price} ฿</p>
        <p>Stock: ${p.stock}</p>
        <button class="btn" onclick="addToCart(${p.id})">
          เพิ่มลงตะกร้า
        </button>
      </div>`;
  });
}

/* ========= ADMIN ========= */
function loadDashboard(){
  const sales=JSON.parse(localStorage.getItem("sales"));
  const products=JSON.parse(localStorage.getItem("products"));
  let total=0;sales.forEach(s=>total+=s.total||0);
  document.getElementById("dashboard").innerHTML=`
    <div class="card"><h3>ยอดขายทั้งหมด</h3><h2>${total} ฿</h2></div>
    <div class="card"><h3>จำนวนสินค้า</h3><h2>${products.length}</h2></div>
    <div class="card"><h3>จำนวนคำสั่งซื้อ</h3><h2>${sales.length}</h2></div>`;
}
function loadAdminProducts(){
  const products=JSON.parse(localStorage.getItem("products"));
  const box=document.getElementById("adminProducts");
  box.innerHTML="";
  products.forEach(p=>{
    box.innerHTML+=`
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p>${p.price} ฿</p>
        <p>Stock: ${p.stock}</p>
        <button class="btn btn-danger" onclick="deleteProduct(${p.id})">ลบ</button>
      </div>`;
  });
}
function deleteProduct(id){
  let products=JSON.parse(localStorage.getItem("products"));
  products=products.filter(p=>p.id!==id);
  localStorage.setItem("products",JSON.stringify(products));
  loadAdminProducts();
}

function addProduct(e){
  e.preventDefault();

  const name=document.getElementById("pName").value.trim();
  const desc=document.getElementById("pDesc").value.trim();
  const price=parseFloat(document.getElementById("pPrice").value);
  const stock=parseInt(document.getElementById("pStock").value);
  const img=document.getElementById("pImg").value.trim();

  let products=JSON.parse(localStorage.getItem("products")) || [];

  const newProduct={
    id: Date.now(),
    name,
    desc,
    price,
    stock,
    img
  };

  products.push(newProduct);
  localStorage.setItem("products",JSON.stringify(products));

  alert("เพิ่มสินค้าเรียบร้อยแล้ว!");

  document.querySelector("form").reset();

  loadAdminProducts();
  loadDashboard();
}
/* ========= CART SYSTEM (UPGRADED) ========= */

function addToCart(id){
  let cart=JSON.parse(localStorage.getItem("cart")) || [];
  let products=JSON.parse(localStorage.getItem("products"));
  const product=products.find(p=>p.id===id);

  if(product.stock <= 0){
    alert("สินค้าหมดสต็อก!");
    return;
  }

  const exist=cart.find(item=>item.id===id);

  if(exist){
    if(exist.qty < product.stock){
      exist.qty += 1;
    }else{
      alert("จำนวนสินค้าเกิน Stock!");
      return;
    }
  }else{
    cart.push({...product, qty:1});
  }

  localStorage.setItem("cart",JSON.stringify(cart));
  alert("เพิ่มสินค้าในตะกร้าแล้ว!");
}

function loadCart(){
  const cart=JSON.parse(localStorage.getItem("cart")) || [];
  const box=document.getElementById("cartItems");
  const totalBox=document.getElementById("cartTotal");

  box.innerHTML="";
  let total=0;

  cart.forEach(item=>{
    total += item.price * item.qty;

    box.innerHTML += `
      <div class="card">
        <img src="${item.img}">
        <h3>${item.name}</h3>
        <p>ราคา: ${item.price} ฿</p>

        <div style="display:flex;align-items:center;gap:10px;margin:10px 0;">
          <button class="btn" onclick="changeQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button class="btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <p>รวม: ${item.price * item.qty} ฿</p>
        <button class="btn btn-danger" onclick="removeFromCart(${item.id})">
          ลบ
        </button>
      </div>
    `;
  });

  totalBox.innerText="ยอดรวมทั้งหมด: "+total+" ฿";
}

function changeQty(id, change){
  let cart=JSON.parse(localStorage.getItem("cart"));
  let products=JSON.parse(localStorage.getItem("products"));
  const item=cart.find(i=>i.id===id);
  const product=products.find(p=>p.id===id);

  item.qty += change;

  if(item.qty <= 0){
    cart = cart.filter(i=>i.id!==id);
  }

  if(item.qty > product.stock){
    item.qty = product.stock;
    alert("จำนวนสินค้าเกิน Stock!");
  }

  localStorage.setItem("cart",JSON.stringify(cart));
  loadCart();
}

function removeFromCart(id){
  let cart=JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter(item=>item.id!==id);
  localStorage.setItem("cart",JSON.stringify(cart));
  loadCart();
}

function checkout(){
  let cart=JSON.parse(localStorage.getItem("cart")) || [];
  let products=JSON.parse(localStorage.getItem("products")) || [];

  if(cart.length===0){
    alert("ไม่มีสินค้าในตะกร้า");
    return;
  }

  let total=0;

  for(let item of cart){
    const product=products.find(p=>p.id===item.id);

    if(item.qty > product.stock){
      alert("Stock ของ "+product.name+" ไม่พอ!");
      return;
    }

    product.stock -= item.qty;
    total += item.price * item.qty;
  }

  let sales=JSON.parse(localStorage.getItem("sales")) || [];
  sales.push({
    id:Date.now(),
    total:total,
    date:new Date().toLocaleString()
  });

  localStorage.setItem("sales",JSON.stringify(sales));
  localStorage.setItem("products",JSON.stringify(products));
  localStorage.removeItem("cart");

  alert("ชำระเงินสำเร็จ!");
  window.location.href="shop.html";
}

/* ===== CART BADGE UPDATE ===== */
function updateCartBadge(){
  const cart=JSON.parse(localStorage.getItem("cart"))||[];
  const badge=document.getElementById("cartCount");
  if(!badge) return;

  const totalQty=cart.reduce((sum,item)=>sum+item.qty,0);

  if(totalQty>0){
    badge.style.display="inline-block";
    badge.innerText=totalQty;
  }else{
    badge.style.display="none";
  }
}

/* ===== TOAST ===== */
function showToast(message){
  const toast=document.createElement("div");
  toast.className="toast";
  toast.innerText=message;
  document.body.appendChild(toast);

  setTimeout(()=>toast.remove(),3000);
}

/* ===== OVERRIDE addToCart ===== */
const oldAddToCart = addToCart;
addToCart = function(id){
  let products=JSON.parse(localStorage.getItem("products"));
  const product=products.find(p=>p.id===id);

  oldAddToCart(id);

  updateCartBadge();
  showToast("เพิ่มสินค้า '"+product.name+"' ลงตะกร้าแล้ว");
}

/* ===== CHECKOUT MODAL ===== */
function checkout(){
  let cart=JSON.parse(localStorage.getItem("cart"))||[];
  if(cart.length===0){
    showToast("ไม่มีสินค้าในตะกร้า");
    return;
  }

  const modal=document.createElement("div");
  modal.className="modal";
  modal.innerHTML=`
    <div class="modal-box">
      <h2>ยืนยันการชำระเงิน</h2>
      <p>คุณต้องการชำระเงินใช่หรือไม่?</p>
      <div class="modal-actions">
        <button class="btn" onclick="confirmCheckout()">ยืนยัน</button>
        <button class="btn" style="background:#ff4d4d"
          onclick="this.closest('.modal').remove()">ยกเลิก</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function confirmCheckout(){
  document.querySelector(".modal").remove();

  let cart=JSON.parse(localStorage.getItem("cart"));
  let products=JSON.parse(localStorage.getItem("products"));
  let sales=JSON.parse(localStorage.getItem("sales"))||[];
  let total=0;

  cart.forEach(item=>{
    const product=products.find(p=>p.id===item.id);
    product.stock-=item.qty;
    total+=item.price*item.qty;
  });

  sales.push({
    id:Date.now(),
    total,
    date:new Date().toLocaleString()
  });

  localStorage.setItem("products",JSON.stringify(products));
  localStorage.setItem("sales",JSON.stringify(sales));
  localStorage.removeItem("cart");

  updateCartBadge();
  showToast("ชำระเงินสำเร็จ 🎉");

  setTimeout(()=>{
    window.location.href="shop.html";
  },1500);
}

/* ===== LOAD BADGE ON PAGE LOAD ===== */
document.addEventListener("DOMContentLoaded",updateCartBadge);
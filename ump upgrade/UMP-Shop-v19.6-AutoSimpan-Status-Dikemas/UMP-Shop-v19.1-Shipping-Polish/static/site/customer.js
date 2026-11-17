if(localStorage.getItem('ump_login')!=='customer') location.href='index.html';
if(!localStorage.getItem('ump_products')) localStorage.setItem('ump_products',JSON.stringify([
{id:1,name:'Cakram Rem Depan',category:'Rem',price:185000,stock:18,image:'assets/logo-ump.jpg'},
{id:2,name:'Filter Oli Motor',category:'Filter',price:65000,stock:24,image:'assets/logo-ump.jpg'},
{id:3,name:'Busi NGK',category:'Mesin',price:120000,stock:5,image:'assets/logo-ump.jpg'},
{id:4,name:'Gear Set & Rantai',category:'Transmisi',price:395000,stock:3,image:'assets/logo-ump.jpg'}
]));

const $=s=>document.querySelector(s), rupiah=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
const get=k=>JSON.parse(localStorage.getItem('ump_'+k)||'[]'), set=(k,v)=>localStorage.setItem('ump_'+k,JSON.stringify(v));
let session=JSON.parse(localStorage.getItem('ump_customer_session')||'null'); if(!session){localStorage.removeItem('ump_login');location='index.html'}
let customerCart=JSON.parse(localStorage.getItem('ump_customer_cart')||'[]'),activeCategory='Semua';
const wishKey='ump_wishlist_'+session.id; let wishlist=JSON.parse(localStorage.getItem(wishKey)||'[]');
if($('#customerWelcome')) $('#customerWelcome').textContent='Halo, '+session.name; function customerLogoutNow(){if(document.querySelector('.ump-confirm-screen'))return;const overlay=document.createElement('div');overlay.className='ump-confirm-screen';overlay.innerHTML='<div class="ump-confirm-card"><div class="confirm-icon">↗</div><h3>Keluar dari akun?</h3><p>Sesi belanja kamu akan diakhiri dengan aman.</p><div class="confirm-actions"><button class="confirm-cancel" id="cancelCustomerLogout">Batal</button><button class="confirm-ok" id="confirmCustomerLogout">Ya, Logout</button></div></div>';document.body.appendChild(overlay);requestAnimationFrame(()=>overlay.classList.add('show'));overlay.querySelector('#cancelCustomerLogout').onclick=()=>{overlay.classList.remove('show');setTimeout(()=>overlay.remove(),180)};overlay.querySelector('#confirmCustomerLogout').onclick=()=>{overlay.innerHTML='<div class="ump-logout-card"><div class="ump-logout-spinner"></div><div>Keluar dari Customer…</div><small style="display:block;margin-top:8px;color:#b8c7da;font-weight:400">Terima kasih sudah berbelanja</small></div>';overlay.className='ump-logout-screen';localStorage.removeItem('ump_login');localStorage.removeItem('ump_customer_session');setTimeout(()=>location.href='index.html',850)}}
const oldLogout=$('#customerLogout');if(oldLogout) oldLogout.onclick=customerLogoutNow;
function toggleAccountMenu(e){if(e)e.stopPropagation();$('#accountMenu')?.classList.toggle('show')}
function closeAccountMenu(){$('#accountMenu')?.classList.remove('show')}
document.addEventListener('click',e=>{if(!e.target.closest('.v11-account-wrap'))closeAccountMenu()});
if($('#accountMenuName')) $('#accountMenuName').textContent=session.name||'Customer UMP';
function saveCart(){localStorage.setItem('ump_customer_cart',JSON.stringify(customerCart))} function categories(){return ['Semua',...new Set(get('products').map(x=>x.category))]}
function setCategory(c){activeCategory=c;showView('shop');renderMarketplace()} function updateWishlistCount(){const el=$('#wishlistCount');if(el)el.textContent=wishlist.length}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];localStorage.setItem(wishKey,JSON.stringify(wishlist));updateWishlistCount();renderMarketplace();renderWishlist()}
function productCard(x,i=0){const fav=wishlist.includes(x.id);return `<article class="product-market-card"><button class="wish-btn ${fav?'active':''}" title="${fav?'Hapus dari Favorit':'Tambah ke Favorit'}" aria-label="${fav?'Hapus dari Favorit':'Tambah ke Favorit'}" onclick="toggleWish(${x.id})"><span>♥</span><em>${fav?'Favorit':'Tambah Favorit'}</em></button><span class="discount-tag">${x.stock<=5?'STOK TERBATAS':i%3===0?'TERLARIS':'READY'}</span><img src="${x.image}" alt="${x.name}" onerror="this.src='assets/logo-ump.jpg'"><div class="pm-body"><div class="pm-category">${x.category}</div><div class="pm-name">${x.name}</div><div class="pm-price">${rupiah(x.price)}</div><div class="pm-meta">⭐ 4.${8-i%3} • Stok ${x.stock}</div><div class="pm-buy"><button class="pm-add" ${x.stock<1?'disabled':''} onclick="addToCart(${x.id})">＋ Keranjang</button><button class="pm-now" ${x.stock<1?'disabled':''} onclick="buyNow(${x.id})">Beli</button></div></div></article>`}    
function renderMarketplace(){const q=($('#customerSearch')?.value||'').toLowerCase();const ps=get('products').filter(x=>(activeCategory==='Semua'||x.category===activeCategory)&&(x.name.toLowerCase().includes(q)||x.category.toLowerCase().includes(q)));$('#categoryChips').innerHTML=categories().slice(0,8).map(c=>`<button class="cat-chip ${c===activeCategory?'active':''}" onclick="setCategory('${c.replaceAll("'","\\'")}')">${c}</button>`).join('');$('#productCount').textContent=ps.length+' produk';$('#customerProducts').innerHTML=ps.map(productCard).join('')||'<div class="empty-light">Produk tidak ditemukan.</div>';renderCart()}
function addToCart(id,open=true){const p=get('products').find(x=>x.id===id);if(!p||p.stock<1)return alert('Stok produk habis');let item=customerCart.find(x=>x.id===id);if(item){if(item.qty>=p.stock)return alert('Jumlah sudah mencapai stok tersedia');item.qty++}else customerCart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1});saveCart();renderCart();if(open)openCart()} function buyNow(id){addToCart(id,false);location='checkout.html'}
function changeCartQty(id,n){const p=get('products').find(x=>x.id===id),it=customerCart.find(x=>x.id===id);if(!it)return;it.qty+=n;if(it.qty<=0)customerCart=customerCart.filter(x=>x.id!==id);else if(p&&it.qty>p.stock){it.qty=p.stock;alert('Maksimal sesuai stok')}saveCart();renderCart()} function removeCart(id){customerCart=customerCart.filter(x=>x.id!==id);saveCart();renderCart()}
function renderCart(){const count=customerCart.reduce((s,x)=>s+x.qty,0),total=customerCart.reduce((s,x)=>s+x.price*x.qty,0);$('#cartCount').textContent=count;$('#drawerCount').textContent=count+' barang';$('#cartTotal').textContent=rupiah(total);$('#customerCart').innerHTML=customerCart.length?customerCart.map(x=>`<div class="market-cart-item"><img src="${x.image}" onerror="this.src='assets/logo-ump.jpg'"><div><b>${x.name}</b><small>${rupiah(x.price)}</small><div class="qty-row"><button class="qty-btn" onclick="changeCartQty(${x.id},-1)">−</button><b>${x.qty}</b><button class="qty-btn" onclick="changeCartQty(${x.id},1)">+</button></div></div><div><b>${rupiah(x.price*x.qty)}</b><div class="danger" style="cursor:pointer;margin-top:8px" onclick="removeCart(${x.id})">Hapus</div></div></div>`).join(''):'<div class="empty-light">Keranjang masih kosong.</div>'}
function openCart(){$('#cartDrawer').classList.add('show');$('#marketOverlay').classList.add('show')} function closeCart(){$('#cartDrawer').classList.remove('show');$('#marketOverlay').classList.remove('show')} function goCheckout(){if(!customerCart.length)return alert('Keranjang masih kosong');location='checkout.html'}
function showView(v){document.querySelectorAll('.customer-view').forEach(x=>x.classList.remove('active'));const view=$('#'+v+'View');if(view)view.classList.add('active');if(v==='orders')renderOrders();if(v==='wishlist')renderWishlist();if(v==='profile')renderProfile();if(v==='cart')renderCartPage();setCustomerNavActive(v);window.scrollTo({top:0,behavior:'smooth'})}
function renderWishlist(){const ps=get('products').filter(x=>wishlist.includes(x.id));$('#wishlistProducts').innerHTML=ps.length?ps.map(productCard).join(''):'<div class="empty-light">Belum ada produk favorit. Klik ♥ pada produk yang kamu suka.</div>'}
let orderFilter='Semua';
function myOrders(){
  const all=JSON.parse(localStorage.getItem('ump_customer_orders')||'[]');
  // Utamakan ID customer agar pesanan akun lain tidak ikut terbaca.
  const mine=all.filter(x=>{
    if(x.customerId!==undefined&&x.customerId!==null&&x.customerId!=='') return String(x.customerId)===String(session.id);
    if(session.username&&x.username) return String(x.username).toLowerCase()===String(session.username).toLowerCase();
    return !!(session.phone&&x.phone&&String(x.phone).replace(/\\D/g,'')===String(session.phone).replace(/\\D/g,''));
  });
  // Satu kartu untuk satu nomor pesanan. Simpan versi data paling baru.
  const unique=new Map();
  mine.forEach((o,i)=>{
    const key=String(o.orderId||o.id||`tanpa-id-${i}`);
    const prev=unique.get(key);
    if(!prev||new Date(o.updatedAt||o.date||0)>=new Date(prev.updatedAt||prev.date||0)) unique.set(key,o);
  });
  return [...unique.values()].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
}
function setOrderFilter(v,btn){orderFilter=v;document.querySelectorAll('[data-order-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderOrders()}
function filteredOrders(){const a=myOrders();if(orderFilter==='Aktif')return a.filter(o=>!['Selesai','Dibatalkan','Dikirim'].includes(o.status));if(orderFilter==='Dikirim')return a.filter(o=>o.status==='Dikirim');if(orderFilter==='Selesai')return a.filter(o=>o.status==='Selesai');if(orderFilter==='Dibatalkan')return a.filter(o=>o.status==='Dibatalkan');return a}
function statusSteps(o){const sts=['Pesanan Dibuat','Diproses','Dikemas','Dikirim','Selesai'],idx=Math.max(0,sts.indexOf(o.status||'Pesanan Dibuat'));if(o.status==='Dibatalkan')return '<div class="order-cancelled">Pesanan dibatalkan</div>';return `<div class="order-progress">${sts.map((s,i)=>`<div class="${i<=idx?'done':''}"><i>${i<idx?'✓':i+1}</i><span>${s}</span></div>`).join('')}</div>`}
function cleanOrderItems(items){
  const merged=new Map();
  (items||[]).forEach(x=>{
    const key=[x.productId??x.id??String(x.name||'').toLowerCase(),x.price,x.unit||'pcs'].join('|');
    if(!merged.has(key)) merged.set(key,{...x,qty:Number(x.qty)||0});
    else merged.get(key).qty+=Number(x.qty)||0;
  });
  return [...merged.values()];
}
function orderItemHtml(x,o){
  const unit=x.unit||'pcs',isGrosir=o?.orderType==='Grosir'||x.category==='Grosir';
  const qty=Number(x.qty)||0,price=Number(x.price)||0,qtyLabel=isGrosir?`${qty} ${unit}`:`${qty} pcs`;
  return `<div class="order-product order-product-qty"><img src="${x.image||'assets/logo-ump.jpg'}" onerror="this.src='assets/logo-ump.jpg'"><span><b>${x.name||'Produk'}</b><small>Harga ${isGrosir?'Grosir':'Satuan'}: ${rupiah(price)} / ${unit}</small><small><strong>Jumlah: ${qtyLabel}</strong></small></span><b class="order-line-total">${rupiah(price*qty)}</b></div>`;
}
function orderGrandTotal(o){const saved=Number(o?.total);if(Number.isFinite(saved)&&saved>0)return saved;return cleanOrderItems(o?.items).reduce((n,x)=>n+(Number(x.price)||0)*(Number(x.qty)||0),0)}
function renderOrders(){
  const all=myOrders(),a=filteredOrders();
  if($('#historyTotal'))$('#historyTotal').textContent=all.length;
  if($('#historyActive'))$('#historyActive').textContent=all.filter(o=>!['Selesai','Dibatalkan'].includes(o.status)).length;
  if($('#historyDone'))$('#historyDone').textContent=all.filter(o=>o.status==='Selesai').length;
  $('#ordersList').innerHTML=a.length?a.map(o=>{
    const items=cleanOrderItems(o.items),count=items.reduce((n,x)=>n+(Number(x.qty)||0),0);
    return `<article class="order-card history-card">
      <div class="order-card-top"><div><b>${o.orderId||'Pesanan'} ${o.orderType==='Grosir'?'<span class="order-type-grosir">GROSIR</span>':''}</b><small>${o.date?new Date(o.date).toLocaleString('id-ID'):'Tanggal tidak tersedia'}</small></div>
      <div><span class="order-status">${o.status||'Pesanan Dibuat'}</span><span class="payment-status-customer ${o.paymentStatus==='Diterima'?'paid':''}">${o.paymentStatus||'Menunggu Verifikasi'}</span></div></div>
      ${statusSteps(o)}
      <div class="history-products">${items.map(x=>orderItemHtml(x,o)).join('')}</div>
      <div class="order-card-bottom"><span>${count} barang • ${o.payment||'Pembayaran belum dipilih'} • ${o.courier||o.shipping||'Reguler'}</span><strong>Total: ${rupiah(orderGrandTotal(o))}</strong><button class="invoice-btn secondary" onclick="showOrderDetail('${o.orderId}')">Lihat Detail & Invoice</button></div>
    </article>`;
  }).join(''):'<div class="empty-light">Belum ada pesanan pada kategori ini.</div>';
}
function showOrderDetail(id){const o=myOrders().find(x=>x.orderId===id);if(!o)return;$('#orderDetailContent').innerHTML=`<span class="detail-kicker">DETAIL PESANAN</span><h2>${o.orderId}</h2><p class="detail-date">Dibuat ${new Date(o.date).toLocaleString('id-ID')}</p>${statusSteps(o)}<div class="detail-section"><h3>Produk</h3>${cleanOrderItems(o.items).map(x=>orderItemHtml(x,o)).join('')}</div><div class="detail-grid"><div><small>Penerima</small><b>${o.name||'-'}</b><span>${o.phone||''}</span></div><div><small>Pengiriman</small><b>${o.courier||o.shipping||'Reguler'}</b><span>${o.address||'-'}</span>${o.resi?`<span class="customer-resi">No. Resi: <strong>${o.resi}</strong></span>`:''}</div><div><small>Pembayaran</small><b>${o.payment||'-'}</b><span>${o.paymentStatus||'Menunggu Verifikasi'}</span></div><div><small>Total Pembayaran</small><b>${rupiah(orderGrandTotal(o))}</b><span>${o.voucher?'Voucher '+o.voucher:''}</span></div></div>${o.note?`<div class="detail-note"><b>Catatan:</b> ${o.note}</div>`:''}<button class="full-btn" onclick="printInvoice('${o.orderId}')">Cetak Invoice</button>`;$('#orderDetailModal').classList.add('show')}
function closeOrderDetail(){$('#orderDetailModal').classList.remove('show')}

function printInvoice(id){const o=myOrders().find(x=>x.orderId===id);if(!o)return;const w=window.open('','_blank');w.document.write(`<title>Invoice ${id}</title><style>body{font-family:Arial;padding:30px}table{width:100%;border-collapse:collapse}td,th{padding:10px;border-bottom:1px solid #ddd;text-align:left}</style><h1>UMP SHOP</h1><p>Universal Mega Parts</p><hr><h2>Invoice ${id}</h2><p>Customer: ${o.name}<br>Alamat: ${o.address}<br>Pembayaran: ${o.payment}<br>Status: ${o.status}</p><table><tr><th>Produk</th><th>Qty</th><th>Total</th></tr>${cleanOrderItems(o.items).map(x=>`<tr><td>${x.name}</td><td>${x.qty} ${x.unit||'pcs'}</td><td>${rupiah(x.price*x.qty)}</td></tr>`).join('')}</table><h3>Total: ${rupiah(orderGrandTotal(o))}</h3>`);w.document.close();w.print()}
function renderProfile(){$('#profileName').value=session.name||'';$('#profileUsername').value=session.username||'';$('#profilePhone').value=session.phone||'';$('#profileAddress').value=session.address||''} function saveProfile(){session={...session,name:$('#profileName').value.trim(),phone:$('#profilePhone').value.trim(),address:$('#profileAddress').value.trim()};let a=get('customers'),i=a.findIndex(x=>x.id===session.id);if(i>=0)a[i]={...a[i],...session};set('customers',a);localStorage.setItem('ump_customer_session',JSON.stringify(session));if($('#customerWelcome')) $('#customerWelcome').textContent='Halo, '+session.name;alert('Profil berhasil disimpan.')}
Object.assign(window,{renderMarketplace,setCategory,toggleWish,addToCart,buyNow,changeCartQty,removeCart,openCart,closeCart,goCheckout,showView,saveProfile,printInvoice,setOrderFilter,showOrderDetail,closeOrderDetail});renderMarketplace();const qp=new URLSearchParams(location.search);if(qp.get('view')==='orders')showView('orders');

// ===== V8: automatic marketplace hero advertising slider =====
let heroIndex = 0;
let heroTimer;
function renderHero(){
  const slides=[...document.querySelectorAll('.hero-ad-slide')];
  const dots=[...document.querySelectorAll('.hero-dots button')];
  if(!slides.length) return;
  heroIndex=(heroIndex+slides.length)%slides.length;
  slides.forEach((el,i)=>el.classList.toggle('active',i===heroIndex));
  dots.forEach((el,i)=>el.classList.toggle('active',i===heroIndex));
}
function restartHeroTimer(){
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>{heroIndex++;renderHero()},4500);
}
function moveHero(step){heroIndex+=step;renderHero();restartHeroTimer()}
function goHero(index){heroIndex=index;renderHero();restartHeroTimer()}
document.addEventListener('DOMContentLoaded',()=>{
  renderHero(); restartHeroTimer();
  const slider=document.querySelector('.hero-ad-slider');
  if(slider){
    slider.addEventListener('mouseenter',()=>clearInterval(heroTimer));
    slider.addEventListener('mouseleave',restartHeroTimer);
  }
});

// V15 Customer-Admin Chat
const CHAT_KEY='ump_customer_admin_chats';
function cid(){return String(session?.id||session?.username||session?.phone||'customer')} function allChats(){try{return JSON.parse(localStorage.getItem(CHAT_KEY)||'{}')}catch(e){return {}}} function saveChats(a){localStorage.setItem(CHAT_KEY,JSON.stringify(a))} function mine(){let a=allChats(),id=cid();if(!a[id])a[id]={name:session?.name||session?.username||'Customer',username:session?.username||'',phone:session?.phone||'',messages:[]};return {a,id,c:a[id]}}
function renderChat(){let b=document.getElementById('chatMessages');if(!b)return;let x=mine(),m=x.c.messages||[];b.innerHTML=m.length?m.map(v=>`<div class="cmsg ${v.sender==='customer'?'me':''}"><div>${String(v.text).replace(/</g,'&lt;')}</div><small>${new Date(v.time).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</small>${v.sender==='customer'?`<button class="chat-delete-btn" title="Hapus pesan ini" onclick="deleteCustomerChatMessage(${v.id})"><span>⌫</span> Hapus</button>`:''}</div>`).join(''):`<div class="chat-empty">👋<b>Halo ${session?.name||session?.username||'Customer'}!</b><p>Silakan chat Admin UMP Shop.</p></div>`;b.scrollTop=b.scrollHeight;let n=m.filter(v=>v.sender==='admin'&&!v.read).length,d=document.getElementById('chatBadge');if(d){d.textContent=n;d.style.display=n?'grid':'none'}}
function toggleChat(){let p=document.getElementById('chatPanel');p.classList.toggle('open');if(p.classList.contains('open')){let x=mine();x.c.messages.forEach(v=>{if(v.sender==='admin')v.read=true});x.a[x.id]=x.c;saveChats(x.a);renderChat()}} function sendChat(t){t=(t||'').trim();if(!t)return;let x=mine();x.c.messages.push({id:Date.now(),sender:'customer',text:t,time:new Date().toISOString(),read:false});x.a[x.id]=x.c;saveChats(x.a);renderChat()} function sendQuick(t){sendChat(t)}
document.getElementById('chatForm')?.addEventListener('submit',e=>{e.preventDefault();let i=document.getElementById('chatText');sendChat(i.value);i.value=''});window.toggleChat=toggleChat;window.sendQuick=sendQuick;renderChat();setInterval(renderChat,2000);

function deleteCustomerChatMessage(mid){const x=mine(),m=(x.c.messages||[]).find(v=>String(v.id)===String(mid));if(!m||m.sender!=='customer')return;showDeleteConfirm(()=>{const msg=document.querySelector(`[onclick="deleteCustomerChatMessage(${mid})"]`)?.closest('.cmsg');if(msg){msg.classList.add('message-removing');setTimeout(()=>{x.c.messages=x.c.messages.filter(v=>String(v.id)!==String(mid));x.a[x.id]=x.c;saveChats(x.a);renderChat();showChatToast('Pesan berhasil dihapus')},220)}else{x.c.messages=x.c.messages.filter(v=>String(v.id)!==String(mid));x.a[x.id]=x.c;saveChats(x.a);renderChat()}})}window.deleteCustomerChatMessage=deleteCustomerChatMessage;
function showDeleteConfirm(done){const old=document.querySelector('.ump-confirm-screen');if(old)old.remove();const el=document.createElement('div');el.className='ump-confirm-screen';el.innerHTML='<div class="ump-confirm-card delete-confirm"><div class="confirm-icon trash">⌫</div><h3>Hapus pesan?</h3><p>Pesan ini akan dihapus dari riwayat chat di browser ini.</p><div class="confirm-actions"><button class="confirm-cancel">Batal</button><button class="confirm-ok danger-ok">Hapus pesan</button></div></div>';document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));el.querySelector('.confirm-cancel').onclick=()=>el.remove();el.querySelector('.confirm-ok').onclick=()=>{el.classList.remove('show');setTimeout(()=>el.remove(),150);done()}}
function showChatToast(text){let t=document.getElementById('chat-action-toast');if(!t){t=document.createElement('div');t.id='chat-action-toast';t.className='chat-action-toast';document.body.appendChild(t)}t.textContent='✓  '+text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

/* V18 customer cart page + navigation indicator */
function renderCartPage(){
 const box=document.getElementById('cartPageItems');if(!box)return;
 const count=customerCart.reduce((s,x)=>s+x.qty,0),total=customerCart.reduce((s,x)=>s+x.price*x.qty,0);
 document.getElementById('cartPageCount').textContent=count+' barang';
 document.getElementById('cartPageTotal').textContent=rupiah(total);
 box.innerHTML=customerCart.length?customerCart.map(x=>`<div class="v18-cart-row"><img src="${x.image}" onerror="this.src='assets/logo-ump.jpg'"><div class="v18-cart-info"><b>${x.name}</b><small>${rupiah(x.price)}</small><div class="qty-row"><button class="qty-btn" onclick="changeCartQty(${x.id},-1);renderCartPage()">−</button><b>${x.qty}</b><button class="qty-btn" onclick="changeCartQty(${x.id},1);renderCartPage()">+</button></div></div><div class="v18-cart-price"><b>${rupiah(x.price*x.qty)}</b><button onclick="removeCart(${x.id});renderCartPage()">Hapus</button></div></div>`).join(''):'<div class="empty-light">Keranjang masih kosong.</div>';
}
function setCustomerNavActive(v){
 document.querySelectorAll('.market-menu-v9 .menu-link').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
 document.querySelectorAll('.top-dest').forEach(b=>b.classList.toggle('active-dest',b.dataset.dest===v));
}

function showPromoSection(){
 showView('shop');setCustomerNavActive('promo');
 setTimeout(()=>document.getElementById('promoSection')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function applyPromoSearch(){
 showView('shop');setCustomerNavActive('promo');
 document.getElementById('productsSection')?.scrollIntoView({behavior:'smooth',block:'start'});
}
window.showPromoSection=showPromoSection;window.applyPromoSearch=applyPromoSearch;

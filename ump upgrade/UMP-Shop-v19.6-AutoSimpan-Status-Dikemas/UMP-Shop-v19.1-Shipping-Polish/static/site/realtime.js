(()=>{
const KEYS=new Set(['ump_products','ump_transactions','ump_customer_orders','ump_attendance','attendance','ump_employees','ump_wholesale_catalog','ump_customers','ump_chats']);
const nativeSet=localStorage.setItem.bind(localStorage); let applying=false, ready=false;
async function push(k,v){if(!ready||applying||!KEYS.has(k))return;try{await fetch('/api/state/'+encodeURIComponent(k),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:JSON.parse(v)})})}catch(e){}}
localStorage.setItem=function(k,v){nativeSet(k,v);push(k,v);};
async function pull(first=false){try{const r=await fetch('/api/state',{cache:'no-store'});if(!r.ok)return;const j=await r.json(),st=j.state||{};applying=true;for(const k of KEYS){if(Object.prototype.hasOwnProperty.call(st,k)){const nv=JSON.stringify(st[k]),ov=localStorage.getItem(k);if(nv!==ov){nativeSet(k,nv);window.dispatchEvent(new CustomEvent('ump:realtime',{detail:{key:k}}));}}}applying=false;if(first&&Object.keys(st).length===0){ready=true;for(const k of KEYS){const v=localStorage.getItem(k);if(v!==null)push(k,v);}}else ready=true;document.documentElement.dataset.realtime='online';}catch(e){document.documentElement.dataset.realtime='offline';}}
pull(true);setInterval(()=>pull(false),1500);window.umpRealtimePull=()=>pull(false);
})();

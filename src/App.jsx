import{useState,useEffect}from"react";
const C={bg:"#F9F8F6",card:"#FFFFFF",rose:"#C9A89A",roseLight:"#F0E6E1",roseMid:"#D4B8AB",sage:"#A8B5A2",sageLight:"#E4EBE2",sand:"#C8B89A",sandLight:"#EDE6D8",lav:"#B5A8C8",lavLight:"#EAE6F2",teal:"#9AB5B5",text:"#5A5A5A",textLight:"#8A8A7A",textFaint:"#BBBBA8",border:"#EDEBE6",borderStrong:"#DDD9D0",green:"#88B098",greenLight:"#E2EFE8",red:"#D4806A",redLight:"#FAE8E3"};
const SERIF="'Georgia',serif",SANS="'Helvetica Neue',sans-serif";
const CATS=[{id:"food",e:"🍜",l:"餐飲",c:"#C9A89A"},{id:"transport",e:"🚌",l:"交通",c:"#A8B5A2"},{id:"hotel",e:"🏨",l:"住宿",c:"#B5A8C8"},{id:"flight",e:"✈️",l:"機票",c:"#9AB5B5"},{id:"ticket",e:"🎭",l:"訂票體驗",c:"#C8A8B5"},{id:"shopping",e:"🛍️",l:"購物",c:"#C8B89A"},{id:"activity",e:"🎯",l:"活動",c:"#A8C8B5"},{id:"beauty",e:"💄",l:"美妝",c:"#D4A8B5"},{id:"other",e:"📎",l:"其他",c:"#BBBBA8"}];
const PLATFORMS=[{id:"booking",l:"Booking.com",e:"🏨"},{id:"agoda",l:"Agoda",e:"🏨"},{id:"airbnb",l:"Airbnb",e:"🏠"},{id:"trip",l:"Trip.com",e:"🌐"},{id:"expedia",l:"Expedia",e:"✈️"},{id:"kkday",l:"KKday",e:"🎭"},{id:"klook",l:"Klook",e:"🎡"},{id:"google_flights",l:"Google Flights",e:"✈️"},{id:"airline",l:"航空公司官網",e:"✈️"},{id:"manual",l:"手動輸入",e:"✏️"}];
const BASE_CURRS=[
{code:"TWD",sym:"NT$",l:"台幣",r:1},{code:"JPY",sym:"¥",l:"日圓",r:0.22},{code:"KRW",sym:"₩",l:"韓圓",r:0.024},{code:"CNY",sym:"¥",l:"人民幣",r:4.38},{code:"HKD",sym:"HK$",l:"港幣",r:4.15},{code:"MNT",sym:"₮",l:"蒙古圖格里克",r:0.0093},
{code:"USD",sym:"$",l:"美元",r:32.5},{code:"EUR",sym:"€",l:"歐元",r:35.2},{code:"GBP",sym:"£",l:"英鎊",r:41.5},{code:"CHF",sym:"Fr",l:"瑞士法郎",r:37.2},{code:"SEK",sym:"kr",l:"瑞典克朗",r:3.1},{code:"NOK",sym:"kr",l:"挪威克朗",r:3.0},{code:"DKK",sym:"kr",l:"丹麥克朗",r:4.7},{code:"CZK",sym:"Kč",l:"捷克克朗",r:1.45},{code:"PLN",sym:"zł",l:"波蘭茲羅提",r:8.2},{code:"HUF",sym:"Ft",l:"匈牙利福林",r:0.09},
{code:"TRY",sym:"₺",l:"土耳其里拉",r:0.95},{code:"AED",sym:"د.إ",l:"阿聯酋迪拉姆",r:8.85},{code:"ILS",sym:"₪",l:"以色列新謝克爾",r:8.7},
{code:"THB",sym:"฿",l:"泰銖",r:0.91},{code:"VND",sym:"₫",l:"越南盾",r:0.00128},{code:"PHP",sym:"₱",l:"披索",r:0.56},{code:"IDR",sym:"Rp",l:"印尼盾",r:0.002},{code:"MYR",sym:"RM",l:"馬來西亞令吉",r:7.2},{code:"SGD",sym:"S$",l:"新加坡幣",r:24.5},{code:"MMK",sym:"K",l:"緬甸元",r:0.015},{code:"KHR",sym:"៛",l:"柬埔寨瑞爾",r:0.008},{code:"LAK",sym:"₭",l:"寮國基普",r:0.0015},{code:"BND",sym:"B$",l:"汶萊幣",r:24.5},
{code:"INR",sym:"₹",l:"印度盧比",r:0.39},{code:"LKR",sym:"Rs",l:"斯里蘭卡盧比",r:0.11},{code:"NPR",sym:"Rs",l:"尼泊爾盧比",r:0.24},
{code:"AUD",sym:"A$",l:"澳幣",r:21.5},{code:"NZD",sym:"NZ$",l:"紐西蘭幣",r:19.8},
];
const PAYS=[{id:"cash",e:"💵",l:"現金"},{id:"card",e:"💳",l:"信用卡"},{id:"linepay",e:"📱",l:"Line Pay"}];
const COVERS=[{id:"a",g:"linear-gradient(135deg,#C9A89A,#D4B8AB,#C8B89A)",e:"🌸"},{id:"b",g:"linear-gradient(135deg,#A8B5A2,#B8C8B2,#9AB5B5)",e:"🌿"},{id:"c",g:"linear-gradient(135deg,#B5A8C8,#C8B8E0,#C9A89A)",e:"🌙"},{id:"d",g:"linear-gradient(135deg,#C8B89A,#C8B89A,#D4A870)",e:"☀️"},{id:"e",g:"linear-gradient(135deg,#9AB5B5,#A8B5A2,#88B0A8)",e:"🌊"},{id:"f",g:"linear-gradient(135deg,#C8A8B8,#B5A8C8,#C9A89A)",e:"🌷"}];
const fmt=n=>new Intl.NumberFormat("zh-TW",{maximumFractionDigits:0}).format(Math.round(n));
const todayStr=()=>new Date().toISOString().split("T")[0];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const lsGet=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)??"null")??d;}catch{return d;}};
const lsSet=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const compressImg=(file,maxW=800)=>new Promise(res=>{const r=new FileReader();r.onload=ev=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const s=Math.min(1,maxW/img.width);c.width=img.width*s;c.height=img.height*s;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",0.85));};img.src=ev.target.result;};r.readAsDataURL(file);});
const compressImgSmall=(file,maxW=400)=>new Promise(res=>{const r=new FileReader();r.onload=ev=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const s=Math.min(1,maxW/img.width);c.width=img.width*s;c.height=img.height*s;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",0.7));};img.src=ev.target.result;};r.readAsDataURL(file);});
const Lbl=({ch,s})=><div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,marginBottom:7,fontWeight:600,textTransform:"uppercase",...s}}>{ch}</div>;
function Pill({active,color="#C9A89A",children,onClick}){return<button onClick={onClick} style={{padding:"7px 13px",borderRadius:99,border:`1.5px solid ${active?color:"#EDEBE6"}`,background:active?color+"28":"transparent",color:active?color:"#8A8A7A",fontSize:12,fontWeight:active?700:400,cursor:"pointer",fontFamily:SANS,whiteSpace:"nowrap"}}>{children}</button>;}
function Inp({style,...p}){return<input {...p} style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1.5px solid #EDEBE6",background:"#FDFCFB",fontSize:14,color:"#5A5A5A",outline:"none",boxSizing:"border-box",fontFamily:SANS,...style}}/>;}
function Sel({style,children,...p}){return<select {...p} style={{padding:"12px 14px",borderRadius:14,border:"1.5px solid #EDEBE6",background:"#FDFCFB",fontSize:13,color:"#5A5A5A",outline:"none",fontFamily:SANS,cursor:"pointer",...style}}>{children}</select>;}
function Btn({children,color="#C9A89A",onClick,style,outline,sm}){return<button onClick={onClick} style={{padding:sm?"7px 13px":"13px 20px",borderRadius:sm?12:16,border:outline?`1.5px solid ${color}`:"none",background:outline?"transparent":color,color:outline?color:"#fff",fontSize:sm?12:14,fontWeight:600,cursor:"pointer",fontFamily:SANS,...style}}>{children}</button>;}
function Toggle({on,onChange,label,sub}){return(<div style={{background:on?"#F0E6E1":"#F5F3EF",borderRadius:18,padding:"13px 16px",border:`1.5px solid ${on?"#D4B8AB":"#EDEBE6"}`,cursor:"pointer"}} onClick={()=>onChange(!on)}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:44,height:24,borderRadius:99,background:on?"#C9A89A":"#DDD9D0",position:"relative",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/></div><div><div style={{fontSize:13,fontWeight:600,color:"#5A5A5A"}}>{label}</div>{sub&&<div style={{fontSize:11,color:"#BBBBA8"}}>{sub}</div>}</div></div></div>);}
function Sheet({children,onClose}){return(<div style={{position:"fixed",inset:0,background:"rgba(80,70,60,0.4)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}><div style={{width:"100%",maxWidth:430,background:"#F9F8F6",borderRadius:"28px 28px 0 0",padding:"24px 20px 44px",maxHeight:"92vh",overflowY:"auto"}}>{children}</div></div>);}
function SHead({title,onClose}){return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}><h3 style={{fontFamily:SERIF,fontSize:18,color:"#5A5A5A",margin:0}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#BBBBA8"}}>✕</button></div>);}
function Toast({data}){if(!data)return null;return(<div style={{position:"fixed",top:54,left:"50%",transform:"translateX(-50%)",zIndex:999,width:"calc(100% - 32px)",maxWidth:380}}><div style={{background:"#2E2A26",borderRadius:20,padding:"16px 20px"}}><div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:8}}>{data.icon} {data.title}</div>{data.lines.map((l,i)=><div key={i} style={{fontSize:12,color:"#BEB8B0",marginBottom:2,fontFamily:"monospace"}}>{l}</div>)}</div></div>);}
function ImgUpload({img,onImg}){
  const handleImg=async e=>{const file=e.target.files?.[0];if(!file)return;const b64=await compressImgSmall(file);onImg(b64);};
  return(<label style={{display:"block",width:"100%",marginBottom:14,cursor:"pointer"}}>
    {img
      ?<div style={{position:"relative"}}><img src={img} style={{width:"100%",borderRadius:16,maxHeight:180,objectFit:"cover"}} alt="參考圖"/><button onClick={e=>{e.preventDefault();onImg(null);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14}}>✕</button></div>
      :<div style={{width:"100%",height:100,borderRadius:16,border:"1.5px dashed #EDEBE6",background:"#FDFCFB",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:24}}>📷</span><span style={{fontSize:12,color:"#BBBBA8"}}>點擊上傳參考圖片</span></div>}
    <input type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
  </label>);
}
async function scanReceipt(base64Img,apiKey,preferCurrs,allCurrs){
  const currList=allCurrs.filter(c=>preferCurrs.includes(c.code)).map(c=>`${c.code}(${c.sym} ${c.l})`).join("、");
  const allCurrList=allCurrs.map(c=>c.code).join(",");
  const prompt=`你是一個收據辨識助手，請分析這張收據圖片，辨識以下資訊並以JSON回傳：

這趟旅行的常用幣別（優先辨識）：${currList}
所有支援幣別：${allCurrList}

請回傳以下JSON格式（只回傳JSON，不要其他文字）：
{
  "amount": 數字（原始金額，不換算），
  "currency": "幣別代碼如JPY/TWD/THB",
  "note": "品項或店名（用中文或原文）",
  "detail": "詳細摘要，如航班號、房型、日期等",
  "category": "food或transport或hotel或flight或ticket或shopping或activity或beauty或other",
  "platform": "若能辨識訂購平台填入：booking/agoda/airbnb/trip/expedia/kkday/klook/google_flights/airline/manual，否則填manual",
  "isOverseas": true或false（根據幣別和收據內容判斷，非TWD通常是true）,
  "confidence": "high或medium或low"
}

辨識規則：
- 金額取「合計」「総計」「합계」「total」「รวม」等最終金額
- 幣別從收據語言、符號判斷，優先從常用幣別中選
- isOverseas：非台幣消費設true，台幣且台灣消費設false
- category：餐廳→food；計程車/捷運→transport；飯店→hotel；機票→flight；KKday/Klook→ticket；百貨→shopping；門票→activity；美妝→beauty`;
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:base64Img.split(",")[1]}},{type:"text",text:prompt}]}]})});
  const data=await res.json();
  const text=data.content?.[0]?.text??"{}";
  const clean=text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}
function ReceiptScanBtn({apiKey,preferCurrs,allCurrs,onResult}){
  const [scanning,setScanning]=useState(false);
  const [err,setErr]=useState(null);
  const handleScan=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    if(!apiKey){setErr("請先在設定→🤖 AI辨識填入API Key");return;}
    setScanning(true);setErr(null);
    try{const b64=await compressImg(file);const result=await scanReceipt(b64,apiKey,preferCurrs,allCurrs);onResult(result);}
    catch{setErr("辨識失敗，請重試或手動記帳");}
    setScanning(false);e.target.value="";
  };
  return(<div style={{marginBottom:14}}>
    <label style={{display:"block",cursor:"pointer"}}>
      <div style={{width:"100%",padding:"13px",borderRadius:18,border:"2px dashed #B5A8C8",background:scanning?"#F0EDF8":"#EAE6F2",color:"#B5A8C8",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {scanning?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> AI 辨識中...</>:<>📷 拍收據自動記帳</>}
      </div>
      <input type="file" accept="image/*" capture="environment" onChange={handleScan} style={{display:"none"}} disabled={scanning}/>
    </label>
    {err&&<div style={{fontSize:12,color:"#D4806A",marginTop:6,padding:"8px 12px",background:"#FAE8E3",borderRadius:10}}>{err}</div>}
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>);
}function WelcomeModal({onClose}){return(<div style={{position:"fixed",inset:0,background:"rgba(80,70,60,0.45)",backdropFilter:"blur(12px)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}><div style={{width:"100%",maxWidth:360,background:"#FFFFFF",borderRadius:28,padding:"32px 28px",textAlign:"center"}}><div style={{width:56,height:6,borderRadius:99,background:"linear-gradient(90deg,#C9A89A,#B5A8C8,#A8B5A2)",margin:"0 auto 24px"}}/><div style={{fontSize:36,marginBottom:12}}>✈️</div><h2 style={{fontFamily:SERIF,fontSize:20,color:"#5A5A5A",margin:"0 0 8px"}}>旅行足跡帳本</h2><p style={{fontSize:13,color:"#8A8A7A",margin:"0 0 20px"}}>Travel Footprint</p><div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28,textAlign:"left"}}>{[{icon:"📱",title:"離線完全可用",desc:"資料存於手機本地，飛機上也能記帳"},{icon:"🔒",title:"隱私安全",desc:"不上傳任何伺服器"},{icon:"👥",title:"多人旅行",desc:"自動拆帳、代購、一鍵LINE帳單"},{icon:"📷",title:"拍收據自動記帳",desc:"AI辨識多國語言收據，自動填入金額"}].map(f=>(<div key={f.icon} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#F9F8F6",borderRadius:14,padding:"12px 14px"}}><span style={{fontSize:20,flexShrink:0}}>{f.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:"#5A5A5A",marginBottom:2}}>{f.title}</div><div style={{fontSize:11,color:"#BBBBA8"}}>{f.desc}</div></div></div>))}</div><button onClick={onClose} style={{width:"100%",padding:"15px",borderRadius:18,border:"none",background:"linear-gradient(135deg,#C9A89A,#D4B8AB)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:SANS}}>開始使用 →</button></div></div>);}
function useStore(){
  const [trips,setTrips]=useState(()=>lsGet("tf_trips",[]));
  const [activeId,setActiveId]=useState(()=>lsGet("tf_active",null));
  const [banks,setBanks]=useState(()=>lsGet("tf_banks",[]));
  const [cards,setCards]=useState(()=>lsGet("tf_cards",[]));
  const [friends,setFriends]=useState(()=>lsGet("tf_friends",["小美","阿芸","芷欣"]));
  const [customCurrs,setCustomCurrs]=useState(()=>lsGet("tf_currs",[]));
  const [apiKey,setApiKey]=useState(()=>lsGet("tf_apikey",""));
  useEffect(()=>lsSet("tf_trips",trips),[trips]);
  useEffect(()=>lsSet("tf_active",activeId),[activeId]);
  useEffect(()=>lsSet("tf_banks",banks),[banks]);
  useEffect(()=>lsSet("tf_cards",cards),[cards]);
  useEffect(()=>lsSet("tf_friends",friends),[friends]);
  useEffect(()=>lsSet("tf_currs",customCurrs),[customCurrs]);
  useEffect(()=>lsSet("tf_apikey",apiKey),[apiKey]);
  const allCurrs=[...BASE_CURRS,...customCurrs];
  const active=trips.find(t=>t.id===activeId)??null;
  const upd=(id,p)=>setTrips(prev=>prev.map(t=>t.id===id?{...t,...p}:t));
  const createTrip=d=>{const t={id:uid(),createdAt:todayStr(),archived:false,expenses:[],proxies:[],wishlist:[],selflist:[],receivables:[],...d};setTrips(p=>[t,...p]);setActiveId(t.id);return t.id;};
  const archiveTrip=id=>upd(id,{archived:true});
  const reopenTrip=id=>upd(id,{archived:false});
  const deleteTrip=id=>{setTrips(p=>p.filter(t=>t.id!==id));if(activeId===id)setActiveId(null);};
  const addExpense=(tid,e,recs=[])=>{setTrips(prev=>prev.map(x=>x.id===tid?{...x,expenses:[{...e,id:uid()},...(x.expenses??[])],receivables:[...recs,...(x.receivables??[])]}:x));};
  const delExpense=(tid,eid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,expenses:(t.expenses??[]).filter(e=>e.id!==eid)}:t));};
  const editExpense=(tid,eid,patch,newRecs=[])=>{setTrips(prev=>prev.map(t=>{if(t.id!==tid)return t;const filteredRecs=(t.receivables??[]).filter(r=>r.expenseId!==eid);const recsWithId=newRecs.map(r=>({...r,expenseId:eid}));return{...t,expenses:(t.expenses??[]).map(e=>e.id===eid?{...e,...patch,id:eid}:e),receivables:[...recsWithId,...filteredRecs]};}));};
  const addWish=(tid,w)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,wishlist:[{...w,id:uid(),done:false},...(t.wishlist??[])]}:t));};
  const delWish=(tid,wid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,wishlist:(t.wishlist??[]).filter(w=>w.id!==wid)}:t));};
  const buyWish=(tid,wid,price,qty,currency,payment,cardId,cardsArr)=>{
    setTrips(prev=>prev.map(t=>{
      if(t.id!==tid)return t;
      const w=(t.wishlist??[]).find(x=>x.id===wid);if(!w)return t;
      const rate=allCurrs.find(c=>c.code===currency)?.r??1;
      const totalTWD=price*qty*rate;
      const selCard=cardsArr.find(c=>c.id===cardId);
      const feeTotal=selCard?totalTWD*selCard.feeRate/100:0;
      const grand=totalTWD+feeTotal;
      const proxy={id:uid(),buyer:w.buyer,item:w.item,price,qty,currency,payment,cardId,note:w.note,img:w.img,feeTotal,totalTWD:grand,paid:false,date:todayStr()};
      return{...t,wishlist:(t.wishlist??[]).map(x=>x.id===wid?{...x,done:true}:x),proxies:[proxy,...(t.proxies??[])]};
    }));
  };
  const addSelfWish=(tid,w)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,selflist:[{...w,id:uid(),done:false},...(t.selflist??[])]}:t));};
  const delSelfWish=(tid,wid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,selflist:(t.selflist??[]).filter(w=>w.id!==wid)}:t));};
  const buySelfWish=(tid,wid,price,qty,currency,payment,cardId,cardsArr)=>{
    setTrips(prev=>prev.map(t=>{
      if(t.id!==tid)return t;
      const w=(t.selflist??[]).find(x=>x.id===wid);if(!w)return t;
      const rate=allCurrs.find(c=>c.code===currency)?.r??1;
      const totalTWD=price*qty*rate;
      const selCard=cardsArr.find(c=>c.id===cardId);
      const feeTotal=selCard?totalTWD*selCard.feeRate/100:0;
      const myShare=totalTWD+feeTotal;
      const ne={id:uid(),date:todayStr(),category:"shopping",note:w.item,amount:price*qty,currency,payment,cardId,iParticipate:true,participants:[],myShare,friendShares:{},feeTotal,isOverseas:true};
      return{...t,selflist:(t.selflist??[]).map(x=>x.id===wid?{...x,done:true}:x),expenses:[ne,...(t.expenses??[])]};
    }));
  };
  const addProxy=(tid,p)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,proxies:[{...p,id:uid(),paid:false},...(t.proxies??[])]}:t));};
  const delProxy=(tid,pid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,proxies:(t.proxies??[]).filter(p=>p.id!==pid)}:t));};
  const toggleProxy=(tid,pid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,proxies:(t.proxies??[]).map(p=>p.id===pid?{...p,paid:!p.paid}:p)}:t));};
  const markManyPaid=(tid,rids)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,receivables:(t.receivables??[]).map(r=>rids.includes(r.id)?{...r,paid:true}:r)}:t));};
  const unmarkPaid=(tid,rid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,receivables:(t.receivables??[]).map(r=>r.id===rid?{...r,paid:false,converted:false}:r)}:t));};
  const delRec=(tid,rid)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,receivables:(t.receivables??[]).filter(r=>r.id!==rid)}:t));};
  const markManyProxyPaid=(tid,pids)=>{setTrips(prev=>prev.map(t=>t.id===tid?{...t,proxies:(t.proxies??[]).map(p=>pids.includes(p.id)?{...p,paid:true}:p)}:t));};
  const convertToExp=(tid,rid)=>{setTrips(prev=>prev.map(t=>{if(t.id!==tid)return t;const r=(t.receivables??[]).find(x=>x.id===rid);if(!r)return t;const ne={id:uid(),date:todayStr(),category:"other",note:`${r.friend} 未還款`,amount:r.amount,currency:"TWD",payment:"cash",iParticipate:true,participants:[],myShare:r.amount,friendShares:{},feeTotal:0,isOverseas:false};return{...t,expenses:[ne,...t.expenses],receivables:(t.receivables??[]).map(x=>x.id===rid?{...x,paid:true,converted:true}:x)};}));};
  const restoreAll=data=>{if(data.trips)setTrips(data.trips);if(data.banks)setBanks(data.banks);if(data.cards)setCards(data.cards);if(data.friends)setFriends(data.friends);if(data.customCurrs)setCustomCurrs(data.customCurrs);if(data.trips?.length>0)setActiveId(data.trips[0].id);};
  return{trips,activeId,setActiveId,active,banks,setBanks,cards,setCards,friends,setFriends,customCurrs,setCustomCurrs,allCurrs,apiKey,setApiKey,createTrip,archiveTrip,reopenTrip,deleteTrip,addExpense,delExpense,editExpense,addWish,delWish,buyWish,addSelfWish,delSelfWish,buySelfWish,addProxy,delProxy,toggleProxy,markManyPaid,unmarkPaid,delRec,markManyProxyPaid,convertToExp,upd,restoreAll};
                                                                                                                                                                                                                                                                                                                                                                                                                                                        }function makeBill(friend,trip,banks,bankId,mode,allCurrs){const recs=(trip.receivables??[]).filter(r=>r.friend===friend&&!r.paid);const prox=(trip.proxies??[]).filter(p=>p.buyer===friend&&!p.paid);const rTotal=recs.reduce((s,r)=>s+r.amount,0);const pTotal=prox.reduce((s,p)=>s+(p.totalTWD??0),0);const grand=rTotal+pTotal;const bank=banks.find(b=>b.id===bankId);const lines=[`📋 ${trip.name}｜${friend} 的帳單`,"━━━━━━━━━━━━━━━━━━━━"];if(recs.length){lines.push("\n💸 代墊分攤");if(mode==="detail")recs.forEach(r=>lines.push(`  ${r.note}　NT$${fmt(r.amount)}`));else lines.push(`  共${recs.length}筆　NT$${fmt(rTotal)}`);}if(prox.length){lines.push("\n🛍️ 代購清單");if(mode==="detail")prox.forEach(p=>lines.push(`  ${p.item}　NT$${fmt(p.totalTWD??0)}`));else lines.push(`  共${prox.length}件　NT$${fmt(pTotal)}`);}lines.push("\n━━━━━━━━━━━━━━━━━━━━",`💰 合計應付　NT$${fmt(grand)}`);if(bank)lines.push("\n匯款 🏦",`  ${bank.bankName}`,`  帳號：${bank.account}`,`  戶名：${bank.holder}`);lines.push("\n麻煩轉帳給我，謝謝 🙏");return lines.join("\n");}
function SettingsSheet({banks,setBanks,cards,setCards,friends,setFriends,trips,customCurrs,setCustomCurrs,apiKey,setApiKey,onRestore,onClose}){
  const [tab,setTab]=useState("friends");
  const [nf,setNf]=useState("");
  const [nb,setNb]=useState({bankName:"",account:"",holder:""});
  const [nc,setNc]=useState({name:"",feeRateOverseas:"",feeRateDomestic:"0"});
  const [restoreMsg,setRestoreMsg]=useState(null);
  const [newCurr,setNewCurr]=useState({code:"",sym:"",l:"",r:""});
  const [fetchingRate,setFetchingRate]=useState(false);
  const [keyInput,setKeyInput]=useState(apiKey);
  const [keyVisible,setKeyVisible]=useState(false);
  const addBank=()=>{if(nb.bankName.trim()&&nb.account.trim()){setBanks(p=>[...p,{...nb,id:uid()}]);setNb({bankName:"",account:"",holder:""});}};
  const addCard=()=>{if(nc.name.trim()&&nc.feeRateOverseas){setCards(p=>[...p,{...nc,id:uid(),feeRateOverseas:+nc.feeRateOverseas,feeRateDomestic:+nc.feeRateDomestic,feeRate:+nc.feeRateOverseas}]);setNc({name:"",feeRateOverseas:"",feeRateDomestic:"0"});}};
  const addFriend=()=>{if(nf.trim()&&!friends.includes(nf.trim())){setFriends(p=>[...p,nf.trim()]);setNf("");}};
  const addCurr=()=>{if(newCurr.code.trim()&&newCurr.r){setCustomCurrs(p=>[...p,{...newCurr,id:uid(),r:+newCurr.r}]);setNewCurr({code:"",sym:"",l:"",r:""});}};
  const fetchRate=async()=>{if(!newCurr.code.trim())return;setFetchingRate(true);try{const res=await fetch(`https://api.exchangerate-api.com/v4/latest/TWD`);const data=await res.json();const rate=data.rates[newCurr.code.toUpperCase()];if(rate){setNewCurr(p=>({...p,r:String((1/rate).toFixed(4))}));}else{alert("找不到此幣別匯率");}}catch{alert("無法取得匯率");}setFetchingRate(false);};
  const handleBackup=()=>{const data={version:1,exportedAt:new Date().toISOString(),trips,banks,cards,friends,customCurrs};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`旅行帳本備份_${new Date().toLocaleDateString("zh-TW").replace(/\//g,"-")}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);};
  const handleRestore=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(!data.trips||!Array.isArray(data.trips))throw new Error();if(window.confirm(`確定還原？共${data.trips.length}趟旅行`)){onRestore(data);setRestoreMsg("✅ 還原成功！");setTimeout(()=>setRestoreMsg(null),3000);}}catch{setRestoreMsg("❌ 格式不符");setTimeout(()=>setRestoreMsg(null),4000);}};reader.readAsText(file);e.target.value="";};
  return(<Sheet onClose={onClose}><SHead title="⚙️ 設定" onClose={onClose}/>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>{[{id:"friends",l:"👥 朋友"},{id:"banks",l:"🏦 帳號"},{id:"cards",l:"💳 信用卡"},{id:"currs",l:"💱 幣別"},{id:"ai",l:"🤖 AI辨識"},{id:"backup",l:"💾 備份"}].map(t=><Pill key={t.id} active={tab===t.id} color="#C9A89A" onClick={()=>setTab(t.id)}>{t.l}</Pill>)}</div>
    {tab==="friends"&&<><Lbl ch="常用朋友"/><div style={{display:"flex",gap:8,marginBottom:14}}><Inp placeholder="姓名" value={nf} onChange={e=>setNf(e.target.value)} style={{flex:1}}/><Btn sm onClick={addFriend} style={{flexShrink:0}}>+新增</Btn></div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{friends.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:6,background:"#F0E6E1",borderRadius:99,padding:"6px 12px"}}><span style={{fontSize:13,color:"#5A5A5A"}}>👤 {f}</span><button onClick={()=>setFriends(p=>p.filter(x=>x!==f))} style={{background:"none",border:"none",color:"#BBBBA8",cursor:"pointer",fontSize:14}}>✕</button></div>)}</div></>}
    {tab==="banks"&&<><Lbl ch="我的銀行帳號"/><Inp placeholder="銀行名稱" value={nb.bankName} onChange={e=>setNb(p=>({...p,bankName:e.target.value}))} style={{marginBottom:8}}/><Inp placeholder="帳號" value={nb.account} onChange={e=>setNb(p=>({...p,account:e.target.value}))} style={{marginBottom:8}}/><Inp placeholder="戶名" value={nb.holder} onChange={e=>setNb(p=>({...p,holder:e.target.value}))} style={{marginBottom:10}}/><Btn onClick={addBank} style={{width:"100%",marginBottom:16}}>+ 新增帳號</Btn>{banks.map(b=><div key={b.id} style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #EDEBE6",padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600,color:"#5A5A5A"}}>🏦 {b.bankName}</div><div style={{fontSize:12,color:"#8A8A7A"}}>{b.account}・{b.holder}</div></div><button onClick={()=>setBanks(p=>p.filter(x=>x.id!==b.id))} style={{background:"none",border:"none",color:"#BBBBA8",cursor:"pointer",fontSize:18}}>🗑</button></div>)}</>}
    {tab==="cards"&&<>
      <Lbl ch="我的信用卡"/>
      <div style={{background:"#EAE6F2",borderRadius:14,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#8A78A8",lineHeight:1.7}}>💡 海外消費才計算手續費，國內消費手續費通常為 0%</div>
      <Inp placeholder="卡片名稱" value={nc.name} onChange={e=>setNc(p=>({...p,name:e.target.value}))} style={{marginBottom:8}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div><Lbl ch="海外手續費 %"/><Inp placeholder="1.5" type="number" value={nc.feeRateOverseas} onChange={e=>setNc(p=>({...p,feeRateOverseas:e.target.value}))}/></div>
        <div><Lbl ch="國內手續費 %"/><Inp placeholder="0" type="number" value={nc.feeRateDomestic} onChange={e=>setNc(p=>({...p,feeRateDomestic:e.target.value}))}/></div>
      </div>
      <Btn onClick={addCard} style={{width:"100%",marginBottom:16}}>+ 新增信用卡</Btn>
      {cards.map(c=><div key={c.id} style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #EDEBE6",padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"#5A5A5A"}}>💳 {c.name}</div>
          <div style={{fontSize:12,color:"#8A8A7A"}}>海外 {c.feeRateOverseas??c.feeRate??0}%・國內 {c.feeRateDomestic??0}%</div>
        </div>
        <button onClick={()=>setCards(p=>p.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:"#BBBBA8",cursor:"pointer",fontSize:18}}>🗑</button>
      </div>)}
    </>}
    {tab==="currs"&&<><div style={{background:"#E4EBE2",borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#A8B5A2",lineHeight:1.7}}>💡 已內建 35 種幣別。若要使用冷門幣別，請在此新增。</div><Lbl ch="新增自訂幣別"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><Inp placeholder="幣別代碼 如 MOP" value={newCurr.code} onChange={e=>setNewCurr(p=>({...p,code:e.target.value.toUpperCase()}))}/><Inp placeholder="符號 如 P" value={newCurr.sym} onChange={e=>setNewCurr(p=>({...p,sym:e.target.value}))}/></div><Inp placeholder="幣別名稱 如 澳門幣" value={newCurr.l} onChange={e=>setNewCurr(p=>({...p,l:e.target.value}))} style={{marginBottom:8}}/><div style={{display:"flex",gap:8,marginBottom:14}}><Inp placeholder="對台幣匯率" type="number" value={newCurr.r} onChange={e=>setNewCurr(p=>({...p,r:e.target.value}))} style={{flex:1}}/><Btn sm color="#A8B5A2" onClick={fetchRate} style={{flexShrink:0}}>{fetchingRate?"查詢中...":"🌐 查匯率"}</Btn></div><Btn onClick={addCurr} style={{width:"100%",marginBottom:16}}>+ 新增幣別</Btn>{customCurrs.map(c=><div key={c.id} style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #EDEBE6",padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600,color:"#5A5A5A"}}>{c.sym} {c.code} {c.l}</div><div style={{fontSize:12,color:"#8A8A7A"}}>1 {c.code} = NT${c.r}</div></div><button onClick={()=>setCustomCurrs(p=>p.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:"#BBBBA8",cursor:"pointer",fontSize:18}}>🗑</button></div>)}</>}
    {tab==="ai"&&<>
      <div style={{background:"#EAE6F2",borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#8A78A8",lineHeight:1.8}}>🤖 使用 Anthropic Claude AI 辨識收據<br/>支援日文、韓文、泰文、英文等多國語言<br/>幣別辨識會優先匹配旅行的常用幣別設定</div>
      <Lbl ch="Anthropic API Key"/>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <Inp type={keyVisible?"text":"password"} placeholder="sk-ant-..." value={keyInput} onChange={e=>setKeyInput(e.target.value)} style={{flex:1,fontFamily:"monospace",fontSize:12}}/>
        <button onClick={()=>setKeyVisible(p=>!p)} style={{padding:"12px",borderRadius:14,border:"1.5px solid #EDEBE6",background:"#FDFCFB",cursor:"pointer",fontSize:16}}>{keyVisible?"🙈":"👁"}</button>
      </div>
      <Btn onClick={()=>setApiKey(keyInput)} color="#B5A8C8" style={{width:"100%",marginBottom:12}}>💾 儲存 API Key</Btn>
      {apiKey&&<div style={{background:"#E2EFE8",borderRadius:12,padding:"10px 14px",fontSize:12,color:"#88B098",fontWeight:600}}>✅ API Key 已設定</div>}
      <div style={{background:"#FFF8E8",border:"1px solid #F0D88A",borderRadius:14,padding:"12px 14px",marginTop:12,fontSize:11,color:"#8A7040",lineHeight:1.7}}>⚠️ API Key 只存在你的手機，不會上傳任何伺服器<br/>取得方式：前往 console.anthropic.com 申請</div>
    </>}
    {tab==="backup"&&<><div style={{background:"#FFF8E8",border:"1px solid #F0D88A",borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#8A7040",lineHeight:1.7}}>⚠️ 清除瀏覽器資料會刪除帳本！建議每趟旅行結束後備份。</div><div style={{background:"#FFFFFF",borderRadius:18,border:"1px solid #EDEBE6",padding:"18px",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:"#5A5A5A",marginBottom:6}}>📤 匯出備份</div><div style={{fontSize:12,color:"#BBBBA8",marginBottom:12}}>目前：{trips.length} 趟旅行・{banks.length} 個帳號・{cards.length} 張卡</div><Btn onClick={handleBackup} color="#A8B5A2" style={{width:"100%"}}>💾 下載備份檔案</Btn></div><div style={{background:"#FFFFFF",borderRadius:18,border:"1px solid #EDEBE6",padding:"18px",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:"#5A5A5A",marginBottom:6}}>📥 還原備份</div><label style={{display:"block",width:"100%",padding:"13px",borderRadius:16,border:"1.5px dashed #C9A89A",background:"#F0E6E1",color:"#C9A89A",fontSize:14,fontWeight:600,cursor:"pointer",textAlign:"center",fontFamily:SANS}}>📂 選擇備份檔案<input type="file" accept=".json" onChange={handleRestore} style={{display:"none"}}/></label></div>{restoreMsg&&<div style={{background:restoreMsg.startsWith("✅")?"#E2EFE8":"#FAE8E3",borderRadius:14,padding:"12px 16px",fontSize:13,fontWeight:600,color:restoreMsg.startsWith("✅")?"#88B098":"#D4806A",textAlign:"center",marginBottom:12}}>{restoreMsg}</div>}<div style={{background:"#FFFFFF",borderRadius:18,border:"1.5px solid #D4806A44",padding:"18px"}}><div style={{fontSize:14,fontWeight:700,color:"#D4806A",marginBottom:6}}>🗑️ 重置所有資料</div><div style={{fontSize:12,color:"#BBBBA8",marginBottom:12,lineHeight:1.6}}>清除所有旅行記錄。<br/><span style={{color:"#D4806A",fontWeight:600}}>無法復原，請先備份！</span></div><button onClick={()=>{if(window.confirm("⚠️ 確定清除所有資料？無法復原！")){localStorage.clear();window.location.reload();}}} style={{width:"100%",padding:"13px",borderRadius:16,border:"1.5px solid #D4806A",background:"#FAE8E3",color:"#D4806A",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:SANS}}>🗑️ 清除所有資料並重新開始</button></div></>}
  </Sheet>);
    }function NewTripSheet({onSave,onClose,allCurrs}){
  const [name,setName]=useState("");const [dest,setDest]=useState("");const [start,setStart]=useState(todayStr());const [end,setEnd]=useState("");const [cover,setCover]=useState("a");const [selCurrs,setSelCurrs]=useState(["TWD"]);
  const toggleCurr=code=>setSelCurrs(p=>p.includes(code)?p.length>1?p.filter(x=>x!==code):p:[...p,code]);
  return(<Sheet onClose={onClose}><SHead title="建立新旅行" onClose={onClose}/>
    <Lbl ch="封面"/><div style={{display:"flex",gap:10,marginBottom:20}}>{COVERS.map(cv=><div key={cv.id} onClick={()=>setCover(cv.id)} style={{width:48,height:48,borderRadius:16,background:cv.g,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:cover===cv.id?"3px solid #5A5A5A":"3px solid transparent",boxSizing:"border-box"}}>{cv.e}</div>)}</div>
    <Lbl ch="旅行名稱"/><Inp placeholder="東京春日小旅行" value={name} onChange={e=>setName(e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="目的地"/><Inp placeholder="日本・東京" value={dest} onChange={e=>setDest(e.target.value)} style={{marginBottom:14}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}><div><Lbl ch="出發日"/><Inp type="date" value={start} onChange={e=>setStart(e.target.value)}/></div><div><Lbl ch="回國日"/><Inp type="date" value={end} onChange={e=>setEnd(e.target.value)}/></div></div>
    <Lbl ch="這趟旅行常用幣別"/><div style={{fontSize:11,color:"#BBBBA8",marginBottom:10}}>記帳時優先顯示，AI辨識收據時也會優先辨識這些幣別</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>{allCurrs.map(c=><button key={c.code} onClick={()=>toggleCurr(c.code)} style={{padding:"7px 12px",borderRadius:99,border:`1.5px solid ${selCurrs.includes(c.code)?"#C9A89A":"#EDEBE6"}`,background:selCurrs.includes(c.code)?"#F0E6E1":"transparent",color:selCurrs.includes(c.code)?"#C9A89A":"#8A8A7A",fontSize:12,fontWeight:selCurrs.includes(c.code)?700:400,cursor:"pointer",fontFamily:SANS}}>{c.sym} {c.code}</button>)}</div>
    <Btn onClick={()=>{if(!name.trim())return;onSave({name:name.trim(),destination:dest.trim(),startDate:start,endDate:end,coverId:cover,preferCurrs:selCurrs});onClose();}} style={{width:"100%"}}>✈️ 開始這趟旅行</Btn>
  </Sheet>);
}
function CurrSel({value,onChange,allCurrs,preferCurrs}){
  const [showAll,setShowAll]=useState(false);
  const list=showAll?allCurrs:allCurrs.filter(c=>(preferCurrs??["TWD"]).includes(c.code));
  return(<div><Sel value={value} onChange={onChange} style={{width:"100%"}}>{list.map(c=><option key={c.code} value={c.code}>{c.code} {c.l}</option>)}</Sel><button onClick={()=>setShowAll(p=>!p)} style={{background:"none",border:"none",fontSize:11,color:"#A8B5A2",cursor:"pointer",fontFamily:SANS,marginTop:4,padding:0}}>{showAll?`▲ 只顯示常用`:`▼ 展開全部（${allCurrs.length}種）`}</button></div>);
}
function PlatformSel({value,manualVal,onChange,onManualChange}){
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
      {PLATFORMS.map(p=><button key={p.id} onClick={()=>onChange(p.id)} style={{padding:"7px 11px",borderRadius:99,border:`1.5px solid ${value===p.id?"#9AB5B5":"#EDEBE6"}`,background:value===p.id?"#E8F0F0":"transparent",color:value===p.id?"#9AB5B5":"#8A8A7A",fontSize:11,fontWeight:value===p.id?700:400,cursor:"pointer",fontFamily:SANS,whiteSpace:"nowrap"}}>{p.e} {p.l}</button>)}
    </div>
    {value==="manual"&&<Inp placeholder="輸入平台名稱" value={manualVal} onChange={e=>onManualChange(e.target.value)} style={{marginTop:4}}/>}
  </div>);
}
function AddWishSheet({trip,friends,allCurrs,onSave,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const [f,setF]=useState({buyer:(friends[0]||""),item:"",currency:(preferCurrs[0]??"TWD"),note:"",img:null});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return(<Sheet onClose={onClose}><SHead title="新增代購清單" onClose={onClose}/>
    <Lbl ch="委託人"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{friends.map(fr=><Pill key={fr} active={f.buyer===fr} color="#B5A8C8" onClick={()=>set("buyer",fr)}>👤 {fr}</Pill>)}</div>
    <Lbl ch="品項名稱"/><Inp placeholder="DHC 唇蜜、森永牛奶糖⋯" value={f.item} onChange={e=>set("item",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="預計幣別"/><CurrSel value={f.currency} onChange={e=>set("currency",e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/><div style={{marginBottom:14}}/>
    <Lbl ch="備註（口味、顏色、規格⋯）"/><Inp placeholder="例：草莓口味、紅色款" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="參考圖片（選填）"/><ImgUpload img={f.img} onImg={v=>set("img",v)}/>
    <Btn onClick={()=>{if(!f.item.trim()||!f.buyer)return;onSave(f);onClose();}} color="#B5A8C8" style={{width:"100%"}}>加入代購清單</Btn>
  </Sheet>);
}
function AddSelfWishSheet({trip,allCurrs,onSave,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const [f,setF]=useState({item:"",currency:(preferCurrs[0]??"TWD"),note:"",img:null});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return(<Sheet onClose={onClose}><SHead title="新增自用清單" onClose={onClose}/>
    <Lbl ch="品項名稱"/><Inp placeholder="想買的東西⋯" value={f.item} onChange={e=>set("item",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="預計幣別"/><CurrSel value={f.currency} onChange={e=>set("currency",e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/><div style={{marginBottom:14}}/>
    <Lbl ch="備註（規格、顏色⋯）"/><Inp placeholder="例：藍色款、L號" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="參考圖片（選填）"/><ImgUpload img={f.img} onImg={v=>set("img",v)}/>
    <Btn onClick={()=>{if(!f.item.trim())return;onSave(f);onClose();}} color="#9AB5B5" style={{width:"100%"}}>加入自用清單</Btn>
  </Sheet>);
}
function BuySelfWishSheet({wish,trip,cards,allCurrs,onBuy,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const initCurrency=wish.currency||(preferCurrs[0]??"TWD");
  const [price,setPrice]=useState("");const [qty,setQty]=useState("1");const [currency,setCurrency]=useState(initCurrency);const [payment,setPayment]=useState("cash");const [cardId,setCardId]=useState("");
  const totalTWD=price&&!isNaN(price)?+price*+qty*(allCurrs.find(c=>c.code===currency)?.r??1):0;
  const selCard=cards.find(c=>c.id===cardId);const feeTotal=selCard?totalTWD*selCard.feeRate/100:0;const grand=totalTWD+feeTotal;
  return(<Sheet onClose={onClose}><SHead title="✓ 買了！記入支出" onClose={onClose}/>
    {wish.img&&<img src={wish.img} style={{width:"100%",borderRadius:16,maxHeight:140,objectFit:"cover",marginBottom:14}} alt="參考圖"/>}
    <div style={{background:"#E8F0F0",borderRadius:14,padding:"12px 14px",marginBottom:16}}><div style={{fontSize:14,fontWeight:700,color:"#9AB5B5"}}>{wish.item}</div>{wish.note&&<div style={{fontSize:12,color:"#8A8A7A"}}>{wish.note}</div>}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div><Lbl ch="幣別"/><CurrSel value={currency} onChange={e=>setCurrency(e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/></div><div><Lbl ch="數量"/><Inp type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/></div></div>
    <Lbl ch="實際單價"/><Inp type="number" placeholder="0" value={price} onChange={e=>setPrice(e.target.value)} style={{marginBottom:6,fontSize:20,fontWeight:700}}/>
    {totalTWD>0&&<div style={{fontSize:12,color:"#A8B5A2",marginBottom:12}}>≈ NT${fmt(grand)}{feeTotal>0?` (含手續費 NT${fmt(feeTotal)})`:""}</div>}
    <Lbl ch="支付方式"/><div style={{display:"flex",gap:8,marginBottom:payment==="card"?10:14}}>{PAYS.map(m=><Pill key={m.id} active={payment===m.id} color="#C8B89A" onClick={()=>setPayment(m.id)}>{m.e} {m.l}</Pill>)}</div>
    {payment==="card"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{cards.map(c=><Pill key={c.id} active={cardId===c.id} color="#C8B89A" onClick={()=>setCardId(c.id)}>💳 {c.name}</Pill>)}</div>}
    <Btn onClick={()=>{if(!price||+price<=0)return;onBuy(+price,+qty,currency,payment,cardId);onClose();}} color="#9AB5B5" style={{width:"100%",marginTop:8}}>✓ 確認購買・記入支出</Btn>
  </Sheet>);
}
function BuyWishSheet({wish,trip,cards,allCurrs,onBuy,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const initCurrency=wish.currency||(preferCurrs[0]??"TWD");
  const [price,setPrice]=useState("");const [qty,setQty]=useState("1");const [currency,setCurrency]=useState(initCurrency);const [payment,setPayment]=useState("cash");const [cardId,setCardId]=useState("");
  const totalTWD=price&&!isNaN(price)?+price*+qty*(allCurrs.find(c=>c.code===currency)?.r??1):0;
  const selCard=cards.find(c=>c.id===cardId);const feeTotal=selCard?totalTWD*(selCard.feeRateOverseas??selCard.feeRate??0)/100:0;const grand=totalTWD+feeTotal;
  return(<Sheet onClose={onClose}><SHead title="✓ 買到了！" onClose={onClose}/>
    {wish.img&&<img src={wish.img} style={{width:"100%",borderRadius:16,maxHeight:140,objectFit:"cover",marginBottom:14}} alt="參考圖"/>}
    <div style={{background:"#EAE6F2",borderRadius:14,padding:"12px 14px",marginBottom:16}}><div style={{fontSize:14,fontWeight:700,color:"#B5A8C8"}}>{wish.item}</div><div style={{fontSize:12,color:"#8A8A7A"}}>委託人：{wish.buyer}{wish.note?`・${wish.note}`:""}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div><Lbl ch="幣別"/><CurrSel value={currency} onChange={e=>setCurrency(e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/></div><div><Lbl ch="數量"/><Inp type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/></div></div>
    <Lbl ch="實際單價"/><Inp type="number" placeholder="0" value={price} onChange={e=>setPrice(e.target.value)} style={{marginBottom:6,fontSize:20,fontWeight:700}}/>
    {totalTWD>0&&<div style={{fontSize:12,color:"#A8B5A2",marginBottom:12}}>≈ NT${fmt(grand)}{feeTotal>0?` (含手續費 NT${fmt(feeTotal)})`:""}</div>}
    <Lbl ch="支付方式"/><div style={{display:"flex",gap:8,marginBottom:payment==="card"?10:14}}>{PAYS.map(m=><Pill key={m.id} active={payment===m.id} color="#C8B89A" onClick={()=>setPayment(m.id)}>{m.e} {m.l}</Pill>)}</div>
    {payment==="card"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{cards.map(c=><Pill key={c.id} active={cardId===c.id} color="#C8B89A" onClick={()=>setCardId(c.id)}>💳 {c.name}</Pill>)}</div>}
    <Btn onClick={()=>{if(!price||+price<=0)return;onBuy(+price,+qty,currency,payment,cardId);onClose();}} style={{width:"100%",marginTop:8}}>✓ 確認購買・加入代收清單</Btn>
  </Sheet>);
}
function AddExpenseSheet({trip,friends,cards,allCurrs,onSave,onClose,prefill,apiKey,customCurrs}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const [f,setF]=useState({
    date:todayStr(),
    category:(prefill?.category??"food"),
    note:(prefill?.note??""),
    detail:(prefill?.detail??""),
    amount:(prefill?.amount??""),
    currency:(prefill?.currency??(preferCurrs[0]??"TWD")),
    payment:"cash",
    cardId:"",
    iParticipate:true,
    participants:[],
    isOverseas:(prefill?.isOverseas??true),
    platform:(prefill?.platform??""),
    platformManual:"",
  });
  const [scanDone,setScanDone]=useState(!!prefill);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleP=fr=>set("participants",f.participants.includes(fr)?f.participants.filter(x=>x!==fr):[...f.participants,fr]);
  const amtTWD=f.amount&&!isNaN(f.amount)?+f.amount*(allCurrs.find(c=>c.code===f.currency)?.r??1):0;
  const selCard=cards.find(c=>c.id===f.cardId);
  const feeRate=selCard?(f.isOverseas?(selCard.feeRateOverseas??selCard.feeRate??0):(selCard.feeRateDomestic??0)):0;
  const total=f.participants.length+(f.iParticipate?1:0);
  const base=total>0?amtTWD/total:amtTWD;
  const feeTotal=amtTWD*feeRate/100;
  const feeEach=total>0?feeTotal/total:0;
  const myShare=f.iParticipate?base+feeEach:0;
  const friendShares={};f.participants.forEach(fr=>{friendShares[fr]=base+feeEach;});
  const handleOverseas=v=>{set("isOverseas",v);if(f.payment==="card"&&f.cardId){/* auto fee rate handled via feeRate calc */}};
  const save=()=>{
    if(!f.amount||isNaN(f.amount)||+f.amount<=0)return;
    const platformLabel=f.platform==="manual"?f.platformManual:(PLATFORMS.find(p=>p.id===f.platform)?.l??"");
    const exp={...f,amount:+f.amount,myShare:f.iParticipate?myShare:0,friendShares,feeTotal,platformLabel};
    const recs=f.participants.map(fr=>({id:uid(),friend:fr,date:f.date,note:f.note||(CATS.find(c=>c.id===f.category)?.l??""),amount:friendShares[fr],paid:false}));
    onSave(exp,recs);onClose();
  };
  const handleScanResult=result=>{
    if(result.amount)set("amount",String(result.amount));
    if(result.currency&&allCurrs.find(c=>c.code===result.currency))set("currency",result.currency);
    if(result.note)set("note",result.note);
    if(result.detail)set("detail",result.detail);
    if(result.category)set("category",result.category);
    if(result.platform)set("platform",result.platform);
    if(result.isOverseas!==undefined)set("isOverseas",result.isOverseas);
    setScanDone(true);
  };
  return(<Sheet onClose={onClose}><SHead title="新增支出" onClose={onClose}/>
    {!scanDone&&<ReceiptScanBtn apiKey={apiKey} preferCurrs={preferCurrs} allCurrs={allCurrs} onResult={handleScanResult}/>}
    {scanDone&&prefill&&<div style={{background:"#EAE6F2",borderRadius:14,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#B5A8C8",fontWeight:600}}>✨ AI 辨識完成，請確認並補充資訊</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div><Lbl ch="日期"/><Inp type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
      <div><Lbl ch="幣別"/><CurrSel value={f.currency} onChange={e=>set("currency",e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/></div>
    </div>
    <Lbl ch="海外 / 國內消費"/>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>handleOverseas(true)} style={{flex:1,padding:"10px",borderRadius:14,border:`1.5px solid ${f.isOverseas?"#9AB5B5":"#EDEBE6"}`,background:f.isOverseas?"#E8F0F0":"transparent",color:f.isOverseas?"#9AB5B5":"#8A8A7A",fontSize:13,fontWeight:f.isOverseas?700:400,cursor:"pointer",fontFamily:SANS}}>🌍 海外消費</button>
      <button onClick={()=>handleOverseas(false)} style={{flex:1,padding:"10px",borderRadius:14,border:`1.5px solid ${!f.isOverseas?"#C9A89A":"#EDEBE6"}`,background:!f.isOverseas?"#F0E6E1":"transparent",color:!f.isOverseas?"#C9A89A":"#8A8A7A",fontSize:13,fontWeight:!f.isOverseas?700:400,cursor:"pointer",fontFamily:SANS}}>🇹🇼 台灣國內</button>
    </div>
    <Lbl ch="類別"/><div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>{CATS.map(c=><Pill key={c.id} active={f.category===c.id} color={c.c} onClick={()=>set("category",c.id)}>{c.e} {c.l}</Pill>)}</div>
    <Lbl ch="金額"/><div style={{position:"relative",marginBottom:6}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#8A8A7A",fontSize:14}}>{allCurrs.find(c=>c.code===f.currency)?.sym}</span><Inp type="number" placeholder="0" value={f.amount} onChange={e=>set("amount",e.target.value)} style={{paddingLeft:34,fontSize:22,fontWeight:700}}/></div>
    {f.currency!=="TWD"&&amtTWD>0&&<div style={{fontSize:12,color:"#A8B5A2",marginBottom:12,paddingLeft:4}}>≈ NT${fmt(amtTWD)}</div>}
    <Lbl ch="簡要品項"/><Inp placeholder="餐廳名稱、景點⋯" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:10}}/>
    <Lbl ch="詳細摘要（選填）"/><Inp placeholder="航班號、房型、訂單號⋯" value={f.detail} onChange={e=>set("detail",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="訂購平台（選填）"/><PlatformSel value={f.platform} manualVal={f.platformManual} onChange={v=>set("platform",v)} onManualChange={v=>set("platformManual",v)}/><div style={{marginBottom:14}}/>
    <Lbl ch="支付方式"/><div style={{display:"flex",gap:8,marginBottom:f.payment==="card"?10:14}}>{PAYS.map(m=><Pill key={m.id} active={f.payment===m.id} color="#C8B89A" onClick={()=>set("payment",m.id)}>{m.e} {m.l}</Pill>)}</div>
    {f.payment==="card"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>{cards.length===0?<span style={{fontSize:12,color:"#BBBBA8"}}>請先在設定新增信用卡</span>:cards.map(c=><Pill key={c.id} active={f.cardId===c.id} color="#C8B89A" onClick={()=>set("cardId",c.id)}>💳 {c.name}</Pill>)}</div>}
    {f.payment==="card"&&selCard&&amtTWD>0&&<div style={{background:"#EDE6D8",borderRadius:14,padding:"10px 14px",fontSize:12,color:"#C8B89A",fontWeight:600,marginBottom:10}}>{f.isOverseas?"海外":"國內"}手續費 {feeRate}%：NT${fmt(feeTotal)}（每人 +NT${fmt(feeEach)}）</div>}
    <div style={{marginBottom:14}}><Toggle on={f.iParticipate} onChange={v=>set("iParticipate",v)} label="我也有參與這筆消費" sub="關閉則我不分攤"/></div>
    <Lbl ch="分攤的朋友（可多選）"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{friends.map(fr=><Pill key={fr} active={f.participants.includes(fr)} color="#A8B5A2" onClick={()=>toggleP(fr)}>👤 {fr}</Pill>)}</div>
    {amtTWD>0&&total>0&&<div style={{background:"#E4EBE2",borderRadius:16,padding:"14px",marginBottom:20}}><div style={{fontSize:12,color:"#A8B5A2",fontWeight:700,marginBottom:8}}>分攤預覽</div>{f.iParticipate&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5A5A5A",marginBottom:4}}><span>👤 我</span><span style={{fontWeight:700}}>NT${fmt(myShare)}</span></div>}{f.participants.map(fr=><div key={fr} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5A5A5A",marginBottom:4}}><span>👤 {fr}</span><span style={{fontWeight:700}}>NT${fmt(friendShares[fr])}</span></div>)}</div>}
    <Btn onClick={save} style={{width:"100%"}}>記錄這筆支出</Btn>
  </Sheet>);
}
function EditExpenseSheet({expense,trip,friends,cards,allCurrs,onSave,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];const e=expense;
  const [f,setF]=useState({
    date:e.date,category:e.category,note:(e.note||""),detail:(e.detail||""),
    amount:String(e.amount),currency:e.currency,payment:e.payment,
    cardId:(e.cardId||""),iParticipate:(e.iParticipate??true),
    participants:(e.participants||[]),isOverseas:(e.isOverseas??true),
    platform:(e.platform||""),platformManual:(e.platformManual||""),
  });
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleP=fr=>set("participants",f.participants.includes(fr)?f.participants.filter(x=>x!==fr):[...f.participants,fr]);
  const amtTWD=f.amount&&!isNaN(f.amount)?+f.amount*(allCurrs.find(c=>c.code===f.currency)?.r??1):0;
  const selCard=cards.find(c=>c.id===f.cardId);
  const feeRate=selCard?(f.isOverseas?(selCard.feeRateOverseas??selCard.feeRate??0):(selCard.feeRateDomestic??0)):0;
  const total=f.participants.length+(f.iParticipate?1:0);
  const base=total>0?amtTWD/total:amtTWD;
  const feeTotal=amtTWD*feeRate/100;
  const feeEach=total>0?feeTotal/total:0;
  const myShare=f.iParticipate?base+feeEach:0;
  const friendShares={};f.participants.forEach(fr=>{friendShares[fr]=base+feeEach;});
  const save=()=>{
    if(!f.amount||isNaN(f.amount)||+f.amount<=0)return;
    const platformLabel=f.platform==="manual"?f.platformManual:(PLATFORMS.find(p=>p.id===f.platform)?.l??"");
    const patch={...f,amount:+f.amount,myShare:f.iParticipate?myShare:0,friendShares,feeTotal,platformLabel};
    const recs=f.participants.map(fr=>({id:uid(),friend:fr,date:f.date,note:f.note||(CATS.find(c=>c.id===f.category)?.l??""),amount:friendShares[fr],paid:false}));
    onSave(patch,recs);onClose();
  };
  return(<Sheet onClose={onClose}><SHead title="✏️ 編輯支出" onClose={onClose}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div><Lbl ch="日期"/><Inp type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
      <div><Lbl ch="幣別"/><CurrSel value={f.currency} onChange={e=>set("currency",e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/></div>
    </div>
    <Lbl ch="海外 / 國內消費"/>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>set("isOverseas",true)} style={{flex:1,padding:"10px",borderRadius:14,border:`1.5px solid ${f.isOverseas?"#9AB5B5":"#EDEBE6"}`,background:f.isOverseas?"#E8F0F0":"transparent",color:f.isOverseas?"#9AB5B5":"#8A8A7A",fontSize:13,fontWeight:f.isOverseas?700:400,cursor:"pointer",fontFamily:SANS}}>🌍 海外消費</button>
      <button onClick={()=>set("isOverseas",false)} style={{flex:1,padding:"10px",borderRadius:14,border:`1.5px solid ${!f.isOverseas?"#C9A89A":"#EDEBE6"}`,background:!f.isOverseas?"#F0E6E1":"transparent",color:!f.isOverseas?"#C9A89A":"#8A8A7A",fontSize:13,fontWeight:!f.isOverseas?700:400,cursor:"pointer",fontFamily:SANS}}>🇹🇼 台灣國內</button>
    </div>
    <Lbl ch="類別"/><div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>{CATS.map(c=><Pill key={c.id} active={f.category===c.id} color={c.c} onClick={()=>set("category",c.id)}>{c.e} {c.l}</Pill>)}</div>
    <Lbl ch="金額"/><div style={{position:"relative",marginBottom:6}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#8A8A7A",fontSize:14}}>{allCurrs.find(c=>c.code===f.currency)?.sym}</span><Inp type="number" placeholder="0" value={f.amount} onChange={e=>set("amount",e.target.value)} style={{paddingLeft:34,fontSize:22,fontWeight:700}}/></div>
    {f.currency!=="TWD"&&amtTWD>0&&<div style={{fontSize:12,color:"#A8B5A2",marginBottom:12,paddingLeft:4}}>≈ NT${fmt(amtTWD)}</div>}
    <Lbl ch="簡要品項"/><Inp placeholder="餐廳名稱、景點⋯" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:10}}/>
    <Lbl ch="詳細摘要（選填）"/><Inp placeholder="航班號、房型、訂單號⋯" value={f.detail} onChange={e=>set("detail",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="訂購平台（選填）"/><PlatformSel value={f.platform} manualVal={f.platformManual} onChange={v=>set("platform",v)} onManualChange={v=>set("platformManual",v)}/><div style={{marginBottom:14}}/>
    <Lbl ch="支付方式"/><div style={{display:"flex",gap:8,marginBottom:14}}>{PAYS.map(m=><Pill key={m.id} active={f.payment===m.id} color="#C8B89A" onClick={()=>set("payment",m.id)}>{m.e} {m.l}</Pill>)}</div>
    {f.payment==="card"&&selCard&&amtTWD>0&&<div style={{background:"#EDE6D8",borderRadius:14,padding:"10px 14px",fontSize:12,color:"#C8B89A",fontWeight:600,marginBottom:10}}>{f.isOverseas?"海外":"國內"}手續費 {feeRate}%：NT${fmt(feeTotal)}</div>}
    <div style={{marginBottom:14}}><Toggle on={f.iParticipate} onChange={v=>set("iParticipate",v)} label="我也有參與這筆消費" sub="關閉則我不分攤"/></div>
    <Lbl ch="分攤的朋友"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{friends.map(fr=><Pill key={fr} active={f.participants.includes(fr)} color="#A8B5A2" onClick={()=>toggleP(fr)}>👤 {fr}</Pill>)}</div>
    {amtTWD>0&&total>0&&<div style={{background:"#E4EBE2",borderRadius:16,padding:"14px",marginBottom:20}}><div style={{fontSize:12,color:"#A8B5A2",fontWeight:700,marginBottom:8}}>分攤預覽</div>{f.iParticipate&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5A5A5A",marginBottom:4}}><span>👤 我</span><span style={{fontWeight:700}}>NT${fmt(myShare)}</span></div>}{f.participants.map(fr=><div key={fr} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5A5A5A",marginBottom:4}}><span>👤 {fr}</span><span style={{fontWeight:700}}>NT${fmt(friendShares[fr])}</span></div>)}</div>}
    <Btn onClick={save} color="#A8B5A2" style={{width:"100%"}}>✓ 儲存修改</Btn>
  </Sheet>);
    }function AddProxySheet({friends,cards,allCurrs,trip,onSave,onClose}){
  const preferCurrs=trip.preferCurrs??["TWD"];
  const [f,setF]=useState({date:todayStr(),buyer:(friends[0]||""),item:"",qty:1,price:"",currency:(preferCurrs[0]??"TWD"),note:"",payment:"cash",cardId:"",img:null});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const total=f.price&&!isNaN(f.price)?+f.price*+f.qty:0;
  const totalTWD=total*(allCurrs.find(c=>c.code===f.currency)?.r??1);
  const selCard=cards.find(c=>c.id===f.cardId);
  const feeTotal=selCard?totalTWD*(selCard.feeRateOverseas??selCard.feeRate??0)/100:0;
  const grand=totalTWD+feeTotal;
  const save=()=>{if(!f.item||!f.price||!f.buyer)return;onSave({...f,price:+f.price,qty:+f.qty,feeTotal,totalTWD:grand});onClose();};
  return(<Sheet onClose={onClose}><SHead title="新增代購" onClose={onClose}/>
    <Lbl ch="委託人"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{friends.map(fr=><Pill key={fr} active={f.buyer===fr} color="#B5A8C8" onClick={()=>set("buyer",fr)}>👤 {fr}</Pill>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div><Lbl ch="日期"/><Inp type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div><div><Lbl ch="幣別"/><CurrSel value={f.currency} onChange={e=>set("currency",e.target.value)} allCurrs={allCurrs} preferCurrs={preferCurrs}/></div></div>
    <Lbl ch="品項名稱"/><Inp placeholder="DHC 唇蜜⋯" value={f.item} onChange={e=>set("item",e.target.value)} style={{marginBottom:14}}/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10,marginBottom:14}}><div><Lbl ch="單價"/><Inp type="number" placeholder="0" value={f.price} onChange={e=>set("price",e.target.value)}/></div><div><Lbl ch="數量"/><Inp type="number" min="1" value={f.qty} onChange={e=>set("qty",e.target.value)}/></div></div>
    <Lbl ch="支付方式"/><div style={{display:"flex",gap:8,marginBottom:f.payment==="card"?10:14}}>{PAYS.map(m=><Pill key={m.id} active={f.payment===m.id} color="#C8B89A" onClick={()=>set("payment",m.id)}>{m.e} {m.l}</Pill>)}</div>
    {f.payment==="card"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>{cards.map(c=><Pill key={c.id} active={f.cardId===c.id} color="#C8B89A" onClick={()=>set("cardId",c.id)}>💳 {c.name}</Pill>)}</div>}
    {total>0&&<div style={{background:"#EAE6F2",borderRadius:14,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#B5A8C8",fontWeight:600}}>小計 NT${fmt(grand)}{feeTotal>0&&<span style={{fontWeight:400,fontSize:11}}> (含海外手續費 NT${fmt(feeTotal)})</span>}</div>}
    <Lbl ch="備註"/><Inp placeholder="口味、顏色⋯" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:14}}/>
    <Lbl ch="參考圖片（選填）"/><ImgUpload img={f.img} onImg={v=>set("img",v)}/>
    <Btn onClick={save} color="#B5A8C8" style={{width:"100%"}}>登記代購</Btn>
  </Sheet>);
}
function BillSheet({friend,trip,banks,allCurrs,onClose}){
  const [bankId,setBankId]=useState(banks[0]?.id??"");const [mode,setMode]=useState("detail");const [copied,setCopied]=useState(false);
  const bill=makeBill(friend,trip,banks,bankId,mode,allCurrs);
  const copy=async()=>{try{await navigator.clipboard.writeText(bill);}catch{}setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return(<Sheet onClose={onClose}><SHead title={`${friend} 的帳單`} onClose={onClose}/>
    <div style={{display:"flex",gap:8,marginBottom:16}}>{[{id:"detail",l:"詳細明細"},{id:"simple",l:"簡式帳單"}].map(t=><Pill key={t.id} active={mode===t.id} color="#C9A89A" onClick={()=>setMode(t.id)}>{t.l}</Pill>)}</div>
    {banks.length>0&&<><Lbl ch="匯款帳號"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{banks.map(b=><Pill key={b.id} active={bankId===b.id} color="#A8B5A2" onClick={()=>setBankId(b.id)}>🏦 {b.bankName}</Pill>)}</div></>}
    <div style={{background:"#F5F3EF",borderRadius:16,padding:"16px",fontFamily:"monospace",fontSize:12,color:"#5A5A5A",lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:16,maxHeight:260,overflowY:"auto"}}>{bill}</div>
    <Btn onClick={copy} color={copied?"#88B098":"#C9A89A"} style={{width:"100%"}}>{copied?"✓ 已複製！":"📋 複製帳單 → 貼到 LINE"}</Btn>
  </Sheet>);
}
function TripList({trips,activeId,onSelect,onCreate,onArchive,onReopen,onDelete,onSettings}){
  const [showArch,setShowArch]=useState(false);
  const active=trips.filter(t=>!t.archived);const arch=trips.filter(t=>t.archived);
  const cv=t=>COVERS.find(c=>c.id===t.coverId)??COVERS[0];
  return(<div style={{padding:"0 16px 100px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingTop:8,marginBottom:24}}>
      <div><div style={{fontSize:10,color:"#BBBBA8",letterSpacing:2,marginBottom:4}}>TRAVEL FOOTPRINT</div><h1 style={{fontFamily:SERIF,fontSize:26,color:"#5A5A5A",margin:"0 0 4px"}}>我的旅行足跡</h1><p style={{fontSize:12,color:"#BBBBA8",margin:0}}>{active.length} 趟進行中・{arch.length} 趟封存</p></div>
      <button onClick={onSettings} style={{background:"#F0E6E1",border:"none",borderRadius:14,padding:"10px 14px",fontSize:13,color:"#C9A89A",cursor:"pointer",fontFamily:SANS,fontWeight:600}}>⚙️ 設定</button>
    </div>
    <button onClick={onCreate} style={{width:"100%",padding:"18px",borderRadius:22,border:"2px dashed #D4B8AB",background:"#F0E6E1",color:"#C9A89A",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:28}}><span style={{fontSize:22}}>＋</span> 建立新旅行</button>
    {active.length>0&&<><div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:12}}>進行中</div>
      {active.map(t=>{const cover=cv(t);const myT=t.expenses.reduce((s,e)=>s+(e.myShare??0),0);const pend=(t.receivables??[]).filter(r=>!r.paid).reduce((s,r)=>s+r.amount,0)+((t.proxies??[]).filter(p=>!p.paid).reduce((s,p)=>s+(p.totalTWD??0),0));const wishPending=(t.wishlist??[]).filter(w=>!w.done).length;const selfPending=(t.selflist??[]).filter(w=>!w.done).length;
        return(<div key={t.id} style={{background:"#FFFFFF",borderRadius:20,border:`1px solid ${t.id===activeId?"#C9A89A":"#EDEBE6"}`,boxShadow:"0 2px 10px rgba(180,165,150,0.07)",marginBottom:12,overflow:"hidden"}}>
          <div style={{height:6,background:cover.g}}/>
          <div style={{padding:"14px 16px"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:14,background:cover.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{cover.e}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontFamily:SERIF,fontSize:16,color:"#5A5A5A",fontWeight:700}}>{t.name}</div>{t.destination&&<div style={{fontSize:12,color:"#8A8A7A"}}>📍 {t.destination}</div>}<div style={{fontSize:11,color:"#BBBBA8"}}>{t.startDate}{t.endDate?`→${t.endDate}`:""}</div></div>
              <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:18,fontWeight:800,color:"#C9A89A"}}>NT${fmt(myT)}</div><div style={{fontSize:10,color:"#BBBBA8"}}>我的花費</div>{pend>0&&<div style={{fontSize:11,color:"#88B098",fontWeight:600}}>待收 NT${fmt(pend)}</div>}{wishPending>0&&<div style={{fontSize:11,color:"#B5A8C8",fontWeight:600}}>代購 {wishPending} 件</div>}{selfPending>0&&<div style={{fontSize:11,color:"#9AB5B5",fontWeight:600}}>自購 {selfPending} 件</div>}</div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:12,borderTop:"1px solid #EDEBE6",paddingTop:10}}>
              <button onClick={()=>onSelect(t.id)} style={{flex:2,padding:"8px",borderRadius:12,border:"none",background:"#C9A89A",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>📖 進入帳本</button>
              <button onClick={()=>onArchive(t.id)} style={{flex:1,padding:"8px",borderRadius:12,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:12,cursor:"pointer",fontFamily:SANS}}>封存</button>
              <button onClick={()=>{if(window.confirm(`刪除「${t.name}」？`))onDelete(t.id);}} style={{width:36,padding:"8px",borderRadius:12,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:12,cursor:"pointer"}}>🗑</button>
            </div>
          </div>
        </div>);
      })}
    </>}
    {arch.length>0&&<div style={{marginTop:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600}}>歷史旅行</div><button onClick={()=>setShowArch(p=>!p)} style={{fontSize:12,color:"#BBBBA8",background:"none",border:"none",cursor:"pointer",fontFamily:SANS}}>{showArch?"收起▲":"展開▼"}({arch.length})</button></div>
      {showArch&&arch.map(t=>{const cover=cv(t);const myT=t.expenses.reduce((s,e)=>s+(e.myShare??0),0);
        return(<div key={t.id} style={{background:"#FFFFFF",borderRadius:20,border:"1px solid #EDEBE6",marginBottom:10,overflow:"hidden",opacity:0.85}}>
          <div style={{height:4,background:cover.g}}/>
          <div style={{padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:36,height:36,borderRadius:12,background:cover.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cover.e}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#5A5A5A"}}>{t.name}</div><div style={{fontSize:11,color:"#BBBBA8"}}>{t.destination}・{t.startDate}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:700,color:"#5A5A5A"}}>NT${fmt(myT)}</div><div style={{display:"flex",gap:6,marginTop:6}}><button onClick={()=>onSelect(t.id)} style={{padding:"5px 9px",borderRadius:9,border:"1px solid #EDEBE6",background:"transparent",color:"#8A8A7A",fontSize:11,cursor:"pointer",fontFamily:SANS}}>查看</button><button onClick={()=>onReopen(t.id)} style={{padding:"5px 9px",borderRadius:9,border:"1px solid #A8B5A2",background:"#E4EBE2",color:"#A8B5A2",fontSize:11,cursor:"pointer",fontFamily:SANS}}>重啟</button></div></div>
          </div>
        </div>);
      })}
    </div>}
    {trips.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#BBBBA8"}}><div style={{fontSize:52,marginBottom:16}}>✈️</div><div style={{fontFamily:SERIF,fontSize:18,color:"#8A8A7A",marginBottom:8}}>還沒有旅行記錄</div><div style={{fontSize:13}}>建立第一趟旅行，開始記帳吧</div></div>}
  </div>);
}const DTABS=[{id:"ledger",e:"📖",l:"帳本"},{id:"collect",e:"💰",l:"代墊"},{id:"proxy",e:"🛍️",l:"代購"},{id:"stats",e:"📊",l:"統計"}];
function TripDetail({trip,store,banks,cards,friends,allCurrs,onBack}){
  const [tab,setTab]=useState("ledger");
  const [modal,setModal]=useState(null);
  const [billFriend,setBillFriend]=useState(null);
  const [toast,setToast]=useState(null);
  const [printMode,setPrintMode]=useState(null);
  const [editingExp,setEditingExp]=useState(null);
  const [buyingWish,setBuyingWish]=useState(null);
  const [buyingSelf,setBuyingSelf]=useState(null);
  const [expPrefill,setExpPrefill]=useState(null);
  const showToast=t=>{setToast(t);setTimeout(()=>setToast(null),4000);};
  const cv=COVERS.find(c=>c.id===trip.coverId)??COVERS[0];
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const pendRec=(trip.receivables??[]).filter(r=>!r.paid).reduce((s,r)=>s+r.amount,0);
  const pendProxy=(trip.proxies??[]).filter(p=>!p.paid).reduce((s,p)=>s+(p.totalTWD??0),0);
  const openExp=(prefill=null)=>{setExpPrefill(prefill);setModal("exp");};
  return(<div style={{minHeight:"100vh",background:"#F9F8F6"}}>
    <div style={{background:cv.g,padding:"44px 20px 28px",position:"relative"}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:12,padding:"7px 14px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:SANS,marginBottom:14}}>← 所有旅行</button>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",letterSpacing:2}}>{trip.destination||"TRAVEL FOOTPRINT"}</div>
      <h2 style={{fontFamily:SERIF,fontSize:22,color:"#fff",margin:"4px 0 10px"}}>{trip.name}</h2>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div><div style={{fontSize:26,fontWeight:800,color:"#fff",fontFamily:SERIF}}>NT${fmt(myTotal)}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>我的花費</div></div>
        {(pendRec+pendProxy)>0&&<div style={{background:"rgba(255,255,255,0.2)",borderRadius:14,padding:"6px 14px"}}><div style={{fontSize:20,fontWeight:800,color:"#fff"}}>NT${fmt(pendRec+pendProxy)}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.75)"}}>待收回來 💚</div></div>}
      </div>
      <div style={{position:"absolute",bottom:-22,left:16,right:16,background:"#FFFFFF",borderRadius:20,padding:5,display:"flex",boxShadow:"0 4px 20px rgba(150,120,100,0.18)",border:"1px solid #EDEBE6"}}>
        {DTABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 3px",borderRadius:14,border:"none",background:tab===t.id?cv.g:"transparent",color:tab===t.id?"#fff":"#BBBBA8",fontSize:11,fontWeight:tab===t.id?700:400,cursor:"pointer",fontFamily:SANS}}>{t.e} {t.l}</button>)}
      </div>
    </div>
    <div style={{height:36}}/>
    {tab==="ledger"&&<LedgerTab trip={trip} allCurrs={allCurrs} onAdd={()=>openExp(null)} onAddWithScan={prefill=>openExp(prefill)} onDel={eid=>store.delExpense(trip.id,eid)} onEdit={e=>setEditingExp(e)} apiKey={store.apiKey} preferCurrs={trip.preferCurrs??["TWD"]} customCurrs={store.customCurrs}/>}
    {tab==="collect"&&<CollectTab trip={trip} friends={friends} onFriendsChange={store.setFriends} onMarkManyPaid={rids=>store.markManyPaid(trip.id,rids)} onUnmarkPaid={rid=>store.unmarkPaid(trip.id,rid)} onDelRec={rid=>store.delRec(trip.id,rid)} onConvert={rid=>store.convertToExp(trip.id,rid)} onBill={f=>setBillFriend(f)}/>}
    {tab==="proxy"&&<ProxyTab trip={trip} allCurrs={allCurrs} onAddWish={()=>setModal("wish")} onBuyWish={w=>setBuyingWish(w)} onDelWish={wid=>store.delWish(trip.id,wid)} onAddSelfWish={()=>setModal("selfwish")} onBuySelfWish={w=>setBuyingSelf(w)} onDelSelfWish={wid=>store.delSelfWish(trip.id,wid)} onAdd={()=>setModal("proxy")} onDel={pid=>store.delProxy(trip.id,pid)} onMarkManyProxyPaid={pids=>store.markManyProxyPaid(trip.id,pids)} onToggle={pid=>store.toggleProxy(trip.id,pid)} onBill={f=>setBillFriend(f)}/>}
    {tab==="stats"&&<StatsTab trip={trip} onOpenPrint={m=>setPrintMode(m)} onExcel={()=>showToast({icon:"📊",title:`${trip.name}_結算表`,lines:[`✦ 支出 ${trip.expenses.length}筆`,`✦ 代墊 ${(trip.receivables??[]).length}筆`,`✦ 代購 ${(trip.proxies??[]).length}件`,"─────────────────","整合SheetJS即可真實下載"]})}/>}
    {modal==="exp"&&<AddExpenseSheet trip={trip} friends={friends} cards={cards} allCurrs={allCurrs} onSave={(exp,recs)=>store.addExpense(trip.id,exp,recs)} onClose={()=>{setModal(null);setExpPrefill(null);}} prefill={expPrefill} apiKey={store.apiKey} customCurrs={store.customCurrs}/>}
    {modal==="proxy"&&<AddProxySheet friends={friends} cards={cards} allCurrs={allCurrs} trip={trip} onSave={p=>store.addProxy(trip.id,p)} onClose={()=>setModal(null)}/>}
    {modal==="wish"&&<AddWishSheet trip={trip} friends={friends} allCurrs={allCurrs} onSave={w=>store.addWish(trip.id,w)} onClose={()=>setModal(null)}/>}
    {modal==="selfwish"&&<AddSelfWishSheet trip={trip} allCurrs={allCurrs} onSave={w=>store.addSelfWish(trip.id,w)} onClose={()=>setModal(null)}/>}
    {editingExp&&<EditExpenseSheet expense={editingExp} trip={trip} friends={friends} cards={cards} allCurrs={allCurrs} onSave={(patch,recs)=>{store.editExpense(trip.id,editingExp.id,patch,recs);setEditingExp(null);}} onClose={()=>setEditingExp(null)}/>}
    {buyingWish&&<BuyWishSheet wish={buyingWish} trip={trip} cards={cards} allCurrs={allCurrs} onBuy={(price,qty,currency,payment,cardId)=>{store.buyWish(trip.id,buyingWish.id,price,qty,currency,payment,cardId,cards);setBuyingWish(null);}} onClose={()=>setBuyingWish(null)}/>}
    {buyingSelf&&<BuySelfWishSheet wish={buyingSelf} trip={trip} cards={cards} allCurrs={allCurrs} onBuy={(price,qty,currency,payment,cardId)=>{store.buySelfWish(trip.id,buyingSelf.id,price,qty,currency,payment,cardId,cards);setBuyingSelf(null);}} onClose={()=>setBuyingSelf(null)}/>}
    {billFriend&&<BillSheet friend={billFriend} trip={trip} banks={banks} allCurrs={allCurrs} onClose={()=>setBillFriend(null)}/>}
    {printMode&&<PrintReport trip={trip} mode={printMode} allCurrs={allCurrs} onClose={()=>setPrintMode(null)}/>}
    <Toast data={toast}/>
  </div>);
}
function LedgerTab({trip,allCurrs,onAdd,onAddWithScan,onDel,onEdit,apiKey,preferCurrs,customCurrs}){
  const [scanning,setScanning]=useState(false);
  const [scanErr,setScanErr]=useState(null);
  const grouped=trip.expenses.reduce((a,e)=>{(a[e.date]=a[e.date]||[]).push(e);return a;},{});
  const dates=Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  const handleScanFile=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    if(!apiKey){setScanErr("請先在設定→🤖 AI辨識設定API Key");e.target.value="";return;}
    setScanning(true);setScanErr(null);
    try{const b64=await compressImg(file);const result=await scanReceipt(b64,apiKey,preferCurrs,allCurrs);onAddWithScan(result);}
    catch{setScanErr("辨識失敗，請重試");}
    setScanning(false);e.target.value="";
  };
  return(<div style={{padding:"16px 16px 100px"}}>
    {!trip.archived&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
      <button onClick={onAdd} style={{padding:"14px",borderRadius:20,border:"2px dashed #D4B8AB",background:"#F0E6E1",color:"#C9A89A",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:18}}>+</span>手動記帳</button>
      <label style={{cursor:"pointer"}}>
        <div style={{padding:"14px",borderRadius:20,border:"2px dashed #B5A8C8",background:scanning?"#F0EDF8":"#EAE6F2",color:"#B5A8C8",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {scanning?<><span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:16}}>⟳</span>辨識中...</>:<><span style={{fontSize:18}}>📷</span>拍收據</>}
        </div>
        <input type="file" accept="image/*" capture="environment" onChange={handleScanFile} style={{display:"none"}} disabled={scanning||trip.archived}/>
      </label>
    </div>}
    {scanErr&&<div style={{background:"#FAE8E3",borderRadius:14,padding:"10px 14px",fontSize:12,color:"#D4806A",marginBottom:14}}>{scanErr}</div>}
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    {dates.length===0?<div style={{textAlign:"center",padding:"50px 0",color:"#BBBBA8"}}><div style={{fontSize:44,marginBottom:10}}>📒</div><div style={{fontFamily:SERIF,fontSize:15}}>還沒有支出記錄</div><div style={{fontSize:12,color:"#BBBBA8",marginTop:6}}>手動記帳或拍收據自動辨識</div></div>
    :dates.map(date=>{const items=grouped[date];const dayMine=items.reduce((s,e)=>s+(e.myShare??0),0);
      return(<div key={date} style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:"#BBBBA8",letterSpacing:1}}>{date.replace(/-/g," · ")}</span><span style={{fontSize:12,color:"#C9A89A",fontWeight:600}}>我花 NT${fmt(dayMine)}</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {items.map(e=>{const cat=CATS.find(c=>c.id===e.category)||CATS[CATS.length-1];const pm=PAYS.find(m=>m.id===e.payment);const currSym=allCurrs.find(c=>c.code===e.currency)?.sym??"";const platLabel=e.platformLabel||(e.platform&&e.platform!=="manual"?(PLATFORMS.find(p=>p.id===e.platform)?.l??""):"");
            return(<div key={e.id} onClick={()=>!trip.archived&&onEdit&&onEdit(e)} style={{background:"#FFFFFF",borderRadius:20,border:"1px solid #EDEBE6",boxShadow:"0 2px 10px rgba(180,165,150,0.07)",padding:"13px 15px",cursor:trip.archived?"default":"pointer"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:42,height:42,borderRadius:14,background:cat.c+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{cat.e}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#5A5A5A"}}>{e.note||cat.l}</div>
                  {e.detail&&<div style={{fontSize:11,color:"#8A8A7A",marginTop:2}}>{e.detail}</div>}
                  <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#BBBBA8"}}>{pm?.e} {pm?.l}</span>
                    {platLabel&&<span style={{fontSize:10,background:"#EAE6F2",color:"#9AB5B5",padding:"1px 7px",borderRadius:99}}>{platLabel}</span>}
                    {e.isOverseas===false&&<span style={{fontSize:10,background:"#F0E6E1",color:"#C9A89A",padding:"1px 7px",borderRadius:99}}>🇹🇼 國內</span>}
                    {e.participants?.length>0&&<span style={{fontSize:10,background:"#E4EBE2",color:"#A8B5A2",padding:"1px 7px",borderRadius:99,fontWeight:600}}>÷{e.participants.length+(e.iParticipate?1:0)}人</span>}
                    {!e.iParticipate&&<span style={{fontSize:10,background:"#EAE6F2",color:"#B5A8C8",padding:"1px 7px",borderRadius:99}}>不含我</span>}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,color:"#BBBBA8"}}>{e.currency!=="TWD"?`${currSym}${fmt(e.amount)}`:`NT$${fmt(e.amount)}`}</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#C9A89A"}}>我：NT${fmt(e.myShare??0)}</div>
                  {!trip.archived&&<div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:3}}><span style={{fontSize:10,color:"#A8B5A2"}}>✏️ 點編輯</span><button onClick={ev=>{ev.stopPropagation();onDel(e.id);}} style={{background:"none",border:"none",fontSize:10,color:"#BBBBA8",cursor:"pointer",padding:0}}>刪除</button></div>}
                </div>
              </div>
            </div>);
          })}
        </div>
      </div>);
    })}
  </div>);
                      }function CollectTab({trip,friends,onFriendsChange,onMarkManyPaid,onUnmarkPaid,onDelRec,onConvert,onBill}){
  const recs=trip.receivables??[];
  const pending=recs.filter(r=>!r.paid);
  const done=recs.filter(r=>r.paid);
  const pendTotal=pending.reduce((s,r)=>s+r.amount,0);
  const allF=[...new Set(pending.map(r=>r.friend))];
  const [editMembers,setEditMembers]=useState(false);
  const [newName,setNewName]=useState("");
  const [checked,setChecked]=useState({});
  const toggleCheck=id=>setChecked(p=>({...p,[id]:!p[id]}));
  const checkedIds=Object.keys(checked).filter(id=>checked[id]);
  const checkedTotal=pending.filter(r=>checkedIds.includes(r.id)).reduce((s,r)=>s+r.amount,0);
  const markAllFriend=fr=>{const ids=pending.filter(r=>r.friend===fr).map(r=>r.id);const allChk=ids.every(id=>checked[id]);setChecked(p=>{const n={...p};ids.forEach(id=>n[id]=!allChk);return n;});};
  return(<div style={{padding:"16px 16px 100px"}}>
    <div style={{background:"linear-gradient(135deg,#E2EFE8,#E6F2EA)",borderRadius:20,padding:"18px",marginBottom:16}}>
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:7}}>待收款合計</div>
      <div style={{fontSize:32,fontWeight:800,color:"#88B098",fontFamily:SERIF}}>NT${fmt(pendTotal)}</div>
      <div style={{fontSize:12,color:"#BBBBA8",marginTop:4}}>{pending.length}筆未收・{done.length}筆已收</div>
    </div>
    {checkedIds.length>0&&<div style={{background:"#FFFFFF",borderRadius:16,border:"1.5px solid #88B098",padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:13,fontWeight:700,color:"#5A5A5A"}}>已勾選 {checkedIds.length} 筆</div><div style={{fontSize:13,color:"#88B098",fontWeight:700}}>合計 NT${fmt(checkedTotal)}</div></div>
      <Btn sm color="#88B098" onClick={()=>{onMarkManyPaid(checkedIds);setChecked({});}}>✓ 一次還款</Btn>
    </div>}
    <div style={{marginBottom:20,background:"#FFFFFF",borderRadius:20,border:"1px solid #EDEBE6",overflow:"hidden"}}>
      <button onClick={()=>setEditMembers(p=>!p)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:SANS}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>👥</span><div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#5A5A5A"}}>旅伴名單</div><div style={{fontSize:11,color:"#BBBBA8"}}>{friends.join("、")}</div></div></div>
        <span style={{fontSize:12,color:"#C9A89A",fontWeight:600}}>{editMembers?"收起 ▲":"編輯 ✏️"}</span>
      </button>
      {editMembers&&<div style={{padding:"0 16px 16px",borderTop:"1px solid #EDEBE6"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12,marginTop:12}}>{friends.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:5,background:"#E4EBE2",borderRadius:99,padding:"5px 10px 5px 12px"}}><span style={{fontSize:12,color:"#5A5A5A",fontWeight:600}}>{f}</span><button onClick={()=>onFriendsChange(friends.filter(x=>x!==f))} style={{background:"none",border:"none",color:"#BBBBA8",cursor:"pointer",fontSize:14,lineHeight:1,padding:"0 2px"}}>✕</button></div>)}</div>
        <div style={{display:"flex",gap:8}}><input placeholder="新增旅伴姓名" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newName.trim()&&!friends.includes(newName.trim())){onFriendsChange([...friends,newName.trim()]);setNewName("");}}} style={{flex:1,padding:"10px 14px",borderRadius:12,border:"1.5px solid #EDEBE6",background:"#FDFCFB",fontSize:13,color:"#5A5A5A",outline:"none",fontFamily:SANS}}/><button onClick={()=>{if(newName.trim()&&!friends.includes(newName.trim())){onFriendsChange([...friends,newName.trim()]);setNewName("");}}} style={{padding:"10px 16px",borderRadius:12,border:"none",background:"#A8B5A2",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS,flexShrink:0}}>+ 新增</button></div>
      </div>}
    </div>
    {allF.map(fr=>{const items=pending.filter(r=>r.friend===fr);const fTotal=items.reduce((s,r)=>s+r.amount,0);const allChk=items.every(r=>checked[r.id]);
      return(<div key={fr} style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"#E2EFE8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#88B098"}}>{fr[0]}</div>
            <span style={{fontWeight:700,color:"#5A5A5A",fontSize:15}}>{fr}</span>
            <span style={{fontSize:12,color:"#88B098",fontWeight:600}}>NT${fmt(fTotal)}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>markAllFriend(fr)} style={{padding:"5px 10px",borderRadius:9,border:`1.5px solid ${allChk?"#88B098":"#EDEBE6"}`,background:allChk?"#E2EFE8":"transparent",color:allChk?"#88B098":"#BBBBA8",fontSize:11,cursor:"pointer",fontFamily:SANS,fontWeight:600}}>{allChk?"✓ 全選":"全選"}</button>
            <Btn sm color="#C9A89A" onClick={()=>onBill(fr)}>📋 帳單</Btn>
          </div>
        </div>
        {items.map(r=><div key={r.id} style={{background:"#FFFFFF",borderRadius:20,border:`1.5px solid ${checked[r.id]?"#88B098":"#EDEBE6"}`,padding:"11px 14px",marginBottom:7}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div onClick={()=>toggleCheck(r.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked[r.id]?"#88B098":"#DDD9D0"}`,background:checked[r.id]?"#88B098":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {checked[r.id]&&<span style={{color:"#fff",fontSize:12,fontWeight:700,lineHeight:1}}>✓</span>}
            </div>
            <div style={{flex:1,cursor:"pointer"}} onClick={()=>toggleCheck(r.id)}><div style={{fontSize:13,fontWeight:600,color:"#5A5A5A"}}>{r.note}</div><div style={{fontSize:11,color:"#BBBBA8"}}>{r.date}</div></div>
            <div style={{fontSize:14,fontWeight:700,color:"#5A5A5A"}}>NT${fmt(r.amount)}</div>
            <div style={{display:"flex",gap:5}}>
              {!trip.archived&&<button onClick={()=>onConvert(r.id)} style={{padding:"5px 9px",borderRadius:9,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:11,cursor:"pointer",fontFamily:SANS}}>轉支出</button>}
              {!trip.archived&&<button onClick={()=>{if(window.confirm(`確定刪除「${r.note}」這筆代墊？`))onDelRec(r.id);}} style={{padding:"5px 9px",borderRadius:9,border:"1px solid #FAE8E3",background:"#FAE8E3",color:"#D4806A",fontSize:11,cursor:"pointer",fontFamily:SANS}}>🗑</button>}
            </div>
          </div>
        </div>)}
      </div>);
    })}
    {pending.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:"#BBBBA8"}}><div style={{fontSize:40,marginBottom:10}}>✅</div><div style={{fontFamily:SERIF,fontSize:15}}>所有代墊都已收款！</div></div>}
    {done.length>0&&<div style={{marginTop:20}}>
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:10}}>已收款紀錄</div>
      {done.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:"#BBBBA8",padding:"8px 0",borderBottom:"1px solid #EDEBE6"}}>
        <span>{r.friend}・{r.note}・NT${fmt(r.amount)}</span>
        <button onClick={()=>onUnmarkPaid(r.id)} style={{padding:"4px 8px",borderRadius:8,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:10,cursor:"pointer",fontFamily:SANS,flexShrink:0,marginLeft:8}}>↩ 取消</button>
      </div>)}
    </div>}
  </div>);
}
function ProxyTab({trip,allCurrs,onAddWish,onBuyWish,onDelWish,onAddSelfWish,onBuySelfWish,onDelSelfWish,onAdd,onDel,onMarkManyProxyPaid,onToggle,onBill}){
  const [view,setView]=useState("wish");
  const wishlist=trip.wishlist??[];
  const selflist=trip.selflist??[];
  const pendingWish=wishlist.filter(w=>!w.done);
  const pendingSelf=selflist.filter(w=>!w.done);
  const proxies=trip.proxies??[];
  const unpaid=proxies.filter(p=>!p.paid);
  const paid=proxies.filter(p=>p.paid);
  const pendTotal=unpaid.reduce((s,p)=>s+(p.totalTWD??0),0);
  const allB=[...new Set(unpaid.map(p=>p.buyer))];
  const [checked,setChecked]=useState({});
  const toggleCheck=id=>setChecked(p=>({...p,[id]:!p[id]}));
  const checkedIds=Object.keys(checked).filter(id=>checked[id]);
  const checkedTotal=unpaid.filter(p=>checkedIds.includes(p.id)).reduce((s,p)=>s+(p.totalTWD??0),0);
  const markAllBuyer=buyer=>{const ids=unpaid.filter(p=>p.buyer===buyer).map(p=>p.id);const allChk=ids.every(id=>checked[id]);setChecked(p=>{const n={...p};ids.forEach(id=>n[id]=!allChk);return n;});};
  return(<div style={{padding:"16px 16px 100px"}}>
    <div style={{background:"linear-gradient(135deg,#EAE6F2,#EDE8F5)",borderRadius:20,padding:"18px",marginBottom:16}}>
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:7}}>代購總覽</div>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><div style={{fontSize:24,fontWeight:800,color:"#B5A8C8",fontFamily:SERIF}}>{pendingWish.length}</div><div style={{fontSize:11,color:"#BBBBA8"}}>代購待購</div></div>
        <div><div style={{fontSize:24,fontWeight:800,color:"#9AB5B5",fontFamily:SERIF}}>{pendingSelf.length}</div><div style={{fontSize:11,color:"#BBBBA8"}}>自購待買</div></div>
        <div><div style={{fontSize:24,fontWeight:800,color:"#88B098",fontFamily:SERIF}}>NT${fmt(pendTotal)}</div><div style={{fontSize:11,color:"#BBBBA8"}}>代購待收款</div></div>
      </div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>{[{id:"wish",l:"📋 代購清單"},{id:"self",l:"🛒 自用清單"},{id:"done",l:"✅ 已購買"}].map(t=><Pill key={t.id} active={view===t.id} color={t.id==="self"?"#9AB5B5":"#B5A8C8"} onClick={()=>setView(t.id)}>{t.l}</Pill>)}</div>
    {view==="wish"&&<>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {!trip.archived&&<button onClick={onAddWish} style={{flex:1,padding:"13px",borderRadius:18,border:"2px dashed #B5A8C8",background:"#EAE6F2",color:"#B5A8C8",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>+ 新增清單</button>}
        {!trip.archived&&<button onClick={onAdd} style={{flex:1,padding:"13px",borderRadius:18,border:"2px dashed #A8B5A2",background:"#E4EBE2",color:"#A8B5A2",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>+ 直接登記</button>}
      </div>
      {pendingWish.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#BBBBA8"}}><div style={{fontSize:36,marginBottom:8}}>🛍️</div><div style={{fontFamily:SERIF,fontSize:14}}>代購清單是空的</div></div>}
      {pendingWish.map(w=><div key={w.id} style={{background:"#FFFFFF",borderRadius:20,border:"1px solid #EDEBE6",padding:"14px",marginBottom:10}}>
        {w.img&&<img src={w.img} style={{width:"100%",borderRadius:12,maxHeight:120,objectFit:"cover",marginBottom:10}} alt="參考圖"/>}
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#5A5A5A"}}>{w.item}</div><div style={{fontSize:12,color:"#B5A8C8",fontWeight:600}}>👤 {w.buyer}</div>{w.note&&<div style={{fontSize:11,color:"#BBBBA8",marginTop:2}}>{w.note}</div>}<div style={{fontSize:11,color:"#BBBBA8",marginTop:2}}>預計幣別：{w.currency}</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {!trip.archived&&<button onClick={()=>onBuyWish(w)} style={{padding:"7px 12px",borderRadius:10,border:"none",background:"#A8B5A2",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS,whiteSpace:"nowrap"}}>✓ 買到了</button>}
            {!trip.archived&&<button onClick={()=>{if(window.confirm(`確定刪除「${w.item}」？`))onDelWish(w.id);}} style={{padding:"7px 12px",borderRadius:10,border:"1px solid #FAE8E3",background:"#FAE8E3",color:"#D4806A",fontSize:12,cursor:"pointer",fontFamily:SANS}}>🗑 刪除</button>}
          </div>
        </div>
      </div>)}
      {wishlist.filter(w=>w.done).length>0&&<div style={{marginTop:8,fontSize:11,color:"#BBBBA8"}}>已購買 {wishlist.filter(w=>w.done).length} 件 ✅</div>}
    </>}
    {view==="self"&&<>
      {!trip.archived&&<button onClick={onAddSelfWish} style={{width:"100%",padding:"13px",borderRadius:18,border:"2px dashed #9AB5B5",background:"#E8F0F0",color:"#9AB5B5",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}><span style={{fontSize:18}}>+</span>新增自用清單</button>}
      {pendingSelf.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#BBBBA8"}}><div style={{fontSize:36,marginBottom:8}}>🛒</div><div style={{fontFamily:SERIF,fontSize:14}}>自用清單是空的</div><div style={{fontSize:12,marginTop:4}}>把想買的東西先記下來吧！</div></div>}
      {pendingSelf.map(w=><div key={w.id} style={{background:"#FFFFFF",borderRadius:20,border:"1px solid #EDEBE6",padding:"14px",marginBottom:10}}>
        {w.img&&<img src={w.img} style={{width:"100%",borderRadius:12,maxHeight:120,objectFit:"cover",marginBottom:10}} alt="參考圖"/>}
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#5A5A5A"}}>{w.item}</div>{w.note&&<div style={{fontSize:11,color:"#BBBBA8",marginTop:2}}>{w.note}</div>}<div style={{fontSize:11,color:"#BBBBA8",marginTop:2}}>預計幣別：{w.currency}</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {!trip.archived&&<button onClick={()=>onBuySelfWish(w)} style={{padding:"7px 12px",borderRadius:10,border:"none",background:"#9AB5B5",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS,whiteSpace:"nowrap"}}>✓ 買了</button>}
            {!trip.archived&&<button onClick={()=>{if(window.confirm(`確定刪除「${w.item}」？`))onDelSelfWish(w.id);}} style={{padding:"7px 12px",borderRadius:10,border:"1px solid #FAE8E3",background:"#FAE8E3",color:"#D4806A",fontSize:12,cursor:"pointer",fontFamily:SANS}}>🗑 刪除</button>}
          </div>
        </div>
      </div>)}
      {selflist.filter(w=>w.done).length>0&&<div style={{marginTop:8,fontSize:11,color:"#BBBBA8"}}>已購買 {selflist.filter(w=>w.done).length} 件 ✅</div>}
    </>}
    {view==="done"&&<>
      {checkedIds.length>0&&<div style={{background:"#FFFFFF",borderRadius:16,border:"1.5px solid #B5A8C8",padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,fontWeight:700,color:"#5A5A5A"}}>已勾選 {checkedIds.length} 件</div><div style={{fontSize:13,color:"#B5A8C8",fontWeight:700}}>合計 NT${fmt(checkedTotal)}</div></div>
        <Btn sm color="#B5A8C8" onClick={()=>{onMarkManyProxyPaid(checkedIds);setChecked({});}}>✓ 一次付款</Btn>
      </div>}
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:12}}>待收款清單</div>
      {allB.map(buyer=>{const items=unpaid.filter(p=>p.buyer===buyer);const bTotal=items.reduce((s,p)=>s+(p.totalTWD??0),0);const allChk=items.every(p=>checked[p.id]);
        return(<div key={buyer} style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"#EAE6F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#B5A8C8"}}>{buyer[0]}</div>
              <span style={{fontWeight:700,color:"#5A5A5A",fontSize:15}}>{buyer}</span>
              <span style={{fontSize:12,color:"#B5A8C8",fontWeight:600}}>NT${fmt(bTotal)}</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>markAllBuyer(buyer)} style={{padding:"5px 10px",borderRadius:9,border:`1.5px solid ${allChk?"#B5A8C8":"#EDEBE6"}`,background:allChk?"#EAE6F2":"transparent",color:allChk?"#B5A8C8":"#BBBBA8",fontSize:11,cursor:"pointer",fontFamily:SANS,fontWeight:600}}>{allChk?"✓ 全選":"全選"}</button>
              <Btn sm color="#B5A8C8" onClick={()=>onBill(buyer)}>📋 帳單</Btn>
            </div>
          </div>
          {items.map(p=>{const sym=allCurrs.find(c=>c.code===p.currency)?.sym??"";
            return(<div key={p.id} style={{background:"#FFFFFF",borderRadius:20,border:`1.5px solid ${checked[p.id]?"#B5A8C8":"#EDEBE6"}`,padding:"12px 14px",marginBottom:7}}>
              {p.img&&<img src={p.img} style={{width:"100%",borderRadius:10,maxHeight:80,objectFit:"cover",marginBottom:8}} alt="參考圖"/>}
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div onClick={()=>toggleCheck(p.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked[p.id]?"#B5A8C8":"#DDD9D0"}`,background:checked[p.id]?"#B5A8C8":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {checked[p.id]&&<span style={{color:"#fff",fontSize:12,fontWeight:700,lineHeight:1}}>✓</span>}
                </div>
                <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>toggleCheck(p.id)}><div style={{fontSize:13,fontWeight:600,color:"#5A5A5A"}}>{p.item}</div><div style={{fontSize:11,color:"#8A8A7A"}}>{sym}{fmt(p.price)}×{p.qty}{p.feeTotal>0?` +手續費NT$${fmt(p.feeTotal)}`:""}</div>{p.note&&<div style={{fontSize:11,color:"#BBBBA8"}}>{p.note}</div>}</div>
                <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:"#B5A8C8"}}>NT${fmt(p.totalTWD??0)}</div><div style={{display:"flex",gap:5,marginTop:4,justifyContent:"flex-end"}}>{!trip.archived&&<button onClick={()=>onDel(p.id)} style={{padding:"5px 9px",borderRadius:9,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:10,cursor:"pointer"}}>刪</button>}</div></div>
              </div>
            </div>);
          })}
        </div>);
      })}
      {paid.length>0&&<div style={{marginTop:16}}>
        <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:10}}>已付款紀錄</div>
        {paid.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:"#BBBBA8",padding:"8px 0",borderBottom:"1px solid #EDEBE6"}}>
          <span>{p.buyer}・{p.item}・NT${fmt(p.totalTWD??0)}</span>
          <button onClick={()=>onToggle(p.id)} style={{padding:"4px 8px",borderRadius:8,border:"1px solid #EDEBE6",background:"transparent",color:"#BBBBA8",fontSize:10,cursor:"pointer",fontFamily:SANS,flexShrink:0,marginLeft:8}}>↩ 取消</button>
        </div>)}
      </div>}
      {unpaid.length===0&&paid.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#BBBBA8"}}><div style={{fontSize:36,marginBottom:8}}>🛍️</div><div style={{fontFamily:SERIF,fontSize:14}}>還沒有已購買的品項</div></div>}
    </>}
  </div>);
      }function PieChart({data,size=160}){
  const total=data.reduce((s,d)=>s+d.value,0);if(!total)return null;
  const cx=size/2,cy=size/2,r=size/2-8,ri=r*0.52;let angle=-Math.PI/2;
  const slices=data.map(d=>{const sweep=(d.value/total)*Math.PI*2;const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);angle+=sweep;const x2=cx+r*Math.cos(angle),y2=cy+r*Math.sin(angle);const xi1=cx+ri*Math.cos(angle-sweep),yi1=cy+ri*Math.sin(angle-sweep);const xi2=cx+ri*Math.cos(angle),yi2=cy+ri*Math.sin(angle);const lg=sweep>Math.PI?1:0;return{...d,path:`M${x1},${y1} A${r},${r},0,${lg},1,${x2},${y2} L${xi2},${yi2} A${ri},${ri},0,${lg},0,${xi1},${yi1} Z`};});
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2"/>)}<circle cx={cx} cy={cy} r={ri-2} fill="white"/></svg>);
}
function StatsTab({trip,onExcel,onOpenPrint}){
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const overseasTotal=trip.expenses.filter(e=>e.isOverseas!==false).reduce((s,e)=>s+(e.myShare??0),0);
  const domesticTotal=trip.expenses.filter(e=>e.isOverseas===false).reduce((s,e)=>s+(e.myShare??0),0);
  const byCat=CATS.map(c=>({...c,sum:trip.expenses.filter(e=>e.category===c.id).reduce((s,e)=>s+(e.myShare??0),0)})).filter(c=>c.sum>0).sort((a,b)=>b.sum-a.sum);
  return(<div style={{padding:"16px 16px 100px"}}>
    <div style={{background:"linear-gradient(135deg,#EDE6D8,#EDE8DE)",borderRadius:20,padding:"18px",marginBottom:12}}>
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:7}}>我的旅行花費</div>
      <div style={{fontSize:30,fontWeight:800,color:"#C8B89A",fontFamily:SERIF}}>NT${fmt(myTotal)}</div>
      <div style={{fontSize:12,color:"#BBBBA8",marginTop:4}}>{trip.expenses.length}筆・{[...new Set(trip.expenses.map(e=>e.date))].length}天</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      <div style={{background:"#E8F0F0",borderRadius:16,padding:"14px"}}><div style={{fontSize:10,color:"#9AB5B5",letterSpacing:1.5,fontWeight:600,marginBottom:4}}>🌍 海外消費</div><div style={{fontSize:18,fontWeight:800,color:"#9AB5B5"}}>NT${fmt(overseasTotal)}</div></div>
      <div style={{background:"#F0E6E1",borderRadius:16,padding:"14px"}}><div style={{fontSize:10,color:"#C9A89A",letterSpacing:1.5,fontWeight:600,marginBottom:4}}>🇹🇼 國內消費</div><div style={{fontSize:18,fontWeight:800,color:"#C9A89A"}}>NT${fmt(domesticTotal)}</div></div>
    </div>
    {byCat.length>0&&<><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><PieChart data={byCat.map(c=>({label:c.l,value:c.sum,color:c.c}))} size={140}/></div>
      <div style={{fontSize:10,color:"#BBBBA8",letterSpacing:1.8,fontWeight:600,marginBottom:12}}>類別分佈</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>{byCat.map(c=><div key={c.id}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:"#5A5A5A"}}>{c.e} {c.l}</span><div style={{display:"flex",gap:10}}><span style={{fontSize:11,color:"#BBBBA8"}}>{myTotal?(c.sum/myTotal*100).toFixed(1):0}%</span><span style={{fontSize:13,fontWeight:600,color:"#5A5A5A"}}>NT${fmt(c.sum)}</span></div></div><div style={{height:7,background:"#EDEBE6",borderRadius:99}}><div style={{height:7,width:myTotal?`${c.sum/myTotal*100}%`:"0%",background:c.c,borderRadius:99}}/></div></div>)}</div>
    </>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
      <Btn onClick={()=>onOpenPrint("simple")} color="#C9A89A" style={{width:"100%"}}>📄 簡式 PDF</Btn>
      <Btn onClick={()=>onOpenPrint("detail")} color="#A8B5A2" style={{width:"100%"}}>📋 詳細 PDF</Btn>
    </div>
    <Btn onClick={onExcel} color="#C8B89A" outline style={{width:"100%"}}>📊 模擬匯出 Excel</Btn>
  </div>);
}
function PrintReport({trip,mode,allCurrs,onClose}){
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const byCat=CATS.map(c=>({label:c.l,value:trip.expenses.filter(e=>e.category===c.id).reduce((s,e)=>s+(e.myShare??0),0),color:c.c,emoji:c.e})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
  const days=[...new Set(trip.expenses.map(e=>e.date))].length;
  const grouped=trip.expenses.reduce((a,e)=>{(a[e.date]=a[e.date]||[]).push(e);return a;},{});
  const dates=Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  const allFriends=[...new Set((trip.receivables??[]).map(r=>r.friend))];
  const coverGrad=COVERS.find(c=>c.id===trip.coverId)?.g??COVERS[0].g;
  return(<div style={{position:"fixed",inset:0,background:"rgba(60,50,40,0.5)",backdropFilter:"blur(10px)",zIndex:500,overflowY:"auto"}}>
    <div style={{position:"sticky",top:0,zIndex:10,background:"rgba(249,248,246,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #EDEBE6",padding:"12px 16px",display:"flex",gap:10,alignItems:"center",maxWidth:680,margin:"0 auto"}}>
      <button onClick={onClose} style={{background:"none",border:"1px solid #EDEBE6",borderRadius:10,padding:"8px 14px",color:"#8A8A7A",fontSize:13,cursor:"pointer",fontFamily:SANS}}>← 返回</button>
      <div style={{flex:1,fontSize:13,color:"#BBBBA8"}}>預覽・{mode==="detail"?"詳細版":"簡式版"}</div>
      <button onClick={()=>window.print()} style={{background:"#C9A89A",border:"none",borderRadius:12,padding:"10px 20px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:SANS}}>🖨️ 列印 / PDF</button>
    </div>
    <div style={{maxWidth:680,margin:"0 auto",padding:"0 0 60px",background:"#fff"}}>
      <div style={{background:coverGrad,padding:"48px 36px 40px",color:"#fff"}}>
        <div style={{fontSize:11,letterSpacing:3,opacity:0.75,marginBottom:8}}>TRAVEL FOOTPRINT</div>
        <h1 style={{fontFamily:SERIF,fontSize:28,margin:"0 0 6px",fontWeight:700}}>{trip.name}</h1>
        {trip.destination&&<div style={{fontSize:14,opacity:0.85,marginBottom:16}}>📍 {trip.destination}</div>}
        <div style={{fontSize:36,fontWeight:800,fontFamily:SERIF}}>NT${fmt(myTotal)}</div>
        <div style={{fontSize:11,opacity:0.7,marginTop:4}}>我的旅行花費・{new Date().toLocaleDateString("zh-TW")} 列印</div>
      </div>
      <div style={{padding:"28px 36px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:32}}>{[{l:"旅行天數",v:`${days} 天`,c:"#F0E6E1",tc:"#C9A89A"},{l:"總支出筆數",v:`${trip.expenses.length} 筆`,c:"#E4EBE2",tc:"#A8B5A2"},{l:"日均花費",v:`NT$${fmt(days?myTotal/days:0)}`,c:"#EDE6D8",tc:"#C8B89A"}].map(s=><div key={s.l} style={{background:s.c,borderRadius:16,padding:"16px",textAlign:"center"}}><div style={{fontSize:11,color:s.tc,letterSpacing:1,fontWeight:600,marginBottom:6}}>{s.l}</div><div style={{fontSize:20,fontWeight:800,color:s.tc,fontFamily:SERIF}}>{s.v}</div></div>)}</div>
        {byCat.length>0&&<><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><PieChart data={byCat} size={180}/></div><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>{byCat.map(c=><div key={c.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:c.color+"15",borderRadius:12,borderLeft:`4px solid ${c.color}`}}><span style={{fontSize:13,color:"#5A5A5A"}}>{c.emoji} {c.label}</span><div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:"#5A5A5A"}}>NT${fmt(c.value)}</div><div style={{fontSize:10,color:"#BBBBA8"}}>{myTotal?(c.value/myTotal*100).toFixed(1):0}%</div></div></div>)}</div></>}
        {mode==="detail"&&<>{dates.map(date=>{const items=grouped[date];const dayMine=items.reduce((s,e)=>s+(e.myShare??0),0);return(<div key={date} style={{marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"2px solid #F0E6E1",marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#5A5A5A"}}>{date.replace(/-/g," / ")}</span><span style={{fontSize:12,color:"#C9A89A",fontWeight:700}}>NT${fmt(dayMine)}</span></div>{items.map(e=>{const cat=CATS.find(c=>c.id===e.category)||CATS[CATS.length-1];const sym=allCurrs.find(c=>c.code===e.currency)?.sym??"";const platLabel=e.platformLabel||(e.platform&&e.platform!=="manual"?(PLATFORMS.find(p=>p.id===e.platform)?.l??""):"");return(<div key={e.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 10px",marginBottom:4,background:"#F9F8F6",borderRadius:10}}><span style={{fontSize:18,flexShrink:0}}>{cat.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#5A5A5A"}}>{e.note||cat.l}{platLabel?` · ${platLabel}`:""}</div>{e.detail&&<div style={{fontSize:10,color:"#8A8A7A"}}>{e.detail}</div>}{e.currency!=="TWD"&&<div style={{fontSize:10,color:"#BBBBA8"}}>{sym}{fmt(e.amount)}</div>}</div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:"#C9A89A"}}>NT${fmt(e.myShare??0)}</div>{e.isOverseas===false&&<div style={{fontSize:9,color:"#C9A89A"}}>🇹🇼</div>}</div></div>);})}</div>);})}</>}
        {allFriends.length>0&&<>{allFriends.map(f=>{const items=(trip.receivables??[]).filter(r=>r.friend===f&&!r.paid);if(!items.length)return null;const fTotal=items.reduce((s,r)=>s+r.amount,0);return(<div key={f} style={{marginBottom:16,background:"#E2EFE8",borderRadius:16,padding:"14px 16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:mode==="detail"?10:0}}><span style={{fontWeight:700,color:"#5A5A5A",fontSize:14}}>👤 {f}</span><span style={{fontWeight:800,color:"#88B098",fontSize:16}}>NT${fmt(fTotal)}</span></div>{mode==="detail"&&items.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#8A8A7A",marginBottom:3}}><span>{r.note}（{r.date}）</span><span>NT${fmt(r.amount)}</span></div>)}</div>);})}</>}
        <div style={{marginTop:36,paddingTop:16,borderTop:"1px solid #EDEBE6",textAlign:"center",fontSize:10,color:"#BBBBA8"}}>旅行足跡帳本 Travel Footprint　・　{new Date().toLocaleDateString("zh-TW")} 列印</div>
      </div>
    </div>
  </div>);
}
export default function App(){
  const store=useStore();
  const [screen,setScreen]=useState("list");
  const [modal,setModal]=useState(null);
  const [welcomed,setWelcomed]=useState(()=>lsGet("tf_welcomed",false));
  const closeWelcome=()=>{lsSet("tf_welcomed",true);setWelcomed(true);};
  const openTrip=id=>{store.setActiveId(id);setScreen("detail");};
  const trip=store.active;
  return(<div style={{minHeight:"100vh",background:"#F9F8F6",fontFamily:SANS,maxWidth:430,margin:"0 auto"}}>
    <div style={{height:44}}/>
    {screen==="list"&&<>
      <TripList trips={store.trips} activeId={store.activeId} onSelect={openTrip} onCreate={()=>setModal("new")} onArchive={store.archiveTrip} onReopen={store.reopenTrip} onDelete={store.deleteTrip} onSettings={()=>setModal("settings")}/>
      {modal==="new"&&<NewTripSheet onSave={d=>{const id=store.createTrip(d);openTrip(id);}} onClose={()=>setModal(null)} allCurrs={store.allCurrs}/>}
      {modal==="settings"&&<SettingsSheet banks={store.banks} setBanks={store.setBanks} cards={store.cards} setCards={store.setCards} friends={store.friends} setFriends={store.setFriends} trips={store.trips} customCurrs={store.customCurrs} setCustomCurrs={store.setCustomCurrs} apiKey={store.apiKey} setApiKey={store.setApiKey} onRestore={store.restoreAll} onClose={()=>setModal(null)}/>}
    </>}
    {screen==="detail"&&trip&&<TripDetail trip={trip} store={store} banks={store.banks} cards={store.cards} friends={store.friends} allCurrs={store.allCurrs} onBack={()=>setScreen("list")}/>}
    {!welcomed&&<WelcomeModal onClose={closeWelcome}/>}
  </div>);
        }

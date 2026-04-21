import { useState, useEffect } from "react";

const C = {
  bg:"#F9F8F6", card:"#FFFFFF",
  rose:"#C9A89A", roseLight:"#F0E6E1", roseMid:"#D4B8AB",
  sage:"#A8B5A2", sageLight:"#E4EBE2",
  sand:"#C8B89A", sandLight:"#EDE6D8",
  lav:"#B5A8C8", lavLight:"#EAE6F2",
  teal:"#9AB5B5",
  text:"#5A5A5A", textLight:"#8A8A7A", textFaint:"#BBBBA8",
  border:"#EDEBE6", borderStrong:"#DDD9D0",
  green:"#88B098", greenLight:"#E2EFE8",
};
const SERIF="'Georgia',serif";
const SANS="'Helvetica Neue',sans-serif";

const CATS=[
  {id:"food",      e:"🍜",l:"餐飲",  c:C.rose},
  {id:"transport", e:"🚌",l:"交通",  c:C.sage},
  {id:"hotel",     e:"🏨",l:"住宿",  c:C.lav},
  {id:"shopping",  e:"🛍️",l:"購物",  c:C.sand},
  {id:"activity",  e:"🎭",l:"體驗",  c:C.teal},
  {id:"beauty",    e:"💄",l:"美妝",  c:"#C8A8B5"},
  {id:"other",     e:"📎",l:"其他",  c:C.textFaint},
];
const CURRS=[
  {code:"TWD",sym:"NT$",l:"台幣",  r:1},
  {code:"JPY",sym:"¥",  l:"日圓",  r:0.22},
  {code:"KRW",sym:"₩",  l:"韓圓",  r:0.024},
  {code:"VND",sym:"₫",  l:"越南盾",r:0.00128},
  {code:"PHP",sym:"₱",  l:"披索",  r:0.56},
  {code:"THB",sym:"฿",  l:"泰銖",  r:0.91},
  {code:"USD",sym:"$",  l:"美元",  r:32.5},
  {code:"EUR",sym:"€",  l:"歐元",  r:35.2},
  {code:"HKD",sym:"HK$",l:"港幣",  r:4.15},
];
const PAYS=[
  {id:"cash",   e:"💵",l:"現金"},
  {id:"card",   e:"💳",l:"信用卡"},
  {id:"linepay",e:"📱",l:"Line Pay"},
];
const COVERS=[
  {id:"a",g:`linear-gradient(135deg,#C9A89A,#D4B8AB,#C8B89A)`,e:"🌸"},
  {id:"b",g:`linear-gradient(135deg,#A8B5A2,#B8C8B2,#9AB5B5)`,e:"🌿"},
  {id:"c",g:`linear-gradient(135deg,#B5A8C8,#C8B8E0,#C9A89A)`,e:"🌙"},
  {id:"d",g:`linear-gradient(135deg,#C8B89A,#C8B89A,#D4A870)`,e:"☀️"},
  {id:"e",g:`linear-gradient(135deg,#9AB5B5,#A8B5A2,#88B0A8)`,e:"🌊"},
  {id:"f",g:`linear-gradient(135deg,#C8A8B8,#B5A8C8,#C9A89A)`,e:"🌷"},
];

const toTWD=(a,c)=>a*(CURRS.find(x=>x.code===c)?.r??1);
const fmt=n=>new Intl.NumberFormat("zh-TW",{maximumFractionDigits:0}).format(Math.round(n));
const todayStr=()=>new Date().toISOString().split("T")[0];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const lsGet=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)??"null")??d;}catch{return d;}};
const lsSet=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

// ── Micro components ──────────────────────────────────────────────────────
const Lbl=({ch,s})=><div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,marginBottom:7,fontWeight:600,textTransform:"uppercase",...s}}>{ch}</div>;
const Card=({ch,s,onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,boxShadow:"0 2px 10px rgba(180,165,150,0.07)",...s}}>{ch}</div>;

function Pill({active,color=C.rose,children,onClick}){
  return <button onClick={onClick} style={{padding:"7px 13px",borderRadius:99,border:`1.5px solid ${active?color:C.border}`,background:active?color+"28":"transparent",color:active?color:C.textLight,fontSize:12,fontWeight:active?700:400,cursor:"pointer",fontFamily:SANS,whiteSpace:"nowrap"}}>{children}</button>;
}
function Inp({style,...p}){
  return <input {...p} style={{width:"100%",padding:"12px 14px",borderRadius:14,border:`1.5px solid ${C.border}`,background:"#FDFCFB",fontSize:14,color:C.text,outline:"none",boxSizing:"border-box",fontFamily:SANS,...style}}/>;
}
function Sel({style,children,...p}){
  return <select {...p} style={{padding:"12px 14px",borderRadius:14,border:`1.5px solid ${C.border}`,background:"#FDFCFB",fontSize:13,color:C.text,outline:"none",fontFamily:SANS,cursor:"pointer",...style}}>{children}</select>;
}
function Btn({children,color=C.rose,onClick,style,outline,sm}){
  return <button onClick={onClick} style={{padding:sm?"7px 13px":"13px 20px",borderRadius:sm?12:16,border:outline?`1.5px solid ${color}`:"none",background:outline?"transparent":color,color:outline?color:"#fff",fontSize:sm?12:14,fontWeight:600,cursor:"pointer",fontFamily:SANS,...style}}>{children}</button>;
}
function Toggle({on,onChange,label,sub}){
  return(
    <div style={{background:on?C.roseLight:"#F5F3EF",borderRadius:18,padding:"13px 16px",border:`1.5px solid ${on?C.roseMid:C.border}`,cursor:"pointer"}} onClick={()=>onChange(!on)}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:24,borderRadius:99,background:on?C.rose:C.borderStrong,position:"relative",flexShrink:0}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:C.text}}>{label}</div>
          {sub&&<div style={{fontSize:11,color:C.textFaint}}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}
function Sheet({children,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(80,70,60,0.4)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"100%",maxWidth:430,background:C.bg,borderRadius:"28px 28px 0 0",padding:"24px 20px 44px",maxHeight:"92vh",overflowY:"auto"}}>
        {children}
      </div>
    </div>
  );
}
function SHead({title,onClose}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
      <h3 style={{fontFamily:SERIF,fontSize:18,color:C.text,margin:0}}>{title}</h3>
      <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.textFaint}}>✕</button>
    </div>
  );
}
function Toast({data}){
  if(!data) return null;
  return(
    <div style={{position:"fixed",top:54,left:"50%",transform:"translateX(-50%)",zIndex:999,width:"calc(100% - 32px)",maxWidth:380}}>
      <div style={{background:"#2E2A26",borderRadius:20,padding:"16px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.25)"}}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:8}}>{data.icon} {data.title}</div>
        {data.lines.map((l,i)=><div key={i} style={{fontSize:12,color:l.startsWith("─")?"#5A5550":"#BEB8B0",marginBottom:2,fontFamily:"monospace"}}>{l||" "}</div>)}
      </div>
    </div>
  );
}

// ── Welcome Modal ─────────────────────────────────────────────────────────
function WelcomeModal({onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(80,70,60,0.45)",backdropFilter:"blur(12px)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
      <div style={{width:"100%",maxWidth:360,background:C.card,borderRadius:28,padding:"32px 28px",boxShadow:"0 16px 48px rgba(140,110,90,0.18)",textAlign:"center"}}>
        {/* Decorative top strip */}
        <div style={{width:56,height:6,borderRadius:99,background:`linear-gradient(90deg,#C9A89A,#B5A8C8,#A8B5A2)`,margin:"0 auto 24px"}}/>
        <div style={{fontSize:36,marginBottom:12}}>✈️</div>
        <h2 style={{fontFamily:SERIF,fontSize:20,color:C.text,margin:"0 0 8px",lineHeight:1.4}}>旅行足跡帳本</h2>
        <p style={{fontSize:13,color:C.textLight,margin:"0 0 20px",lineHeight:1.7}}>Travel Footprint</p>

        {/* Feature badges */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28,textAlign:"left"}}>
          {[
            {icon:"📱",title:"離線完全可用",desc:"資料存於手機本地，飛機上也能記帳"},
            {icon:"🔒",title:"隱私安全",desc:"不上傳任何伺服器，資料只在你的裝置"},
            {icon:"👥",title:"多人旅行",desc:"自動拆帳、代購管理、一鍵 LINE 帳單"},
          ].map(f=>(
            <div key={f.icon} style={{display:"flex",gap:12,alignItems:"flex-start",background:C.bg,borderRadius:14,padding:"12px 14px"}}>
              <span style={{fontSize:20,flexShrink:0}}>{f.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>{f.title}</div>
                <div style={{fontSize:11,color:C.textFaint,lineHeight:1.5}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"15px",borderRadius:18,border:"none",background:`linear-gradient(135deg,#C9A89A,#D4B8AB)`,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:SANS,letterSpacing:0.5}}>
          開始使用 →
        </button>
        <p style={{fontSize:10,color:C.textFaint,margin:"14px 0 0",letterSpacing:0.5}}>初次開啟才會顯示此說明</p>
      </div>
    </div>
  );
}

// ── App Store ─────────────────────────────────────────────────────────────
function useStore(){
  const [trips,   setTrips]   = useState(()=>lsGet("tf_trips",[]));
  const [activeId,setActiveId]= useState(()=>lsGet("tf_active",null));
  const [banks,   setBanks]   = useState(()=>lsGet("tf_banks",[]));
  const [cards,   setCards]   = useState(()=>lsGet("tf_cards",[]));
  const [friends, setFriends] = useState(()=>lsGet("tf_friends",["小美","阿芸","芷欣"]));

  useEffect(()=>lsSet("tf_trips",trips),   [trips]);
  useEffect(()=>lsSet("tf_active",activeId),[activeId]);
  useEffect(()=>lsSet("tf_banks",banks),   [banks]);
  useEffect(()=>lsSet("tf_cards",cards),   [cards]);
  useEffect(()=>lsSet("tf_friends",friends),[friends]);

  const active=trips.find(t=>t.id===activeId)??null;
  const upd=(id,p)=>setTrips(prev=>prev.map(t=>t.id===id?{...t,...p}:t));

  const createTrip=d=>{
    const t={id:uid(),createdAt:todayStr(),archived:false,expenses:[],proxies:[],receivables:[],...d};
    setTrips(p=>[t,...p]); setActiveId(t.id); return t.id;
  };
  const archiveTrip=id=>upd(id,{archived:true});
  const reopenTrip =id=>upd(id,{archived:false});
  const deleteTrip =id=>{setTrips(p=>p.filter(t=>t.id!==id));if(activeId===id)setActiveId(null);};

  const addExpense=(tid,e,recs=[])=>{
    const t=trips.find(x=>x.id===tid);
    upd(tid,{expenses:[{...e,id:uid()},...(t?.expenses??[])],receivables:[...recs,...(t?.receivables??[])]});
  };
  const delExpense=(tid,eid)=>{const t=trips.find(x=>x.id===tid);upd(tid,{expenses:(t?.expenses??[]).filter(e=>e.id!==eid)});};

  const addProxy=(tid,p)=>{const t=trips.find(x=>x.id===tid);upd(tid,{proxies:[{...p,id:uid(),paid:false},...(t?.proxies??[])]});};
  const delProxy=(tid,pid)=>{const t=trips.find(x=>x.id===tid);upd(tid,{proxies:(t?.proxies??[]).filter(p=>p.id!==pid)});};
  const toggleProxy=(tid,pid)=>{const t=trips.find(x=>x.id===tid);upd(tid,{proxies:(t?.proxies??[]).map(p=>p.id===pid?{...p,paid:!p.paid}:p)});};

  const markPaid=(tid,rid)=>{const t=trips.find(x=>x.id===tid);upd(tid,{receivables:(t?.receivables??[]).map(r=>r.id===rid?{...r,paid:true}:r)});};
  const convertToExp=(tid,rid)=>{
    const t=trips.find(x=>x.id===tid); if(!t) return;
    const r=(t.receivables??[]).find(x=>x.id===rid); if(!r) return;
    const ne={id:uid(),date:todayStr(),category:"other",note:`${r.friend} 未還款`,amount:r.amount,currency:"TWD",payment:"cash",iParticipate:true,participants:[],myShare:r.amount,friendShares:{},feeTotal:0};
    upd(tid,{expenses:[ne,...t.expenses],receivables:(t.receivables??[]).map(x=>x.id===rid?{...x,paid:true,converted:true}:x)});
  };

  return{trips,activeId,setActiveId,active,banks,setBanks,cards,setCards,friends,setFriends,
    createTrip,archiveTrip,reopenTrip,deleteTrip,
    addExpense,delExpense,addProxy,delProxy,toggleProxy,markPaid,convertToExp,upd};
}

// ── LINE bill text ────────────────────────────────────────────────────────
function makeBill(friend,trip,banks,bankId,mode){
  const recs=(trip.receivables??[]).filter(r=>r.friend===friend&&!r.paid);
  const prox=(trip.proxies??[]).filter(p=>p.buyer===friend&&!p.paid);
  const rTotal=recs.reduce((s,r)=>s+r.amount,0);
  const pTotal=prox.reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0);
  const grand=rTotal+pTotal;
  const bank=banks.find(b=>b.id===bankId);
  const lines=[`📋 ${trip.name}｜${friend} 的帳單`,`━━━━━━━━━━━━━━━━━━━━`];
  if(recs.length){
    lines.push(`\n💸 代墊分攤`);
    if(mode==="detail") recs.forEach(r=>lines.push(`  ${r.note}　NT$${fmt(r.amount)}`));
    else lines.push(`  共${recs.length}筆　NT$${fmt(rTotal)}`);
  }
  if(prox.length){
    lines.push(`\n🛍️ 代購清單`);
    if(mode==="detail") prox.forEach(p=>{
      const sym=CURRS.find(c=>c.code===p.currency)?.sym??"";
      lines.push(`  ${p.item}${p.currency!=="TWD"?` (${sym}${fmt(p.price)}×${p.qty})`:`×${p.qty}`}　NT$${fmt(toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0))}`);
    });
    else lines.push(`  共${prox.length}件　NT$${fmt(pTotal)}`);
  }
  lines.push(`\n━━━━━━━━━━━━━━━━━━━━`,`💰 合計應付　NT$${fmt(grand)}`);
  if(bank) lines.push(`\n匯款 🏦`,`  ${bank.bankName}`,`  帳號：${bank.account}`,`  戶名：${bank.holder}`);
  lines.push(`\n麻煩轉帳給我，謝謝 🙏`);
  return lines.join("\n");
}

// ── NEW TRIP ──────────────────────────────────────────────────────────────
function NewTripSheet({onSave,onClose}){
  const [name,setName]=useState(""); const [dest,setDest]=useState("");
  const [start,setStart]=useState(todayStr()); const [end,setEnd]=useState("");
  const [cover,setCover]=useState("a");
  return(
    <Sheet onClose={onClose}>
      <SHead title="建立新旅行" onClose={onClose}/>
      <Lbl ch="封面"/>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {COVERS.map(cv=><div key={cv.id} onClick={()=>setCover(cv.id)} style={{width:48,height:48,borderRadius:16,background:cv.g,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:cover===cv.id?`3px solid ${C.text}`:`3px solid transparent`,boxSizing:"border-box"}}>{cv.e}</div>)}
      </div>
      <Lbl ch="旅行名稱"/>
      <Inp placeholder="東京春日小旅行" value={name} onChange={e=>setName(e.target.value)} style={{marginBottom:14}}/>
      <Lbl ch="目的地"/>
      <Inp placeholder="日本・東京" value={dest} onChange={e=>setDest(e.target.value)} style={{marginBottom:14}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        <div><Lbl ch="出發日"/><Inp type="date" value={start} onChange={e=>setStart(e.target.value)}/></div>
        <div><Lbl ch="回國日"/><Inp type="date" value={end} onChange={e=>setEnd(e.target.value)}/></div>
      </div>
      <Btn onClick={()=>{if(!name.trim())return;onSave({name:name.trim(),destination:dest.trim(),startDate:start,endDate:end,coverId:cover});onClose();}} style={{width:"100%"}}>✈️ 開始這趟旅行</Btn>
    </Sheet>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────
function SettingsSheet({banks,setBanks,cards,setCards,friends,setFriends,onClose}){
  const [tab,setTab]=useState("friends");
  const [nf,setNf]=useState(""); const [nb,setNb]=useState({bankName:"",account:"",holder:""}); const [nc,setNc]=useState({name:"",feeRate:""});
  return(
    <Sheet onClose={onClose}>
      <SHead title="⚙️ 設定" onClose={onClose}/>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"friends",l:"👥 朋友"},{id:"banks",l:"🏦 帳號"},{id:"cards",l:"💳 信用卡"}].map(t=><Pill key={t.id} active={tab===t.id} color={C.rose} onClick={()=>setTab(t.id)}>{t.l}</Pill>)}
      </div>
      {tab==="friends"&&<>
        <Lbl ch="常用朋友"/>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <Inp placeholder="姓名" value={nf} onChange={e=>setNf(e.target.value)} style={{flex:1}}/>
          <Btn sm onClick={()=>{if(nf.trim()&&!friends.includes(nf.trim())){setFriends(p=>[...p,nf.trim()]);setNf("");}}} style={{flexShrink:0}}>+新增</Btn>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {friends.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:6,background:C.roseLight,borderRadius:99,padding:"6px 12px"}}>
            <span style={{fontSize:13,color:C.text}}>👤 {f}</span>
            <button onClick={()=>setFriends(p=>p.filter(x=>x!==f))} style={{background:"none",border:"none",color:C.textFaint,cursor:"pointer",fontSize:14}}>✕</button>
          </div>)}
        </div>
      </>}
      {tab==="banks"&&<>
        <Lbl ch="我的銀行帳號"/>
        <Inp placeholder="銀行名稱" value={nb.bankName} onChange={e=>setNb(p=>({...p,bankName:e.target.value}))} style={{marginBottom:8}}/>
        <Inp placeholder="帳號" value={nb.account} onChange={e=>setNb(p=>({...p,account:e.target.value}))} style={{marginBottom:8}}/>
        <Inp placeholder="戶名" value={nb.holder} onChange={e=>setNb(p=>({...p,holder:e.target.value}))} style={{marginBottom:10}}/>
        <Btn onClick={()=>{if(nb.bankName&&nb.account){setBanks(p=>[...p,{...nb,id:uid()}]);setNb({bankName:"",account:"",holder:""});}}} style={{width:"100%",marginBottom:16}}>+ 新增帳號</Btn>
        {banks.map(b=><Card key={b.id} s={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:14,fontWeight:600,color:C.text}}>🏦 {b.bankName}</div><div style={{fontSize:12,color:C.textLight}}>{b.account}・{b.holder}</div></div>
          <button onClick={()=>setBanks(p=>p.filter(x=>x.id!==b.id))} style={{background:"none",border:"none",color:C.textFaint,cursor:"pointer",fontSize:16}}>🗑</button>
        </Card>)}
      </>}
      {tab==="cards"&&<>
        <Lbl ch="我的信用卡"/>
        <Inp placeholder="卡片名稱（如：國泰 CUBE）" value={nc.name} onChange={e=>setNc(p=>({...p,name:e.target.value}))} style={{marginBottom:8}}/>
        <Inp placeholder="手續費 %" type="number" step="0.1" value={nc.feeRate} onChange={e=>setNc(p=>({...p,feeRate:e.target.value}))} style={{marginBottom:10}}/>
        <Btn onClick={()=>{if(nc.name&&nc.feeRate){setCards(p=>[...p,{...nc,id:uid(),feeRate:+nc.feeRate}]);setNc({name:"",feeRate:""});}}} style={{width:"100%",marginBottom:16}}>+ 新增信用卡</Btn>
        {cards.map(c=><Card key={c.id} s={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:14,fontWeight:600,color:C.text}}>💳 {c.name}</div><div style={{fontSize:12,color:C.textLight}}>手續費 {c.feeRate}%</div></div>
          <button onClick={()=>setCards(p=>p.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:C.textFaint,cursor:"pointer",fontSize:16}}>🗑</button>
        </Card>)}
      </>}
    </Sheet>
  );
}

// ── ADD EXPENSE ───────────────────────────────────────────────────────────
function AddExpenseSheet({trip,friends,cards,onSave,onClose}){
  const [f,setF]=useState({date:todayStr(),category:"food",note:"",amount:"",currency:"TWD",payment:"cash",cardId:"",iParticipate:true,participants:[]});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleP=fr=>set("participants",f.participants.includes(fr)?f.participants.filter(x=>x!==fr):[...f.participants,fr]);
  const amtTWD=f.amount&&!isNaN(f.amount)?toTWD(+f.amount,f.currency):0;
  const selCard=cards.find(c=>c.id===f.cardId);
  const feeRate=selCard?.feeRate??0;
  const total=f.participants.length+(f.iParticipate?1:0);
  const base=total>0?amtTWD/total:amtTWD;
  const feeTotal=amtTWD*feeRate/100;
  const feeEach=total>0?feeTotal/total:0;
  const myShare=f.iParticipate?base+feeEach:0;
  const friendShares={};
  f.participants.forEach(fr=>{friendShares[fr]=base+feeEach;});

  const save=()=>{
    if(!f.amount||isNaN(f.amount)||+f.amount<=0) return;
    const exp={...f,amount:+f.amount,myShare:f.iParticipate?myShare:0,friendShares,feeTotal};
    const recs=f.participants.map(fr=>({id:uid(),friend:fr,date:f.date,note:f.note||(CATS.find(c=>c.id===f.category)?.l??""),amount:friendShares[fr],paid:false}));
    onSave(exp,recs); onClose();
  };

  return(
    <Sheet onClose={onClose}>
      <SHead title="新增支出" onClose={onClose}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><Lbl ch="日期"/><Inp type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
        <div><Lbl ch="幣別"/><Sel value={f.currency} onChange={e=>set("currency",e.target.value)} style={{width:"100%"}}>{CURRS.map(c=><option key={c.code} value={c.code}>{c.code} {c.l}</option>)}</Sel></div>
      </div>
      <Lbl ch="類別"/>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
        {CATS.map(c=><Pill key={c.id} active={f.category===c.id} color={c.c} onClick={()=>set("category",c.id)}>{c.e} {c.l}</Pill>)}
      </div>
      <Lbl ch="金額"/>
      <div style={{position:"relative",marginBottom:6}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.textLight,fontSize:14}}>{CURRS.find(c=>c.code===f.currency)?.sym}</span>
        <Inp type="number" placeholder="0" value={f.amount} onChange={e=>set("amount",e.target.value)} style={{paddingLeft:34,fontSize:22,fontWeight:700}}/>
      </div>
      {f.currency!=="TWD"&&amtTWD>0&&<div style={{fontSize:12,color:C.sage,marginBottom:12,paddingLeft:4}}>≈ NT${fmt(amtTWD)}</div>}
      <Lbl ch="品項備註"/>
      <Inp placeholder="餐廳名稱、景點⋯" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:14}}/>
      <Lbl ch="支付方式"/>
      <div style={{display:"flex",gap:8,marginBottom:f.payment==="card"?10:14}}>
        {PAYS.map(m=><Pill key={m.id} active={f.payment===m.id} color={C.sand} onClick={()=>set("payment",m.id)}>{m.e} {m.l}</Pill>)}
      </div>
      {f.payment==="card"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
          {cards.length===0?<span style={{fontSize:12,color:C.textFaint}}>請先在設定新增信用卡</span>:cards.map(c=><Pill key={c.id} active={f.cardId===c.id} color={C.sand} onClick={()=>set("cardId",c.id)}>💳 {c.name} ({c.feeRate}%)</Pill>)}
        </div>
        {selCard&&amtTWD>0&&<div style={{background:C.sandLight,borderRadius:14,padding:"10px 14px",fontSize:12,color:C.sand,fontWeight:600,marginBottom:10}}>手續費 {feeRate}%：NT${fmt(feeTotal)}（每人 +NT${fmt(feeEach)}）</div>}
      </>}
      <div style={{marginBottom:14}}><Toggle on={f.iParticipate} onChange={v=>set("iParticipate",v)} label="我也有參與這筆消費" sub="關閉則我不分攤，全額由朋友負擔"/></div>
      <Lbl ch="分攤的朋友（可多選）"/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
        {friends.map(fr=><Pill key={fr} active={f.participants.includes(fr)} color={C.sage} onClick={()=>toggleP(fr)}>👤 {fr}</Pill>)}
      </div>
      {amtTWD>0&&total>0&&<div style={{background:C.sageLight,borderRadius:16,padding:"14px",marginBottom:20}}>
        <div style={{fontSize:12,color:C.sage,fontWeight:700,marginBottom:8}}>分攤預覽</div>
        {f.iParticipate&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.text,marginBottom:4}}><span>👤 我</span><span style={{fontWeight:700}}>NT${fmt(myShare)}</span></div>}
        {f.participants.map(fr=><div key={fr} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.text,marginBottom:4}}><span>👤 {fr}</span><span style={{fontWeight:700}}>NT${fmt(friendShares[fr])}</span></div>)}
        {!f.iParticipate&&<div style={{fontSize:11,color:C.textFaint,marginTop:4}}>此筆不計入我的支出</div>}
      </div>}
      <Btn onClick={save} style={{width:"100%"}}>記錄這筆支出</Btn>
    </Sheet>
  );
}

// ── ADD PROXY ─────────────────────────────────────────────────────────────
function AddProxySheet({friends,cards,onSave,onClose}){
  const [f,setF]=useState({date:todayStr(),buyer:friends[0]||"",item:"",qty:1,price:"",currency:"TWD",note:"",payment:"cash",cardId:""});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const total=f.price&&!isNaN(f.price)?+f.price*+f.qty:0;
  const totalTWD=toTWD(total,f.currency);
  const selCard=cards.find(c=>c.id===f.cardId);
  const feeTotal=selCard?totalTWD*selCard.feeRate/100:0;
  const grand=totalTWD+feeTotal;
  const save=()=>{if(!f.item||!f.price||!f.buyer)return;onSave({...f,price:+f.price,qty:+f.qty,feeTotal,totalTWD:grand});onClose();};
  return(
    <Sheet onClose={onClose}>
      <SHead title="新增代購" onClose={onClose}/>
      <Lbl ch="委託人"/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
        {friends.map(fr=><Pill key={fr} active={f.buyer===fr} color={C.lav} onClick={()=>set("buyer",fr)}>👤 {fr}</Pill>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><Lbl ch="日期"/><Inp type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
        <div><Lbl ch="幣別"/><Sel value={f.currency} onChange={e=>set("currency",e.target.value)} style={{width:"100%"}}>{CURRS.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel></div>
      </div>
      <Lbl ch="品項名稱"/>
      <Inp placeholder="DHC 唇蜜、森永牛奶糖⋯" value={f.item} onChange={e=>set("item",e.target.value)} style={{marginBottom:14}}/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10,marginBottom:8}}>
        <div><Lbl ch="單價"/><Inp type="number" placeholder="0" value={f.price} onChange={e=>set("price",e.target.value)}/></div>
        <div><Lbl ch="數量"/><Inp type="number" min="1" value={f.qty} onChange={e=>set("qty",e.target.value)}/></div>
      </div>
      <Lbl ch="支付方式"/>
      <div style={{display:"flex",gap:8,marginBottom:f.payment==="card"?10:14}}>
        {PAYS.map(m=><Pill key={m.id} active={f.payment===m.id} color={C.sand} onClick={()=>set("payment",m.id)}>{m.e} {m.l}</Pill>)}
      </div>
      {f.payment==="card"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
        {cards.map(c=><Pill key={c.id} active={f.cardId===c.id} color={C.sand} onClick={()=>set("cardId",c.id)}>💳 {c.name} ({c.feeRate}%)</Pill>)}
      </div>}
      {total>0&&<div style={{background:C.lavLight,borderRadius:14,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.lav,fontWeight:600}}>
        小計 NT${fmt(grand)}{feeTotal>0&&<span style={{fontWeight:400,fontSize:11}}> (含手續費 NT${fmt(feeTotal)})</span>}
      </div>}
      <Lbl ch="備註"/>
      <Inp placeholder="口味、顏色、規格⋯" value={f.note} onChange={e=>set("note",e.target.value)} style={{marginBottom:20}}/>
      <Btn onClick={save} color={C.lav} style={{width:"100%"}}>登記代購</Btn>
    </Sheet>
  );
}

// ── BILL SHEET ────────────────────────────────────────────────────────────
function BillSheet({friend,trip,banks,onClose}){
  const [bankId,setBankId]=useState(banks[0]?.id??"");
  const [mode,setMode]=useState("detail");
  const [copied,setCopied]=useState(false);
  const bill=makeBill(friend,trip,banks,bankId,mode);
  const copy=async()=>{try{await navigator.clipboard.writeText(bill);}catch{} setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return(
    <Sheet onClose={onClose}>
      <SHead title={`${friend} 的帳單`} onClose={onClose}/>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{id:"detail",l:"詳細明細"},{id:"simple",l:"簡式帳單"}].map(t=><Pill key={t.id} active={mode===t.id} color={C.rose} onClick={()=>setMode(t.id)}>{t.l}</Pill>)}
      </div>
      {banks.length>0&&<>
        <Lbl ch="匯款帳號"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {banks.map(b=><Pill key={b.id} active={bankId===b.id} color={C.sage} onClick={()=>setBankId(b.id)}>🏦 {b.bankName}</Pill>)}
        </div>
      </>}
      <div style={{background:"#F5F3EF",borderRadius:16,padding:"16px",fontFamily:"monospace",fontSize:12,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:16,maxHeight:260,overflowY:"auto"}}>{bill}</div>
      <Btn onClick={copy} color={copied?C.green:C.rose} style={{width:"100%"}}>{copied?"✓ 已複製！貼到 LINE 吧 🎉":"📋 複製帳單 → 貼到 LINE"}</Btn>
    </Sheet>
  );
}

// ── TRIP LIST ─────────────────────────────────────────────────────────────
function TripList({trips,activeId,onSelect,onCreate,onArchive,onReopen,onDelete,onSettings}){
  const [showArch,setShowArch]=useState(false);
  const active=trips.filter(t=>!t.archived);
  const arch=trips.filter(t=>t.archived);
  const cv=t=>COVERS.find(c=>c.id===t.coverId)??COVERS[0];
  return(
    <div style={{padding:"0 16px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingTop:8,marginBottom:24}}>
        <div>
          <div style={{fontSize:10,color:C.textFaint,letterSpacing:2,marginBottom:4}}>TRAVEL FOOTPRINT</div>
          <h1 style={{fontFamily:SERIF,fontSize:26,color:C.text,margin:"0 0 4px"}}>我的旅行足跡</h1>
          <p style={{fontSize:12,color:C.textFaint,margin:0}}>{active.length} 趟進行中・{arch.length} 趟封存</p>
        </div>
        <button onClick={onSettings} style={{background:C.roseLight,border:"none",borderRadius:14,padding:"10px 14px",fontSize:13,color:C.rose,cursor:"pointer",fontFamily:SANS,fontWeight:600}}>⚙️ 設定</button>
      </div>
      <button onClick={onCreate} style={{width:"100%",padding:"18px",borderRadius:22,border:`2px dashed ${C.roseMid}`,background:C.roseLight,color:C.rose,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:28}}>
        <span style={{fontSize:22}}>＋</span> 建立新旅行
      </button>
      {active.length>0&&<><div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:12}}>進行中</div>
        {active.map(t=>{
          const cover=cv(t); const myT=t.expenses.reduce((s,e)=>s+(e.myShare??0),0);
          const pend=(t.receivables??[]).filter(r=>!r.paid).reduce((s,r)=>s+r.amount,0)+((t.proxies??[]).filter(p=>!p.paid).reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0));
          return(<Card key={t.id} s={{marginBottom:12,overflow:"hidden",border:t.id===activeId?`2px solid ${C.rose}`:undefined}}>
            <div style={{height:6,background:cover.g}}/>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:14,background:cover.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{cover.e}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:SERIF,fontSize:16,color:C.text,fontWeight:700}}>{t.name}</div>
                  {t.destination&&<div style={{fontSize:12,color:C.textLight}}>📍 {t.destination}</div>}
                  <div style={{fontSize:11,color:C.textFaint}}>{t.startDate}{t.endDate?`→${t.endDate}`:""}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:18,fontWeight:800,color:C.rose}}>NT${fmt(myT)}</div>
                  <div style={{fontSize:10,color:C.textFaint}}>我的花費</div>
                  {pend>0&&<div style={{fontSize:11,color:C.green,fontWeight:600}}>待收 NT${fmt(pend)}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
                <button onClick={()=>onSelect(t.id)} style={{flex:2,padding:"8px",borderRadius:12,border:"none",background:C.rose,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>📖 進入帳本</button>
                <button onClick={()=>onArchive(t.id)} style={{flex:1,padding:"8px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.textFaint,fontSize:12,cursor:"pointer",fontFamily:SANS}}>封存</button>
                <button onClick={()=>{if(window.confirm(`刪除「${t.name}」？`))onDelete(t.id);}} style={{width:36,padding:"8px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.textFaint,fontSize:12,cursor:"pointer"}}>🗑</button>
              </div>
            </div>
          </Card>);
        })}
      </>}
      {arch.length>0&&<div style={{marginTop:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600}}>歷史旅行</div>
          <button onClick={()=>setShowArch(p=>!p)} style={{fontSize:12,color:C.textFaint,background:"none",border:"none",cursor:"pointer",fontFamily:SANS}}>{showArch?"收起▲":"展開▼"}({arch.length})</button>
        </div>
        {showArch&&arch.map(t=>{
          const cover=cv(t); const myT=t.expenses.reduce((s,e)=>s+(e.myShare??0),0);
          return(<Card key={t.id} s={{marginBottom:10,overflow:"hidden",opacity:0.85}}>
            <div style={{height:4,background:cover.g}}/>
            <div style={{padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:12,background:cover.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cover.e}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.text}}>{t.name}</div><div style={{fontSize:11,color:C.textFaint}}>{t.destination}・{t.startDate}</div></div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.text}}>NT${fmt(myT)}</div>
                <div style={{display:"flex",gap:6,marginTop:6}}>
                  <button onClick={()=>onSelect(t.id)} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.textLight,fontSize:11,cursor:"pointer",fontFamily:SANS}}>查看</button>
                  <button onClick={()=>onReopen(t.id)} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.sage}`,background:C.sageLight,color:C.sage,fontSize:11,cursor:"pointer",fontFamily:SANS}}>重啟</button>
                </div>
              </div>
            </div>
          </Card>);
        })}
      </div>}
      {trips.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:C.textFaint}}>
        <div style={{fontSize:52,marginBottom:16}}>✈️</div>
        <div style={{fontFamily:SERIF,fontSize:18,color:C.textLight,marginBottom:8}}>還沒有旅行記錄</div>
        <div style={{fontSize:13}}>建立第一趟旅行，開始記帳吧</div>
      </div>}
    </div>
  );
}

// ── TRIP DETAIL ───────────────────────────────────────────────────────────
const DTABS=[{id:"ledger",e:"📖",l:"帳本"},{id:"collect",e:"💰",l:"待收"},{id:"proxy",e:"🛍️",l:"代購"},{id:"stats",e:"📊",l:"統計"}];

function TripDetail({trip,store,banks,cards,friends,onBack}){
  const [tab,setTab]=useState("ledger");
  const [modal,setModal]=useState(null);
  const [billFriend,setBillFriend]=useState(null);
  const [toast,setToast]=useState(null);
  const [printMode,setPrintMode]=useState(null); // null | "simple" | "detail"
  const showToast=t=>{setToast(t);setTimeout(()=>setToast(null),4000);};
  const cv=COVERS.find(c=>c.id===trip.coverId)??COVERS[0];
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const pendRec=(trip.receivables??[]).filter(r=>!r.paid).reduce((s,r)=>s+r.amount,0);
  const pendProxy=(trip.proxies??[]).filter(p=>!p.paid).reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0);

  const handleAddExp=(exp,recs)=>store.addExpense(trip.id,exp,recs);

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:cv.g,padding:"44px 20px 28px",position:"relative"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:12,padding:"7px 14px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:SANS,marginBottom:14}}>← 所有旅行</button>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",letterSpacing:2}}>{trip.destination||"TRAVEL FOOTPRINT"}</div>
        <h2 style={{fontFamily:SERIF,fontSize:22,color:"#fff",margin:"4px 0 10px"}}>{trip.name}</h2>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div><div style={{fontSize:26,fontWeight:800,color:"#fff",fontFamily:SERIF}}>NT${fmt(myTotal)}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>我的花費</div></div>
          {(pendRec+pendProxy)>0&&<div style={{background:"rgba(255,255,255,0.2)",borderRadius:14,padding:"6px 14px"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>NT${fmt(pendRec+pendProxy)}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.75)"}}>待收回來 💚</div>
          </div>}
        </div>
        <div style={{position:"absolute",bottom:-22,left:16,right:16,background:C.card,borderRadius:20,padding:5,display:"flex",boxShadow:"0 4px 20px rgba(150,120,100,0.18)",border:`1px solid ${C.border}`}}>
          {DTABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 3px",borderRadius:14,border:"none",background:tab===t.id?cv.g:"transparent",color:tab===t.id?"#fff":C.textFaint,fontSize:11,fontWeight:tab===t.id?700:400,cursor:"pointer",fontFamily:SANS}}>{t.e} {t.l}</button>)}
        </div>
      </div>
      <div style={{height:36}}/>

      {tab==="ledger"&&<LedgerTab trip={trip} onAdd={()=>setModal("exp")} onDel={eid=>store.delExpense(trip.id,eid)}/>}
      {tab==="collect"&&<CollectTab trip={trip} friends={friends} onFriendsChange={store.setFriends} onMarkPaid={rid=>store.markPaid(trip.id,rid)} onConvert={rid=>store.convertToExp(trip.id,rid)} onBill={f=>setBillFriend(f)}/>}
      {tab==="proxy"&&<ProxyTab trip={trip} onAdd={()=>setModal("proxy")} onDel={pid=>store.delProxy(trip.id,pid)} onToggle={pid=>store.toggleProxy(trip.id,pid)} onBill={f=>setBillFriend(f)}/>}
      {tab==="stats"&&<StatsTab trip={trip} onOpenPrint={m=>setPrintMode(m)} onExcel={()=>showToast({icon:"📊",title:`${trip.name}_結算表.xlsx`,lines:[`✦ 我的支出明細　${trip.expenses.length}筆`,`✦ 待收款清單　${(trip.receivables??[]).length}筆`,`✦ 代購清單　${(trip.proxies??[]).length}件`,`✦ 朋友應收總覽`,`─────────────────`,`正式版整合 SheetJS 即可真實下載`]})}/>}

      {modal==="exp"&&<AddExpenseSheet trip={trip} friends={friends} cards={cards} onSave={handleAddExp} onClose={()=>setModal(null)}/>}
      {modal==="proxy"&&<AddProxySheet friends={friends} cards={cards} onSave={p=>store.addProxy(trip.id,p)} onClose={()=>setModal(null)}/>}
      {billFriend&&<BillSheet friend={billFriend} trip={trip} banks={banks} onClose={()=>setBillFriend(null)}/>}
      {printMode&&<PrintReport trip={trip} mode={printMode} onClose={()=>setPrintMode(null)}/>}
      <Toast data={toast}/>
    </div>
  );
}

// ── LEDGER TAB ────────────────────────────────────────────────────────────
function LedgerTab({trip,onAdd,onDel}){
  const grouped=trip.expenses.reduce((a,e)=>{(a[e.date]=a[e.date]||[]).push(e);return a;},{});
  const dates=Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  return(
    <div style={{padding:"16px 16px 100px"}}>
      {!trip.archived&&<button onClick={onAdd} style={{width:"100%",padding:"14px",borderRadius:20,border:`2px dashed ${C.roseMid}`,background:C.roseLight,color:C.rose,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}><span style={{fontSize:20}}>+</span>記錄新支出</button>}
      {dates.length===0?<div style={{textAlign:"center",padding:"50px 0",color:C.textFaint}}><div style={{fontSize:44,marginBottom:10}}>📒</div><div style={{fontFamily:SERIF,fontSize:15}}>還沒有支出記錄</div></div>
      :dates.map(date=>{
        const items=grouped[date]; const dayMine=items.reduce((s,e)=>s+(e.myShare??0),0);
        return(<div key={date} style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:11,color:C.textFaint,letterSpacing:1}}>{date.replace(/-/g," · ")}</span>
            <span style={{fontSize:12,color:C.rose,fontWeight:600}}>我花 NT${fmt(dayMine)}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {items.map(e=>{
              const cat=CATS.find(c=>c.id===e.category)||CATS[6]; const pm=PAYS.find(m=>m.id===e.payment);
              return(<Card key={e.id} s={{padding:"13px 15px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:14,background:cat.c+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{cat.e}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:C.text}}>{e.note||cat.l}</div>
                    <div style={{display:"flex",gap:6,marginTop:2,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,color:C.textFaint}}>{pm?.e} {pm?.l}</span>
                      {e.participants?.length>0&&<span style={{fontSize:10,background:C.sageLight,color:C.sage,padding:"1px 7px",borderRadius:99,fontWeight:600}}>÷{e.participants.length+(e.iParticipate?1:0)}人</span>}
                      {!e.iParticipate&&<span style={{fontSize:10,background:C.lavLight,color:C.lav,padding:"1px 7px",borderRadius:99}}>不含我</span>}
                      {e.feeTotal>0&&<span style={{fontSize:10,background:C.sandLight,color:C.sand,padding:"1px 7px",borderRadius:99}}>含手續費</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,color:C.textFaint}}>{e.currency!=="TWD"?`${CURRS.find(c=>c.code===e.currency)?.sym}${fmt(e.amount)}`:`NT$${fmt(e.amount)}`}</div>
                    <div style={{fontSize:15,fontWeight:700,color:C.rose}}>我：NT${fmt(e.myShare??0)}</div>
                    {!trip.archived&&<button onClick={()=>onDel(e.id)} style={{background:"none",border:"none",fontSize:10,color:C.textFaint,cursor:"pointer"}}>刪除</button>}
                  </div>
                </div>
              </Card>);
            })}
          </div>
        </div>);
      })}
    </div>
  );
}

// ── COLLECT TAB ───────────────────────────────────────────────────────────
function CollectTab({trip,friends,onFriendsChange,onMarkPaid,onConvert,onBill}){
  const recs=trip.receivables??[];
  const pending=recs.filter(r=>!r.paid);
  const done=recs.filter(r=>r.paid);
  const pendTotal=pending.reduce((s,r)=>s+r.amount,0);
  const allF=[...new Set(pending.map(r=>r.friend))];
  const [editMembers,setEditMembers]=useState(false);
  const [newName,setNewName]=useState("");
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <Card s={{padding:"18px",marginBottom:16,background:`linear-gradient(135deg,${C.greenLight},#E6F2EA)`,border:"none"}}>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:7}}>待收款合計（代墊）</div>
        <div style={{fontSize:32,fontWeight:800,color:C.green,fontFamily:SERIF}}>NT${fmt(pendTotal)}</div>
        <div style={{fontSize:12,color:C.textFaint,marginTop:4}}>{pending.length}筆未收・{done.length}筆已收</div>
      </Card>

      {/* ── 旅伴名單管理 ── */}
      <div style={{marginBottom:20,background:C.card,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden"}}>
        <button onClick={()=>setEditMembers(p=>!p)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:SANS}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:16}}>👥</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>旅伴名單</div>
              <div style={{fontSize:11,color:C.textFaint}}>{friends.join("、")}</div>
            </div>
          </div>
          <span style={{fontSize:12,color:C.rose,fontWeight:600}}>{editMembers?"收起 ▲":"編輯 ✏️"}</span>
        </button>
        {editMembers&&(
          <div style={{padding:"0 16px 16px",borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.textFaint,margin:"12px 0 10px",lineHeight:1.6}}>
              修改後，下次記帳分攤時就會套用新名單。已建立的記錄不受影響。
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {friends.map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:5,background:C.sageLight,borderRadius:99,padding:"5px 10px 5px 12px"}}>
                  <span style={{fontSize:12,color:C.text,fontWeight:600}}>{f}</span>
                  <button onClick={()=>onFriendsChange(friends.filter(x=>x!==f))} style={{background:"none",border:"none",color:C.textFaint,cursor:"pointer",fontSize:14,lineHeight:1,padding:"0 2px"}}>✕</button>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input
                placeholder="新增旅伴姓名"
                value={newName}
                onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&newName.trim()&&!friends.includes(newName.trim())){onFriendsChange([...friends,newName.trim()]);setNewName("");}}}
                style={{flex:1,padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#FDFCFB",fontSize:13,color:C.text,outline:"none",fontFamily:SANS}}
              />
              <button onClick={()=>{if(newName.trim()&&!friends.includes(newName.trim())){onFriendsChange([...friends,newName.trim()]);setNewName("");}}}
                style={{padding:"10px 16px",borderRadius:12,border:"none",background:C.sage,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS,flexShrink:0}}>
                + 新增
              </button>
            </div>
          </div>
        )}
      </div>
      {allF.map(fr=>{
        const items=pending.filter(r=>r.friend===fr); const fTotal=items.reduce((s,r)=>s+r.amount,0);
        return(<div key={fr} style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.green}}>{fr[0]}</div>
              <span style={{fontWeight:700,color:C.text,fontSize:15}}>{fr}</span>
              <span style={{fontSize:12,color:C.green,fontWeight:600}}>NT${fmt(fTotal)}</span>
            </div>
            <Btn sm color={C.rose} onClick={()=>onBill(fr)}>📋 帳單</Btn>
          </div>
          {items.map(r=><Card key={r.id} s={{padding:"11px 14px",marginBottom:7}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{r.note}</div><div style={{fontSize:11,color:C.textFaint}}>{r.date}</div></div>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginRight:8}}>NT${fmt(r.amount)}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>onMarkPaid(r.id)} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>✓ 已還</button>
                {!trip.archived&&<button onClick={()=>{if(window.confirm("轉為我的支出？"))onConvert(r.id);}} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.textFaint,fontSize:11,cursor:"pointer",fontFamily:SANS}}>轉支出</button>}
              </div>
            </div>
          </Card>)}
        </div>);
      })}
      {pending.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.textFaint}}><div style={{fontSize:40,marginBottom:10}}>✅</div><div style={{fontFamily:SERIF,fontSize:15}}>所有代墊都已收款！</div></div>}
      {done.length>0&&<div style={{marginTop:20}}>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:10}}>已收款紀錄</div>
        {done.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textFaint,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span>{r.friend}・{r.note}</span><span>{r.converted?"轉入支出":`NT$${fmt(r.amount)}`}</span></div>)}
      </div>}
    </div>
  );
}

// ── PROXY TAB ─────────────────────────────────────────────────────────────
function ProxyTab({trip,onAdd,onDel,onToggle,onBill}){
  const proxies=trip.proxies??[];
  const pending=proxies.filter(p=>!p.paid);
  const pendTotal=pending.reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0);
  const allB=[...new Set(pending.map(p=>p.buyer))];
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <Card s={{padding:"18px",marginBottom:16,background:`linear-gradient(135deg,${C.lavLight},#EDE8F5)`,border:"none"}}>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:7}}>代購待收合計</div>
        <div style={{fontSize:32,fontWeight:800,color:C.lav,fontFamily:SERIF}}>NT${fmt(pendTotal)}</div>
        <div style={{fontSize:12,color:C.textFaint,marginTop:4}}>{pending.length}件未收款</div>
      </Card>
      {!trip.archived&&<button onClick={onAdd} style={{width:"100%",padding:"13px",borderRadius:18,border:`2px dashed ${C.lav}`,background:C.lavLight,color:C.lav,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}><span style={{fontSize:18}}>+</span>新增代購品項</button>}
      {allB.map(buyer=>{
        const items=pending.filter(p=>p.buyer===buyer); const bTotal=items.reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0);
        return(<div key={buyer} style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.lavLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.lav}}>{buyer[0]}</div>
              <span style={{fontWeight:700,color:C.text,fontSize:15}}>{buyer}</span>
              <span style={{fontSize:12,color:C.lav,fontWeight:600}}>NT${fmt(bTotal)}</span>
            </div>
            <Btn sm color={C.lav} onClick={()=>onBill(buyer)}>📋 帳單</Btn>
          </div>
          {items.map(p=>{
            const sym=CURRS.find(c=>c.code===p.currency)?.sym??"";
            return(<Card key={p.id} s={{padding:"12px 14px",marginBottom:7}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.item}</div>
                  <div style={{fontSize:11,color:C.textLight}}>{sym}{fmt(p.price)}×{p.qty}{p.currency!=="TWD"?` ≈NT$${fmt(toTWD(p.price*p.qty,p.currency))}`:""}  {p.feeTotal>0?`+手續費NT$${fmt(p.feeTotal)}`:""}</div>
                  {p.note&&<div style={{fontSize:11,color:C.textFaint}}>{p.note}</div>}
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.lav}}>NT${fmt(toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0))}</div>
                  <div style={{display:"flex",gap:5,marginTop:4,justifyContent:"flex-end"}}>
                    <button onClick={()=>onToggle(p.id)} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>✓ 已付</button>
                    {!trip.archived&&<button onClick={()=>onDel(p.id)} style={{padding:"5px 9px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.textFaint,fontSize:10,cursor:"pointer"}}>刪</button>}
                  </div>
                </div>
              </div>
            </Card>);
          })}
        </div>);
      })}
      {pending.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.textFaint}}><div style={{fontSize:40,marginBottom:10}}>✅</div><div style={{fontFamily:SERIF,fontSize:15}}>所有代購都已付款！</div></div>}
    </div>
  );
}

// ── SVG Pie Chart ─────────────────────────────────────────────────────────
function PieChart({data,size=160}){
  // data: [{label, value, color}]
  const total=data.reduce((s,d)=>s+d.value,0);
  if(!total) return null;
  const cx=size/2, cy=size/2, r=size/2-8, ri=r*0.52;
  let angle=-Math.PI/2;
  const slices=data.map(d=>{
    const sweep=(d.value/total)*Math.PI*2;
    const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle);
    angle+=sweep;
    const x2=cx+r*Math.cos(angle), y2=cy+r*Math.sin(angle);
    const xi1=cx+ri*Math.cos(angle-sweep), yi1=cy+ri*Math.sin(angle-sweep);
    const xi2=cx+ri*Math.cos(angle), yi2=cy+ri*Math.sin(angle);
    const lg=sweep>Math.PI?1:0;
    return{...d,path:`M${x1},${y1} A${r},${r},0,${lg},1,${x2},${y2} L${xi2},${yi2} A${ri},${ri},0,${lg},0,${xi1},${yi1} Z`};
  });
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2"/>)}
      <circle cx={cx} cy={cy} r={ri-2} fill="white"/>
    </svg>
  );
}

// ── SVG Bar Chart ─────────────────────────────────────────────────────────
function BarChart({data,width=280,height=120}){
  // data: [{label, value, color}]
  const max=Math.max(...data.map(d=>d.value),1);
  const barW=Math.min(36, (width-24)/data.length-8);
  const gap=(width-24-barW*data.length)/(data.length+1);
  return(
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((d,i)=>{
        const bh=Math.max(4,((d.value/max)*(height-32)));
        const x=24+gap*(i+1)+barW*i;
        const y=height-16-bh;
        return(
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx={6} fill={d.color} opacity="0.9"/>
            <text x={x+barW/2} y={height-2} textAnchor="middle" fontSize="9" fill="#AAAAAA" fontFamily="sans-serif">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Print Report ──────────────────────────────────────────────────────────
function PrintReport({trip,mode,onClose}){
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const byCat=CATS.map(c=>({label:c.l,value:trip.expenses.filter(e=>e.category===c.id).reduce((s,e)=>s+(e.myShare??0),0),color:c.c,emoji:c.e})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
  const pendRec=(trip.receivables??[]).filter(r=>!r.paid).reduce((s,r)=>s+r.amount,0);
  const pendProxy=(trip.proxies??[]).filter(p=>!p.paid).reduce((s,p)=>s+toTWD(p.price*p.qty,p.currency)+(p.feeTotal??0),0);
  const days=[...new Set(trip.expenses.map(e=>e.date))].length;
  const grouped=trip.expenses.reduce((a,e)=>{(a[e.date]=a[e.date]||[]).push(e);return a;},{});
  const dates=Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  const allFriends=[...new Set([...(trip.receivables??[]).map(r=>r.friend)])];

  // Print CSS injected via style tag
  const printStyle=`
    @media print {
      body { margin:0; background:#fff; }
      .no-print { display:none !important; }
      .print-page { padding:0 !important; max-width:100% !important; }
      .page-break { page-break-before: always; }
    }
    @media screen {
      .print-page { background:#fff; }
    }
    body { font-family: 'Helvetica Neue', sans-serif; }
  `;

  const doPrint=()=>{
    const s=document.createElement("style");
    s.innerHTML=printStyle;
    document.head.appendChild(s);
    window.print();
    setTimeout(()=>document.head.removeChild(s),2000);
  };

  const coverGrad=COVERS.find(c=>c.id===trip.coverId)?.g??COVERS[0].g;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(60,50,40,0.5)",backdropFilter:"blur(10px)",zIndex:500,overflowY:"auto"}}>
      {/* Toolbar - no-print */}
      <div className="no-print" style={{position:"sticky",top:0,zIndex:10,background:"rgba(249,248,246,0.96)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",gap:10,alignItems:"center",maxWidth:680,margin:"0 auto"}}>
        <button onClick={onClose} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.textLight,fontSize:13,cursor:"pointer",fontFamily:SANS}}>← 返回</button>
        <div style={{flex:1,fontSize:13,color:C.textFaint}}>預覽報表・{mode==="detail"?"詳細版":"簡式版"}</div>
        <button onClick={doPrint} style={{background:C.rose,border:"none",borderRadius:12,padding:"10px 20px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:SANS,display:"flex",alignItems:"center",gap:6}}>
          🖨️ 列印 / 儲存 PDF
        </button>
      </div>

      {/* Report body */}
      <div className="print-page" style={{maxWidth:680,margin:"0 auto",padding:"0 0 60px"}}>

        {/* Cover */}
        <div style={{background:coverGrad,padding:"48px 36px 40px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-40,top:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
          <div style={{position:"absolute",right:40,bottom:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{fontSize:11,letterSpacing:3,opacity:0.75,marginBottom:8}}>TRAVEL FOOTPRINT</div>
          <h1 style={{fontFamily:SERIF,fontSize:28,margin:"0 0 6px",fontWeight:700}}>{trip.name}</h1>
          {trip.destination&&<div style={{fontSize:14,opacity:0.85,marginBottom:16}}>📍 {trip.destination}</div>}
          <div style={{fontSize:12,opacity:0.7,marginBottom:24}}>{trip.startDate}{trip.endDate?` → ${trip.endDate}`:""} ・ {days} 天 ・ {trip.expenses.length} 筆支出</div>
          <div style={{display:"flex",gap:24}}>
            <div><div style={{fontSize:32,fontWeight:800,fontFamily:SERIF}}>NT${fmt(myTotal)}</div><div style={{fontSize:11,opacity:0.75}}>我的旅行花費</div></div>
            {(pendRec+pendProxy)>0&&<div style={{background:"rgba(255,255,255,0.18)",borderRadius:16,padding:"10px 18px"}}>
              <div style={{fontSize:22,fontWeight:800}}>NT${fmt(pendRec+pendProxy)}</div>
              <div style={{fontSize:11,opacity:0.75}}>待收回來</div>
            </div>}
          </div>
          <div style={{fontSize:10,opacity:0.5,marginTop:16,letterSpacing:1}}>
            列印日期：{new Date().toLocaleDateString("zh-TW")}　{mode==="detail"?"詳細明細版":"簡式大項版"}
          </div>
        </div>

        {/* Section 1: Summary cards */}
        <div style={{padding:"28px 36px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:32}}>
            {[
              {l:"旅行天數",v:`${days} 天`,c:C.roseLight,tc:C.rose},
              {l:"總支出筆數",v:`${trip.expenses.length} 筆`,c:C.sageLight,tc:C.sage},
              {l:"日均花費",v:`NT$${fmt(days?myTotal/days:0)}`,c:C.sandLight,tc:C.sand},
            ].map(s=>(
              <div key={s.l} style={{background:s.c,borderRadius:16,padding:"16px",textAlign:"center"}}>
                <div style={{fontSize:11,color:s.tc,letterSpacing:1,fontWeight:600,marginBottom:6}}>{s.l}</div>
                <div style={{fontSize:20,fontWeight:800,color:s.tc,fontFamily:SERIF}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Section 2: Charts */}
          {byCat.length>0&&<>
            <div style={{fontSize:11,color:C.textFaint,letterSpacing:2,fontWeight:600,marginBottom:18}}>支出分析</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:32,alignItems:"center"}}>
              {/* Pie */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{fontSize:12,color:C.textLight,marginBottom:12,fontWeight:600}}>類別佔比</div>
                <PieChart data={byCat.map(c=>({label:c.label,value:c.value,color:c.color}))} size={160}/>
                {/* Legend */}
                <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:5,width:"100%"}}>
                  {byCat.map(c=>(
                    <div key={c.label} style={{display:"flex",alignItems:"center",gap:7,fontSize:11}}>
                      <div style={{width:10,height:10,borderRadius:3,background:c.color,flexShrink:0}}/>
                      <span style={{color:C.textLight,flex:1}}>{c.emoji} {c.label}</span>
                      <span style={{color:C.text,fontWeight:600}}>{myTotal?(c.value/myTotal*100).toFixed(0):0}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bar */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{fontSize:12,color:C.textLight,marginBottom:12,fontWeight:600}}>各類別金額</div>
                <BarChart data={byCat.map(c=>({label:c.emoji,value:c.value,color:c.color}))} width={240} height={130}/>
                <div style={{marginTop:12,width:"100%"}}>
                  {byCat.map(c=>(
                    <div key={c.label} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textLight,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
                      <span>{c.emoji} {c.label}</span>
                      <span style={{fontWeight:700,color:C.text}}>NT${fmt(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* Section 3: Expense detail */}
          {mode==="detail"&&<>
            <div className="page-break"/>
            <div style={{fontSize:11,color:C.textFaint,letterSpacing:2,fontWeight:600,marginBottom:18,paddingTop:24}}>支出明細</div>
            {dates.map(date=>{
              const items=grouped[date];
              const dayMine=items.reduce((s,e)=>s+(e.myShare??0),0);
              return(
                <div key={date} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,paddingBottom:6,borderBottom:`2px solid ${C.roseLight}`}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.text}}>{date.replace(/-/g," / ")}</span>
                    <span style={{fontSize:12,color:C.rose,fontWeight:700}}>NT${fmt(dayMine)}</span>
                  </div>
                  {items.map(e=>{
                    const cat=CATS.find(c=>c.id===e.category)||CATS[6];
                    const pm=PAYS.find(m=>m.id===e.payment);
                    return(
                      <div key={e.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",marginBottom:4,background:C.bg,borderRadius:10}}>
                        <span style={{fontSize:16,flexShrink:0}}>{cat.e}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.text}}>{e.note||cat.l}</div>
                          <div style={{fontSize:10,color:C.textFaint}}>{pm?.l}{e.participants?.length>0?` ÷${e.participants.length+(e.iParticipate?1:0)}人`:""}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          {e.currency!=="TWD"&&<div style={{fontSize:10,color:C.textFaint}}>{CURRS.find(c=>c.code===e.currency)?.sym}{fmt(e.amount)}</div>}
                          <div style={{fontSize:13,fontWeight:700,color:C.rose}}>NT${fmt(e.myShare??0)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>}

          {/* Section 3 simple: category totals only */}
          {mode==="simple"&&byCat.length>0&&<>
            <div style={{fontSize:11,color:C.textFaint,letterSpacing:2,fontWeight:600,marginBottom:14}}>類別小計</div>
            <div style={{marginBottom:32}}>
              {byCat.map(c=>(
                <div key={c.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",marginBottom:6,background:c.color+"18",borderRadius:14,borderLeft:`4px solid ${c.color}`}}>
                  <span style={{fontSize:14,color:C.text}}>{c.emoji} {c.label}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:800,color:C.text}}>NT${fmt(c.value)}</div>
                    <div style={{fontSize:10,color:C.textFaint}}>{myTotal?(c.value/myTotal*100).toFixed(1):0}%</div>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"14px 16px",background:C.roseLight,borderRadius:14,marginTop:8}}>
                <span style={{fontSize:14,fontWeight:700,color:C.rose}}>合計</span>
                <span style={{fontSize:18,fontWeight:800,color:C.rose,fontFamily:SERIF}}>NT${fmt(myTotal)}</span>
              </div>
            </div>
          </>}

          {/* Section 4: Receivables */}
          {allFriends.length>0&&<>
            <div style={{fontSize:11,color:C.textFaint,letterSpacing:2,fontWeight:600,marginBottom:14,paddingTop:8}}>朋友待收明細</div>
            {allFriends.map(f=>{
              const items=(trip.receivables??[]).filter(r=>r.friend===f&&!r.paid);
              if(!items.length) return null;
              const fTotal=items.reduce((s,r)=>s+r.amount,0);
              return(
                <div key={f} style={{marginBottom:16,background:C.greenLight,borderRadius:16,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:mode==="detail"?10:0}}>
                    <span style={{fontWeight:700,color:C.text,fontSize:14}}>👤 {f}</span>
                    <span style={{fontWeight:800,color:C.green,fontSize:16}}>NT${fmt(fTotal)}</span>
                  </div>
                  {mode==="detail"&&items.map(r=>(
                    <div key={r.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textLight,marginBottom:3}}>
                      <span>{r.note}（{r.date}）</span><span>NT${fmt(r.amount)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </>}

          {/* Footer */}
          <div style={{marginTop:36,paddingTop:16,borderTop:`1px solid ${C.border}`,textAlign:"center",fontSize:10,color:C.textFaint,letterSpacing:1}}>
            旅行足跡帳本 Travel Footprint　・　{new Date().toLocaleDateString("zh-TW")} 列印
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STATS TAB ─────────────────────────────────────────────────────────────
function StatsTab({trip,onExcel,onOpenPrint}){
  const myTotal=trip.expenses.reduce((s,e)=>s+(e.myShare??0),0);
  const byCat=CATS.map(c=>({...c,sum:trip.expenses.filter(e=>e.category===c.id).reduce((s,e)=>s+(e.myShare??0),0)})).filter(c=>c.sum>0).sort((a,b)=>b.sum-a.sum);
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <Card s={{padding:"18px",marginBottom:16,background:`linear-gradient(135deg,${C.sandLight},#EDE8DE)`,border:"none"}}>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:7}}>我的旅行花費</div>
        <div style={{fontSize:30,fontWeight:800,color:C.sand,fontFamily:SERIF}}>NT${fmt(myTotal)}</div>
        <div style={{fontSize:12,color:C.textFaint,marginTop:4}}>{trip.expenses.length}筆・{[...new Set(trip.expenses.map(e=>e.date))].length}天</div>
      </Card>
      {byCat.length>0&&<>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:1.8,fontWeight:600,marginBottom:12}}>類別分佈（我的負擔）</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {byCat.map(c=><div key={c.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:13,color:C.text}}>{c.e} {c.l}</span>
              <div style={{display:"flex",gap:10}}>
                <span style={{fontSize:11,color:C.textFaint}}>{myTotal?(c.sum/myTotal*100).toFixed(1):0}%</span>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>NT${fmt(c.sum)}</span>
              </div>
            </div>
            <div style={{height:7,background:C.border,borderRadius:99}}>
              <div style={{height:7,width:myTotal?`${c.sum/myTotal*100}%`:"0%",background:c.c,borderRadius:99}}/>
            </div>
          </div>)}
        </div>
        {/* In-app pie preview */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <PieChart data={byCat.map(c=>({label:c.l,value:c.sum,color:c.c}))} size={140}/>
        </div>
      </>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Btn onClick={()=>onOpenPrint("simple")} color={C.rose} style={{width:"100%"}}>📄 簡式 PDF</Btn>
        <Btn onClick={()=>onOpenPrint("detail")} color={C.sage} style={{width:"100%"}}>📋 詳細 PDF</Btn>
      </div>
      <Btn onClick={onExcel} color={C.sand} outline style={{width:"100%"}}>📊 模擬匯出 Excel</Btn>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────
export default function App(){
  const store=useStore();
  const [screen,setScreen]=useState("list");
  const [modal,setModal]=useState(null);
  const [welcomed,setWelcomed]=useState(()=>lsGet("tf_welcomed",false));

  const closeWelcome=()=>{lsSet("tf_welcomed",true);setWelcomed(true);};
  const openTrip=id=>{store.setActiveId(id);setScreen("detail");};
  const trip=store.active;
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:SANS,maxWidth:430,margin:"0 auto"}}>
      <div style={{height:44}}/>
      {screen==="list"&&<>
        <TripList trips={store.trips} activeId={store.activeId} onSelect={openTrip} onCreate={()=>setModal("new")} onArchive={store.archiveTrip} onReopen={store.reopenTrip} onDelete={store.deleteTrip} onSettings={()=>setModal("settings")}/>
        {modal==="new"&&<NewTripSheet onSave={d=>{const id=store.createTrip(d);openTrip(id);}} onClose={()=>setModal(null)}/>}
        {modal==="settings"&&<SettingsSheet banks={store.banks} setBanks={store.setBanks} cards={store.cards} setCards={store.setCards} friends={store.friends} setFriends={store.setFriends} onClose={()=>setModal(null)}/>}
      </>}
      {screen==="detail"&&trip&&<TripDetail trip={trip} store={store} banks={store.banks} cards={store.cards} friends={store.friends} onBack={()=>setScreen("list")}/>}
      {!welcomed&&<WelcomeModal onClose={closeWelcome}/>}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";

// --- 1. 核心樣式與常數 ---
const C = {
  bg: "#F9F8F6", card: "#FFFFFF", rose: "#C9A89A", roseLight: "#F0E6E1", roseMid: "#D4B8AB",
  sage: "#A8B5A2", sageLight: "#E4EBE2", sand: "#C8B89A", sandLight: "#EDE6D8",
  lav: "#B5A8C8", lavLight: "#EAE6F2", teal: "#9AB5B5", text: "#5A5A5A",
  textLight: "#8A8A7A", textFaint: "#BBBBA8", border: "#EDEBE6", borderStrong: "#DDD9D0",
  green: "#88B098", greenLight: "#E2EFE8", red: "#D4806A", redLight: "#FAE8E3"
};
const SERIF = "'Georgia', serif", SANS = "'Helvetica Neue', sans-serif";
const CATS = [
  { id: "food", e: "🍜", l: "餐飲" }, { id: "transport", e: "🚌", l: "交通" },
  { id: "hotel", e: "🏨", l: "住宿" }, { id: "shopping", e: "🛍️", l: "購物" },
  { id: "activity", e: "🎭", l: "體驗" }, { id: "beauty", e: "💄", l: "美妝" },
  { id: "other", e: "📎", l: "其他" }
];
const BASE_CURRS = [
  { code: "TWD", sym: "NT$", l: "台幣", r: 1 }, { code: "JPY", sym: "¥", l: "日圓", r: 0.22 },
  { code: "KRW", sym: "₩", l: "韓圓", r: 0.024 }, { code: "CNY", sym: "¥", l: "人民幣", r: 4.38 },
  { code: "VND", sym: "₫", l: "越南盾", r: 0.00128 }, { code: "THB", sym: "฿", l: "泰銖", r: 0.91 },
  { code: "USD", sym: "$", l: "美元", r: 32.5 }
];

// --- 2. 實用工具函數 ---
const fmt = n => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(Math.round(n || 0));
const todayStr = () => new Date().toISOString().split("T")[0];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const compressImg = (file, maxW = 400) => new Promise(res => {
  const r = new FileReader(); r.onload = ev => {
    const img = new Image(); img.onload = () => {
      const c = document.createElement("canvas"); const s = Math.min(1, maxW / img.width);
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.7));
    }; img.src = ev.target.result;
  }; r.readAsDataURL(file);
});

// --- 3. UI 原子組件 ---
const Lbl = ({ ch, s }) => <div style={{ fontSize: 10, color: "#BBBBA8", letterSpacing: 1.8, marginBottom: 7, fontWeight: 600, textTransform: "uppercase", ...s }}>{ch}</div>;
function Pill({ active, color = "#C9A89A", children, onClick }) { return <button onClick={onClick} style={{ padding: "7px 13px", borderRadius: 99, border: `1.5px solid ${active ? color : "#EDEBE6"}`, background: active ? color + "28" : "transparent", color: active ? color : "#8A8A7A", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: SANS, whiteSpace: "nowrap" }}>{children}</button>; }
function Inp({ style, ...p }) { return <input {...p} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid #EDEBE6", background: "#FDFCFB", fontSize: 14, color: "#5A5A5A", outline: "none", boxSizing: "border-box", fontFamily: SANS, ...style }} />; }
function Sel({ style, children, ...p }) { return <select {...p} style={{ padding: "12px 14px", borderRadius: 14, border: "1.5px solid #EDEBE6", background: "#FDFCFB", fontSize: 13, color: "#5A5A5A", outline: "none", fontFamily: SANS, cursor: "pointer", ...style }}>{children}</select>; }
function Btn({ children, color = "#C9A89A", onClick, style, outline, sm }) { return <button onClick={onClick} style={{ padding: sm ? "7px 13px" : "13px 20px", borderRadius: sm ? 12 : 16, border: outline ? `1.5px solid ${color}` : "none", background: outline ? "transparent" : color, color: outline ? color : "#fff", fontSize: sm ? 12 : 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS, ...style }}>{children}</button>; }
function Sheet({ children, onClose }) { return (<div style={{ position: "fixed", inset: 0, background: "rgba(80,70,60,0.4)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}><div style={{ width: "100%", maxWidth: 430, background: "#F9F8F6", borderRadius: "28px 28px 0 0", padding: "24px 20px 44px", maxHeight: "92vh", overflowY: "auto" }}>{children}</div></div>); }
function SHead({ title, onClose }) { return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}><h3 style={{ fontFamily: SERIF, fontSize: 18, color: "#5A5A5A", margin: 0 }}>{title}</h3><button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#BBBBA8" }}>✕</button></div>); }

function ImgUpload({ img, onImg }) {
  const handleImg = async e => { const file = e.target.files?.[0]; if (!file) return; const b64 = await compressImg(file); onImg(b64); };
  return (
    <label style={{ display: "block", width: "100%", marginBottom: 14, cursor: "pointer" }}>
      {img ? (
        <div style={{ position: "relative" }}><img src={img} style={{ width: "100%", borderRadius: 16, maxHeight: 180, objectFit: "cover" }} /><button onClick={e => { e.preventDefault(); onImg(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button></div>
      ) : (
        <div style={{ width: "100%", height: 100, borderRadius: 16, border: "1.5px dashed #EDEBE6", background: "#FDFCFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}><span style={{ fontSize: 24 }}>📷</span><span style={{ fontSize: 12, color: "#BBBBA8" }}>點擊上傳圖片</span></div>
      )}
      <input type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }} />
    </label>
  );
}

// --- 4. 業務邏輯 Store ---
function useStore() {
  const [trips, setTrips] = useState(() => lsGet("tf_trips", []));
  const [activeId, setActiveId] = useState(() => lsGet("tf_active", null));
  const [friends, setFriends] = useState(() => lsGet("tf_friends", ["我", "旅伴A"]));
  const [cards, setCards] = useState(() => lsGet("tf_cards", [{ id: "c1", name: "常用卡", feeRate: 1.5 }]));
  const [customCurrs, setCustomCurrs] = useState(() => lsGet("tf_currs", []));

  useEffect(() => { lsSet("tf_trips", trips); lsSet("tf_active", activeId); lsSet("tf_friends", friends); lsSet("tf_cards", cards); lsSet("tf_currs", customCurrs); }, [trips, activeId, friends, cards, customCurrs]);

  const allCurrs = [...BASE_CURRS, ...customCurrs];
  const active = trips.find(t => t.id === activeId) || null;
  const updateActive = (n) => setTrips(prev => prev.map(t => t.id === activeId ? { ...t, ...n } : t));

  return { trips, setTrips, active, activeId, setActiveId, friends, setFriends, cards, setCards, allCurrs, updateActive, customCurrs, setCustomCurrs };
}

// --- 5. 核心功能頁面 ---

function HomeTab({ trip, friends }) {
  const exps = trip.expenses || [];
  const proxies = (trip.proxies || []).filter(p => p.status !== 'cancelled');
  const totalExp = exps.reduce((s, e) => s + e.totalTWD, 0);
  const totalProxy = proxies.reduce((s, p) => s + p.totalTWD, 0);
  const budget = trip.budget || 50000;

  // 分攤算法：計算淨值
  const balance = {};
  friends.forEach(f => balance[f] = 0);
  exps.forEach(e => {
    const s = e.totalTWD / (e.shares?.length || 1);
    balance[e.payer] += e.totalTWD;
    e.shares?.forEach(sh => balance[sh] -= s);
  });

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #C9A89A, #D4B8AB)", borderRadius: 28, padding: 24, color: "#fff", marginBottom: 25, boxShadow: "0 10px 20px rgba(201,168,154,0.2)" }}>
        <Lbl ch="總旅行預算進度" s={{ color: "rgba(255,255,255,0.7)" }} />
        <div style={{ fontSize: 32, fontFamily: SERIF, fontWeight: 700 }}>NT$ {fmt(totalExp + totalProxy)}</div>
        <div style={{ marginTop: 15, background: "rgba(255,255,255,0.2)", height: 6, borderRadius: 3 }}><div style={{ width: `${Math.min(100, ((totalExp + totalProxy)/budget)*100)}%`, background: "#fff", height: "100%", borderRadius: 3 }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, opacity: 0.9 }}><span>目標 NT$ {fmt(budget)}</span><span>{Math.round(((totalExp + totalProxy)/budget)*100)}%</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
        <div style={{ background: "#fff", padding: 16, borderRadius: 20, border: "1.5px solid #EDEBE6" }}><Lbl ch="一般支出" /><div style={{ fontSize: 18, fontWeight: 700 }}>NT$ {fmt(totalExp)}</div></div>
        <div style={{ background: "#fff", padding: 16, borderRadius: 20, border: "1.5px solid #EDEBE6" }}><Lbl ch="代墊總額" /><div style={{ fontSize: 18, fontWeight: 700, color: C.rose }}>NT$ {fmt(totalProxy)}</div></div>
      </div>

      <Lbl ch="分攤結算 (誰該收錢/付錢)" />
      {friends.map(f => (
        <div key={f} style={{ background: "#fff", padding: "16px 20px", borderRadius: 20, marginBottom: 12, border: "1.5px solid #EDEBE6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: balance[f] >= 0 ? C.green : C.red }} /> <span style={{ fontWeight: 600 }}>{f}</span></div>
          <span style={{ color: balance[f] >= 0 ? C.green : C.red, fontWeight: 700, fontSize: 15 }}>{balance[f] >= 0 ? `+${fmt(balance[f])}` : fmt(balance[f])}</span>
        </div>
      ))}
    </div>
  );
}

function ListTab({ trip, updateActive, friends, allCurrs, cards }) {
  const [showAdd, setShowAdd] = useState(false);
  const exps = trip.expenses || [];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}><Lbl ch="消費清單" /><Btn sm onClick={() => setShowAdd(true)}>+ 新增支出</Btn></div>
      {exps.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.textFaint }}>尚無消費記錄</div>}
      {exps.map(e => (
        <div key={e.id} style={{ background: "#fff", padding: 16, borderRadius: 22, marginBottom: 12, border: "1.5px solid #EDEBE6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20, background: C.bg, width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{CATS.find(c => c.id === e.cat)?.e || "📎"}</div>
            <div><div style={{ fontWeight: 700, color: C.text }}>{e.item}</div><div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{e.payer} 付 · {e.shares?.length} 人分攤</div></div>
          </div>
          <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, fontSize: 15 }}>NT$ {fmt(e.totalTWD)}</div><div style={{ fontSize: 10, color: C.textFaint }}>{e.amount} {e.curr} {e.fee > 0 && `(含手續費)`}</div></div>
        </div>
      ))}
      {showAdd && <AddExpSheet friends={friends} cards={cards} allCurrs={allCurrs} onClose={() => setShowAdd(false)} onAdd={(ex) => updateActive({ expenses: [ex, ...(trip.expenses || [])] })} />}
    </div>
  );
}

function ProxyTab({ trip, updateActive }) {
  const [selPids, setSelPids] = useState([]);
  const proxies = trip.proxies || [];
  const toggle = (id) => setSelPids(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  
  const handleBatchPay = () => {
    updateActive({ proxies: proxies.map(p => selPids.includes(p.id) ? { ...p, paid: true } : p) });
    setSelPids([]);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}><Lbl ch="💰 代墊管理" />{selPids.length > 0 && <Btn sm onClick={handleBatchPay}>勾選結清 ({selPids.length})</Btn>}</div>
      {proxies.map(p => (
        <div key={p.id} style={{ background: "#fff", padding: 16, borderRadius: 22, marginBottom: 12, border: "1.5px solid #EDEBE6", opacity: p.status === 'cancelled' ? 0.6 : 1, transition: "0.3s" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {p.img && <img src={p.img} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover" }} />}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{p.item}</span>
                {!p.paid && p.status !== 'cancelled' && <input type="checkbox" checked={selPids.includes(p.id)} onChange={() => toggle(p.id)} style={{ width: 18, height: 18 }} />}
              </div>
              <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>委託人：{p.buyer} {p.paid && <span style={{ color: C.green, fontWeight: 700, marginLeft: 8 }}>[已結清]</span>}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.rose, marginTop: 8 }}>NT$ {fmt(p.totalTWD)}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 15, marginTop: 12, borderTop: "1px solid #F5F3EF", paddingTop: 10 }}>
            {!p.paid && p.status !== 'cancelled' && <button onClick={() => updateActive({ proxies: proxies.map(x => x.id === p.id ? { ...x, status: 'cancelled' } : x) })} style={{ border: "none", background: "none", color: C.red, fontSize: 12, fontWeight: 600 }}>取消購買</button>}
            <button onClick={() => { if(window.confirm("確定刪除此記錄？")) updateActive({ proxies: proxies.filter(x => x.id !== p.id) }) }} style={{ border: "none", background: "none", color: C.textFaint, fontSize: 12 }}>刪除</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishTab({ trip, friends, allCurrs, cards, updateActive }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showBuy, setShowBuy] = useState(null);
  const list = (trip.wishlist || []).filter(w => !w.done);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}><Lbl ch="🛍️ 代購清單" /><Btn sm onClick={() => setShowAdd(true)}>+ 我要許願</Btn></div>
      {list.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.textFaint, border: "1.5px dashed #EDEBE6", borderRadius: 24 }}>清單空空如也，快去許願！</div>}
      {list.map(w => (
        <div key={w.id} style={{ background: "#fff", padding: 16, borderRadius: 22, marginBottom: 12, border: "1.5px solid #EDEBE6", display: "flex", gap: 15, alignItems: "center" }}>
          {w.img && <img src={w.img} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />}
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{w.item}</div><div style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>{w.buyer} · {w.note || "無備註"}</div></div>
          <Btn sm onClick={() => setShowBuy(w)}>買到了</Btn>
        </div>
      ))}
      {showAdd && <AddWishSheet friends={friends} onClose={() => setShowAdd(false)} onAdd={(w) => updateActive({ wishlist: [{ ...w, id: uid(), done: false }, ...(trip.wishlist || [])] })} />}
      {showBuy && <BuyWishSheet wish={showBuy} allCurrs={allCurrs} cards={cards} onClose={() => setShowBuy(null)} onBuy={(wid, pr, qt, cu, cardId) => {
        const rate = allCurrs.find(c => c.code === cu)?.r || 1;
        const base = pr * qt * rate;
        const card = cards.find(c => c.id === cardId);
        const fee = card ? base * (card.feeRate / 100) : 0;
        const proxy = { id: uid(), buyer: showBuy.buyer, item: showBuy.item, totalTWD: base + fee, paid: false, status: 'active', img: showBuy.img, date: todayStr() };
        updateActive({ wishlist: trip.wishlist.map(x => x.id === wid ? { ...x, done: true } : x), proxies: [proxy, ...(trip.proxies || [])] });
      }} />}
    </div>
  );
}

// --- 6. 交互彈窗 Sheets ---

function AddExpSheet({ friends, cards, allCurrs, onClose, onAdd }) {
  const [amt, setAmt] = useState(""); const [it, setIt] = useState(""); const [cu, setCu] = useState("TWD");
  const [ca, setCa] = useState("food"); const [py, setPy] = useState(friends[0]); const [sh, setSh] = useState(friends);
  const [pm, setPm] = useState("cash"); const [cid, setCid] = useState(cards[0]?.id || "");

  const handleSave = () => {
    if (!amt || !it) return alert("請輸入金額與品名");
    const r = allCurrs.find(x => x.code === cu)?.r || 1;
    const base = parseFloat(amt) * r;
    const card = cards.find(x => x.id === cid);
    const fee = pm === "card" && card ? base * (card.feeRate / 100) : 0;
    onAdd({ id: uid(), item: it, cat: ca, amount: parseFloat(amt), curr: cu, totalTWD: base + fee, fee, payer: py, shares: sh, payment: pm, cardId: cid, date: todayStr() });
    onClose();
  };

  return (
    <Sheet onClose={onClose}><SHead title="記一筆消費" onClose={onClose} />
      <Lbl ch="分類" /><div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 15, paddingBottom: 5 }}>{CATS.map(c => <Pill key={c.id} active={ca === c.id} onClick={() => setCa(c.id)}>{c.e} {c.l}</Pill>)}</div>
      <Lbl ch="金額與品名" /><div style={{ display: "flex", gap: 10, marginBottom: 15 }}><Inp type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" style={{ fontSize: 20, flex: 1 }} /><Inp value={it} onChange={e => setIt(e.target.value)} placeholder="買了什麼？" style={{ flex: 1.5 }} /></div>
      <Lbl ch="幣別" /><div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 15, paddingBottom: 5 }}>{allCurrs.map(c => <Pill key={c.code} active={cu === c.code} onClick={() => setCu(c.code)}>{c.code}</Pill>)}</div>
      <Lbl ch="付款方式" /><div style={{ display: "flex", gap: 10, marginBottom: 15 }}><Pill active={pm === "cash"} onClick={() => setPm("cash")}>💵 現金</Pill><Pill active={pm === "card"} onClick={() => setPm("card")}>💳 刷卡</Pill></div>
      {pm === "card" && <div style={{ marginBottom: 15 }}><Lbl ch="選擇信用卡 (計算手續費)" /><Sel value={cid} onChange={e => setCid(e.target.value)} style={{ width: "100%" }}>{cards.map(c => <option key={c.id} value={c.id}>{c.name} ({c.feeRate}%)</option>)}</Sel></div>}
      <Lbl ch="誰付錢" /><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 15 }}>{friends.map(f => <Pill key={f} active={py === f} onClick={() => setPy(f)}>{f}</Pill>)}</div>
      <Lbl ch="誰分攤" /><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 25 }}>{friends.map(f => <Pill key={f} active={sh.includes(f)} onClick={() => setSh(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}>{f}</Pill>)}</div>
      <Btn style={{ width: "100%" }} onClick={handleSave}>儲存消費</Btn>
    </Sheet>
  );
}

function AddWishSheet({ friends, onClose, onAdd }) {
  const [f, setF] = useState(friends[0]); const [it, setIt] = useState(""); const [n, setN] = useState(""); const [im, setIm] = useState(null);
  return (
    <Sheet onClose={onClose}><SHead title="許下願望" onClose={onClose} /><ImgUpload img={im} onImg={setIm} />
      <Lbl ch="委託人" /><div style={{ display: "flex", gap: 8, marginBottom: 15 }}>{friends.map(name => <Pill key={name} active={f === name} onClick={() => setF(name)}>{name}</Pill>)}</div>
      <Lbl ch="品名" /><Inp value={it} onChange={e => setIt(e.target.value)} placeholder="想買什麼？" style={{ marginBottom: 15 }} />
      <Lbl ch="備註" /><Inp value={n} onChange={e => setN(e.target.value)} placeholder="顏色、尺寸或網址" style={{ marginBottom: 20 }} />
      <Btn style={{ width: "100%" }} onClick={() => { if(!it) return; onAdd({ buyer: f, item: it, note: n, img: im }); onClose(); }}>送出願望</Btn>
    </Sheet>
  );
}

function BuyWishSheet({ wish, allCurrs, cards, onClose, onBuy }) {
  const [p, setP] = useState(""); const [c, setC] = useState("TWD"); const [cid, setCid] = useState(cards[0]?.id || "");
  return (
    <Sheet onClose={onClose}><SHead title={`購入: ${wish.item}`} onClose={onClose} />
      <Lbl ch="單價" /><Inp type="number" value={p} onChange={e => setP(e.target.value)} placeholder="0" style={{ fontSize: 24, marginBottom: 15 }} />
      <Lbl ch="幣別" /><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 15 }}>{allCurrs.map(cu => <Pill key={cu.code} active={c === cu.code} onClick={() => setC(cu.code)}>{cu.code}</Pill>)}</div>
      <Lbl ch="支付卡片" /><Sel value={cid} onChange={e => setCid(e.target.value)} style={{ width: "100%", marginBottom: 20 }}>{cards.map(ca => <option key={ca.id} value={ca.id}>{ca.name} ({ca.feeRate}%)</option>)}</Sel>
      <Btn style={{ width: "100%" }} onClick={() => { if(!p) return; onBuy(wish.id, parseFloat(p), 1, c, cid); onClose(); }}>完成購買並轉入代墊</Btn>
    </Sheet>
  );
}

// --- 7. 主 App 組件 ---
export default function App() {
  const s = useStore();
  const [tab, setTab] = useState("home");

  if (!s.activeId) return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, padding: 30 }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>✈️</div>
      <h2 style={{ fontFamily: SERIF, marginBottom: 10 }}>準備好出發了嗎？</h2>
      <p style={{ color: C.textLight, marginBottom: 30, textAlign: "center" }}>建立你的第一趟旅程，開始輕鬆管理帳務與代購。</p>
      <Btn onClick={() => { const id = uid(); s.setTrips([{ id, name: "2026 日本櫻花季", date: todayStr(), budget: 50000, expenses: [], wishlist: [], proxies: [] }]); s.setActiveId(id); }}>開啟新旅程 ✨</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", background: C.bg, minHeight: "100vh", padding: "24px 20px 100px", fontFamily: SANS, color: C.text }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 25 }}>
        <div>
          <h1 style={{ fontFamily: SERIF, fontSize: 26, margin: 0 }}>{s.active.name}</h1>
          <div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>{s.active.date} · {s.friends.join(", ")}</div>
        </div>
        <button onClick={() => setTab("settings")} style={{ background: "#fff", border: "1.5px solid #EDEBE6", width: 44, height: 44, borderRadius: 14, fontSize: 18 }}>⚙️</button>
      </header>

      <nav style={{ display: "flex", gap: 12, marginBottom: 25, overflowX: "auto", paddingBottom: 5, msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <Pill active={tab === "home"} onClick={() => setTab("home")}>🏠 總覽</Pill>
        <Pill active={tab === "list"} onClick={() => setTab("list")}>📝 支出</Pill>
        <Pill active={tab === "proxy"} onClick={() => setTab("proxy")}>💰 代墊</Pill>
        <Pill active={tab === "wish"} onClick={() => setTab("wish")}>🛍️ 代購</Pill>
      </nav>

      <main>
        {tab === "home" && <HomeTab trip={s.active} friends={s.friends} />}
        {tab === "list" && <ListTab trip={s.active} updateActive={s.updateActive} friends={s.friends} allCurrs={s.allCurrs} cards={s.cards} />}
        {tab === "proxy" && <ProxyTab trip={s.active} updateActive={s.updateActive} />}
        {tab === "wish" && <WishTab trip={s.active} friends={s.friends} allCurrs={s.allCurrs} cards={s.cards} updateActive={s.updateActive} />}

        {tab === "settings" && (
          <div style={{ background: "#fff", padding: 24, borderRadius: 28, border: "1.5px solid #EDEBE6" }}>
            <Lbl ch="旅程基本資料" />
            <Inp placeholder="旅程名稱" defaultValue={s.active.name} onBlur={e => s.updateActive({ name: e.target.value })} style={{ marginBottom: 12 }} />
            <Inp type="number" placeholder="預算 (TWD)" defaultValue={s.active.budget} onBlur={e => s.updateActive({ budget: parseFloat(e.target.value) })} style={{ marginBottom: 20 }} />
            
            <Lbl ch="旅伴管理 (以逗號分隔)" />
            <Inp defaultValue={s.friends.join(", ")} onBlur={e => s.setFriends(e.target.value.split(",").map(x => x.trim()))} style={{ marginBottom: 20 }} />
            
            <Lbl ch="自定義匯率" />
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <Inp placeholder="代碼(如 EUR)" id="new_curr_code" style={{ flex: 1 }} />
              <Inp type="number" placeholder="匯率" id="new_curr_rate" style={{ flex: 1 }} />
              <Btn sm onClick={() => {
                const c = document.getElementById("new_curr_code").value;
                const r = document.getElementById("new_curr_rate").value;
                if(c && r) s.setCustomCurrs([...s.customCurrs, { code: c, r: parseFloat(r) }]);
              }}>新增</Btn>
            </div>

            <Lbl ch="危險區域" />
            <Btn outline style={{ width: "100%", marginBottom: 12 }} onClick={() => {
              const data = JSON.stringify(localStorage);
              const blob = new Blob([data], { type: "application/json" });
              const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "travel_backup.json"; a.click();
            }}>匯出所有資料備份</Btn>
            <Btn outline color={C.red} style={{ width: "100%" }} onClick={() => { if(window.confirm("這將刪除所有旅程記錄，確定嗎？")) { localStorage.clear(); window.location.reload(); } }}>重置並清空 APP</Btn>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";

// --- 常數與工具函數 ---
const C = {
  bg: "#F9F8F6", card: "#FFFFFF", rose: "#C9A89A", roseLight: "#F0E6E1", roseMid: "#D4B8AB",
  sage: "#A8B5A2", sageLight: "#E4EBE2", sand: "#C8B89A", sandLight: "#EDE6D8",
  lav: "#B5A8C8", lavLight: "#EAE6F2", teal: "#9AB5B5", text: "#5A5A5A",
  textLight: "#8A8A7A", textFaint: "#BBBBA8", border: "#EDEBE6", borderStrong: "#DDD9D0",
  green: "#88B098", greenLight: "#E2EFE8", red: "#D4806A", redLight: "#FAE8E3"
};
const SERIF = "'Georgia', serif", SANS = "'Helvetica Neue', sans-serif";
const CATS = [
  { id: "food", e: "🍜", l: "餐飲", c: "#C9A89A" }, { id: "transport", e: "🚌", l: "交通", c: "#A8B5A2" },
  { id: "hotel", e: "🏨", l: "住宿", c: "#B5A8C8" }, { id: "shopping", e: "🛍️", l: "購物", c: "#C8B89A" },
  { id: "activity", e: "🎭", l: "體驗", c: "#9AB5B5" }, { id: "beauty", e: "💄", l: "美妝", c: "#C8A8B5" },
  { id: "other", e: "📎", l: "其他", c: "#BBBBA8" }
];
const BASE_CURRS = [
  { code: "TWD", sym: "NT$", l: "台幣", r: 1 }, { code: "JPY", sym: "¥", l: "日圓", r: 0.22 },
  { code: "KRW", sym: "₩", l: "韓圓", r: 0.024 }, { code: "CNY", sym: "¥", l: "人民幣", r: 4.38 },
  { code: "VND", sym: "₫", l: "越南盾", r: 0.00128 }, { code: "THB", sym: "฿", l: "泰銖", r: 0.91 },
  { code: "USD", sym: "$", l: "美元", r: 32.5 }
];
const PAYS = [{ id: "cash", e: "💵", l: "現金" }, { id: "card", e: "💳", l: "信用卡" }, { id: "linepay", e: "📱", l: "Line Pay" }];
const COVERS = [{ id: "a", g: "linear-gradient(135deg,#C9A89A,#D4B8AB,#C8B89A)", e: "🌸" }, { id: "b", g: "linear-gradient(135deg,#A8B5A2,#B8C8B2,#9AB5B5)", e: "🌿" }];

const fmt = n => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(Math.round(n));
const todayStr = () => new Date().toISOString().split("T")[0];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k) ?? "null") ?? d; } catch { return d; } };
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

// --- 通用 UI 組件 ---
const Lbl = ({ ch, s }) => <div style={{ fontSize: 10, color: "#BBBBA8", letterSpacing: 1.8, marginBottom: 7, fontWeight: 600, textTransform: "uppercase", ...s }}>{ch}</div>;
function Pill({ active, color = "#C9A89A", children, onClick }) { return <button onClick={onClick} style={{ padding: "7px 13px", borderRadius: 99, border: `1.5px solid ${active ? color : "#EDEBE6"}`, background: active ? color + "28" : "transparent", color: active ? color : "#8A8A7A", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: SANS, whiteSpace: "nowrap" }}>{children}</button>; }
function Inp({ style, ...p }) { return <input {...p} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid #EDEBE6", background: "#FDFCFB", fontSize: 14, color: "#5A5A5A", outline: "none", boxSizing: "border-box", fontFamily: SANS, ...style }} />; }
function Sel({ style, children, ...p }) { return <select {...p} style={{ padding: "12px 14px", borderRadius: 14, border: "1.5px solid #EDEBE6", background: "#FDFCFB", fontSize: 13, color: "#5A5A5A", outline: "none", fontFamily: SANS, cursor: "pointer", ...style }}>{children}</select>; }
function Btn({ children, color = "#C9A89A", onClick, style, outline, sm }) { return <button onClick={onClick} style={{ padding: sm ? "7px 13px" : "13px 20px", borderRadius: sm ? 12 : 16, border: outline ? `1.5px solid ${color}` : "none", background: outline ? "transparent" : color, color: outline ? color : "#fff", fontSize: sm ? 12 : 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS, ...style }}>{children}</button>; }
function Sheet({ children, onClose }) { return (<div style={{ position: "fixed", inset: 0, background: "rgba(80,70,60,0.4)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}><div style={{ width: "100%", maxWidth: 430, background: "#F9F8F6", borderRadius: "28px 28px 0 0", padding: "24px 20px 44px", maxHeight: "92vh", overflowY: "auto" }}>{children}</div></div>); }
function SHead({ title, onClose }) { return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}><h3 style={{ fontFamily: SERIF, fontSize: 18, color: "#5A5A5A", margin: 0 }}>{title}</h3><button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#BBBBA8" }}>✕</button></div>); }

function ImgUpload({ img, onImg }) {
  const handleImg = async e => { const file = e.target.files?.[0]; if (!file) return; const b64 = await compressImg(file); onImg(b64); };
  return (<label style={{ display: "block", width: "100%", marginBottom: 14, cursor: "pointer" }}>
    {img ? <div style={{ position: "relative" }}><img src={img} style={{ width: "100%", borderRadius: 16, maxHeight: 180, objectFit: "cover" }} alt="參考圖" /><button onClick={e => { e.preventDefault(); onImg(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button></div>
      : <div style={{ width: "100%", height: 100, borderRadius: 16, border: "1.5px dashed #EDEBE6", background: "#FDFCFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}><span style={{ fontSize: 24 }}>📷</span><span style={{ fontSize: 12, color: "#BBBBA8" }}>點擊上傳參考圖片</span></div>}
    <input type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }} />
  </label>);
}

// --- 資料與狀態管理 ---
function useStore() {
  const [trips, setTrips] = useState(() => lsGet("tf_trips", []));
  const [activeId, setActiveId] = useState(() => lsGet("tf_active", null));
  const [banks, setBanks] = useState(() => lsGet("tf_banks", []));
  const [cards, setCards] = useState(() => lsGet("tf_cards", []));
  const [friends, setFriends] = useState(() => lsGet("tf_friends", ["小美", "阿芸"]));
  const [customCurrs, setCustomCurrs] = useState(() => lsGet("tf_currs", []));

  useEffect(() => lsSet("tf_trips", trips), [trips]);
  useEffect(() => lsSet("tf_active", activeId), [activeId]);
  useEffect(() => lsSet("tf_banks", banks), [banks]);
  useEffect(() => lsSet("tf_cards", cards), [cards]);
  useEffect(() => lsSet("tf_friends", friends), [friends]);
  useEffect(() => lsSet("tf_currs", customCurrs), [customCurrs]);

  const allCurrs = [...BASE_CURRS, ...customCurrs];
  const active = trips.find(t => t.id === activeId) ?? null;

  const addWish = (tid, w) => {
    setTrips(prev => prev.map(t => t.id === tid ? { ...t, wishlist: [{ ...w, id: uid(), done: false }, ...(t.wishlist ?? [])] } : t));
  };

  const buyWish = (tid, wid, price, qty, currency, payment, cardId, cardsArr) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tid) return t;
      const w = (t.wishlist ?? []).find(x => x.id === wid); if (!w) return t;
      const r = allCurrs.find(c => c.code === currency)?.r ?? 1;
      const totalTWD = price * qty * r;
      const selCard = cardsArr.find(c => c.id === cardId);
      const feeTotal = selCard ? totalTWD * selCard.feeRate / 100 : 0;
      const grand = totalTWD + feeTotal;
      const proxy = { id: uid(), buyer: w.buyer, item: w.item, price, qty, currency, payment, cardId, note: w.note, img: w.img, feeTotal, totalTWD: grand, paid: false, status: 'active', date: todayStr() };
      return { ...t, wishlist: (t.wishlist ?? []).map(x => x.id === wid ? { ...x, done: true } : x), proxies: [proxy, ...(t.proxies ?? [])] };
    }));
  };

  const delProxy = (tid, pid) => {
    if (window.confirm("確定要刪除這筆代墊記錄嗎？")) {
      setTrips(prev => prev.map(t => t.id === tid ? { ...t, proxies: (t.proxies ?? []).filter(p => p.id !== pid) } : t));
    }
  };

  const cancelProxy = (tid, pid) => {
    setTrips(prev => prev.map(t => t.id === tid ? { ...t, proxies: (t.proxies ?? []).map(p => p.id === pid ? { ...p, status: 'cancelled' } : p) } : t));
  };

  const markManyProxyPaid = (tid, pids) => {
    setTrips(prev => prev.map(t => t.id === tid ? { ...t, proxies: (t.proxies ?? []).map(p => pids.includes(p.id) ? { ...p, paid: true } : p) } : t));
  };

  return { trips, activeId, setActiveId, active, banks, setBanks, cards, setCards, friends, setFriends, allCurrs, addWish, buyWish, delProxy, cancelProxy, markManyProxyPaid };
}

// --- 代墊頁簽組件 ---
function ProxyTab({ trip, onMarkPaid, onDel, onCancel }) {
  const [selPids, setSelPids] = useState([]);
  const proxies = trip.proxies ?? [];

  const toggleSel = (pid) => setSelPids(p => p.includes(pid) ? p.filter(x => x !== pid) : [...p, pid]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
        <Lbl ch="💰 代墊明細" />
        {selPids.length > 0 && <Btn sm onClick={() => { onMarkPaid(selPids); setSelPids([]); }}>勾選結清 ({selPids.length})</Btn>}
      </div>

      {proxies.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#BBBBA8", fontSize: 13 }}>尚無代墊記錄</div>}

      {proxies.map(p => (
        <div key={p.id} style={{
          background: "#fff", borderRadius: 20, padding: 16, marginBottom: 12,
          border: "1.5px solid #EDEBE6", opacity: p.status === 'cancelled' ? 0.6 : 1,
          position: "relative"
        }}>
          <div style={{ display: "flex", gap: 12 }}>
            {p.img && <img src={p.img} style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }} alt="item" />}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#5A5A5A" }}>{p.item}</span>
                {!p.paid && p.status !== 'cancelled' && (
                  <input type="checkbox" checked={selPids.includes(p.id)} onChange={() => toggleSel(p.id)} style={{ transform: "scale(1.2)" }} />
                )}
              </div>
              <div style={{ fontSize: 12, color: "#8A8A7A", marginTop: 2 }}>委託人：{p.buyer}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C9A89A", marginTop: 6 }}>
                NT$ {fmt(p.totalTWD)} 
                {p.paid && <span style={{ color: "#88B098", marginLeft: 8 }}>✓ 已貼</span>}
                {p.status === 'cancelled' && <span style={{ color: "#D4806A", marginLeft: 8 }}>已取消</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10, borderTop: "1px solid #F5F3EF", paddingTop: 10 }}>
            {!p.paid && p.status !== 'cancelled' && <button onClick={() => onCancel(p.id)} style={{ border: "none", background: "none", color: "#D4806A", fontSize: 12, cursor: "pointer" }}>取消購買</button>}
            <button onClick={() => onDel(p.id)} style={{ border: "none", background: "none", color: "#BBBBA8", fontSize: 12, cursor: "pointer" }}>刪除記錄</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- 主程式入口 (示意) ---
export default function TravelApp() {
  const { active, activeId, allCurrs, cards, friends, addWish, buyWish, delProxy, cancelProxy, markManyProxyPaid } = useStore();
  const [tab, setTab] = useState("proxy"); // 預設顯示代墊頁簽
  const [showAddWish, setShowAddWish] = useState(false);

  if (!active) return <div style={{ padding: 20 }}>請先建立旅行</div>;

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", background: C.bg, minHeight: "100vh", padding: "20px" }}>
      {/* 頁簽切換 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Pill active={tab === "proxy"} onClick={() => setTab("proxy")}>💰 代墊</Pill>
        <Pill active={tab === "wish"} onClick={() => setTab("wish")}>🛍️ 代購清單</Pill>
      </div>

      {tab === "proxy" && (
        <ProxyTab 
          trip={active} 
          onMarkPaid={(pids) => markManyProxyPaid(activeId, pids)}
          onDel={(pid) => delProxy(activeId, pid)}
          onCancel={(pid) => cancelProxy(activeId, pid)}
        />
      )}

      {/* 這裡是為了展示功能，省略了部分 WishList 的渲染細節，但邏輯已補全在 useStore */}
      <Btn onClick={() => setShowAddWish(true)} style={{ position: "fixed", bottom: 30, right: 20, borderRadius: 50, width: 60, height: 60, fontSize: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>+</Btn>
      
      {/* 彈出視窗等... */}
    </div>
  );
}

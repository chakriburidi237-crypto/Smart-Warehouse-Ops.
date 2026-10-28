/** Signal Room design reminder: controlled enterprise operations console; shift, account, and all-product signals remain explicit and accountable. */
import { useMemo, useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CheckCircle2, ChevronDown, LogIn, LogOut, MessageCircle, Package, Send, ShieldAlert, ShieldCheck, UserRound, Users, X } from "lucide-react";
import { toast } from "sonner";

export type Shift = { id: "A" | "B" | "C"; label: string; time: string; focus: string; staff: number; state: string };
export type WarehouseAccount = { id: string; name: string; initials: string; role: string; area: string; availability: "online" | "away" };

export const shiftOptions: Shift[] = [
  { id: "A", label: "Morning shift", time: "06:00–14:00", focus: "Inbound & replenishment", staff: 24, state: "Handover ready" },
  { id: "B", label: "Operations shift", time: "14:00–22:00", focus: "Fulfillment & dispatch", staff: 31, state: "Active now" },
  { id: "C", label: "Night shift", time: "22:00–06:00", focus: "Cycle count & recovery", staff: 15, state: "Scheduled" },
];

export const warehouseAccounts: WarehouseAccount[] = [
  { id: "nina", name: "Nina Torres", initials: "NT", role: "Fulfillment Lead", area: "Command desk", availability: "online" },
  { id: "nia", name: "Nia Patel", initials: "NP", role: "Picker", area: "Zone A", availability: "online" },
  { id: "leah", name: "Leah Stone", initials: "LS", role: "Inventory Controller", area: "Inbound", availability: "online" },
  { id: "kai", name: "Kai Morgan", initials: "KM", role: "Quality Inspector", area: "QC-01", availability: "away" },
  { id: "gabe", name: "Gabe Lewis", initials: "GL", role: "Dispatch Coordinator", area: "Dock D-02", availability: "online" },
];

export function ShiftControl({ shift, onChange }: { shift: Shift; onChange: (shift: Shift) => void }) {
  const [open, setOpen] = useState(false);
  const selectShift = (next: Shift) => {
    onChange(next);
    setOpen(false);
    toast.success(`${next.label} selected`, { description: `${next.focus} is now the active operations context.` });
  };
  return <div className="shift-control"><button className="shift-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="facility-dot" /><span className="shift-trigger-copy"><b>Shift {shift.id} · {shift.label}</b><small>{shift.time} · {shift.state}</small></span><ChevronDown size={14} /></button>{open && <div className="shift-menu"><div className="shift-menu-head"><span>SELECT OPERATIONS SHIFT</span><button onClick={() => setOpen(false)} aria-label="Close shift selector"><X size={13} /></button></div>{shiftOptions.map((item) => <button key={item.id} onClick={() => selectShift(item)} className={`shift-option ${item.id === shift.id ? "selected" : ""}`}><span><b>SHIFT {item.id}</b><small>{item.label} · {item.time}</small></span><em>{item.staff} staff</em></button>)}</div>}</div>;
}

export function AccountControl({ account, onSelect, onLogout }: { account: WarehouseAccount; onSelect: (account: WarehouseAccount) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const selectAccount = (next: WarehouseAccount) => { onSelect(next); setOpen(false); toast.success(`Account switched to ${next.name}`, { description: `${next.role} · ${next.area}` }); };
  return <div className="account-control"><button className="account-strip" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="avatar">{account.initials}</span><span className="account-copy">{account.name}<small>{account.role.toUpperCase()}</small></span><ChevronDown size={15} color="#94a9b1" /></button>{open && <div className="account-menu"><div className="account-menu-person"><span className="avatar">{account.initials}</span><div><b>{account.name}</b><small>{account.role.toUpperCase()} · {account.area.toUpperCase()}</small></div></div><div className="account-session"><span><i />Session protected</span><small>Local demo session</small></div><div className="account-switcher"><span>SWITCH ACCOUNT</span>{warehouseAccounts.filter((item) => item.id !== account.id).map((item) => <button key={item.id} onClick={() => selectAccount(item)}><span className="account-mini-avatar">{item.initials}</span><span><b>{item.name}</b><small>{item.role} · {item.area}</small></span><i className={item.availability} /></button>)}</div><button className="logout-button" onClick={onLogout}><LogOut size={14} />Sign out</button></div>}</div>;
}

export function LoginScreen({ onLogin }: { onLogin: (account: WarehouseAccount) => void }) {
  return <main className="login-screen"><section className="login-panel"><div className="login-brand"><img src="/manus-storage/warehouseiq-logo_32aea17c.png" alt="WarehouseIQ logo" /><span>Warehouse<em>IQ</em></span></div><span className="eyebrow">NORTHLINE FULFILLMENT · FC-01</span><h1>Choose an operations account.</h1><p>Open the warehouse control desk with the appropriate shift role and floor context.</p><div className="login-sso"><ShieldCheck size={17} /><span><b>Secure local access</b><small>Demo accounts · role and area context available</small></span></div><div className="login-accounts">{warehouseAccounts.map((account) => <button key={account.id} onClick={() => onLogin(account)}><span className="login-account-avatar">{account.initials}</span><span><b>{account.name}</b><small>{account.role} · {account.area}</small></span><LogIn size={14} /></button>)}</div><small className="login-footer">WarehouseIQ Operations Console · Version 9.0</small></section><aside className="login-aside"><div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" /><span className="eyebrow">CURRENT OPERATING CONTEXT</span><h2>Shift B is holding the priority promise.</h2><div className="login-signal"><Activity size={15} /><span><b>1 decision ready</b><small>Priority allocation requires lead approval.</small></span></div></aside></main>;
}

const productSeries = [
  { hour: "08", LUMA: 16, HELIOS: 24, ARC: 11, NOVA: 18, AERO: 9 },
  { hour: "09", LUMA: 23, HELIOS: 28, ARC: 17, NOVA: 21, AERO: 13 },
  { hour: "10", LUMA: 19, HELIOS: 31, ARC: 21, NOVA: 26, AERO: 17 },
  { hour: "11", LUMA: 29, HELIOS: 25, ARC: 19, NOVA: 32, AERO: 18 },
  { hour: "12", LUMA: 34, HELIOS: 29, ARC: 23, NOVA: 27, AERO: 22 },
  { hour: "13", LUMA: 27, HELIOS: 33, ARC: 20, NOVA: 30, AERO: 24 },
  { hour: "14", LUMA: 31, HELIOS: 36, ARC: 25, NOVA: 34, AERO: 21 },
];

const products = [
  { sku: "LUMA-200", key: "LUMA", name: "Luma task lamp", color: "#E46B35", complete: 72, onHand: 7, requirement: "Reorder 36" },
  { sku: "HELIOS-15", key: "HELIOS", name: "Helios shelf kit", color: "#28536B", complete: 91, onHand: 43, requirement: "On plan" },
  { sku: "ARC-040", key: "ARC", name: "Arc storage bin", color: "#789875", complete: 64, onHand: 18, requirement: "Watch level" },
  { sku: "NOVA-110", key: "NOVA", name: "Nova packing sleeve", color: "#B78252", complete: 96, onHand: 92, requirement: "On plan" },
  { sku: "AERO-075", key: "AERO", name: "Aero cable tie", color: "#7A6D9B", complete: 83, onHand: 55, requirement: "On plan" },
] as const;

export function AllProductsAnalytics({ shift }: { shift: Shift }) {
  const [activeProduct, setActiveProduct] = useState<(typeof products)[number]["key"] | "ALL">("ALL");
  const active = useMemo(() => products.find((item) => item.key === activeProduct), [activeProduct]);
  return <section className="all-products-section"><div className="all-products-head"><div><span className="eyebrow">Whole warehouse requirements</span><h3>All-product fulfillment performance</h3><p>Completed units by SKU for Shift {shift.id}; compare current fulfillment work against stock requirements in one operating view.</p></div><div className="product-total"><b>406</b><span>units cleared<br />this shift</span></div></div><div className="product-filter-row"><button className={activeProduct === "ALL" ? "active" : ""} onClick={() => setActiveProduct("ALL")}>All products</button>{products.map((product) => <button key={product.key} className={activeProduct === product.key ? "active" : ""} onClick={() => setActiveProduct(product.key)}><i style={{ background: product.color }} />{product.sku}</button>)}</div><div className="all-products-grid"><div className="product-chart"><ResponsiveContainer width="100%" height={260}><LineChart data={productSeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}><XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#7B867E", fontSize: 10, fontFamily: "IBM Plex Mono" }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#7B867E", fontSize: 10, fontFamily: "IBM Plex Mono" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #ddd5c9", fontFamily: "IBM Plex Mono", fontSize: 10 }} />{activeProduct === "ALL" ? products.map((product) => <Line key={product.key} type="monotone" dataKey={product.key} stroke={product.color} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />) : active && <Line type="monotone" dataKey={active.key} stroke={active.color} strokeWidth={3} dot={false} activeDot={{ r: 4 }} />}</LineChart></ResponsiveContainer></div><div className="product-requirements"><span className="eyebrow">Requirements & completion</span>{products.map((product) => <div className={`product-requirement ${activeProduct === product.key ? "selected" : ""}`} key={product.key}><span className="product-dot" style={{ background: product.color }} /><div><b>{product.sku}<small>{product.name}</small></b><div className="requirement-track"><i style={{ width: `${product.complete}%`, background: product.color }} /></div></div><div className="requirement-meta"><b>{product.complete}%</b><small>{product.onHand} on hand · {product.requirement}</small></div></div>)}</div></div><div className="analytics-footnote"><Package size={14} /><span><b>Operations requirement:</b> all five tracked SKUs are visible in the chart. LUMA-200 remains the only SKU with an open stock action for this shift.</span><CheckCircle2 size={14} /></div></section>;
}

const shiftPerformance = [
  { id: "A", shift: "Morning", throughput: 332, accuracy: 99.5, backlog: 7, exceptions: 2, handoff: "Inbound cleared" },
  { id: "B", shift: "Operations", throughput: 406, accuracy: 99.3, backlog: 11, exceptions: 3, handoff: "Dispatch peak" },
  { id: "C", shift: "Night", throughput: 284, accuracy: 98.9, backlog: 4, exceptions: 1, handoff: "Recovery ready" },
];

export function ThreeShiftPerformance({ activeShift }: { activeShift: Shift }) {
  return <section className="shift-performance"><div className="shift-performance-head"><div><span className="eyebrow">Shift handover comparison</span><h3>Performance across all three shifts</h3><p>Compare throughput, accuracy, backlog, and active exceptions to make the next shift handover an operating decision, not a guess.</p></div><span className="shift-focus-badge">VIEWING SHIFT {activeShift.id}</span></div><div className="shift-performance-grid"><div className="shift-performance-chart"><ResponsiveContainer width="100%" height={225}><BarChart data={shiftPerformance} margin={{ top: 5, right: 0, bottom: 0, left: -18 }}><XAxis dataKey="shift" axisLine={false} tickLine={false} tick={{ fill: "#7B867E", fontSize: 10, fontFamily: "IBM Plex Mono" }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#7B867E", fontSize: 10, fontFamily: "IBM Plex Mono" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #ddd5c9", fontFamily: "IBM Plex Mono", fontSize: 10 }} /><Bar dataKey="throughput" name="Units cleared" fill="#17364D" radius={[4, 4, 0, 0]} /><Bar dataKey="backlog" name="Carryover backlog" fill="#E46B35" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer><div className="shift-chart-key"><span><i />Units cleared</span><span><i />Carryover backlog</span></div></div><div className="shift-scorecards">{shiftPerformance.map((item) => <article className={`shift-score ${item.id === activeShift.id ? "active" : ""}`} key={item.id}><div><span>SHIFT {item.id} · {item.shift}</span><b>{item.throughput} <small>units</small></b></div><div className="shift-mini-metrics"><span>{item.accuracy}%<small>accuracy</small></span><span>{item.backlog}<small>backlog</small></span><span>{item.exceptions}<small>exceptions</small></span></div><p>{item.handoff}</p></article>)}</div></div><div className="shift-decision"><Users size={15} /><span><b>Handover decision:</b> Shift B clears the most units but carries the largest backlog. Shift C has the smallest recovery queue; assign its first 30 minutes to the priority allocation and QC hold.</span></div></section>;
}

type CollaborationMessage = { author: string; role: string; initials: string; time: string; text: string; kind?: "issue" | "complaint" | "lead" };

export function CollaborationChat({ onLog, activeAccount }: { onLog: (entry: { kind: "team"; status: "taken"; time: string; title: string; detail: string }) => void; activeAccount: WarehouseAccount }) {
  const [messages, setMessages] = useState<CollaborationMessage[]>([
    { author: "Nia Patel", role: "PICKER · ZONE A", initials: "NP", time: "14:21", text: "A-03 is clear. I can pick the seven available LUMA-200 units in this wave." },
    { author: "Leah Stone", role: "INVENTORY", initials: "LS", time: "14:24", text: "Inbound receipt for the remaining three units is confirmed at 14:20." },
    { author: "Nina Torres", role: "FULFILLMENT LEAD", initials: "NT", time: "14:28", text: "Approve the split shipment and revise Marlowe Market to next-day promise.", kind: "lead" },
  ]);
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"message" | "issue" | "complaint">("message");
  const submitMessage = (preset?: string, presetMode?: "issue" | "complaint") => {
    const text = preset ?? draft.trim();
    const nextMode = presetMode ?? mode;
    if (!text) return;
    const kind = nextMode === "message" ? "lead" : nextMode;
    const title = nextMode === "issue" ? "Floor issue reported" : nextMode === "complaint" ? "Customer complaint logged" : "Team message recorded";
    setMessages((current) => [...current, { author: activeAccount.name, role: activeAccount.role.toUpperCase(), initials: activeAccount.initials, time: "15:04", text, kind }]);
    onLog({ kind: "team", status: "taken", time: "15:04", title, detail: nextMode === "complaint" ? `Complaint owner: ${activeAccount.name}. ${text}` : text });
    setDraft("");
    toast.success(nextMode === "issue" ? "Floor issue escalated" : nextMode === "complaint" ? "Complaint logged" : "Message sent", { description: "The event has been added to the Decision Ledger." });
  };
  return <><div className="wms-heading"><div><span className="eyebrow">Shift collaboration & escalation</span><h2>Team chat</h2></div><p>Use standard messages for handoffs, report floor issues without leaving the task, or log a customer complaint with a clear owner and ledger record.</p></div><section className="chat-layout"><aside className="chat-channels"><span className="eyebrow">Channels</span><button className="channel active"><MessageCircle size={15} />Shift B · general <small>9</small></button><button className="channel"><Package size={15} />SO-48219 <small>3</small></button><button className="channel"><ShieldAlert size={15} />MAT-218 defect <small>2</small></button><button className="channel complaint"><MessageCircle size={15} />Customer complaints <small>1</small></button><div className="presence"><span className="eyebrow">Warehouse accounts</span>{warehouseAccounts.map((account) => <p key={account.id}><i className={account.availability === "away" ? "away" : ""} />{account.name}<small>{account.area}</small></p>)}</div></aside><article className="chat-thread"><div className="chat-thread-head"><div><span className="eyebrow">Order context · SO-48219</span><h3>Priority allocation hand-off</h3></div><span className="thread-live"><i />5 accounts</span></div><div className="message-stack">{messages.map((message, index) => <div className={`chat-message ${message.kind ?? ""}`} key={`${message.time}-${index}`}><span className="chat-avatar">{message.initials}</span><div><b>{message.author}<small>{message.role} · {message.time}</small></b>{message.kind === "issue" && <em className="message-tag issue">FLOOR ISSUE</em>}{message.kind === "complaint" && <em className="message-tag complaint">CUSTOMER COMPLAINT</em>}<p>{message.text}</p></div></div>)}</div><div className="quick-actions"><span className="eyebrow">Escalation shortcuts</span><div><button onClick={() => submitMessage("Damaged carton reported at A-03. Hold the bin for recount and inspect the next pick.", "issue")}><ShieldAlert size={12} />Report floor issue</button><button onClick={() => submitMessage("Nova Retail reported a missed delivery expectation. Review carrier hand-off and prepare a response.", "complaint")}><MessageCircle size={12} />Log customer complaint</button></div></div><div className="composer-mode"><button className={mode === "message" ? "active" : ""} onClick={() => setMode("message")}>Message</button><button className={mode === "issue" ? "active issue" : ""} onClick={() => setMode("issue")}>Issue</button><button className={mode === "complaint" ? "active complaint" : ""} onClick={() => setMode("complaint")}>Complaint</button></div><div className="chat-input"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submitMessage(); }} placeholder={mode === "issue" ? "Describe the floor issue and location…" : mode === "complaint" ? "Describe the customer or partner complaint…" : "Message the order team…"} /><button aria-label="Send message" onClick={() => submitMessage()}><Send size={15} /></button></div></article></section></>;
}

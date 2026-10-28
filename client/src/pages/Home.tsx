/** Signal Room design reminder: lead with operational decisions; use flow, coordinates, and intentional Signal Orange rather than generic dashboard decoration. */
import { useState } from "react";
import "../components/WmsExtensions.css";
import "../components/ConsoleEnhancements.css";
import {
  AccountControl,
  AllProductsAnalytics,
  CollaborationChat,
  LoginScreen,
  ShiftControl,
  ThreeShiftPerformance,
  shiftOptions,
  type Shift,
  type WarehouseAccount,
  warehouseAccounts,
} from "@/components/ConsoleEnhancements";
import {
  DecisionLedgerView,
  LedgerSnapshot,
  MaterialIssuesView,
  ShippingView,
  TeamChatView,
  TrackingView,
  type LedgerEntry,
  type LedgerLog,
} from "@/components/WmsExtensions";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Factory,
  Gauge,
  LayoutDashboard,
  ListFilter,
  MapPinned,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  Send,
  Settings2,
  ShieldAlert,
  ShipWheel,
  Sparkles,
  ScrollText,
  Truck,
  UsersRound,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";

type View = "Command Desk" | "Order Queue" | "Inventory" | "Material Issues" | "Pick & Pack" | "Shipping" | "Tracking" | "Team Chat" | "Decision Ledger" | "Dispatch" | "Analytics";

const navItems: { label: View; icon: typeof LayoutDashboard; count?: string }[] = [
  { label: "Command Desk", icon: LayoutDashboard },
  { label: "Order Queue", icon: PackageSearch, count: "8" },
  { label: "Inventory", icon: Boxes, count: "3" },
  { label: "Material Issues", icon: ShieldAlert, count: "2" },
  { label: "Pick & Pack", icon: ClipboardCheck, count: "14" },
  { label: "Shipping", icon: ShipWheel, count: "4" },
  { label: "Tracking", icon: MapPinned },
  { label: "Dispatch", icon: Truck, count: "2" },
  { label: "Team Chat", icon: MessageCircle, count: "3" },
  { label: "Decision Ledger", icon: ScrollText },
  { label: "Analytics", icon: Gauge },
];

const orders = [
  { priority: "URG", name: "Nova Retail", id: "SO-48219", sku: "LUMA-200", units: "10 units", allocation: "7 / 10", promise: "16:00", state: "At risk", kind: "urgent" },
  { priority: "HGH", name: "Swell & Co.", id: "SO-48207", sku: "HELIOS-15", units: "6 units", allocation: "6 / 6", promise: "16:30", state: "Ready", kind: "high" },
  { priority: "HGH", name: "Marlowe Market", id: "SO-48196", sku: "LUMA-200", units: "5 units", allocation: "5 / 5", promise: "Tomorrow", state: "Reserved", kind: "high" },
  { priority: "STD", name: "Aster House", id: "SO-48183", sku: "ARC-040", units: "2 units", allocation: "2 / 2", promise: "Tomorrow", state: "Ready", kind: "normal" },
];

const inventory = [
  { sku: "LUMA-200", name: "Luma task lamp", available: 7, percent: 19, status: "critical" },
  { sku: "HELIOS-15", name: "Helios shelf kit", available: 43, percent: 68, status: "healthy" },
  { sku: "ARC-040", name: "Arc storage bin", available: 18, percent: 37, status: "watch" },
];

const initialLedger: LedgerEntry[] = [
  { id: "L-184", kind: "allocation", status: "proposed", time: "14:18", title: "Priority allocation proposed for SO-48219", detail: "Seven available LUMA-200 units protect the 16:00 promise; the inbound balance is available at 14:20." },
  { id: "L-183", kind: "team", status: "taken", time: "14:28", title: "Lead approved split-shipment hand-off", detail: "Nina T. confirmed the priority split and next-day revision for Marlowe Market." },
  { id: "L-182", kind: "material", status: "proposed", time: "14:12", title: "LUMA-200 defect requires quarantine", detail: "12 incoming units from batch B-24091 are awaiting quarantine; this would trigger a safety-stock reorder." },
  { id: "L-181", kind: "shipping", status: "proposed", time: "14:04", title: "Express carrier comparison prepared", detail: "SO-48219 has insufficient SLA slack for Economy or Standard service." },
];

function ViewHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="view-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{copy}</p>
    </div>
  );
}

function CommandDesk({
  decisionResolved,
  onResolve,
  onQueue,
  ledger,
  shift,
}: {
  decisionResolved: boolean;
  onResolve: () => void;
  onQueue: () => void;
  ledger: LedgerEntry[];
  shift: Shift;
}) {
  return (
    <>
      <section className="intro-grid">
        <div className="intro-copy">
          <span className="eyebrow">Tuesday, 14 October · Shift {shift.id} · {shift.time}</span>
          <h2>Keep the promise.<br /><span className="warm">Protect the flow.</span></h2>
          <p>{shift.focus} is the operating priority. One allocation needs a decision before the 16:00 carrier cut-off; everything else is moving inside today’s plan.</p>
          <div className="intro-stats">
            <div className="stat-stack"><small>Orders in motion</small><strong>48 <span className="delta">+12%</span></strong></div>
            <div className="stat-stack"><small>Pick accuracy</small><strong>99.3%</strong></div>
            <div className="stat-stack"><small>Floor capacity</small><strong>76%</strong></div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/manus-storage/warehouse-control-visual_7f896875.jpg" alt="Organised warehouse floor with picker routes" />
          <div className="visual-chip"><span>●</span>W-01 / FULFILLMENT LIVE</div>
          <div className="visual-evidence"><b>ZONE A · LIVE VIEW</b>3 pickers · route W-26</div>
        </div>
      </section>

      <section className="flow-tape" aria-label="Order fulfillment flow">
        <div className="flow-title">Today’s<br />fulfillment flow</div>
        <div className="stage-row">
          {["Order created", "Prioritised", "Allocated", "Picking", "Packing", "Quality check", "Dispatch"].map((stage, index) => (
            <div key={stage} className={`stage ${index < 3 ? "complete" : index === 3 ? "active" : ""}`}>
              <span className="stage-dot">{index < 3 ? <Check size={10} /> : index + 1}</span><span>{stage}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`decision-ticket ${decisionResolved ? "resolved" : ""}`}>
        <div className="decision-top">
          <div style={{ display: "flex", gap: 13 }}>
            <div className="signal-icon">{decisionResolved ? <Check size={19} /> : <AlertTriangle size={19} />}</div>
            <div>
              <span className="eyebrow">{decisionResolved ? "Resolution recorded · 14:34" : "Decision required · SLA risk"}</span>
              <span className="thread-count"><MessageCircle size={11} />3 team comments</span>
              <h3 className="decision-title">
                {decisionResolved ? <>Priority allocation <span>protected</span></> : <>Protect <span>SO-48219</span> before 16:00</>}
              </h3>
              <p className="decision-copy">
                {decisionResolved
                  ? "7 available units are committed to Nova Retail. The remaining 3 are covered by inbound stock at 14:20; Marlowe Market has a transparent next-day promise."
                  : "Nova Retail needs 10 LUMA-200 units but only 7 are available. Release the lower-priority reservation, allocate the available units to the urgent order, and split-ship the inbound balance."}
              </p>
            </div>
          </div>
          <div className="decision-actions">
            {decisionResolved ? (
              <button className="button-secondary" onClick={onQueue}>View allocation record <ArrowRight size={13} /></button>
            ) : (
              <>
                <button className="button-secondary" onClick={onQueue}>Review impact</button>
                <button className="button-primary" onClick={onResolve}>Approve allocation <Check size={13} /></button>
              </>
            )}
          </div>
        </div>
        <div className="decision-math">
          <span className="math-item"><b>10</b> urgent demand</span><span className="math-arrow">→</span>
          <span className="math-item"><b>7</b> available now</span><span className="math-arrow">+</span>
          <span className="math-item"><b>3</b> inbound @ 14:20</span><span className="math-arrow">→</span>
          <span className="math-item"><b>{decisionResolved ? "SLA protected" : "1 SLA at risk"}</b></span>
        </div>
        <div className="decision-path"><span>01 Allocate</span><i /><span>02 Pick zone A</span><i /><span>03 Pack-02</span><i /><span>04 Dock-01</span></div>
        <div className="comment-thread" aria-label="Three team comments on the allocation decision">
          <div className="thread-head"><MessageCircle size={11} />Operational hand-off · 3 comments</div>
          <div className="comment-line"><span className="comment-avatar">NP</span><div className="comment-body"><b>Nia P. <small>FLOOR · 14:21</small></b><br />A-03 is clear. I can pick the seven available units in this wave.</div></div>
          <div className="comment-line"><span className="comment-avatar inventory">LS</span><div className="comment-body"><b>Leah S. <small>INVENTORY · 14:24</small></b><br />The inbound receipt for the remaining three units is confirmed for 14:20.</div></div>
          <div className="comment-line"><span className="comment-avatar lead">NT</span><div className="comment-body"><b>Nina T. <small>LEAD · 14:28</small></b><br />Approve the split shipment and revise Marlowe Market to the next-day promise.</div></div>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="surface">
          <div className="surface-head"><div><span className="eyebrow">Priority order queue</span><h3 className="section-heading">What moves next</h3></div><button className="surface-link" onClick={onQueue}>Open queue <ArrowUpRight size={13} /></button></div>
          <div className="priority-list">
            {orders.map((order) => (
              <div className="order-row" key={order.id}>
                <span className={`priority-badge ${order.kind}`}>{order.priority}</span>
                <div><div className="customer-name">{order.name}</div><div className="order-code">{order.id}</div></div>
                <div className="line-sku">{order.sku}<small>{order.units}</small></div>
                <div className={`allocation ${order.id === "SO-48219" && !decisionResolved ? "warning" : ""}`}>{order.id === "SO-48219" && decisionResolved ? "10 / 10" : order.allocation}</div>
                <div className="promise"><strong>{order.state}</strong>{order.promise}</div>
                <ChevronRight size={16} className="row-chevron" />
              </div>
            ))}
          </div>
        </div>
        <div className="right-rail">
          <div className="surface">
            <div className="surface-head"><div><span className="eyebrow">Stock monitor</span><h3 className="section-heading">Inventory radar</h3></div><Boxes size={18} color="#6d7a71" /></div>
            <div className="inventory-radar">
              {inventory.map((item) => (
                <div className="radar-row" key={item.sku}>
                  <div className="radar-line"><span className="radar-product">{item.sku}<span>{item.name}</span></span><span className={`stock-number ${item.status === "critical" ? "critical" : ""}`}>{item.available} on hand</span></div>
                  <div className="stock-track"><div className={`stock-fill ${item.status === "critical" ? "critical" : item.status === "watch" ? "warn" : ""}`} style={{ width: `${item.percent}%` }} /></div>
                </div>
              ))}
              <div className="mini-note"><b>REORDER SIGNAL:</b> LUMA-200 will breach its safety floor after SO-48219. Suggested PO: 36 units.</div>
            </div>
          </div>
          <div className="operations-clock">
            <span className="eyebrow">Carrier sequence</span><h3 className="clock-title">The dispatch clock</h3>
            <div className="deadline"><span className="deadline-time">15:30</span><span className="deadline-copy">Express carrier<small>6 orders pending quality check</small></span><i className="deadline-state orange" /></div>
            <div className="deadline"><span className="deadline-time">16:00</span><span className="deadline-copy">Priority outbound<small>SO-48219 requires resolution</small></span><i className="deadline-state orange" /></div>
            <div className="deadline"><span className="deadline-time">17:45</span><span className="deadline-copy">Ground collection<small>24 orders in safe window</small></span><i className="deadline-state green" /></div>
            <div className="clock-chain">NEXT HAND-OFF <b>→</b> PACK-02 TO DOCK D-01</div>
          </div>
          <LedgerSnapshot entries={ledger} />
        </div>
      </section>
    </>
  );
}

function OrderQueue({ decisionResolved, onResolve, qcHold }: { decisionResolved: boolean; onResolve: () => void; qcHold: boolean }) {
  return (
    <>
      <ViewHeading eyebrow="Fulfillment control" title="Order queue" copy="Ranked by promise risk, customer tier, and fulfillment readiness. Decisions remain visible alongside the work." />
      <div className="toolbar"><div className="filter-group"><button className="filter-pill active">All active · 48</button><button className="filter-pill">At risk · 1</button><button className="filter-pill">Ready to pick · 14</button><button className="filter-pill">Held · 2</button></div><button className="button-secondary"><ListFilter size={13} /> Sort: priority</button></div>
      <section className="page-grid">
        <div className="surface"><div className="surface-head"><div><span className="eyebrow">Promise-date order</span><h3 className="section-heading">Work sequence</h3></div><span className="mono" style={{ color: "#788178", fontSize: 10 }}>48 ACTIVE</span></div>
          <div className="full-list">
            {orders.concat(orders.slice(1, 3)).map((order, index) => (
              <div className="queue-card" key={`${order.id}-${index}`}>
                <div><div className="customer-name">{order.name}</div><div className="order-code">{order.id} · {order.sku} · {order.units}</div></div>
                <div className={`queue-stage ${order.id === "SO-48207" && qcHold ? "warn" : order.id === "SO-48219" && !decisionResolved ? "warn" : order.id === "SO-48196" ? "queued" : ""}`}><i className="mini-stage-dot" />{order.id === "SO-48207" && qcHold ? "QC hold" : order.id === "SO-48219" && !decisionResolved ? "Awaiting allocation" : order.id === "SO-48196" ? "Reservation held" : "Allocated"}</div>
                <div className="allocation">{order.id === "SO-48219" && decisionResolved ? "10 / 10" : order.allocation}</div>
                <div className="promise"><strong>{order.id === "SO-48207" && qcHold ? "Blocked" : order.id === "SO-48219" && !decisionResolved ? "At risk" : "On plan"}</strong>{order.promise}</div>
                <ChevronRight size={16} className="row-chevron" />
              </div>
            ))}
          </div>
        </div>
        <aside className="impact-panel"><span className="eyebrow" style={{ color: "#557158" }}>Allocation scenario</span><h3>Preserve the higher promise.</h3><p className="muted-copy">The proposed trade-off makes the service impact explicit before any stock moves.</p>
          <div className="impact-item"><div className="impact-icon"><Sparkles size={13} /></div><p><b>Nova Retail stays inside the 16:00 SLA.</b><br />7 units allocate now; 3 ship from inbound today.</p></div>
          <div className="impact-item"><div className="impact-icon"><Clock3 size={13} /></div><p><b>Marlowe Market moves by one day.</b><br />Promise is revised before their warehouse release.</p></div>
          <div className="impact-item"><div className="impact-icon"><UsersRound size={13} /></div><p><b>No picker rework required.</b><br />The active route is already in Zone A.</p></div>
          {!decisionResolved && <button className="button-primary" style={{ marginTop: 17, width: "100%" }} onClick={onResolve}>Approve recommended split <Check size={13} /></button>}
        </aside>
      </section>
    </>
  );
}

function InventoryView() {
  const skus = [
    { sku: "LUMA-200", name: "Luma task lamp", amount: 7, location: "A-03 / BIN-17", status: "critical", label: "Reorder now", width: "19%" },
    { sku: "HELIOS-15", name: "Helios shelf kit", amount: 43, location: "C-12 / BIN-04", status: "healthy", label: "Healthy", width: "68%" },
    { sku: "ARC-040", name: "Arc storage bin", amount: 18, location: "B-08 / BIN-09", status: "watch", label: "Watch", width: "37%" },
    { sku: "NOVA-110", name: "Nova packing sleeve", amount: 92, location: "P-01 / BIN-12", status: "healthy", label: "Healthy", width: "86%" },
  ];
  return <>
    <ViewHeading eyebrow="Stock health" title="Inventory radar" copy="Available, reserved, and inbound stock appear together so allocation decisions do not create invisible shortages." />
    <section className="inventory-page-grid">
      {skus.map((sku) => <article className={`sku-card ${sku.status === "critical" ? "critical" : ""}`} key={sku.sku}><span className="coord">{sku.location}</span><span className={`sku-label ${sku.status}`}>{sku.label}</span><h3>{sku.sku}</h3><p>{sku.name}</p><div className="sku-amount"><strong>{sku.amount}</strong><span>available</span></div><div className="stock-waterline"><i className={sku.status === "critical" ? "critical" : sku.status === "watch" ? "warn" : ""} style={{ width: sku.width }} /></div></article>)}
      <article className="reorder-card"><span className="eyebrow" style={{ color: "#abc0c6" }}>Replenishment recommendation</span><h3>Order 36 more LUMA-200 units.</h3><p>At current velocity, the SKU falls below its safety floor after today’s priority split. Supplier lead time remains within the 4-day threshold.</p><div className="reorder-metrics"><div><small>Safety floor</small><b>11 units</b></div><div><small>Inbound</small><b>3 @ 14:20</b></div><div><small>Lead time</small><b>4 days</b></div></div></article>
    </section>
  </>;
}

function PickPackView({ pickStarted, onStart }: { pickStarted: boolean; onStart: () => void }) {
  return <>
    <ViewHeading eyebrow="Floor execution" title="Pick & pack" copy="Routes sequence items by zone and cut-off, keeping walkers productive while leaving exceptions clear to the floor lead." />
    <section className="pick-layout">
      <article className="route-card"><img src="/manus-storage/aisle-route-visual_8f274b7b.jpg" alt="Optimised warehouse pick route" /><div className="route-overlay"><span className="eyebrow">Recommended pick wave · W-26</span><h3>Zone A becomes the next best route.</h3><p>Bundle the urgent LUMA-200 allocation with two nearby orders. This removes 126 metres of duplicate travel.</p><button className="button-primary" onClick={onStart}>{pickStarted ? <><Check size={13} />Wave released</> : <><MapPinned size={13} />Release wave</>}</button><div className="route-stops"><span className="route-stop active">A-03</span><span className="route-stop">A-07</span><span className="route-stop">PACK-02</span></div></div></article>
      <article className="task-board"><div className="surface-head"><div><span className="eyebrow">Current task board</span><h3 className="section-heading">Floor hand-off</h3></div><Factory size={18} color="#718075" /></div><div className="task-list">
        <div className="task-row"><span className="task-check working"><PackageCheck size={13} /></span><div><h4>Pick SO-48207 in Zone C</h4><p>C-12 / BIN-04 · KAI M.</p></div><span className="task-state working">IN HAND</span></div>
        <div className="task-row"><span className={`task-check ${pickStarted ? "working" : ""}`}>{pickStarted ? <PackageCheck size={13} /> : <MapPinned size={13} />}</span><div><h4>Pick SO-48219 in Zone A</h4><p>A-03 / BIN-17 · {pickStarted ? "ROUTED TO NIA P." : "RELEASE ON APPROVAL"}</p></div><span className={`task-state ${pickStarted ? "working" : ""}`}>{pickStarted ? "ROUTED" : "QUEUED"}</span></div>
        <div className="task-row"><span className="task-check"><Check size={13} /></span><div><h4>Pack SO-48175 at Station 04</h4><p>PACK-04 · GABE L.</p></div><span className="task-state">COMPLETE</span></div>
        <div className="task-row"><span className="task-check"><Check size={13} /></span><div><h4>Quality check SO-48162</h4><p>QC-01 · CASEY R.</p></div><span className="task-state">COMPLETE</span></div>
      </div></article>
    </section>
  </>;
}

function DispatchView() {
  return <>
    <ViewHeading eyebrow="Outbound control" title="Dispatch board" copy="Carrier deadlines, manifest readiness, and dock sequencing are joined in one clear shipping view." />
    <section className="dispatch-hero"><img src="/manus-storage/dispatch-visual_d67b81cd.jpg" alt="Order dispatch at a warehouse loading dock" /><div className="dispatch-copy"><span className="eyebrow" style={{ color: "#bad0d1" }}>Express collection at 15:30</span><h3>6 orders need quality checks before the van closes.</h3><p>Dock 02 has capacity for the express cage; workers are assigned and no carrier delay is forecast.</p><div className="dispatch-stat"><div><b>22 min</b><small>to manifest lock</small></div><div><b>18 / 24</b><small>orders sealed</small></div><div><b>92%</b><small>on-time forecast</small></div></div></div></section>
    <section className="manifest-table"><div className="manifest-row header"><span>Manifest</span><span>Carrier</span><span>Dock</span><span>Cut-off</span><span>Status</span></div><div className="manifest-row"><span>EXP-2148</span><span>Express</span><span>D-02</span><span>15:30</span><span className="dispatch-status loading">Loading</span></div><div className="manifest-row"><span>PRIO-602</span><span>Priority</span><span>D-01</span><span>16:00</span><span className="dispatch-status">Staged</span></div><div className="manifest-row"><span>GRD-071</span><span>Ground</span><span>D-03</span><span>17:45</span><span className="dispatch-status">Open</span></div></section>
  </>;
}

function AnalyticsView({ shift }: { shift: Shift }) {
  const values = [51, 67, 44, 76, 83, 63, 71];
  return <>
    <ViewHeading eyebrow="Operational intelligence" title="Flow analysis" copy="The operating picture focuses on throughput, not vanity metrics: where time accumulates and what intervention removes it." />
    <section className="analytics-grid"><article className="chart-card"><span className="eyebrow">Orders cleared per hour</span><h3>Throughput holds above plan.</h3><p>Today’s active shift versus a 60-order-per-hour operating target.</p><div className="bar-chart">{values.map((value, index) => <div className="bar-wrap" key={index}><div className="bar" style={{ height: `${value * 1.8}px` }} /><span>{["08", "09", "10", "11", "12", "13", "14"][index]}</span></div>)}</div></article><article className="chart-card"><span className="eyebrow">Bottleneck watch</span><h3>Minutes recoverable now</h3><div className="bottleneck-list"><div className="bottleneck"><span className="bottleneck-number">18</span><div><b>Quality-check queue</b><p>6 orders · QC-01 is highest load</p></div></div><div className="bottleneck"><span className="bottleneck-number">12</span><div><b>Duplicate aisle travel</b><p>Route W-26 removes 126 m</p></div></div><div className="bottleneck"><span className="bottleneck-number">07</span><div><b>Allocation decision</b><p>Priority stock exception pending</p></div></div></div><div className="trend-grid"><div className="trend-box"><small>Pick accuracy</small><b>99.3%</b><em>+0.4 vs plan</em></div><div className="trend-box"><small>Pack dwell</small><b>6.2m</b><em>-1.1 min</em></div></div></article></section>
    <AllProductsAnalytics shift={shift} />
    <ThreeShiftPerformance activeShift={shift} />
  </>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Command Desk");
  const [decisionResolved, setDecisionResolved] = useState(false);
  const [pickStarted, setPickStarted] = useState(false);
  const [qcHold, setQcHold] = useState(false);
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [shift, setShift] = useState<Shift>(shiftOptions[1]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [account, setAccount] = useState<WarehouseAccount>(warehouseAccounts[0]);

  const appendDecision: LedgerLog = (entry) => setLedger((current) => [{ ...entry, id: `L-${Date.now()}` }, ...current]);

  const resolveDecision = () => {
    setDecisionResolved(true);
    appendDecision({ kind: "allocation", status: "resolved", time: "14:34", title: "Priority stock allocation protected", detail: "Seven available LUMA-200 units committed to SO-48219; three inbound units will ship as the second fulfillment leg." });
    toast.success("Priority allocation recorded", { description: "7 LUMA-200 units reassigned to SO-48219; inbound balance will split-ship at 14:20." });
  };
  const startWave = () => {
    setPickStarted(true);
    appendDecision({ kind: "team", status: "taken", time: "14:36", title: "Pick wave W-26 released", detail: "Nia P. is routed through Zone A to protect the priority allocation without duplicate travel." });
    toast.success("Pick wave W-26 released", { description: "Nia P. has been routed to Zone A; the optimised sequence saves 126 metres of travel." });
  };
  const openQueue = () => setActiveView("Order Queue");

  if (!isLoggedIn) return <LoginScreen onLogin={(nextAccount) => { setAccount(nextAccount); setIsLoggedIn(true); toast.success("Signed in", { description: `Welcome back, ${nextAccount.name}. ${nextAccount.area} context is ready.` }); }} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img className="brand-mark" src="/manus-storage/warehouseiq-logo_32aea17c.png" alt="WarehouseIQ logo" /><div className="brand-name">Warehouse<em>IQ</em></div></div>
        <ShiftControl shift={shift} onChange={setShift} />
        <span className="sidebar-label">Operations</span>
        <nav className="nav-list" aria-label="Warehouse application navigation">{navItems.map((item) => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${activeView === item.label ? "active" : ""}`} onClick={() => setActiveView(item.label)}><Icon /><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}</button>; })}</nav>
        <div className="shift-note"><span className="eyebrow">Live shift status</span><strong>Calm, with one call.</strong><p>48 orders active · 76% floor capacity · 1 exception needs a lead decision.</p></div>
        <AccountControl account={account} onSelect={setAccount} onLogout={() => { setIsLoggedIn(false); toast.success("Signed out", { description: "Your local operations session has been closed." }); }} />
      </aside>

      <div className="main-panel">
        <div className="mobile-menu"><span className="mobile-brand"><img src="/manus-storage/warehouseiq-logo_32aea17c.png" alt="" />Warehouse<em style={{ color: "#e46b35", fontFamily: "DM Mono", fontSize: 10, fontStyle: "normal" }}>IQ</em></span><nav aria-label="Warehouse mobile navigation">{navItems.map((item) => { const Icon = item.icon; return <button aria-label={item.label} className={activeView === item.label ? "active" : ""} key={item.label} onClick={() => setActiveView(item.label)}><Icon size={16} /></button>; })}</nav></div>
        <header className="topbar"><div className="crumb"><h1>{activeView}</h1><span>/ NORTHLINE FC-01</span></div><div className="topbar-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={16} /></button><button className="icon-button" aria-label="Notifications"><Bell size={16} /></button><div className="clock"><span className="clock-indicator" />SHIFT {shift.id} · {shift.time}</div></div></header>
        <main className="content">
          {activeView === "Command Desk" && <CommandDesk decisionResolved={decisionResolved} onResolve={resolveDecision} onQueue={openQueue} ledger={ledger} shift={shift} />}
          {activeView === "Order Queue" && <OrderQueue decisionResolved={decisionResolved} onResolve={resolveDecision} qcHold={qcHold} />}
          {activeView === "Inventory" && <InventoryView />}
          {activeView === "Material Issues" && <MaterialIssuesView onLog={appendDecision} />}
          {activeView === "Pick & Pack" && <PickPackView pickStarted={pickStarted} onStart={startWave} />}
          {activeView === "Shipping" && <ShippingView onLog={appendDecision} />}
          {activeView === "Tracking" && <TrackingView onLog={appendDecision} />}
          {activeView === "Dispatch" && <DispatchView />}
          {activeView === "Team Chat" && <CollaborationChat onLog={appendDecision} activeAccount={account} />}
          {activeView === "Decision Ledger" && <DecisionLedgerView entries={ledger} />}
          {activeView === "Analytics" && <AnalyticsView shift={shift} />}
        </main>
      </div>
    </div>
  );
}

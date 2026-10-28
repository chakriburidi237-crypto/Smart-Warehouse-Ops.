/** Signal Room design reminder: extend the operational field desk with explicit decision evidence and traceable hand-offs. */
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDotDashed,
  Clock3,
  MessageCircle,
  PackageCheck,
  PackageX,
  Radio,
  RotateCcw,
  Send,
  ShieldAlert,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";

export type LedgerKind = "allocation" | "material" | "shipping" | "tracking" | "team";
export type LedgerStatus = "proposed" | "taken" | "resolved";
export type LedgerEntry = { id: string; kind: LedgerKind; title: string; detail: string; time: string; status: LedgerStatus };
export type LedgerLog = (entry: Omit<LedgerEntry, "id">) => void;

const kindLabel: Record<LedgerKind, string> = {
  allocation: "ALLOCATION",
  material: "MATERIAL",
  shipping: "SHIPPING",
  tracking: "TRACKING",
  team: "TEAM",
};

export function LedgerSnapshot({ entries }: { entries: LedgerEntry[] }) {
  return (
    <section className="ledger-snapshot" aria-label="Recent Decision Ledger entries">
      <div className="ledger-snapshot-head"><span className="eyebrow">Decision Ledger</span><span className="ledger-live"><i />LIVE</span></div>
      {entries.slice(0, 3).map((entry) => (
        <div className="ledger-snapshot-row" key={entry.id}>
          <span className={`ledger-kind ${entry.kind}`}>{kindLabel[entry.kind].slice(0, 3)}</span>
          <div><b>{entry.title}</b><small>{entry.time} · {entry.status}</small></div>
        </div>
      ))}
    </section>
  );
}

export function MaterialIssuesView({ onLog }: { onLog: LedgerLog }) {
  const [issues, setIssues] = useState([
    { id: "MAT-218", sku: "LUMA-200", batch: "B-24091", supplier: "Northway Electric", qty: 12, type: "Incoming defect", reportedBy: "Leah S.", status: "open", safety: true },
    { id: "MAT-207", sku: "ARC-040", batch: "B-24073", supplier: "Arcline Plastics", qty: 8, type: "Mislabeled", reportedBy: "Kai M.", status: "quarantined", safety: false },
  ]);

  const quarantine = (id: string) => {
    const issue = issues.find((item) => item.id === id);
    if (!issue) return;
    setIssues((current) => current.map((item) => item.id === id ? { ...item, status: "quarantined" } : item));
    onLog({ kind: "material", status: "taken", time: "14:38", title: `${issue.sku} batch moved to Quarantine`, detail: `${issue.qty} units from ${issue.batch} are no longer allocatable; safety-stock reorder recommendation opened.` });
    toast.success("Batch quarantined", { description: `${issue.qty} ${issue.sku} units have been removed from allocatable stock.` });
  };

  const dispose = (id: string, outcome: "return" | "released") => {
    const issue = issues.find((item) => item.id === id);
    if (!issue) return;
    setIssues((current) => current.map((item) => item.id === id ? { ...item, status: outcome } : item));
    onLog({ kind: "material", status: "resolved", time: "14:42", title: `${issue.id} disposition recorded`, detail: outcome === "return" ? `${issue.qty} units are marked for return to ${issue.supplier}.` : `${issue.qty} units were released back to allocatable stock after label verification.` });
    toast.success(outcome === "return" ? "Return to supplier recorded" : "Batch released", { description: `${issue.id} is now traceable in the Decision Ledger.` });
  };

  return (
    <>
      <div className="wms-heading"><div><span className="eyebrow">Quality & material control</span><h2>Material issues</h2></div><p>Flagging a batch moves it out of allocatable inventory immediately, then records the decision path to final disposition.</p></div>
      <section className="material-summary">
        <article className="material-summary-card critical"><span className="eyebrow">Quarantined now</span><strong>20 <small>units</small></strong><p>2 batches are excluded from allocation.</p></article>
        <article className="material-summary-card"><span className="eyebrow">Supplier defect rate</span><strong>2.8<small>%</small></strong><p>Northway Electric is above its 2.0% watch level.</p></article>
        <article className="material-reorder"><span className="eyebrow">System recommendation</span><h3>Quarantine B-24091, then raise a 36-unit LUMA-200 purchase order.</h3><p>The defect would put post-allocation stock below the 11-unit safety floor.</p></article>
      </section>
      <section className="issue-grid">
        {issues.map((issue) => (
          <article className={`issue-card ${issue.status}`} key={issue.id}>
            <div className="issue-card-top"><span className={`issue-state ${issue.status}`}>{issue.status === "open" ? "Decision required" : issue.status}</span><span className="mono">{issue.id}</span></div>
            <div className="issue-title"><span className="issue-icon"><ShieldAlert size={18} /></span><div><h3>{issue.type}</h3><p>{issue.sku} · batch {issue.batch}</p></div></div>
            <div className="issue-evidence"><div><small>Supplier</small><b>{issue.supplier}</b></div><div><small>Quantity</small><b>{issue.qty} units</b></div><div><small>Reported by</small><b>{issue.reportedBy}</b></div></div>
            {issue.safety && <div className="issue-decision"><AlertTriangle size={14} /><span><b>Allocation protection:</b> quarantine triggers a safety-stock breach, so the reorder recommendation is already staged.</span></div>}
            <div className="issue-actions">
              {issue.status === "open" && <button className="button-primary" onClick={() => quarantine(issue.id)}><PackageX size={13} />Quarantine batch</button>}
              {issue.status === "quarantined" && <><button className="button-secondary" onClick={() => dispose(issue.id, "released")}><Check size={13} />Release</button><button className="button-primary" onClick={() => dispose(issue.id, "return")}><RotateCcw size={13} />Return to supplier</button></>}
              {issue.status === "return" && <span className="resolved-note"><Check size={13} />Return label prepared</span>}
              {issue.status === "released" && <span className="resolved-note"><Check size={13} />Stock available again</span>}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export function ShippingView({ onLog }: { onLog: LedgerLog }) {
  const [assigned, setAssigned] = useState(false);
  const [consolidated, setConsolidated] = useState(false);
  const assignCarrier = () => {
    setAssigned(true);
    onLog({ kind: "shipping", status: "taken", time: "14:45", title: "Express selected for SO-48219", detail: "1.5 hours remain in the SLA window; priority tier outweighed the ₹120 cost premium over Standard." });
    toast.success("Express carrier assigned", { description: "Tracking number NX-4M82-019 has been prepared for SO-48219." });
  };
  const consolidate = () => {
    setConsolidated(true);
    onLog({ kind: "shipping", status: "taken", time: "14:46", title: "Two Northwest orders consolidated", detail: "SO-48175 and SO-48183 share a Manchester route and retain more than 4 hours of SLA slack." });
    toast.success("Manifest consolidation accepted", { description: "Estimated dispatch cost reduction: ₹86." });
  };
  return (
    <>
      <div className="wms-heading"><div><span className="eyebrow">Carrier & manifest intelligence</span><h2>Shipping decisions</h2></div><p>Every packed, QC-passed order gets a carrier choice with the service promise and trade-off made explicit.</p></div>
      <section className="shipping-decision">
        <div className="shipping-decision-copy"><span className="eyebrow">Carrier recommendation · SO-48219</span><h3>{assigned ? "Express service assigned." : "Use Express to preserve the priority promise."}</h3><p>Nova Retail has <b>1h 28m</b> remaining until its promised cut-off. Standard is lower cost, but its hand-off misses the operating window.</p><div className="shipping-evidence"><span>VIP priority</span><i>→</i><span>1h 28m SLA</span><i>→</i><span>Express service</span></div>{!assigned && <button className="button-primary" onClick={assignCarrier}><Truck size={14} />Assign Express Carrier</button>} {assigned && <span className="resolved-note"><Check size={13} />NX-4M82-019 · label ready</span>}</div>
        <div className="carrier-matrix"><span className="eyebrow">Service comparison</span><div className="carrier-row"><b>Economy</b><span>₹90</span><span>Next day</span><em>Misses SLA</em></div><div className="carrier-row"><b>Standard</b><span>₹150</span><span>4–6 hours</span><em>At risk</em></div><div className="carrier-row selected"><b>Express</b><span>₹270</span><span>90 min</span><em>Recommended</em></div></div>
      </section>
      <section className="consolidation-card"><div><span className="eyebrow">Manifest opportunity</span><h3>{consolidated ? "Northwest manifest consolidated." : "Combine two slack-time orders headed Northwest."}</h3><p>SO-48175 and SO-48183 can share the 17:45 ground manifest without moving either promise date.</p></div>{consolidated ? <span className="resolved-note"><Check size={13} />₹86 saved</span> : <button className="button-secondary" onClick={consolidate}>Accept consolidation <ArrowRight size={13} /></button>}</section>
    </>
  );
}

const trackingSequence = ["Dispatched", "In Transit", "Out for Delivery", "Delivered"] as const;
type TrackingStatus = typeof trackingSequence[number];

export function TrackingView({ onLog }: { onLog: LedgerLog }) {
  const [status, setStatus] = useState<TrackingStatus>("Dispatched");
  const [customerMode, setCustomerMode] = useState(false);
  const advance = () => {
    const position = trackingSequence.indexOf(status);
    if (position >= trackingSequence.length - 1) return;
    const next = trackingSequence[position + 1];
    setStatus(next);
    onLog({ kind: "tracking", status: next === "Delivered" ? "resolved" : "taken", time: next === "In Transit" ? "14:49" : next === "Out for Delivery" ? "15:03" : "15:18", title: `NX-4M82-019 advanced to ${next}`, detail: next === "Delivered" ? "Delivery confirmation received; fulfillment cycle is complete." : `Mock carrier checkpoint received at ${next === "In Transit" ? "Manchester sorting hub" : "Salford delivery route"}.` });
    toast.success(`Tracking updated: ${next}`);
  };
  const activeIndex = trackingSequence.indexOf(status);
  return (
    <>
      <div className="wms-heading"><div><span className="eyebrow">Post-dispatch control</span><h2>Tracking</h2></div><p>Advance mock carrier events to demonstrate how dispatch becomes delivery visibility, with every checkpoint preserved in the ledger.</p></div>
      <section className="tracking-layout">
        <article className="tracking-card"><div className="tracking-card-head"><div><span className="eyebrow">Shipment NX-4M82-019</span><h3>Nova Retail · {status}</h3></div><span className="tracking-live"><Radio size={12} />LIVE SIMULATION</span></div><div className="tracking-line">{trackingSequence.map((item, index) => <div className={`tracking-step ${index <= activeIndex ? "done" : ""} ${index === activeIndex ? "current" : ""}`} key={item}><i>{index < activeIndex ? <Check size={10} /> : index + 1}</i><b>{item}</b><small>{index === 0 ? "Dock D-01 · 14:46" : index === 1 && activeIndex >= 1 ? "Manchester hub · 14:49" : index === 2 && activeIndex >= 2 ? "Salford route · 15:03" : index === 3 && activeIndex >= 3 ? "Signed · 15:18" : "Awaiting event"}</small></div>)}</div><div className="tracking-actions">{status !== "Delivered" ? <button className="button-primary" onClick={advance}><CircleDotDashed size={13} />Advance tracking event</button> : <span className="resolved-note"><Check size={13} />Delivery recorded</span>}<button className="button-secondary" onClick={() => setCustomerMode((value) => !value)}>{customerMode ? "Hide" : "Preview"} customer view</button></div></article>
        <article className="tracking-exception"><span className="eyebrow">Exception logic</span><h3>Delayed past SLA?</h3><p>The system would draft a customer update and record the delay. A lost shipment would re-enter the allocation queue as a reshipment recommendation.</p><div className="exception-flow"><span>Carrier delay</span><i>→</i><span>Alert draft</span><i>→</i><span>Decision Ledger</span></div></article>
      </section>
      {customerMode && <section className="customer-preview"><div className="customer-brand"><img src="/manus-storage/warehouseiq-logo_32aea17c.png" alt="WarehouseIQ" /><span>Shipment status</span></div><div><span className="eyebrow">TRACKING NX-4M82-019</span><h3>Your order is {status.toLowerCase()}.</h3><p>Nova Retail order SO-48219 · updated 15 Oct, 14:49</p></div><span className="customer-status"><Check size={14} />{status}</span></section>}
    </>
  );
}

type ChatMessage = { author: string; role: string; initials: string; time: string; text: string; tone?: "lead" | "system" };

export function TeamChatView({ onLog, onQcHold }: { onLog: LedgerLog; onQcHold: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: "Nia P.", role: "PICKER · ZONE A", initials: "NP", time: "14:21", text: "A-03 is clear. I can pick the seven available LUMA-200 units in this wave." },
    { author: "Leah S.", role: "INVENTORY", initials: "LS", time: "14:24", text: "Inbound receipt for the remaining three units is confirmed at 14:20." },
    { author: "Nina T.", role: "FULFILLMENT LEAD", initials: "NT", time: "14:28", text: "Approve the split shipment and revise Marlowe Market to next-day promise.", tone: "lead" },
  ]);
  const quickAction = (template: string, text: string) => {
    setMessages((current) => [...current, { author: "Nina T.", role: "FULFILLMENT LEAD", initials: "NT", time: "14:52", text, tone: "lead" }]);
    if (template === "QC hold") onQcHold();
    onLog({ kind: "team", status: "taken", time: "14:52", title: `Quick action · ${template}`, detail: template === "QC hold" ? "QC hold raised against SO-48207; the order is blocked from shipping until inspection closes." : text });
    toast.success(`${template} recorded`, { description: "The event is now visible in the Decision Ledger." });
  };
  return (
    <>
      <div className="wms-heading"><div><span className="eyebrow">Shift collaboration</span><h2>Team chat</h2></div><p>Order and exception conversations stay attached to warehouse context; structured quick actions write directly into the Decision Ledger.</p></div>
      <section className="chat-layout"><aside className="chat-channels"><span className="eyebrow">Channels</span><button className="channel active"><MessageCircle size={15} />Shift B · general <small>9</small></button><button className="channel"><PackageCheck size={15} />SO-48219 <small>3</small></button><button className="channel"><ShieldAlert size={15} />MAT-218 defect <small>2</small></button><div className="presence"><span className="eyebrow">On shift now</span><p><i />Nia P. <small>Zone A</small></p><p><i />Leah S. <small>Inventory</small></p><p><i className="away" />Kai M. <small>Zone C</small></p></div></aside><article className="chat-thread"><div className="chat-thread-head"><div><span className="eyebrow">Order context · SO-48219</span><h3>Priority allocation hand-off</h3></div><span className="thread-live"><i />3 active</span></div><div className="message-stack">{messages.map((message, index) => <div className={`chat-message ${message.tone ?? ""}`} key={`${message.time}-${index}`}><span className="chat-avatar">{message.initials}</span><div><b>{message.author}<small>{message.role} · {message.time}</small></b><p>{message.text}</p></div></div>)}</div><div className="quick-actions"><span className="eyebrow">Structured quick actions</span><div><button onClick={() => quickAction("Need backup at bin", "Need backup at bin A-03 for the priority split pick.")}>Need backup at bin</button><button onClick={() => quickAction("Item not found", "Item not found at the nominated bin; second scan is required.")}>Item not found</button><button onClick={() => quickAction("QC hold", "QC hold raised for SO-48207 pending visual inspection.")}>QC hold</button><button onClick={() => quickAction("Ready for pickup", "SO-48219 is packed and ready for priority carrier pickup.")}>Ready for pickup</button></div></div><div className="chat-input"><span>Message the order team…</span><button aria-label="Send message"><Send size={15} /></button></div></article></section>
    </>
  );
}

export function DecisionLedgerView({ entries }: { entries: LedgerEntry[] }) {
  return <><div className="wms-heading"><div><span className="eyebrow">System reasoning record</span><h2>Decision Ledger</h2></div><p>A live operational record of what changed, why the decision was made, and which person or system action moved the workflow forward.</p></div><section className="ledger-board"><div className="ledger-board-head"><div><span className="ledger-live"><i />LIVE FEED</span><h3>Actions and reasoning</h3></div><div className="ledger-legend"><span>Proposed</span><span>Taken</span><span>Resolved</span></div></div><div className="ledger-list">{entries.map((entry) => <div className={`ledger-entry ${entry.status}`} key={entry.id}><div className="ledger-entry-meta"><span className={`ledger-kind ${entry.kind}`}>{kindLabel[entry.kind]}</span><time>{entry.time}</time></div><div className="ledger-entry-content"><h4>{entry.title}</h4><p>{entry.detail}</p></div><span className="ledger-state">{entry.status}</span></div>)}</div></section></>;
}

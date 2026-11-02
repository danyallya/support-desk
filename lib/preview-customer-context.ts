export type PreviewCustomerContext = {
  email: string;
  company: string;
  plan: string;
  lastSeen: string;
  note: string;
};

const contexts: Record<string, PreviewCustomerContext> = {
  "NS-2048": { email: "maya.chen@example.com", company: "Acme Studio", plan: "Scale", lastSeen: "Today, 9:38 AM", note: "Maya is an admin on the Acme Studio workspace. They’re preparing for a product launch next month." },
  "NS-2047": { email: "oliver.grant@example.com", company: "Northwind Labs", plan: "Growth", lastSeen: "Today, 9:24 AM", note: "Oliver manages billing for Northwind Labs and is reviewing the annual plan for next quarter." },
  "NS-2046": { email: "samira.nouri@example.com", company: "Juniper Health", plan: "Starter", lastSeen: "Today, 9:10 AM", note: "Samira coordinates workspace access for the Juniper Health team." },
  "NS-2044": { email: "theo.martin@example.com", company: "Fieldnotes", plan: "Growth", lastSeen: "Today, 8:42 AM", note: "Theo is validating the archived-record export for the Fieldnotes operations team." },
  "NS-2042": { email: "nina.patel@example.com", company: "Brightpath", plan: "Scale", lastSeen: "Today, 7:55 AM", note: "Nina administers audit access for the Brightpath workspace." },
};

export function getPreviewCustomerContext(ticketId: string): PreviewCustomerContext | null {
  return contexts[ticketId] ?? null;
}

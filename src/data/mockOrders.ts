export const mockOrders = [
  { id: "ord-3011", type: "Upgrade", status: "Complete", amount: "$120.00" },
  { id: "ord-3012", type: "Refund", status: "Pending", amount: "$38.40" },
  { id: "ord-3013", type: "Add-on", status: "Processing", amount: "$16.00" },
  { id: "ord-3014", type: "Renewal", status: "Complete", amount: "$240.00" }
] as const;

import { useMemo, useState } from "react";
import { AIState, AIRole, createAIAttributes } from "@domglyph/ai-contract";
import { DataTable } from "@domglyph/components";
import { Box, InputBase, Stack, Text } from "@domglyph/primitives";
import { MetadataPill } from "./MetadataPill";

type OrderRow = {
  id: string;
  type: string;
  status: string;
  amount: string;
};

type OrdersTableProps = {
  orders: readonly OrderRow[];
  showAIView: boolean;
};

export function OrdersTable({ orders, showAIView }: OrdersTableProps) {
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        [order.id, order.type, order.status, order.amount]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [orders, query]
  );

  return (
    <Stack gap="var(--demo-space-4)">
      <Stack gap="var(--demo-space-2)">
        <Text as="label" htmlFor="orders-filter">
          Search orders
        </Text>
        <InputBase
          id="orders-filter"
          className="input-field"
          placeholder="Filter by order id, type, status, or amount"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          {...createAIAttributes({
            id: "orders-filter",
            role: AIRole.FIELD,
            fieldType: "search",
            state: query ? AIState.IDLE : AIState.EMPTY
          })}
        />
      </Stack>

      <MetadataPill
        show={showAIView}
        title="Filter metadata"
        attributes={{
          "data-ai-id": "orders-filter",
          "data-ai-role": "field",
          "data-ai-field-type": "search"
        }}
      />

      <Box className="table-wrap">
        <DataTable
          aiId="customer-orders-table"
          entity="order"
          caption="Recent customer activity"
          rows={filteredOrders}
          columns={[
            { key: "id", header: "Order ID" },
            { key: "type", header: "Type" },
            { key: "status", header: "Status" },
            { key: "amount", header: "Amount" }
          ]}
          emptyState="No orders match the current filter."
        />
      </Box>
    </Stack>
  );
}

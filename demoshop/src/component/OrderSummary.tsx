import { Ticket } from "@/models";



interface OrderSummaryProps {
  tickets: Ticket[];
  quantities: Record<string, number>;
  totalAmount: number;
}

export function OrderSummary({ tickets, quantities, totalAmount }: OrderSummaryProps) {
  const selectedTickets = tickets.filter((ticket) => (quantities[ticket.id] || 0) > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Order Summary</h2>

      {selectedTickets.length === 0 ? (
        <p className="text-sm text-gray-500">No tickets selected</p>
      ) : (
        <div className="space-y-4">
          {/* Selected Tickets */}
          <div className="space-y-3">
            {selectedTickets.map((ticket) => {
              const qty = quantities[ticket.id];
              const subtotal = ticket.amount * qty;

              return (
                <div key={ticket.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{ticket.name}</p>
                    <p className="text-xs text-gray-500">
                      {qty} × {ticket.currency} {ticket.amount}
                    </p>
                  </div>
                  <p className="text-sm text-gray-900">AED {subtotal}</p>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-900">Total Amount</p>
            <p className="text-xl text-indigo-600">
              AED {totalAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

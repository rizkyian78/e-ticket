import type { TicketType } from '../types';

export const OrderSummary = ({
  tickets,
  quantities,
}: {
  tickets: TicketType[];
  quantities: Record<string, number>;
}) => {
  const total = tickets.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price, 0);
  return (
    <div className="space-y-3 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      {tickets.map(
        (t) =>
          quantities[t.id] > 0 && (
            <div key={t.id} className="flex justify-between text-sm">
              <span>
                {t.name} x{quantities[t.id]}
              </span>
              <span>{quantities[t.id] * t.price} AED</span>
            </div>
          )
      )}
      <div className="flex justify-between border-t pt-3 font-semibold">
        <span>Total</span>
        <span>{total} AED</span>
      </div>
    </div>
  );
};

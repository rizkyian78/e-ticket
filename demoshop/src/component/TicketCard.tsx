import type { TicketType } from '../types';

export const TicketCard = ({
  ticket,
  qty,
  onChange,
}: {
  ticket: TicketType;
  qty: number;
  onChange: (qty: number) => void;
}) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <div
      className={`h-32 rounded-lg bg-gradient-to-br ${ticket.color} flex items-center justify-center text-4xl font-bold text-white`}
    >
      {ticket.code[0]}
    </div>
    <div className="mt-4 space-y-1">
      <div className="flex justify-between">
        <h3 className="font-semibold">{ticket.name}</h3>
        <span className="rounded bg-gray-100 px-2 py-1 text-xs">{ticket.quota} left</span>
      </div>
      <p className="text-xs text-gray-500">Code: {ticket.code}</p>
      <p className="text-sm text-gray-500">{ticket.description}</p>
      <div className="flex items-center justify-between pt-2">
        <span className="font-semibold">{ticket.price} AED</span>
        <div className="flex items-center gap-2">
          <button
            data-testid={`dec-${ticket.id}`}
            onClick={() => onChange(Math.max(0, qty - 1))}
            className="btn"
          >
            -
          </button>
          <span data-testid={`qty-${ticket.id}`}>{qty}</span>
          <button
            data-testid={`inc-${ticket.id}`}
            onClick={() => onChange(qty + 1)}
            className="btn"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
);

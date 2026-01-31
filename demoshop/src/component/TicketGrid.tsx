import type { TicketType } from '../types';
import { TicketCard } from './TicketCard';

export const TicketGrid = ({
  tickets,
  quantities,
  onChange,
}: {
  tickets: TicketType[];
  quantities: Record<string, number>;
  onChange: (id: string, qty: number) => void;
}) => (
  <div className="space-y-4 rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold">Select Your Tickets</h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {tickets.map((t) => (
        <TicketCard
          key={t.id}
          ticket={t}
          qty={quantities[t.id] || 0}
          onChange={(q) => onChange(t.id, q)}
        />
      ))}
    </div>
  </div>
);

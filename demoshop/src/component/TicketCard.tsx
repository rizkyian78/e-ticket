import { Minus, Plus } from 'lucide-react';
import { Ticket } from '@/models';



interface TicketCardProps {
  ticket: Ticket;
  quantity: number;
  remainingQuota: number;
  onQuantityChange: (change: number) => void;
}

export function TicketCard({ ticket, quantity, remainingQuota, onQuantityChange }: TicketCardProps) {
  const isDisabled = remainingQuota === 0;
  const canIncrease = quantity < remainingQuota;
  const canDecrease = quantity > 0;


  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
        isDisabled ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      {/* Ticket Name */}
      <h3 className="text-lg text-gray-900 mb-2">{ticket.name}</h3>

      {/* Price */}
      <p className="text-2xl text-gray-900 mb-3">
        AED {ticket.amount}
      </p>

      {/* Remaining Quota */}
      <p className="text-sm text-gray-600 mb-4">
        {remainingQuota > 0 ? `${remainingQuota} tickets remaining` : 'Sold out'}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onQuantityChange(-1)}
          disabled={!canDecrease || isDisabled}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            canDecrease && !isDisabled
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="text-lg text-gray-900 min-w-[2rem] text-center">{quantity}</span>

        <button
          onClick={() => onQuantityChange(1)}
          disabled={!canIncrease || isDisabled}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            canIncrease && !isDisabled
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

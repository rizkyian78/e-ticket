import { InquiryResponse } from '@/model/inquiry.model';
import { User, Mail, Phone } from 'lucide-react';

export function OrderSummary({ inquiry }: { inquiry: InquiryResponse }) {
  const customerInfo = {
    name: inquiry.customer.name,
    email: inquiry.customer.email,
    phone: inquiry.customer.phoneNumber
  };


  const total = inquiry.total_amount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      {/* Customer Information */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Customer
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-gray-900 dark:text-gray-100">
              {customerInfo.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">
              {customerInfo.email}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">
              {customerInfo.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-6" />

      {/* Order Details */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Tickets
        </div>
        <div className="space-y-3">
          {inquiry.orders.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 dark:text-white">
                  {item.ticket_code} Ticket
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Quantity: {item.reserving_quota}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {formatCurrency(Number(item.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-6" />

      {/* Total */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {inquiry.currency} {total}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        All prices include applicable fees.
      </div>
    </div>
  );
}

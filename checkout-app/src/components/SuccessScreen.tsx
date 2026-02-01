import { CheckCircle2, CreditCard } from 'lucide-react';
import { PageTransition } from './PageTransition';
import { InquiryResponse } from '@/model/inquiry.model';




export function SuccessScreen({ paymentMethod, inquiry }: { paymentMethod: string, inquiry: InquiryResponse }) {
  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'creditcard':
        return 'Credit Card';
      case 'debitcard':
        return 'Debit Card';
      case 'qris':
        return 'QRIS';
      default:
        return 'Card';
    }
  };


  return (
    <PageTransition>
      <div className="w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
          Payment successful
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
          Your payment has been processed successfully
        </p>

        {/* Payment Details */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            {/* Amount */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount paid</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {inquiry.currency} {inquiry.total_amount}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Payment method</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getPaymentMethodName()}
                </span>
              </div>
            </div>

            {/* Reference ID */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reference ID</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {inquiry.reference_id}
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">

          <button onClick={() => {
            window.location.href =
              inquiry.return_url

          }} className="w-full py-3.5 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
            Return to merchant
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
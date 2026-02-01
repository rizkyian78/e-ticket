/* eslint-disable react-hooks/purity */
import { XCircle, CreditCard } from 'lucide-react';
import { PageTransition } from './PageTransition';
import { useNavigate } from 'react-router-dom';
import { InquiryResponse } from '@/model/inquiry.model';


export function FailedScreen({ inquiry }: { inquiry: InquiryResponse }) {
  const navigate = useNavigate();
  const errorMessages = [
    'Your card was declined. Please try another payment method.',
    'Insufficient funds. Please check your account balance.',
    'Payment gateway timeout. Please try again.',
    'Card verification failed. Please check your card details.'
  ];

  const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];

  return (
    <PageTransition>
      <div className="w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
          Payment failed
        </h1>

        {/* Error Message */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-red-900 dark:text-red-300 text-center">
            {randomError}
          </p>
        </div>

        {/* Error Details (Optional) */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Error code</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                ERR_{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            What you can do:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Check your card details and try again</li>
            <li>Try a different payment method</li>
            <li>Contact your bank if the issue persists</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout/" + inquiry.id)}
            className="w-full py-3.5 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Choose another payment method
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
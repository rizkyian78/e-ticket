/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, QrCode } from 'lucide-react';
import { PageTransition } from '../../components/PageTransition';
import { Breadcrumb } from '../../components/Breadcrumb';
import { InquiryResponse } from '@/model/inquiry.model';


export function QRISPayment({ inquiry }: { inquiry: InquiryResponse }) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  console.log(inquiry)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageTransition>
      <div className="w-full">
        {/* Breadcrumb */}
        <Breadcrumb currentStep="payment" />

        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Change payment method
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Scan to pay
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Open your banking or e-wallet app and scan the QR code
          </p>
        </div>

        {/* QR Code Container */}
        <div className="mb-6 p-8 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center">
          {/* QR Code Placeholder */}
          <div className="w-64 h-64 bg-white border-4 border-gray-900 rounded-lg flex items-center justify-center mb-4 relative">
            {/* Simulated QR Code Pattern */}
            <div className="absolute inset-0 p-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Corner markers */}
                <rect x="0" y="0" width="20" height="20" fill="black" />
                <rect x="80" y="0" width="20" height="20" fill="black" />
                <rect x="0" y="80" width="20" height="20" fill="black" />

                {/* Inner corner markers */}
                <rect x="4" y="4" width="12" height="12" fill="white" />
                <rect x="84" y="4" width="12" height="12" fill="white" />
                <rect x="4" y="84" width="12" height="12" fill="white" />

                {/* Pattern blocks */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <rect
                      x={Math.random() * 60 + 25}
                      y={Math.random() * 60 + 25}
                      width="4"
                      height="4"
                      fill="black"
                    />
                  </React.Fragment>
                ))}
              </svg>
            </div>

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              IDR 150,000
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time remaining</div>
            <div className={`text-lg font-medium ${timeLeft < 60 ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Waiting for payment
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          className="w-full py-3.5 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          Cancel payment
        </button>

        {/* Debug: Auto-complete button (hidden in production) */}
        <button
          className="w-full mt-3 py-2 px-4 rounded-lg text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          [Demo: Simulate payment]
        </button>
      </div>
    </PageTransition>
  );
}
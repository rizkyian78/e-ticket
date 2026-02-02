import React, { useState } from 'react';
import { CreditCard, Lock, ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useMutation } from '@tanstack/react-query';
import { submitTransaction } from '@/services/useInquiry';
import { useNavigate } from 'react-router-dom';
import { InquiryResponse } from '@/model/inquiry.model';



type CardBrand = 'visa' | 'mastercard' | 'amex' | 'jcb' | null;

const idempotentKey = crypto.randomUUID()

export function DebitCardPayment({ inquiry }: { inquiry: InquiryResponse }) {
  const navigate = useNavigate();


  const { mutate } = useMutation({
    mutationFn: (payload: unknown) => {
      return submitTransaction(payload)
    },
    onSuccess: (res) => {
      navigate(`/checkout/${inquiry.id}/transaction/${res.transaction_id}`)
    }
  })


  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand>(null);

  const detectCardBrand = (number: string): CardBrand => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^35/.test(cleaned)) return 'jcb';
    return null;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const brand = detectCardBrand(cleaned);
    setCardBrand(brand);

    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + ' / ' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvc(value);
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length >= 13 &&
    expiry.replace(/\D/g, '').length === 4 &&
    cvc.length >= 3 &&
    cardholderName.trim().length > 0;

  const getCardBrandIcon = () => {
    if (!cardBrand) return <CreditCard className="w-6 h-6 text-gray-400" />;

    const brandColors = {
      visa: '#1A1F71',
      mastercard: '#EB001B',
      amex: '#006FCF',
      jcb: '#0E4C96'
    };

    return (
      <div className="w-10 h-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: brandColors[cardBrand] }}>
          {cardBrand.toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="w-full">
        {/* Back Button */}

        <Breadcrumb currentStep="payment" />

        <button
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Change payment method
        </button>



        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Pay with Debit Card
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 pr-14 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getCardBrandIcon()}
              </div>
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM / YY"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cardholder name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <Lock className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Payments are encrypted and secure
          </span>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => {
            mutate({
              "inquiryId": inquiry.id,
              "amount": inquiry.total_amount,
              "currency": inquiry.currency,
              "paymentSource": "debitcard",
              "idempotencyKey": `PURCHASE:${idempotentKey}:debitcard`,
              "paymentSourceData": {
                "cardToken": crypto.randomUUID(), // TODO TOKENIZE CARD
                "cardNumber": cardNumber,
                "cardHolderName": cardholderName,
                "expiryMonth": expiry,
                "expiryYear": expiry,
                "cvc": cvc,
                "threeDSecure": true
              }
            })
          }}
          disabled={!isFormValid}
          className={`
            w-full py-3.5 px-4 rounded-lg font-medium transition-all
            ${isFormValid
              ? 'bg-[#635BFF] hover:bg-[#5046e5] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
        >
          Pay {inquiry.currency} {inquiry.total_amount}
        </button>
      </div>
    </PageTransition>
  );
}
import React from 'react';
import { CreditCard, Landmark, QrCode, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { PageTransition } from './PageTransition';
import { Breadcrumb } from './Breadcrumb';
import { submitTransaction } from '@/services/useInquiry';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { InquiryResponse } from '@/model/inquiry.model';

type PaymentMethod = 'creditcard' | 'debitcard' | 'qris' | null;

interface Props {
  inquiry: InquiryResponse;
  onMethodSelect: (method: PaymentMethod) => void;
}
const idempotentKey = crypto.randomUUID()

export function PaymentMethodSelection({ inquiry, onMethodSelect }: Props) {
  const navigate = useNavigate();


  const { mutate } = useMutation({
    mutationFn: (payload: unknown) => {
      return submitTransaction(payload)
    },
    onSuccess: (res) => {
      navigate(`/checkout/${inquiry.id}/qris/${res.transaction_id}`)
    }
  })
  const methods = [
    { id: 'creditcard' as const, name: 'Credit Card', icon: CreditCard },
    { id: 'debitcard' as const, name: 'Debit Card', icon: Landmark },
    { id: 'qris' as const, name: 'QRIS', icon: QrCode }
  ];

  const promoContent = {
    'creditcard': 'Pay with credit card and enjoy exclusive cashback or instant discounts from participating banks.',
    'debitcard': 'Use your debit card to get special discounts available for selected issuers.',
    'qris': 'Scan and pay with QRIS to receive instant cashback or merchant discounts.'
  };

  const [hoveredMethod, setHoveredMethod] = React.useState<PaymentMethod>(null);
  const [tempSelected, setTempSelected] = React.useState<PaymentMethod>("creditcard");
  const displayedPromo = hoveredMethod || tempSelected;

  const handleMethodClick = (method: PaymentMethod) => {

    setTempSelected(method);
  };

  const handleContinue = () => {
    if (tempSelected !== "qris") {
      onMethodSelect(tempSelected);
    }

    if (tempSelected === "qris") {
      mutate({
        "inquiryId": inquiry.id,
        "amount": inquiry.total_amount,
        "currency": inquiry.currency,
        "paymentSource": "qris",
        "idempotencyKey": `PURCHASE:${idempotentKey}:qris`,
        "paymentSourceData": {
          "cardToken": crypto.randomUUID(), // TODO TOKENIZE CARD
          "threeDSecure": true
        }
      })
    }
  };

  return (
    <PageTransition>
      <div className="w-full">
        {/* Breadcrumb */}
        <Breadcrumb currentStep="method" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Secure checkout</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Choose a payment method
          </h1>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = tempSelected === method.id;

            return (
              <button
                key={method.id}
                onClick={() => handleMethodClick(method.id)}
                onMouseEnter={() => setHoveredMethod(method.id)}
                onMouseLeave={() => setHoveredMethod(null)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-lg border transition-all
                  ${isSelected
                    ? 'border-[#635BFF] bg-[#635BFF]/5 dark:bg-[#635BFF]/10 ring-2 ring-[#635BFF]/20'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${isSelected
                      ? 'bg-[#635BFF] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </span>
                </div>
                <ChevronRight className={`
                  w-5 h-5 transition-colors
                  ${isSelected
                    ? 'text-[#635BFF]'
                    : 'text-gray-400 dark:text-gray-600'
                  }
                `} />
              </button>
            );
          })}
        </div>

        {/* Promo Section */}
        {displayedPromo && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/50 dark:border-purple-800/30 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-600 text-white">
                    Promo
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {methods.find(m => m.id === displayedPromo)?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {promoContent[displayedPromo]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Promo Footer Note */}
        {displayedPromo && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Promotions may vary by issuer and availability.
          </p>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!tempSelected}
          className={`
            w-full py-3.5 px-4 rounded-lg font-medium transition-all
            ${tempSelected
              ? 'bg-[#635BFF] hover:bg-[#5046e5] text-white shadow-sm hover:shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
import { Loader2 } from 'lucide-react';
import { PageTransition } from '../../components/PageTransition';
import { useQuery } from '@tanstack/react-query';
import { retrieveTransaction } from '@/services/useInquiry';
import { useParams } from 'react-router-dom';
import { SuccessScreen } from '@/components/SuccessScreen';
import { FailedScreen } from '@/components/FailedScreen';
import { InquiryResponse } from '@/model/inquiry.model';

export function ProcessingScreenPayment({ inquiry }: { inquiry: InquiryResponse }) {
  const { transactionId } = useParams<{
    transactionId: string;
  }>();


  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction", transactionId],
    enabled: !!transactionId, // 🚨 REQUIRED
    queryFn: () => retrieveTransaction(transactionId!),
    refetchInterval: (query) => {
      if (["SUCCESS", "FAILED"].includes(query?.state?.data?.status)) {
        return false; // 🛑 stop polling
      }
      return 2000; // poll every 2s while pending
    }
  });

  if (isLoading) {
    return <div>Loading…</div>;
  }

  if (isError) {
    return <div>Failed to load transaction</div>;
  }

  if (data?.status === "SUCCESS") {
    return (
      <SuccessScreen paymentMethod={data.payment_method} inquiry={inquiry} />
    );
  }

  if (data.status === "FAILED") {
    return <FailedScreen inquiry={inquiry} />
  }

  return (
    <PageTransition>
      <div className="w-full flex flex-col items-center justify-center py-16">
        {/* Spinner */}
        <div className="mb-6">
          <Loader2 className="w-16 h-16 text-[#635BFF] animate-spin" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
          Processing payment…
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Please do not close this page. This may take a few moments.
        </p>

        {/* Progress indicator */}
        <div className="mt-8 w-full max-w-xs">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#635BFF] rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
        </div>

        <style>{`
          @keyframes progress {
            0%, 100% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
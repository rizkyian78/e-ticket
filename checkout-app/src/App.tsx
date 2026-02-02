import { Routes, Route, useMatch } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import { CreditCardPayment } from "./pages/modules/CreditCardPayment";
import { QRISPayment } from "./pages/modules/QRISPayment";
import { DebitCardPayment } from "./pages/modules/DebitCardPayment";
import { ProcessingScreenPayment } from "./pages/modules/ProcessingScreenPayment";
import { OrderSummary } from "./components/OrderSummary";
import React from "react";
import { fetchInquiry } from "./services/useInquiry";
import { useQuery } from "@tanstack/react-query";
import { InquiryResponse } from "./model/inquiry.model";

function App() {


  const match = useMatch("/checkout/:inquiryId/*");


  const inquiryId = match?.params.inquiryId;

  console.log(inquiryId)



  const { data, isLoading } = useQuery({
    queryKey: ["inquiry", inquiryId],
    queryFn: () => fetchInquiry(inquiryId!),
    enabled: !!inquiryId,

  });



  if (isLoading) return <>LOADINGG</>


  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-start ${'opacity-100'} transition-opacity duration-150`}>
        <Routes>
          <Route path="/checkout/:inquiryId" element={<CheckoutPage inquiry={data} />} />
          <Route path="/checkout/:inquiryId/creditcard" element={<CreditCardPayment inquiry={data} />} />
          <Route path="/checkout/:inquiryId/debitcard" element={<DebitCardPayment inquiry={data} />} />
          <Route path="/checkout/:inquiryId/qris/:transactionId" element={<QRISPayment inquiry={data} />} />
          <Route path="/checkout/:inquiryId/transaction/:transactionId" element={<ProcessingScreenPayment inquiry={data} />} />
        </Routes>

        <div className="hidden lg:block lg:w-[360px]">
          <div className="sticky top-8">
            <OrderSummary inquiry={data} />
          </div>
        </div>

        <div className="lg:hidden w-full">
          <MobileOrderSummary inquiry={data} />
        </div>

      </div>

    </div>
  );
}

export default App;


function MobileOrderSummary({ inquiry }: { inquiry: InquiryResponse }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (<div className="border-t border-gray-200 dark:border-gray-800 pt-6">
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full flex items-center justify-between text-left"
    >
      <span className="font-semibold text-gray-900 dark:text-white">
        Order Summary
      </span>
      <span className="text-gray-600 dark:text-gray-400">
        {isExpanded ? '−' : '+'}
      </span>
    </button>
    {isExpanded && (
      <div className="mt-4">
        <OrderSummary inquiry={inquiry} />
      </div>
    )}
  </div>
  );
}

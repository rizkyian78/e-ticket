import { PaymentMethodSelection } from '@/components/PaymentMethodSelection';
import { InquiryResponse } from '@/model/inquiry.model';
import { useNavigate, useParams } from 'react-router-dom';

type PaymentMethod = 'creditcard' | 'debitcard' | 'qris' | null;


export default function CheckoutPage({ inquiry }: { inquiry: InquiryResponse }) {
  const navigate = useNavigate();

  const { inquiryId } = useParams()


  const handleMethodSelect = (method: PaymentMethod) => {


    navigate(`/checkout/${inquiryId}/${method}`, {

    })
  };

  // Determine if sticky summary should be shown

  // Get current page path for display


  return (

    <div className={`w-full lg:max-w-[600px] lg:mx-auto`}>
      <PaymentMethodSelection
        inquiry={inquiry}
        onMethodSelect={handleMethodSelect}
      />
    </div>
  );
}
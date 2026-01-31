import { useState } from 'react';
import { Layout } from '@/component/Layout';
import { Header } from '@/component/Header';
import { CustomerForm } from './component/CustomerForm';
import { TicketGrid } from './component/TicketGrid';
import { OrderSummary } from './component/OrderSummary';
import { PaymentInfo } from './component/PaymentInfo';
import { TICKETS } from './data/ticket';

export default function App() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [qty, setQty] = useState<Record<string, number>>({});
  const [token, setToken] = useState('tok_visa_123456');

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Demo Ticket Shop
      </h1>

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">UI pipeline working</p>
      </div>
    </div>
    // <Layout>
    //   <Header />
    //   <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    //     <div className="space-y-6 lg:col-span-2">
    //       <CustomerForm value={customer} onChange={setCustomer} />
    //       <TicketGrid
    //         tickets={TICKETS}
    //         quantities={qty}
    //         onChange={(id, q) => setQty((v) => ({ ...v, [id]: q }))}
    //       />
    //       <PaymentInfo token={token} onChange={setToken} />
    //     </div>
    //     <OrderSummary tickets={TICKETS} quantities={qty} />
    //   </div>
    // </Layout>
  );
}

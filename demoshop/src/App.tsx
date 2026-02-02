import { useEffect, useState } from 'react';
import { TicketCard } from '@/component/TicketCard';
import { OrderSummary } from '@/component/OrderSummary';
import { CheckoutForm } from '@/component/CheckoutForm';
import { CheckoutRequest, Ticket } from './models';
import dayjs from 'dayjs';
import { env } from '@/config/env';
import axios from 'axios';

export default function App() {

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    gold: 0,
    premium: 0,
    vip: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get(env.ticketServiceUrl + 'api/ticket');

      const data: Ticket[] = res.data;

      setTickets(data);

      const initialQuantities: Record<string, number> = {};
      data.forEach(ticket => {
        initialQuantities[ticket.id] = 0;
      });

      setQuantities(initialQuantities);



    };

    fetchTickets();
  }, []);

  const [isCheckingOut, setIsCheckingOut] = useState(false);



  const handleQuantityChange = (ticketId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[ticketId] ?? 0;
      const ticket = tickets.find(t => t.id === ticketId);

      if (!ticket) return prev;

      const maxQty = ticket.availableQuota;

      const newQty = Math.max(
        0,
        Math.min(currentQty + change, maxQty)
      );

      return {
        ...prev,
        [ticketId]: newQty,
      };
    });
  };

  const handleCheckout = async (formData: { name: string; email: string; phone: string }) => {
    setIsCheckingOut(true);

    const payload: CheckoutRequest = {
      amount: totalAmount.toString(),
      reference_id: `REF-${dayjs().millisecond() * 1000}`,
      currency: 'AED',
      return_url: window.location.href,
      customer: {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
      },
      order: tickets
        .filter(t => (quantities[t.id] ?? 0) > 0)
        .map(t => ({
          ticket_id: t.id,
          ticket_code: t.code,
          reserving_quota: quantities[t.id],
          amount: t.amount.toString(),
        })),
    };

    await axios.post(env.paymentServiceUrl + 'api/inquiry/submit', payload, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': env.apiKey },

    }).then(res => {

      console.log(res.data.urls.checkout)

      window.location.replace(res.data.urls.checkout);
    }).catch(err => console.error(err));



    setIsCheckingOut(false);

  };

  const totalAmount = tickets.reduce((sum, ticket) => {
    const qty = quantities[ticket.id] ?? 0;
    return sum + qty * ticket.amount;
  }, 0);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl text-gray-900">E-Ticket Purchase</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ticket Selection */}
            <section>
              <h2 className="text-xl text-gray-900 mb-6">
                Select Your Tickets
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tickets.map(ticket => {
                  const selectedQty = quantities[ticket.id] ?? 0;
                  const remainingQuota =
                    ticket.availableQuota - selectedQty;

                  return (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      quantity={selectedQty}
                      remainingQuota={remainingQuota}
                      onQuantityChange={change =>
                        handleQuantityChange(ticket.id, change)
                      }
                    />
                  );
                })}
              </div>
            </section>

            {/* Checkout */}
            <section>
              <h2 className="text-xl text-gray-900 mb-6">
                Customer Information
              </h2>

              <CheckoutForm
                onSubmit={handleCheckout}
                disabled={totalAmount === 0 || isCheckingOut}
                isLoading={isCheckingOut}
              />
            </section>
          </div>

          {/* Right - Order Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
                tickets={tickets}
                quantities={quantities}
                totalAmount={totalAmount}
              />
            </div>
          </div>
        </div>

        {/* Mobile Order Summary */}
        <div className="lg:hidden mt-8">
          <OrderSummary
            tickets={tickets}
            quantities={quantities}
            totalAmount={totalAmount}
          />
        </div>
      </main>
    </div>
  );
}

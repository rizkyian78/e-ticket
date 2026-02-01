export interface Ticket {
    id: string;
    code: string;
    name: string;
    price: number;
    quota: number;
    amount: number;
    currency: string;
    availableQuota: number;
  }


  export interface CheckoutRequest {
    amount: string;
    reference_id: string;
    currency: string;
    return_url: string;
    customer: Customer;
    order: OrderItem[];
  }
  
  export interface Customer {
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface OrderItem {
    ticket_id: string;
    ticket_code: string;
    reserving_quota: number;
    amount: string;
  }
  
  export type PaymentSource = 'VA' | 'EWALLET' | 'CARD';
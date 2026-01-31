export type TicketType = {
  id: string;
  name: string;
  code: string;
  price: number;
  quota: number;
  description: string;
  color: string;
};

export type Customer = {
  name: string;
  email: string;
  phone?: string;
};

export type OrderItem = {
  ticketId: string;
  qty: number;
};

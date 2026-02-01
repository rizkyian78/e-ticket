export interface InquiryResponse {
    id: string;
    user_id: string | null;
    ticket_id: string | null;
    reference_id: string;
    locked_amount: string;   // API sends string
    currency: string;
    total_amount: string;    // API sends string
    return_url: string;
    status: InquiryStatus;
    customer: Customer;
    orders: Order[];
    created_at: string;      // ISO datetime
    expired_at: string;      // ISO datetime
    updated_at: string;      // ISO datetime
  }
  
  export type InquiryStatus =
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "EXPIRED"
    | "CANCELLED";
  
  export interface Customer {
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface Order {
    amount: string;          // API sends string
    ticket_id: string;
    ticket_code: string;
    reserving_quota: number;
  }
  
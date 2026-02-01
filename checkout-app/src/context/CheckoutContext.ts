import { createContext, useContext } from "react";

export interface CheckoutData {
    inquiryId: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    tickets: Array<{
        name: string;
        qty: number;
        price: number;
    }>;
    total: number;
}

const CheckoutContext = createContext<CheckoutData | null>(null);

export const useCheckout = () => {
    const ctx = useContext(CheckoutContext);
    if (!ctx) {
        throw new Error("useCheckout must be used inside CheckoutProvider");
    }
    return ctx;
};

export const CheckoutProvider = CheckoutContext.Provider;

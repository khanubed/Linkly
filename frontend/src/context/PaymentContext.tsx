import axios from "axios";
import { createContext } from "react";

export const PaymentContext = createContext<any>(null);

export const PaymentProvider = ({ children }: any) => {
    
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (plan: "pro" | "business") => {
    const { data } = await axios.post("/api/payment/create-order", { plan });
    return data;
  };

  const verifyPayment = async (payload: any) => {
    const { data } = await axios.post("/api/payment/verify", payload);
    return data;
  };

  return (
    <PaymentContext.Provider value={{ loadRazorpay, createOrder, verifyPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

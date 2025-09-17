"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayButton({ price = "5.00", onSuccess }) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [{ amount: { value: price } }],
          })
        }
        onApprove={async (data, actions) => {
          await actions.order.capture();
          onSuccess(); // unlock export/deploy
        }}
      />
    </PayPalScriptProvider>
  );
}

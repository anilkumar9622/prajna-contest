'use client';

import Swal from "sweetalert2";

const showMessage = (msg = '', type = 'success') => {
  const toast: any = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: 'toast', popup: 'small-toast' },
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const createOrder = async (amount: number) => {
  const response = await fetch('/api/payment/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100 }),
  });
  if (!response.ok) throw new Error('Order creation failed');
  return await response.json();
};

const verifyPayment = async (paymentData: any) => {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) throw new Error('Payment verification failed');
  return await response.json();
};

export async function startRazorpayPayment({
  amount,
  userId,
  customerInfo,
  onSuccess,
  onFailure,
}: {
  amount: number;
  userId: string;
  customerInfo?: { name?: string; email?: string; contact?: string };
  onSuccess?: (res: any) => void;
  onFailure?: (err: any) => void;
}) {
  try {
    if (amount <= 0) {
      showMessage("Invalid amount!", "error");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error("Razorpay SDK failed to load.");

    const orderData = await createOrder(amount);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'PRAJÑĀ CONTEST 2026',
      description: 'Registration Payment',
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const result = await verifyPayment({
            ...response,
            user_id: userId,
            amount: orderData.amount,
            email: customerInfo?.email || "",
            userDetails: customerInfo,
          });

          if (result.success) {
            showMessage("Payment successful!", "success");
            onSuccess?.(result);
          } else {
            showMessage("Payment verification failed!", "error");
            onFailure?.(result);
          }
        } catch (err) {
          showMessage("Payment verification failed!", "error");
          onFailure?.(err);
        }
      },
      prefill: {
        name: customerInfo?.name || '',
        email: customerInfo?.email || '',
        contact: customerInfo?.contact || '',
      },
      theme: { color: "#493f8f" },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (err: any) => {
      showMessage("Payment failed! " + err.error.description, "error");
      onFailure?.(err);
    });

    rzp.open();
  } catch (err) {
    showMessage("Payment initialization failed!", "error");
    onFailure?.(err);
  }
}

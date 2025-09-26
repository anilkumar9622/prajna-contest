import { useState } from "react";

export default function SendEmailPage() {
  const [status, setStatus] = useState("");

  const handleSendEmail = async () => {
    setStatus("Sending...");

    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "anilchauhan.src@gmail.com",
        subject: "Payment Successful",
        message: "Thank you for your payment! Your transaction was successful.",
      }),
    });

    const data = await res.json();
    console.log(data);
    setStatus(data.message);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Send Test Email</h1>
      <button
        onClick={handleSendEmail}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Email
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

import EmailTemplate from "@/lib/emailTemplate/template";
import { useState } from "react";

export default function SendEmailPage() {
  const [status, setStatus] = useState("");

  const handleSendEmail = async () => {
    setStatus("Sending...");

    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "anilkumar.202pr@gmail.com",
        subject: "Registraion Successful: Prajna Contest 2026",
        message: EmailTemplate({
          name: "Anil Kumar",
          amount: 199.99,
          transactionId: "TXN123456",
          supportEmail: "support@bace.org.in",
          paymentMode:""
        }),
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

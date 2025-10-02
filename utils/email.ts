export interface EmailPayload {
  to: string;
  subject: string;
  message: string;
}

export const sendEmail = async ({ to, subject, message }: EmailPayload) => {
  try {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send email");
    }

    console.log("📧 Email API Response:", data);
    return { success: true, message: data.message || "Email sent successfully!" };
  } catch (error: any) {
    console.error("❌ Email sending failed:", error);
    return { success: false, message: error.message || "Failed to send email" };
  }
};

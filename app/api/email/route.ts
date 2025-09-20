import { sendEmail } from "../../../lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;

    await sendEmail({ to, subject, message });

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Email send error:", error);

    return new Response(
      JSON.stringify({ message: "Failed to send email", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

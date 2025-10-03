import { sendEmail } from "../../../lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;

    let res:any = await sendEmail({ to, subject, message });

    // console.log({res}, ">>>>")
    if (res?.success) {
      res = new Response(
        JSON.stringify({ message: "Email sent successfully!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }else{
       res = new Response(
        JSON.stringify({ message: res?.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return res;
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

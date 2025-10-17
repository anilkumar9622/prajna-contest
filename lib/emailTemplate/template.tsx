// components/EmailTemplate.jsx
import React from "react";

interface EmailTemplateProps {
  name?: string; // default "User"
  transactionId: string;
  amount: number | string;
  supportEmail?: string;
  logoUrl?: string; 
  themeColor?: string; 
  paymentMode: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name = "User",
  transactionId,
  amount,
  supportEmail = "support@example.com",
  logoUrl = "https://bace.org.in/assets/image/main-data/bace_logo-min.png",
  themeColor = "#493f8f",
  paymentMode = ""
}: EmailTemplateProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Successful</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 30px;
          text-align: center;
          margin: 20px auto;
        }
        .logo {
          max-width: 120px;
          margin-bottom: 20px;
        }
        h1 {
          color: ${themeColor};
          font-size: 22px;
          margin-bottom: 16px;
        }
        p {
          line-height: 1.6;
          font-size: 15px;
          color: #333; /* ✅ fixed for standard theme visibility */
          margin: 8px 0;
        }
        .button {
          display: inline-block;
          margin: 20px 0;
          padding: 12px 24px;
          font-size: 16px;
          color: #fff;
          background-color: ${themeColor};
          border-radius: 5px;
          text-decoration: none;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
        .query-txt {
          font-size: 13px;
        } 
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${logoUrl}" alt="Logo" class="logo" />
        <h1>Thank You, ${name}!</h1>
        <p>Your payment of <strong>&#8377; ${amount}</strong> was successful.</p>
        <p>Payment Mode: <strong>${paymentMode}</strong></p>
        <p>Your registration is now complete.</p>
       
        <a href="mailto:${supportEmail}" class="button">Contact Support</a>
         <p class="query-txt">If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} BACE. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export default EmailTemplate;

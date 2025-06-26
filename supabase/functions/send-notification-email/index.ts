
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  message: string;
  deviceName: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, deviceName, userName }: NotificationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Good Family <onboarding@resend.dev>",
      to: [to],
      subject: "Notifikasi Monitoring Keluarga",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Notifikasi Monitoring Keluarga</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Pengguna:</strong> ${userName}</p>
            <p><strong>Perangkat:</strong> ${deviceName}</p>
            <p><strong>Pesan:</strong> ${message}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Pesan ini dikirim dari sistem monitoring Good Family
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

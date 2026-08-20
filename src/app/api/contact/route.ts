import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Wire Resend / SMTP later. For now acknowledge + log server-side.
    console.info("[contact]", {
      to: process.env.CONTACT_TO_EMAIL ?? "hello@marchve.com",
      ...data,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }
}

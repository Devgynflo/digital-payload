import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";
import type { InitOptions } from "payload/config";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// nodemailer config
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export async function getPayloadClient({
  initOptions,
}: Args = {}): Promise<Payload> {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error(
      "Something went wrong with payload server , payload secret is missing",
    );
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromAddress: "onboarding@resend.dev",
        fromName: "DigitalHippo",
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
}

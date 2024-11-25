import { serve } from "@novu/framework/next";
import { paidRequest, trialRequest } from "@/novu/workflows";
import { Client } from "@novu/framework";

const client = new Client({
  secretKey: process.env.NOVU_SECRET_KEY,
  strictAuthentication: false, // set to true by default
});

export const { GET, POST, OPTIONS } = serve({
  client,
  workflows: [paidRequest, trialRequest],
});

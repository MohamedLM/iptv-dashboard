import { Hono } from "hono";
import { handle } from "hono/vercel";
import chartRoute from "./chart";
import importOrderRoute from "./importOrders";
import commonRequest from "./common";
import orderRequest from "./order";
import webhooks from "./webhooks";

const app = new Hono().basePath("/api");

app.route("/chart", chartRoute);
app.route("/import-orders", importOrderRoute);
app.route("/orders", orderRequest);
app.route("/webhooks", webhooks);
app.route("/", commonRequest);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);

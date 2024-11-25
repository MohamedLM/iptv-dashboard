import { auth } from "@/auth";
import { getChartData } from "@/libs/timeseries";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import toInteger from "lodash/toInteger";
import { getCustomerTimeline } from "@/libs/customer";

const app = new Hono();

app.use(async (c, next) => {
  const session = await auth();
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized!" });
  }
  await next();
});

app.get("/", async (c) => {
  const from = c.req.query("from");
  const to = c.req.query("to");
  const site = c.req.query("site");
  const data = await getChartData(from!, to!, site);
  return c.json(data);
});

app.get("/customer", async (c) => {
  const id = c.req.query("id");
  if (!id) throw new Error("Invalid customer id");

  const data = await getCustomerTimeline(id!);
  return c.json(data);
});

export default app;

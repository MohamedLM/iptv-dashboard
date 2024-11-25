import { auth } from "@/auth";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { getNextTagOptions } from "@/libs/tag";
import { map } from "lodash";
import { getEmailTemplateOptions } from "@/libs/email-templates";

const app = new Hono();

app.use(async (c, next) => {
  const session = await auth();
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized!" });
  }
  await next();
});

app.get("/tags", async (c) => {
  const search = c.req.query("s");
  const cursor = c.req.query("cursor");

  const results = await getNextTagOptions('customer', search, cursor, 1000);
  return c.json(results);
});

app.get("/email-template-options", async (c) => {
  const result = await getEmailTemplateOptions();
  return c.json(result);
})

export default app;

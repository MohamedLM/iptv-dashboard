import { auth } from "@/auth";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { sleep } from "@/utils/common";
import camelCase from "lodash/camelCase";
import mapKeys from "lodash/mapKeys";
import map from "lodash/map";
import { z } from "zod";
import get from "lodash/get";
import { upsertSiteCustomer } from "@/libs/customer";
import { createPaidOrderForCustomer } from "@/libs/order";
import { requestOrderSchema } from "./order";
import { toInteger } from "lodash";

const requestImportSchema = z.object({
  orderNumber: z.string(),
  orderStatus: z.string(),
  orderDate: z.string(),
  customerNote: z.string().optional(),
  firstNameBilling: z.string().optional(),
  lastNameBilling: z.string().optional(),
  companyBilling: z.string().optional(),
  address12Billing: z.string().optional(),
  cityBilling: z.string().optional(),
  stateCodeBilling: z.string().optional(),
  postcodeBilling: z.string().optional(),
  countryCodeBilling: z.string().optional(),
  emailBilling: z.string(),
  phoneBilling: z.string().optional(),
  firstNameShipping: z.string().optional(),
  lastNameShipping: z.string().optional(),
  address12Shipping: z.string().optional(),
  cityShipping: z.string().optional(),
  stateCodeShipping: z.string().optional(),
  postcodeShipping: z.string().optional(),
  countryCodeShipping: z.string().optional(),
  paymentMethodTitle: z.string().optional(),
  cartDiscountAmount: z.string().optional(),
  orderSubtotalAmount: z.string().optional(),
  shippingMethodTitle: z.string().optional(),
  orderShippingAmount: z.string().optional(),
  orderRefundAmount: z.string().optional(),
  orderTotalAmount: z.string().optional(),
  orderTotalTaxAmount: z.string().optional(),
  sku: z.string().optional(),
  item: z.string().optional(),
  itemName: z.string().optional(),
  quantityRefund: z.string().optional(),
  itemCost: z.string().optional(),
  couponCode: z.string().optional(),
  discountAmount: z.string().optional(),
  discountAmountTax: z.string().optional(),
});

const app = new Hono();

app.use(async (c, next) => {
  const session = await auth();
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized!" });
  }
  await next();
});

app.post("/", async (c) => {
  const siteId = c.req.header("X-Site-Id");
  const body = await c.req.json();
  if (!siteId) {
    throw new Error("Invalid site id");
  }

  const results = await Promise.allSettled(
    map(body, async (orderData) => {
      const camelCasesBody = mapKeys(orderData, (v, k) => camelCase(k));
      const firstName = get(camelCasesBody, ["firstNameBilling"], "");
      const lastName = get(camelCasesBody, ["lastNameBilling"], "");
      const _data = {
        name: [firstName, lastName].join(" "),
        email: get(camelCasesBody, ["emailBilling"]),
        phone: get(camelCasesBody, ["phoneBilling"]),
        country: get(camelCasesBody, ["countryCodeBilling"]),
        productName: get(camelCasesBody, ["itemName"]),
        notes: get(camelCasesBody, ["customerNote"]),
        amount: get(camelCasesBody, ["orderTotalAmount"]),
        currency: get(camelCasesBody, ["currency"], "USD"),
        orderId: get(camelCasesBody, ["orderNumber"]),
        status: get(camelCasesBody, ["orderStatus"]),
        orderDate: get(camelCasesBody, ["orderDate"]),
        duration: toInteger(get(camelCasesBody, ["duration"], 0)),
      };

      const data = requestOrderSchema.parse(_data);

      const customer = await upsertSiteCustomer(siteId, data);
      if (!customer?.id) {
        throw new Error("Failed to create customer");
      }

      const dbData = {
        ...data,
        duration: 0,
        metadata: {
          rawBody: orderData,
        },
      };
      const result = await createPaidOrderForCustomer(
        siteId,
        customer.id,
        dbData
      );
      // console.log("result", result);

      return result;
    })
  );

  return c.json({
    success: true,
    results,
  });

  // const firstName = get(camelCasesBody, ["firstNameBilling"], "");
  // const lastName = get(camelCasesBody, ["lastNameBilling"], "");
  // const data = {
  //   name: [firstName, lastName].join(" "),
  //   email: get(camelCasesBody, ["emailBilling"]),
  //   phone: get(camelCasesBody, ["phoneBilling"]),
  //   country: get(camelCasesBody, ["countryCodeBilling"]),
  //   productName: get(camelCasesBody, ["itemName"]),
  //   notes: get(camelCasesBody, ["customerNote"]),
  //   amount: get(camelCasesBody, [""]),
  //   currency: get(camelCasesBody, [""]),
  //   orderId: get(camelCasesBody, [""]),
  //   status: get(camelCasesBody, [""]),
  //   orderDate: get(camelCasesBody, [""]),
  //   duration: get(camelCasesBody, [""]),
  // };

  // await sleep(1000);
  // return c.json({
  //   oke: true,
  //   data,
  //   camelCasesBody,
  //   body
  // });
});

export default app;

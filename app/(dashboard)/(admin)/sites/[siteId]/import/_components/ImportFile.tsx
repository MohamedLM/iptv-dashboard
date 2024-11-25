"use client";
import Papa, { ParseResult } from "papaparse";
import { useState } from "react";
import TableData from "./TableData";
import map from "lodash/map";
import Link from "next/link";

const defaultValue = {
  "Order Number": "",
  "Order Status": "",
  "Order Date": "",
  "Customer Note": "",
  "First Name (Billing)": "",
  "Last Name (Billing)": "",
  "Company (Billing)": "",
  "Address 1&2 (Billing)": "",
  "City (Billing)": "",
  "State Code (Billing)": "",
  "Postcode (Billing)": "",
  "Country Code (Billing)": "",
  "Email (Billing)": "",
  "Phone (Billing)": "",
  "First Name (Shipping)": "",
  "Last Name (Shipping)": "",
  "Address 1&2 (Shipping)": "",
  "City (Shipping)": "",
  "State Code (Shipping)": "",
  "Postcode (Shipping)": "",
  "Country Code (Shipping)": "",
  "Payment Method Title": "",
  "Cart Discount Amount": "",
  "Order Subtotal Amount": "",
  "Shipping Method Title": "",
  "Order Shipping Amount": "",
  "Order Refund Amount": "",
  "Order Total Amount": "",
  "Order Total Tax Amount": "",
  SKU: "",
  "Item #": "",
  "Item Name": "",
  "Quantity (- Refund)": "",
  "Item Cost": "",
  "Coupon Code": "",
  "Discount Amount": "",
  "Discount Amount Tax": "",
};

export default function ImportFile({ siteId }: { siteId: string }) {
  const [jsonData, setJsonData] = useState<any[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (results: ParseResult<any>) => {
          const filteredData = map(results.data, (data) => {
            return {
              ...defaultValue,
              ...data,
            };
          }).filter((d) => d["Order Number"]);

          setJsonData(filteredData);
          console.log("filteredData", filteredData);
        },
        header: true, // Set to true if the first row contains headers
      });
    }
  };

  return jsonData === null ? (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-default-400 text-default-500 bg-content2"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span>
          </p>
          <p className="text-xs">Allowed type is .csv</p>
          <p className="text-xs text-primary mt-4"><Link href={`/sample-order-data.csv`} target="_blank">Download sample data</Link></p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  ) : (
    <TableData siteId={siteId} data={jsonData} onReset={() => setJsonData(null)} />
  );
}

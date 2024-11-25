import { notFound } from "next/navigation";

export default function NotAllowed() {
  // TODO: Custom error for not allowed page.
  return notFound();
}

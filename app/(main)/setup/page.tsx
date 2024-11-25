import { createUser } from "@/libs/user";

export default async function Setup() {
  const user = await createUser({
    name: "Admin",
    email: "admin",
    password: "admin",
    role: "admin",
  }).catch(() => {});
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

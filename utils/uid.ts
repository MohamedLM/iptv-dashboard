import ShortUniqueId from "short-unique-id";

const { randomUUID } = new ShortUniqueId({ length: 10 });

export const generateId = () => randomUUID();

export const generateNumberId = () => {
  const now = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${now}${random}`;
};

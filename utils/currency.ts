export const nFormat = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

export const formatCurrency = (amount: number) => {
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return USD.format(amount);
};

export const formatPrice = (amount: number | string) => {
  const validAmount = amount || 0;
  return validAmount.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

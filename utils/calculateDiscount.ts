export const calculateDiscount = (price: number, sales_price: number) => {
  const discount = ((price - sales_price) / price) * 100;

  return Math.round(discount);
};

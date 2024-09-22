export const init = (account_id) => {
  if (!window || !window.PostAffTracker) {
    return;
  }

  window.PostAffTracker.setAccountId(account_id);
};

export const track = () => {
  if (!window || !window.PostAffTracker) {
    return;
  }

  try {
    window.PostAffTracker.track();
  } catch (err) {}
};

export const createSale = ({ price, ids, order_id, coupon_code }) => {
  if (!window || !window.PostAffTracker) {
    return;
  }

  var sale = window.PostAffTracker.createSale();

  if (!sale) {
    return;
  }

  sale.setTotalCost(price);
  sale.setProductID(ids.join("-"));
  sale.setOrderID(order_id);
  sale.setCoupon(coupon_code);

  window.PostAffTracker.register();
};

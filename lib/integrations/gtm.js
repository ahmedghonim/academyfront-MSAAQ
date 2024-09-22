export const pageview = (url) => {
  if (!window || !window.dataLayer) {
    return;
  }

  window.dataLayer.push({
    event: "Pageview",
    page: url
  });
};

export const event = (action, payload = {}) => {
  if (!window || !window.dataLayer) {
    return;
  }

  window.dataLayer.push({
    event: action,
    eventModel: payload
  });
};

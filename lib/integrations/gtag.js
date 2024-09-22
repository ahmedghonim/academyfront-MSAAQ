// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url, tracking_id) => {
  if (!window || !window.gtag) {
    return;
  }

  window.gtag("config", tracking_id, {
    page_path: url
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action, { category, label, value }) => {
  if (!window || !window.gtag) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

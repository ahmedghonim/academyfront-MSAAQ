export const pageview = () => {
  if (!window || !window.fbq) {
    return;
  }

  window.fbq("track", "PageView");
};

export const init = (tracking_id, memberData) => {
  if (!window || !window.fbq) {
    return;
  }

  window.fbq("init", tracking_id, memberData);
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  if (!window || !window.fbq) {
    return;
  }

  window.fbq("track", name, options);
};

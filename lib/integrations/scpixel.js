export const pageview = () => {
  if (!window || !window.snaptr) {
    return;
  }

  window.snaptr("track", "PAGE_VIEW");
};
export const init = (tracking_id, memberData) => {
  if (!window || !window.snaptr) {
    return;
  }

  window.snaptr("init", tracking_id, memberData);
};
export const event = (name, options = {}) => {
  if (!window || !window.snaptr) {
    return;
  }

  window.snaptr("track", name, options);
};

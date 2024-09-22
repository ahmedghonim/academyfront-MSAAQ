export const identify = (memberData) => {
  if (!window || !window.ttq) {
    return;
  }

  window.ttq.identify(memberData);
};

export const pageview = () => {
  if (!window || !window.ttq) {
    return;
  }

  window.ttq.page();
};

export const event = (event, options) => {
  if (!window || !window.ttq) {
    return;
  }

  window.ttq.track(event, options);
};

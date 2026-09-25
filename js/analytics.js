const uuids = (typeof getKeys === 'function')
    ? getKeys(window.location.hash.substring(1))
    : window.location.hash.substring(1); // Remove # symbol

if (!uuids) {
    gtag('event', 'page_view', {
      page_location: window.location.origin + window.location.pathname,
      page_path: window.location.pathname,
      page_title: document.title
    });
}

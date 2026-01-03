// Content script to handle YouTube's Single Page Application navigation
// This catches in-page navigations that don't trigger full page loads

(function() {
  'use strict';

  let lastUrl = location.href;

  // Convert shorts URL to watch URL
  function convertShortsUrl(url) {
    const shortsMatch = url.match(/^(https?:\/\/(?:www\.|m\.)?youtube\.com)\/shorts\/([^/?#]+)(.*)/);
    if (shortsMatch) {
      const baseUrl = shortsMatch[1];
      const videoId = shortsMatch[2];
      const rest = shortsMatch[3] || '';
      return `${baseUrl}/watch?v=${videoId}${rest}`;
    }
    return null;
  }

  // Function to check and redirect if we're on a shorts URL
  function checkAndRedirect() {
    const currentUrl = location.href;

    // Only process if URL actually changed
    if (currentUrl === lastUrl) {
      return;
    }

    lastUrl = currentUrl;

    const watchUrl = convertShortsUrl(currentUrl);
    if (watchUrl) {
      window.location.replace(watchUrl);
    }
  }

  // Check immediately on script load
  checkAndRedirect();

  // CRITICAL: Intercept clicks on links BEFORE YouTube's router handles them
  document.addEventListener('click', function(e) {
    // Find the clicked link (might be nested in other elements)
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }

    if (!target || target.tagName !== 'A') {
      return;
    }

    const href = target.href;
    if (!href) {
      return;
    }

    // Check if it's a shorts link
    const watchUrl = convertShortsUrl(href);
    if (watchUrl) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Navigate to the watch URL
      window.location.href = watchUrl;
    }
  }, true); // Use capture phase to intercept before YouTube's handlers

  // Watch for URL changes using multiple methods as backup

  // Method 1: Listen to YouTube's state changes (yt-navigate-finish event)
  document.addEventListener('yt-navigate-finish', checkAndRedirect);

  // Method 2: Listen to yt-navigate-start (even earlier)
  document.addEventListener('yt-navigate-start', checkAndRedirect);

  // Method 3: Intercept history API calls
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    const result = originalPushState.apply(this, arguments);
    setTimeout(checkAndRedirect, 0);
    return result;
  };

  history.replaceState = function() {
    const result = originalReplaceState.apply(this, arguments);
    setTimeout(checkAndRedirect, 0);
    return result;
  };

  // Method 4: Listen to popstate (back/forward navigation)
  window.addEventListener('popstate', checkAndRedirect);

  // Method 5: Aggressive polling as final fallback
  setInterval(checkAndRedirect, 100);

})();

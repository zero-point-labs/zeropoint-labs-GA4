/**
 * ZeroPoint Labs Analytics SDK
 * Privacy-first, GDPR-compliant analytics tracking
 * 
 * Usage:
 * <script src="https://yourdomain.com/analytics.js" data-domain="example.com"></script>
 */

(function() {
  'use strict';

  // Configuration
  const script = document.currentScript;
  const config = {
    domain: script?.getAttribute('data-domain') || window.location.hostname,
    apiEndpoint: script?.getAttribute('data-api') || '/api/analytics/track',
    autoTrack: script?.getAttribute('data-auto-track') !== 'false',
    trackOutbound: script?.getAttribute('data-track-outbound') !== 'false',
    trackForms: script?.getAttribute('data-track-forms') !== 'false',
    cookieless: script?.getAttribute('data-cookieless') === 'true',
    debug: script?.getAttribute('data-debug') === 'true'
  };

  // State
  let sessionId = null;
  let userId = null;
  let isTracking = true;

  // Utilities
  function log(...args) {
    if (config.debug) {
      console.log('[ZP Analytics]', ...args);
    }
  }

  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Session management
  function initializeSession() {
    if (config.cookieless) {
      // Use sessionStorage for cookieless tracking
      sessionId = sessionStorage.getItem('zp_session_id');
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('zp_session_id', sessionId);
      }
      
      userId = localStorage.getItem('zp_user_id');
      if (!userId) {
        userId = generateUserId();
        localStorage.setItem('zp_user_id', userId);
      }
    } else {
      // Use localStorage for persistent tracking
      sessionId = localStorage.getItem('zp_session_id');
      userId = localStorage.getItem('zp_user_id');
      
      if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('zp_session_id', sessionId);
      }
      
      if (!userId) {
        userId = generateUserId();
        localStorage.setItem('zp_user_id', userId);
      }
    }
    
    log('Session initialized:', { sessionId, userId });
  }

  // Tracking functions
  async function sendEvent(eventData) {
    if (!isTracking) {
      log('Tracking disabled, skipping event:', eventData);
      return;
    }

    const payload = {
      event_type: eventData.type || 'custom',
      page_url: eventData.page_url || window.location.href,
      page_title: eventData.page_title || document.title,
      referrer: eventData.referrer || document.referrer,
      session_id: sessionId,
      user_id: userId,
      event_data: eventData.data || {}
    };

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      log('Event sent successfully:', payload, result);
    } catch (error) {
      log('Failed to send event:', error, payload);
    }
  }

  function trackPageView() {
    sendEvent({
      type: 'pageview',
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer
    });
  }

  function trackClick(element, eventData = {}) {
    const linkData = {
      type: 'click',
      data: {
        element: element.tagName,
        text: element.textContent?.trim().substring(0, 100),
        href: element.href || null,
        id: element.id || null,
        classes: element.className || null,
        ...eventData
      }
    };

    // Check if it's an outbound link
    if (element.href && element.hostname !== window.location.hostname) {
      linkData.data.outbound = true;
    }

    sendEvent(linkData);
  }

  function trackFormSubmit(form, eventData = {}) {
    const formData = {
      type: 'form_submit',
      data: {
        form_id: form.id || null,
        form_action: form.action || null,
        form_method: form.method || 'GET',
        ...eventData
      }
    };

    sendEvent(formData);
  }

  // Event listeners
  function setupEventListeners() {
    // Track clicks on links and buttons
    document.addEventListener('click', function(e) {
      const element = e.target.closest('a, button');
      if (element) {
        // Add small delay for outbound links to ensure tracking
        if (element.href && element.hostname !== window.location.hostname && config.trackOutbound) {
          e.preventDefault();
          trackClick(element, { outbound: true });
          
          // Navigate after a short delay
          setTimeout(() => {
            window.location.href = element.href;
          }, 100);
        } else {
          trackClick(element);
        }
      }
    });

    // Track form submissions
    if (config.trackForms) {
      document.addEventListener('submit', function(e) {
        trackFormSubmit(e.target);
      });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollCheckpoints = [25, 50, 75, 90];
    
    function trackScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Check if we've crossed any checkpoints
        scrollCheckpoints.forEach(checkpoint => {
          if (scrollPercent >= checkpoint && maxScrollDepth >= checkpoint) {
            sendEvent({
              type: 'scroll',
              data: {
                depth: checkpoint,
                max_depth: scrollPercent
              }
            });
            
            // Remove this checkpoint so we don't track it again
            scrollCheckpoints = scrollCheckpoints.filter(c => c !== checkpoint);
          }
        });
      }
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScroll, 100);
    });

    // Track time on page (send event before unload)
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      if (timeOnPage > 10) { // Only track if user stayed for more than 10 seconds
        sendEvent({
          type: 'time_on_page',
          data: {
            duration: timeOnPage,
            engaged: timeOnPage > 30 // Consider 30+ seconds as engaged
          }
        });
      }
    });
  }

  // Public API
  window.zpAnalytics = {
    // Track custom events
    track: function(eventName, eventData = {}) {
      sendEvent({
        type: 'custom',
        data: {
          event_name: eventName,
          ...eventData
        }
      });
    },

    // Track page views manually
    page: function(url, title) {
      sendEvent({
        type: 'pageview',
        page_url: url || window.location.href,
        page_title: title || document.title
      });
    },

    // Enable/disable tracking
    enable: function() {
      isTracking = true;
      log('Tracking enabled');
    },

    disable: function() {
      isTracking = false;
      log('Tracking disabled');
    },

    // Check tracking status
    isEnabled: function() {
      return isTracking;
    },

    // Get session info
    getSession: function() {
      return {
        sessionId,
        userId,
        domain: config.domain
      };
    },

    // GDPR compliance
    optOut: function() {
      this.disable();
      localStorage.setItem('zp_opt_out', 'true');
      log('User opted out of tracking');
    },

    optIn: function() {
      localStorage.removeItem('zp_opt_out');
      this.enable();
      log('User opted in to tracking');
    },

    hasOptedOut: function() {
      return localStorage.getItem('zp_opt_out') === 'true';
    }
  };

  // Initialize
  function init() {
    // Check if user has opted out
    if (window.zpAnalytics.hasOptedOut()) {
      isTracking = false;
      log('User has opted out, tracking disabled');
      return;
    }

    // Check for Do Not Track
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
      isTracking = false;
      log('Do Not Track detected, tracking disabled');
      return;
    }

    initializeSession();
    
    if (config.autoTrack) {
      setupEventListeners();
      
      // Track initial page view
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
      } else {
        trackPageView();
      }
    }

    log('Analytics SDK initialized', config);
  }

  // Handle SPA navigation
  let currentPath = window.location.pathname;
  
  function checkForNavigationChange() {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      if (config.autoTrack) {
        trackPageView();
      }
    }
  }

  // Listen for history changes (for SPAs)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(checkForNavigationChange, 0);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(checkForNavigationChange, 0);
  };

  window.addEventListener('popstate', checkForNavigationChange);

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); 
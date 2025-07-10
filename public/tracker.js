(function() {
  'use strict';
  
  // Configuration
  const TRACKER_VERSION = '1.0.0';
  const API_ENDPOINT = '/api/track';
  let WEBSITE_DOMAIN = '';
  let SESSION_ID = '';
  let START_TIME = Date.now();
  let LAST_ACTIVITY = Date.now();
  let PAGE_VIEWS = 0;
  let EVENTS_QUEUE = [];
  let SEND_INTERVAL = 5000; // Send events every 5 seconds
  
  // Initialize tracker
  function init() {
    // Get website domain from script tag data attribute
    const scriptTag = document.querySelector('script[data-website]');
    if (scriptTag) {
      WEBSITE_DOMAIN = scriptTag.getAttribute('data-website');
    } else {
      WEBSITE_DOMAIN = window.location.hostname;
    }
    
    // Generate session ID
    SESSION_ID = generateSessionId();
    
    // Set up event listeners
    setupEventListeners();
    
    // Track initial page view
    trackPageView();
    
    // Start sending events periodically
    setInterval(sendQueuedEvents, SEND_INTERVAL);
    
    // Send events before page unload
    window.addEventListener('beforeunload', sendQueuedEvents);
  }
  
  // Generate unique session ID
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Page visibility change (for session duration)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Click tracking
    document.addEventListener('click', handleClick);
    
    // Form submission tracking
    document.addEventListener('submit', handleFormSubmit);
    
    // Scroll tracking (for engagement)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        trackEvent('scroll', window.location.pathname, {
          scrollY: window.scrollY,
          scrollPercent: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        });
      }, 100);
    });
    
    // Update last activity on user interaction
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
      document.addEventListener(event, function() {
        LAST_ACTIVITY = Date.now();
      }, { passive: true });
    });
  }
  
  // Handle visibility change
  function handleVisibilityChange() {
    if (document.hidden) {
      trackEvent('page_blur', window.location.pathname, {
        sessionDuration: Date.now() - START_TIME
      });
    } else {
      trackEvent('page_focus', window.location.pathname);
    }
  }
  
  // Handle click events
  function handleClick(event) {
    const target = event.target;
    const tagName = target.tagName.toLowerCase();
    
    // Track link clicks
    if (tagName === 'a') {
      trackEvent('link_click', window.location.pathname, {
        href: target.href,
        text: target.textContent.trim().substring(0, 100),
        external: target.hostname !== window.location.hostname
      });
    }
    
    // Track button clicks
    if (tagName === 'button' || target.type === 'submit') {
      trackEvent('button_click', window.location.pathname, {
        text: target.textContent.trim().substring(0, 100),
        id: target.id,
        className: target.className
      });
    }
  }
  
  // Handle form submissions
  function handleFormSubmit(event) {
    const form = event.target;
    trackEvent('form_submit', window.location.pathname, {
      formId: form.id,
      formAction: form.action,
      formMethod: form.method,
      fieldCount: form.elements.length
    });
  }
  
  // Track page view
  function trackPageView() {
    PAGE_VIEWS++;
    trackEvent('page_view', window.location.pathname, {
      title: document.title,
      referrer: document.referrer,
      pageViews: PAGE_VIEWS
    });
  }
  
  // Track custom event
  function trackEvent(eventType, path, metadata = {}) {
    const event = {
      website: WEBSITE_DOMAIN,
      event: eventType,
      path: path,
      timestamp: new Date().toISOString(),
      sessionId: SESSION_ID,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
          width: screen.width,
          height: screen.height
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url: window.location.href
      }
    };
    
    EVENTS_QUEUE.push(event);
    
    // Send immediately for important events
    if (['page_view', 'form_submit'].includes(eventType)) {
      sendQueuedEvents();
    }
  }
  
  // Send queued events to server
  function sendQueuedEvents() {
    if (EVENTS_QUEUE.length === 0) return;
    
    const events = [...EVENTS_QUEUE];
    EVENTS_QUEUE = [];
    
    // Use sendBeacon for reliable sending (especially on page unload)
    if (navigator.sendBeacon) {
      const data = JSON.stringify({ events });
      navigator.sendBeacon(API_ENDPOINT, data);
    } else {
      // Fallback to fetch
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        keepalive: true
      }).catch(function(error) {
        console.error('Analytics tracking error:', error);
      });
    }
  }
  
  // Public API
  window.ZeroPointAnalytics = {
    track: trackEvent,
    trackPageView: trackPageView,
    version: TRACKER_VERSION
  };
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Track SPA navigation (for Next.js and other SPAs)
  let currentPath = window.location.pathname;
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(checkForPathChange, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(checkForPathChange, 0);
  };
  
  window.addEventListener('popstate', checkForPathChange);
  
  function checkForPathChange() {
    if (currentPath !== window.location.pathname) {
      currentPath = window.location.pathname;
      trackPageView();
    }
  }
})(); 
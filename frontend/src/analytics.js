import ReactGA from "react-ga4";

/**
 * Initialize Google Analytics
 * Safe initialization that only runs when GA_ID is present
 */
export const initGA = () => {
  const GA_ID = import.meta.env.VITE_GA_ID;

  if (!GA_ID) {
    console.warn("⚠️ Google Analytics ID missing in environment variables");
    return;
  }

  try {
    ReactGA.initialize(GA_ID);
    console.log("✅ Google Analytics initialized");
  } catch (error) {
    console.error("❌ Failed to initialize Google Analytics:", error);
  }
};

/**
 * Track page view
 * @param {string} path - The page path to track
 */
export const trackPageView = (path) => {
  try {
    ReactGA.send({
      hitType: "pageview",
      page: path,
    });
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

/**
 * Track custom events
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Optional event label
 */
export const trackEvent = (category, action, label = "") => {
  try {
    ReactGA.event({
      category,
      action,
      label,
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};

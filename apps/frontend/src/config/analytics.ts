// Firebase Analytics configuration and utilities
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-NE0W2731Y0";

// Analytics event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: AnalyticsEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined events for our app
export const analytics = {
  // Data generation events
  generatePeople: (count: number) =>
    trackEvent({
      action: "generate_people",
      category: "Data Generation",
      label: "People Data",
      value: count,
    }),

  generateCompanies: (count: number) =>
    trackEvent({
      action: "generate_companies",
      category: "Data Generation",
      label: "Company Data",
      value: count,
    }),

  generateQuick: () =>
    trackEvent({
      action: "generate_quick",
      category: "Data Generation",
      label: "Quick Generate",
    }),

  // Navigation events
  visitHome: () =>
    trackEvent({
      action: "visit_home",
      category: "Navigation",
      label: "Home Page",
    }),

  visitGenerator: () =>
    trackEvent({
      action: "visit_generator",
      category: "Navigation",
      label: "Generator Page",
    }),

  visitAbout: () =>
    trackEvent({
      action: "visit_about",
      category: "Navigation",
      label: "About Page",
    }),

  // API events
  viewApiDocs: () =>
    trackEvent({
      action: "view_api_docs",
      category: "API",
      label: "Swagger Documentation",
    }),

  // Support events
  visitBuyMeCoffee: () =>
    trackEvent({
      action: "visit_buy_me_coffee",
      category: "Support",
      label: "Buy Me Coffee",
    }),

  visitGitHub: () =>
    trackEvent({
      action: "visit_github",
      category: "Support",
      label: "GitHub Repository",
    }),

  visitLinkedIn: () =>
    trackEvent({
      action: "visit_linkedin",
      category: "Support",
      label: "LinkedIn Profile",
    }),
};

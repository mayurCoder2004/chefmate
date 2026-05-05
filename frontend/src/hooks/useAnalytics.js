import { trackEvent } from '../analytics';

/**
 * Custom hook for tracking analytics events
 * Usage: const analytics = useAnalytics()
 * Then: analytics.trackRecipeGenerate(), analytics.trackRecipeShare(), etc.
 */
export const useAnalytics = () => {
  return {
    // Recipe related events
    trackRecipeGenerate: () => {
      trackEvent('Recipe', 'Generate Recipe', 'AI Recipe Generation');
    },
    
    trackRecipeShare: (recipeId) => {
      trackEvent('Recipe', 'Share Recipe', recipeId);
    },
    
    trackRecipeSave: (recipeId) => {
      trackEvent('Recipe', 'Save Recipe', recipeId);
    },
    
    trackRecipeView: (recipeId) => {
      trackEvent('Recipe', 'View Recipe', recipeId);
    },
    
    // Cooking related events
    trackStartCooking: (recipeId) => {
      trackEvent('Cooking', 'Start Cook Mode', recipeId);
    },
    
    trackCompleteCooking: (recipeId) => {
      trackEvent('Cooking', 'Complete Cooking', recipeId);
    },
    
    // Meal planner events
    trackMealPlanCreate: () => {
      trackEvent('Meal Planner', 'Create Meal Plan');
    },
    
    trackMealPlanSave: () => {
      trackEvent('Meal Planner', 'Save Meal Plan');
    },
    
    // User authentication events
    trackSignup: () => {
      trackEvent('User', 'Sign Up');
    },
    
    trackLogin: () => {
      trackEvent('User', 'Login');
    },
    
    trackLogout: () => {
      trackEvent('User', 'Logout');
    },
    
    // Search and filter events
    trackSearch: (searchTerm) => {
      trackEvent('Search', 'Recipe Search', searchTerm);
    },
    
    trackFilterApply: (filterType) => {
      trackEvent('Filter', 'Apply Filter', filterType);
    },
    
    // Generic event tracker
    track: (category, action, label) => {
      trackEvent(category, action, label);
    }
  };
};

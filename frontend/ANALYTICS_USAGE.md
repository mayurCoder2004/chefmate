# Google Analytics Integration Guide

## ✅ What's Implemented

### 1. **Automatic Page View Tracking**
Every route change is automatically tracked. No additional code needed.

### 2. **Core Analytics Files**
- `src/analytics.js` - Core GA4 initialization and tracking functions
- `src/hooks/useAnalytics.js` - Optional custom hook for event tracking

### 3. **Environment Variable**
Uses `VITE_GA_ID` from `.env` file (already configured: `G-L34K2P1ESY`)

---

## 📊 How It Works

### Automatic Tracking (Already Active)
- ✅ Page views on every route change
- ✅ User visits
- ✅ Safe initialization (won't break app if GA fails)

---

## 🎯 Optional: Track Custom Events

### Example 1: Track Recipe Generation (SmartRecipe.jsx)

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

const SmartRecipe = () => {
  const analytics = useAnalytics();

  const handleGenerateRecipe = async () => {
    // Your existing logic...
    
    // Track the event
    analytics.trackRecipeGenerate();
  };

  return (
    // Your component JSX
  );
};
```

### Example 2: Track Recipe Share

```jsx
const handleShare = (recipeId) => {
  // Your existing share logic...
  
  analytics.trackRecipeShare(recipeId);
};
```

### Example 3: Track Start Cooking (CookMode.jsx)

```jsx
const CookMode = () => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackStartCooking(recipeId);
  }, []);

  return (
    // Your component JSX
  );
};
```

### Example 4: Track User Login (Login.jsx)

```jsx
const handleLogin = async () => {
  // Your existing login logic...
  
  if (loginSuccessful) {
    analytics.trackLogin();
  }
};
```

---

## 🛠️ Available Tracking Methods

### Recipe Events
- `trackRecipeGenerate()` - AI recipe generation
- `trackRecipeShare(recipeId)` - Share recipe
- `trackRecipeSave(recipeId)` - Save recipe
- `trackRecipeView(recipeId)` - View recipe details

### Cooking Events
- `trackStartCooking(recipeId)` - Enter cook mode
- `trackCompleteCooking(recipeId)` - Complete cooking

### Meal Planner Events
- `trackMealPlanCreate()` - Create meal plan
- `trackMealPlanSave()` - Save meal plan

### User Events
- `trackSignup()` - User registration
- `trackLogin()` - User login
- `trackLogout()` - User logout

### Search & Filter Events
- `trackSearch(searchTerm)` - Search recipes
- `trackFilterApply(filterType)` - Apply filters

### Custom Event
- `track(category, action, label)` - Track any custom event

---

## 🔍 Verify It's Working

1. **Run your app**: `npm run dev`
2. **Open browser console**: Look for `✅ Google Analytics initialized`
3. **Navigate between pages**: Each route change sends a pageview
4. **Check GA4 Dashboard**: Go to Google Analytics → Reports → Realtime

---

## ⚠️ Important Notes

- Analytics will NOT initialize if `VITE_GA_ID` is missing
- All tracking is wrapped in try-catch (won't break your app)
- Event tracking is **optional** - page views work automatically
- No sensitive data is tracked by default

---

## 🚀 Next Steps (Optional)

If you want to add event tracking to specific actions:

1. Import the hook: `import { useAnalytics } from '../hooks/useAnalytics'`
2. Initialize in component: `const analytics = useAnalytics()`
3. Call tracking methods where needed: `analytics.trackRecipeGenerate()`

That's it! Your analytics is ready to go. 🎉

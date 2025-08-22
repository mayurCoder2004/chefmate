const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Fetch random meals
export const getRandomMeals = async () => {
  const res = await fetch(`${BASE_URL}/random.php`);
  return res.json();
};

// Search meals by name
export async function searchMeals(query) {
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching meals:", err);
    return { meals: [] };
  }
}

// Filter meals by ingredient
export const filterMealsByIngredient = async (ingredient) => {
  const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  return res.json();
};

// Filter meals by category
export const filterMealsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  return res.json();
};

// Filter meals by region
export async function filterMealsByRegion(area) {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
  return res.json();
}

// Fetch all categories
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  return res.json();
};

// Fetch all areas/regions
export const getAreas = async () => {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  return res.json();
};

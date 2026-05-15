# Email Capture Feature Implementation

## Summary
Added email capture functionality to ChefMate app that appears after recipe generation for non-logged-in users.

---

## 1. Backend - Email Routes (`backend/routes/emailRoutes.js`)

**New file created** with the following features:

### Schema
```javascript
{
  email: String (required, unique, lowercase, trimmed),
  recipeName: String (default: ''),
  subscribedAt: Date (default: Date.now),
  source: String (default: 'recipe_capture')
}
```

### Endpoint: POST `/api/email/capture`

**Request Body:**
```json
{
  "email": "user@example.com",
  "recipeName": "Paneer Tikka Masala"
}
```

**Validation:**
- Email format validation using regex
- Checks for existing subscribers
- Handles duplicate key errors gracefully

**Responses:**

✅ **Success (201):**
```json
{
  "success": true,
  "message": "Subscribed successfully!"
}
```

✅ **Already Subscribed (200):**
```json
{
  "success": true,
  "message": "Already subscribed!"
}
```

❌ **Invalid Email (400):**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

❌ **Server Error (500):**
```json
{
  "success": false,
  "message": "Failed to save email. Please try again."
}
```

---

## 2. Backend - Server Updates (`backend/server.js`)

**Two lines added:**

```javascript
// Import statement (line 8)
import emailRoutes from "./routes/emailRoutes.js";

// Route registration (after shareRoutes)
app.use("/api/email", emailRoutes);
```

**No other changes made to server.js**

---

## 3. Frontend - AiRecipePage Updates (`frontend/src/pages/AiRecipePage.jsx`)

### New Imports
```javascript
import { Mail, X } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
```

### New State Variables
```javascript
const { user } = useContext(AuthContext);
const [showEmailPrompt, setShowEmailPrompt] = useState(false);
const [email, setEmail] = useState("");
const [emailSubmitting, setEmailSubmitting] = useState(false);
const [emailSuccess, setEmailSuccess] = useState(false);
```

### Logic Updates

**1. Show prompt after recipe loads (in useEffect):**
```javascript
const isDismissed = localStorage.getItem('chefmate_email_dismissed') === 'true';
if (!user && !isDismissed) {
  setShowEmailPrompt(true);
}
```

**2. Dismiss handler:**
```javascript
const handleEmailDismiss = () => {
  setShowEmailPrompt(false);
  localStorage.setItem('chefmate_email_dismissed', 'true');
};
```

**3. Submit handler:**
```javascript
const handleEmailSubmit = async (e) => {
  e.preventDefault();
  // Validates email
  // POSTs to /api/email/capture
  // Shows success message
  // Dismisses after 2 seconds
};
```

### UI Component

**Email Capture Card:**
- Appears below recipe content
- Only visible to non-logged-in users
- Dismissible with "X" button or "No thanks"
- Shows success state after submission
- Uses #E8521A for button color
- 12px border radius
- Stores dismissal in localStorage

**Visual Structure:**
```
┌─────────────────────────────────────┐
│  📬 Get this recipe in your inbox   │
│  We'll also send you 3 new Indian   │
│  recipes every week — free.         │
│                                     │
│  [email input field]                │
│  [Save to my email]  [No thanks]    │
└─────────────────────────────────────┘
```

---

## Features Implemented

✅ Shows ONLY after recipe is generated  
✅ Shows ONLY to non-logged-in users  
✅ "No thanks" dismisses permanently via localStorage  
✅ POST to `/api/email/capture` with email and recipeName  
✅ Success message: "Got it! Check your inbox 🎉"  
✅ Error handling for invalid emails  
✅ Floating card at bottom (not modal)  
✅ Button color #E8521A  
✅ Border radius 12px  
✅ No changes to navbar, login, signup, or other components  

---

## Testing

### Backend Testing
```bash
# Test email capture
curl -X POST http://localhost:5000/api/email/capture \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","recipeName":"Paneer Tikka"}'

# Expected: {"success":true,"message":"Subscribed successfully!"}

# Test duplicate
curl -X POST http://localhost:5000/api/email/capture \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","recipeName":"Another Recipe"}'

# Expected: {"success":true,"message":"Already subscribed!"}
```

### Frontend Testing
1. Logout (if logged in)
2. Navigate to any AI recipe page
3. Email capture card should appear below recipe
4. Enter email and submit
5. Should show success message
6. Card should disappear after 2 seconds
7. Refresh page - card should NOT appear again
8. Clear localStorage key `chefmate_email_dismissed`
9. Refresh - card should appear again

---

## Database

**Collection:** `emailsubscribers`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "recipeName": "Paneer Tikka Masala",
  "subscribedAt": "2026-05-15T10:30:00.000Z",
  "source": "recipe_capture"
}
```

---

## Files Modified

1. ✅ **Created:** `backend/routes/emailRoutes.js`
2. ✅ **Modified:** `backend/server.js` (2 lines added)
3. ✅ **Modified:** `frontend/src/pages/AiRecipePage.jsx`

**No other files were touched.**

---

## localStorage Keys Used

- `chefmate_email_dismissed`: `"true"` when user dismisses the prompt

---

## Next Steps (Optional Enhancements)

1. **Email Service Integration**: Connect to SendGrid/Mailchimp to actually send emails
2. **Admin Dashboard**: View all subscribers
3. **Unsubscribe Flow**: Add unsubscribe endpoint
4. **Analytics**: Track conversion rates
5. **A/B Testing**: Test different copy variations

# ⚡ Quick Start Guide

## 🎯 30-Second Setup

### 1. Create Database (5 mins)
```bash
# Open MySQL and run:
mysql -u root -p < database/setup.sql
```

### 2. Install Backend Dependencies (2 mins)
```bash
cd backend
npm install
```

### 3. Start Backend Server
```bash
npm start
# Should see: ✅ Server running on http://localhost:3000
```

### 4. Open Frontend
```bash
# Open in browser:
frontend/index.html
```

---

## ✅ Verification Checklist

- [ ] MySQL database created (`service_finder`)
- [ ] 8 plumber profiles loaded
- [ ] Backend server running on port 3000
- [ ] Frontend opens in browser
- [ ] Can see plumbing services on home page

---

## 🧪 Test the Application

### Test 1: Browse Plumbers
1. Open home page
2. See 8 plumbers with ratings
3. Search by "Mumbai" or "Pune"

### Test 2: Login/Register
1. Click "Login" in navbar
2. Use credentials:
   - Email: `rajesh@email.com`
   - Password: `password`
3. Should redirect to home

### Test 3: View Plumber Details
1. After login, click "View Details"
2. See professional ID card
3. Verify information display

### Test 4: Book Plumber
1. Click "Book Now" or on details page
2. Select date and time
3. Click "Share Live Location"
4. Allow browser access to location
5. Confirm booking

### Test 5: Review Booking
1. Click "My Bookings" in navbar
2. See booking with details
3. Check booking status (Pending/Confirmed)

---

## 🔑 Test Credentials

| Email | Password | Name |
|-------|----------|------|
| rajesh@email.com | password | Rajesh Kumar |
| priya@email.com | password | Priya Sharma |
| vikram@email.com | password | Vikram Singh |

---

## 📱 Responsive Testing

Test on different screen sizes:
- [ ] Desktop (1200px+)
- [ ] Tablet (768px)
- [ ] Mobile (480px)

---

## 🐛 Common Issues & Fixes

### Backend won't start
```bash
# Check if port 3000 is available
netstat -ano | findstr :3000

# If in use, kill it or change PORT in .env
```

### Database error "No database"
```bash
# Re-run schema
mysql -u root -p < database/setup.sql

# Verify
mysql -u root -p
USE service_finder;
SHOW TABLES;
```

### Location not working
- Allow browser permissions
- Check you're in Maharashtra bounds
- Use VPN to India if needed

### Login doesn't work
- Check email exists in database
- Verify backend is running
- Check browser console for errors

---

## 📊 API Testing

Test endpoints using Postman or curl:

```bash
# 1. Get all plumbers
curl http://localhost:3000/api/services

# 2. Search plumbers
curl http://localhost:3000/api/services?search=Mumbai

# 3. Get plumber details
curl http://localhost:3000/api/providers/1

# 4. Health check
curl http://localhost:3000/api/health
```

---

## 🎓 Code Organization

```
Backend Structure:
- server.js          → Main entry point
- config/db.js       → Database connection
- models/            → Database models (User, Provider, Booking)
- controllers/       → Business logic (Auth, Services, Booking)
- routes/            → API endpoint definitions

Frontend Structure:
- index.html         → Page structure
- style.css          → Premium styling (glassmorphism, gradients)
- script.js          → Client-side logic (fetch API, events)
```

---

## 🚀 Next Steps

1. ✅ Run the application
2. ✅ Test all features
3. 📚 Read code comments
4. 🔨 Try modifying (e.g., change colors, add features)
5. 🎨 Customize the design

---

## 📞 Debugging Tips

### View Network Requests
1. Open Developer Tools (F12)
2. Go to Network tab
3. Perform actions (login, book)
4. See API calls and responses

### View Browser Console
1. Press F12 → Console tab
2. Look for errors in red
3. Read error messages

### Check SQL Data
```sql
-- View all users
SELECT * FROM users;

-- View all bookings
SELECT * FROM bookings;

-- View bookings with plumber details
SELECT b.*, p.name FROM bookings b JOIN providers p ON b.provider_id = p.id;
```

---

## 🎉 Success Indicators

✅ You're ready when:
- Frontend loads without errors
- Home page shows 8 plumbers
- Can login with test credentials
- Can search and filter plumbers
- Can view plumber details
- Can book with location
- Can view bookings

---

Good luck! Happy coding! 🚀

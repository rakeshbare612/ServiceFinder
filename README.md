# 🔧 Service Finder - Premium Plumber Booking Platform

A modern, full-stack web application for booking professional plumbers with premium UI and smooth user experience.

## 📋 Project Overview

**Service Finder** is a premium booking platform (similar to Urban Company) built with:
- **Frontend**: HTML, CSS, Vanilla JavaScript (No React)
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Design**: Glassmorphism, Gradient backgrounds, Smooth animations

## 🎨 Key Features

✅ **User Authentication** (Login/Register)
✅ **Browse Plumbers** with ratings and prices
✅ **Advanced Search** by location
✅ **Plumber Details Page** with professional ID card
✅ **Live Location Tracking** (Maharashtra only)
✅ **Booking System** with date/time selection
✅ **My Bookings** with status tracking
✅ **Premium UI** with animations and glassmorphism
✅ **Toast Notifications**
✅ **Responsive Design**

## 📁 Project Structure

```
service-finder/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Premium styling
│   └── script.js           # Frontend logic
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment config
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── models/
│   │   ├── User.js         # User model
│   │   ├── Provider.js     # Provider model
│   │   └── Booking.js      # Booking model
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── servicesController.js
│   │   └── bookingController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── servicesRoutes.js
│       ├── providersRoutes.js
│       └── bookingRoutes.js
└── database/
    └── setup.sql           # MySQL database setup
```

## 🗄️ Database Schema

### Users Table
```sql
id, name, email, password, created_at
```

### Providers Table
```sql
id, name, phone, address, experience, skills, 
profileImage, workerId, price, rating, verified, created_at
```

### Services Table
```sql
id, title, provider_id, price, location, rating, created_at
```

### Bookings Table
```sql
id, user_id, provider_id, date, time, 
latitude, longitude, status, created_at
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **Git** (optional)

### Step 1: Clone/Download Project
Download the project or clone from repository

### Step 2: Setup Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run the SQL setup file:**
   ```bash
   mysql -u root -p < database/setup.sql
   ```
   
   Or copy-paste the content of `database/setup.sql` in MySQL Workbench

3. **Verify database creation:**
   ```bash
   mysql -u root -p
   USE service_finder;
   SHOW TABLES;
   ```

4. **Check dummy data:**
   ```sql
   SELECT * FROM users;
   SELECT * FROM providers;
   SELECT * FROM bookings;
   ```

### Step 3: Setup Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm list
   ```

4. **Update .env file** (if needed):
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=          # Leave empty if no password
   DB_NAME=service_finder
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ Service Finder Backend Server running on http://localhost:3000
   📡 API available at http://localhost:3000/api
   🏥 Health check: http://localhost:3000/api/health
   ```

### Step 4: Open Frontend

1. **Open the frontend:**
   - Navigate to `frontend` folder
   - Open `index.html` in your browser
   - Or use Live Server extension in VS Code

2. **Access the application:**
   - Home page with plumber search
   - Register new account or login with test credentials

## 🔐 Test Credentials

After running database setup, use the following to login:

**User 1:**
- Email: `rajesh@email.com`
- Password: `password` (Default password set in dummy data)

**User 2:**
- Email: `priya@email.com`
- Password: `password`

**User 3:**
- Email: `vikram@email.com`
- Password: `password`

> **Note:** If passwords don't work, update them using a MySQL update query:
> ```sql
> UPDATE users SET password = '$2a$10$E9rnJO4O7L1qP3K0x8H8h.pLx4v9Z6R2Q0M3N4O5P6Q7R8S9T0U1' WHERE email = 'rajesh@email.com';
> ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Services (Providers)
- `GET /api/services` - Get all plumbers
- `GET /api/services?search=location` - Search plumbers

### Providers
- `GET /api/providers/:id` - Get provider details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings?userId=X` - Get user bookings
- `GET /api/bookings/admin/all` - Get all bookings
- `PATCH /api/bookings/:id/status` - Update booking status

## 🎯 How to Use

### 1. **Home Page**
   - View available plumbers
   - Search by location
   - See ratings and prices

### 2. **Login/Register**
   - Create new account or login
   - Email verification not required
   - Data saved in MySQL

### 3. **View Plumber Details**
   - Click "View Details" on any plumber
   - See professional ID card
   - View experience and skills

### 4. **Book a Plumber**
   - Select date and time
   - Click "Share Live Location" to enable GPS
   - Must be in Maharashtra (or will show error)
   - Confirm booking

### 5. **My Bookings**
   - View all your bookings
   - See booking status (Pending/Confirmed/Completed)
   - View plumber details for each booking

## 🎨 Premium Design Features

- **Gradient Backgrounds**: Linear gradients on hero and cards
- **Glassmorphism**: Transparent glass effect with blur
- **Smooth Animations**: Slide-in, fade-in effects
- **Card Designs**: Elevated shadows and hover effects
- **Professional ID Card**: Custom styled with verified badge
- **Responsive**: Works on desktop, tablet, mobile
- **Color Scheme**: Purple gradient (#667eea to #764ba2)

## 🔍 Location Restriction

The app restricts service booking to **Maharashtra only**:
- Coordinates: 12.4°N to 22.7°N (latitude), 72.6°E to 80.9°E (longitude)
- Error message shown if user is outside Maharashtra
- Location stored in database with booking

## ⚙️ Configuration

### Change Backend Port
Edit `backend/.env`:
```
PORT=4000
```

### Change Database Credentials
Edit `backend/.env`:
```
DB_USER=root
DB_PASSWORD=your_password
```

### Change Frontend API URL
Edit `frontend/script.js` (Line 2):
```javascript
const API_BASE = 'http://localhost:3000/api';
```

## 🐛 Troubleshooting

### Issue: Cannot connect to MySQL
**Solution:** Make sure MySQL is running:
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo service mysql start
```

### Issue: "Port 3000 already in use"
**Solution:** Kill process on port 3000 or use different port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: CORS error
**Solution:** Make sure backend server is running on `http://localhost:3000`

### Issue: Location not working
**Solution:** 
- Allow browser location access when prompted
- Use a VPN set to India if outside India
- Check Maharashtra coordinates

## 📝 Dummy Providers

The database includes 8 pre-loaded plumbers:

1. **Ashok Patel** - ₹500/hr - Bandra, Mumbai (4.8★)
2. **Raj Verma** - ₹600/hr - Andheri, Mumbai (4.7★)
3. **Sunil Desai** - ₹450/hr - Pune (4.6★)
4. **Ramesh Gupta** - ₹700/hr - Navi Mumbai (4.9★)
5. **Deepak Singh** - ₹550/hr - Dadar, Mumbai (4.5★)
6. **Arun Kumar** - ₹400/hr - Thane (4.4★)
7. **Vikas Sharma** - ₹650/hr - Nagpur (4.8★)
8. **Mohit Jain** - ₹350/hr - Powai, Mumbai (4.3★)

## 🔧 Technology Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Frontend Logic |
| Node.js | Backend Runtime |
| Express.js | Web Framework |
| MySQL | Database |
| Bcryptjs | Password Hashing |
| CORS | Cross-Origin Support |

## 📚 Learning Resources

- **Express.js Documentation**: https://expressjs.com/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **CSS Glassmorphism**: https://glassmorphism.com/
- **JavaScript Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 🚀 Future Enhancements

- Payment integration (Stripe/Razorpay)
- Email notifications
- Admin dashboard
- Reviews and ratings
- Real-time chat with plumber
- Schedule optimization
- Push notifications
- Mobile app version
- Plumber availability calendar

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author Notes

This is a beginner-friendly full-stack project with:
- ✅ Clean, commented code
- ✅ MVC architecture
- ✅ Error handling
- ✅ Responsive design
- ✅ Professional UI

Perfect for learning full-stack development!

---

**Happy Coding! 🎉**

For any issues or questions, refer to the troubleshooting section or check the code comments.

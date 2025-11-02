# 🧪 MANUAL TESTING GUIDE

## 🌐 Access URLs

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:8000/api

---

## 👥 TEST ACCOUNTS

### 👨‍💼 Admin Account
- **Login URL:** http://localhost:3000/admin/login
- **Email:** `admin@test.com`
- **Username:** `admin`
- **Password:** `admin123`

**What to Test:**
- ✅ Login with email or username
- ✅ Register new schools
- ✅ Update admin password
- ✅ Delete schools
- ✅ View admin dashboard

---

### 🏫 School Account
- **Login URL:** http://localhost:3000/school/login
- **Email:** `principal@demo.com`
- **Password:** `school123`

**What to Test:**
- ✅ Login to school dashboard
- ✅ View school statistics (500 students, 50 staff)
- ✅ See enrolled students list (3 students)
- ✅ Upload student CSV file
- ✅ Download student CSV
- ✅ Update school password

**School Details:**
- Name: Demo High School
- Location: Delhi
- Type: High School
- Contact: +91-11-12345678

---

### 🎓 Student Accounts (Choose Any)

- **Login URL:** http://localhost:3000/student/login

**Option 1:**
- Username: `rahul_s`
- Email: `rahul@student.com`
- Password: `student123`
- Name: Rahul Sharma

**Option 2:**
- Username: `priya_p`
- Email: `priya@student.com`
- Password: `student123`
- Name: Priya Patel

**Option 3:**
- Username: `amit_s`
- Email: `amit@student.com`
- Password: `student123`
- Name: Amit Singh

**What to Test:**
- ✅ Login to student dashboard
- ✅ View enrolled courses
- ✅ Access course modules
- ✅ Complete quizzes
- ✅ Take exams
- ✅ Track progress

---

## 📚 AVAILABLE COURSES

### 1. Disaster Management Basics ⭐ (Full Content)
**3 Modules:**
1. Introduction to Disasters
   - Content: Understanding different types of disasters
   - Video: https://www.youtube.com/watch?v=sample1
   - Quiz: 2 questions
   
2. Disaster Preparedness
   - Content: Creating emergency plans and kits
   - Video: https://www.youtube.com/watch?v=sample2
   - Quiz: 1 question
   
3. Emergency Response
   - Content: Response procedures and evacuation
   - Video: https://www.youtube.com/watch?v=sample3
   - Exam: Final Assessment (3 questions)

### 2. Emergency First Aid
- Basic course (no modules yet)

### 3. Community Resilience
- Basic course (no modules yet)

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Admin Flow
1. Go to http://localhost:3000/admin/login
2. Login with `admin@test.com` / `admin123`
3. Navigate to "Register School" section
4. Create a new school
5. Verify school appears in system

### Scenario 2: School Dashboard
1. Go to http://localhost:3000/school/login
2. Login with `principal@demo.com` / `school123`
3. View dashboard showing:
   - 3 students enrolled
   - 500 total students
   - 50 staff members
4. Check student list shows: Rahul, Priya, Amit
5. Try downloading student CSV

### Scenario 3: Student Learning
1. Go to http://localhost:3000/student/login
2. Login with `rahul_s` / `student123`
3. View available courses
4. Select "Disaster Management Basics"
5. Complete Module 1
6. Take the quiz
7. View progress

### Scenario 4: Course Navigation
1. Login as any student
2. Open "Disaster Management Basics"
3. Navigate through all 3 modules
4. Answer quiz questions:
   - Q1: Most common disaster? → **Flood (B)**
   - Q2: Disaster response org? → **NDMA (A)**
   - Q3: Emergency kit water days? → **3 days (B)**
5. Take Final Assessment exam:
   - Q1: During earthquake? → **Drop, Cover, Hold On (C)**
   - Q2: Emergency number? → **112 (D)**
   - Q3: NOT in emergency kit? → **Candles and matches (B)**

### Scenario 5: Password Management
1. Login as admin
2. Go to password update section
3. Update password from `admin123` to `newpass123`
4. Logout and login with new password
5. Verify successful

---

## 🔍 API ENDPOINTS TO TEST

### Health Check
```
GET http://localhost:8000/api/auth/health
```
Should return: `{"success": true, "message": "Auth service is running"}`

### Get All Courses
```
GET http://localhost:8000/api/courses
```
Should return 3 courses

### Get Course Modules (with learning_items)
```
GET http://localhost:8000/api/courses/{COURSE_ID}/modules
```
Replace {COURSE_ID} with actual course ID from database

### School Dashboard (Protected)
```
GET http://localhost:8000/api/schools/dashboard/{SCHOOL_ID}
Headers: Authorization: Bearer {TOKEN}
```
Need JWT token from login

---

## 📊 DATABASE VERIFICATION

To verify data is in MongoDB:
```powershell
cd "c:\Users\aaksh\OneDrive\Desktop\New folder\dis\backend"
node verify_db.js
```

Expected Collections:
- admins: 3 documents (2 from tests + 1 new)
- schools: 3 documents (2 from tests + 1 new)
- students: 3 documents
- courses: 5 documents (2 from tests + 3 new)
- modules: 5 documents (2 from tests + 3 new)
- quizzes: 5 documents (2 from tests + 3 new)
- exams: 3 documents (2 from tests + 1 new)
- examquestions: 5 documents (2 from tests + 3 new)

---

## 🎨 FRONTEND PAGES TO EXPLORE

1. **Home Page:** http://localhost:3000
2. **Admin Login:** http://localhost:3000/admin/login
3. **Admin Register:** http://localhost:3000/admin/register
4. **Admin Dashboard:** http://localhost:3000/admin/dashboard
5. **School Login:** http://localhost:3000/school/login
6. **School Dashboard:** http://localhost:3000/school/dashboard/{school_id}
7. **Student Login:** http://localhost:3000/student/login
8. **Student Dashboard:** http://localhost:3000/student/dashboard/{student_id}
9. **Alerts/Donations:** http://localhost:3000/alerts

---

## ✅ THINGS TO VERIFY

- [ ] Admin can login and see dashboard
- [ ] School can login and see 3 students
- [ ] Students can login and access courses
- [ ] Course modules display correctly
- [ ] Quizzes are interactive
- [ ] Exam can be taken
- [ ] JWT tokens work for protected routes
- [ ] Password update functionality works
- [ ] Student CSV download works
- [ ] Donations page loads data
- [ ] MongoDB stores all data correctly

---

## 🚨 TROUBLESHOOTING

**If login doesn't work:**
- Check browser console for errors
- Verify backend is running on port 8000
- Check MongoDB is connected

**If courses don't show:**
- Verify test data was created
- Check browser network tab for API calls
- Ensure `/api` prefix is in all requests

**If JWT errors:**
- Token might be expired (24h limit)
- Try logging in again to get fresh token

---

## 📞 QUICK REFERENCE

**Both Servers Running:**
```
Backend: ✅ http://localhost:8000
Frontend: ✅ http://localhost:3000
MongoDB: ✅ localhost:27017
```

**Quick Login:**
- Admin: `admin` / `admin123`
- School: `principal@demo.com` / `school123`
- Student: `rahul_s` / `student123`

**Start Testing:** Go to http://localhost:3000 and explore! 🚀

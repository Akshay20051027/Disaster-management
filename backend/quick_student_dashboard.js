const axios = require('axios');
(async () => {
  try {
    const base = 'http://localhost:8000';
    const login = await axios.post(base + '/api/auth/student/login', {
      email_or_username: 'rahul_s',
      password: 'student123'
    });
    console.log('StudentId:', login.data.student_id);
    const token = login.data.token;
    const studentId = login.data.student_id;
    const { data } = await axios.get(base + '/api/students/dashboard/' + studentId, {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    if (e.response) {
      console.error('HTTP Error:', e.response.status, e.response.data);
    } else {
      console.error('Error:', e.message);
    }
  }
})();

// import React from 'react';
// import { Link } from 'react-router-dom';

// const CourseCard = ({ course }) => (
//   <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
//     <h3>{course.title}</h3>
//     <p>{course.description}</p>
//     <Link to={`/courses/${course.id}`}>View Course</Link>
//   </div>
// );

// export default CourseCard;

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';

const CourseCard = ({ course }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">{course?.title || 'Course'}</Typography>
      <Typography variant="body2" color="text.secondary">{course?.description || 'No description available.'}</Typography>

      {/* --- Single Button as the Entry Point --- */}
      <Button
        component={RouterLink}
        to={course?.id ? `/courses/${course.id}/player` : '#'}
        disabled={!course?.id}
        variant="contained"
        size="small"
        sx={{ mt: 2 }}
      >
        Start Course
      </Button>

    </CardContent>
  </Card>
);

export default CourseCard;
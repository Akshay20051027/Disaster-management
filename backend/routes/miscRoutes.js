const express = require('express');
const router = express.Router();
const { getDonations, addDonation, donationStats, getRequests, addRequest, updateRequestStatus, getPersons, addPerson, allocatePerson } = require('../controllers/miscController');

router.get('/donations', getDonations);
router.post('/donations', addDonation);
router.get('/donations/stats', donationStats);

router.get('/requests', getRequests);
router.post('/requests', addRequest);
router.put('/requests/:id', updateRequestStatus);

router.get('/persons', getPersons);
router.post('/persons', addPerson);
router.put('/allocate-person/:id', allocatePerson);

module.exports = router;

const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  item_name: String,
  category: String,
  quantity: Number,
  location: String,
  lat: Number,
  lng: Number
}, { timestamps: true });

const RequestSchema = new mongoose.Schema({
  location: String,
  item_needed: String,
  email: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const PersonSchema = new mongoose.Schema({
  name: String,
  role: String,
  allocated: { type: Boolean, default: false },
  email: String
}, { timestamps: true });

const Donation = mongoose.model('Donation', DonationSchema);
const RequestItem = mongoose.model('RequestItem', RequestSchema);
const Person = mongoose.model('Person', PersonSchema);

const getDonations = async (req, res) => {
  const items = await Donation.find().sort({ _id: -1 }).lean();
  res.json(items);
};

const addDonation = async (req, res) => {
  const created = await Donation.create(req.body);
  res.status(201).json({ message: 'Donation added successfully', id: created._id });
};

const donationStats = async (req, res) => {
  const stats = await Donation.aggregate([
    { $group: { _id: '$category', total: { $sum: '$quantity' } } }
  ]);
  res.json(stats.map(s => ({ category: s._id, total: s.total })));
};

const getRequests = async (req, res) => {
  const items = await RequestItem.find().sort({ _id: -1 }).lean();
  res.json(items);
};

const addRequest = async (req, res) => {
  const created = await RequestItem.create(req.body);
  res.status(201).json({ message: 'Request submitted successfully', id: created._id });
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const item = await RequestItem.findById(id);
  if (!item) return res.status(404).json({ message: 'Request not found' });
  item.status = status;
  await item.save();
  // Email sending could be added here using nodemailer if SMTP env present
  res.json({ message: `Request ${status} successfully` });
};

const getPersons = async (req, res) => {
  const people = await Person.find().sort({ _id: -1 }).lean();
  res.json(people);
};

const addPerson = async (req, res) => {
  const created = await Person.create({ ...req.body, allocated: false });
  res.status(201).json({ message: 'Person added successfully', id: created._id });
};

const allocatePerson = async (req, res) => {
  const { id } = req.params;
  const person = await Person.findById(id);
  if (!person) return res.status(404).json({ message: 'Person not found' });
  person.allocated = true;
  await person.save();
  res.json({ message: 'Person allocated successfully' });
};

module.exports = { getDonations, addDonation, donationStats, getRequests, addRequest, updateRequestStatus, getPersons, addPerson, allocatePerson };

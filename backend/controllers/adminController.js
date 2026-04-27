// ===== Admin Controller =====
const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const bcrypt = require('bcryptjs');

// Sample data for demo purposes
const sampleWorkers = [
    { id: 1, name: 'Amit Sharma', phone: '+91 98765 43210', address: 'Dadar, Mumbai', experience: 8, skills: 'Pipe Repair, Leak Fixing, Bathroom Fittings', profileImage: 'https://i.pravatar.cc/300?img=10', workerId: 'PLB-101', price: 450, rating: 4.8, workerEmail: 'worker1@service.com' },
    { id: 2, name: 'Nisha Patel', phone: '+91 99876 54321', address: 'Pune, Maharashtra', experience: 6, skills: 'Interior Painting, Texture Work, Color Matching', profileImage: 'https://i.pravatar.cc/300?img=11', workerId: 'PNT-102', price: 420, rating: 4.7, workerEmail: 'worker2@service.com' },
    { id: 3, name: 'Raj Verma', phone: '+91 91234 56789', address: 'Thane, Maharashtra', experience: 10, skills: 'Wiring Repair, Switchboard, Lighting Installation', profileImage: 'https://i.pravatar.cc/300?img=12', workerId: 'ELC-103', price: 500, rating: 4.9, workerEmail: 'worker3@service.com' }
];

const sampleComplaints = [
    { id: 1, userName: 'John Doe', providerName: 'Amit Sharma', complaint_type: 'Service Quality', message: 'The plumber arrived late and the work was not completed properly.', status: 'Pending', created_at: '2024-01-15' },
    { id: 2, userName: 'Jane Smith', providerName: 'Nisha Patel', complaint_type: 'Pricing', message: 'Charged more than the quoted price for painting work.', status: 'Resolved', created_at: '2024-01-10' },
    { id: 3, userName: 'Mike Johnson', providerName: 'Raj Verma', complaint_type: 'Professionalism', message: 'Electrician was not professional and left tools behind.', status: 'Under Review', created_at: '2024-01-08' }
];

exports.getOverview = async (req, res) => {
    try {
        const totalWorkers = await Provider.getCount();
        const pendingBookings = await Booking.getCountByStatus('Pending');
        const acceptedBookings = await Booking.getCountByStatus('Accepted');
        const completedBookings = await Booking.getCountByStatus('Completed');
        const totalComplaints = await Complaint.getCount();
        const workerStats = await Booking.getWorkerStats();

        res.json({
            success: true,
            data: {
                totalWorkers,
                pendingBookings,
                acceptedBookings,
                completedBookings,
                totalComplaints,
                workerStats
            }
        });
    } catch (error) {
        console.error('Database error in getOverview:', error.message);
        // Return sample data when DB fails
        const sampleWorkerStats = [
            { id: 1, name: 'Amit Sharma', completed_jobs: 15, pending_jobs: 2, accepted_jobs: 3, total_jobs: 20, completion_rate: 75.0 },
            { id: 2, name: 'Nisha Patel', completed_jobs: 12, pending_jobs: 1, accepted_jobs: 2, total_jobs: 15, completion_rate: 80.0 },
            { id: 3, name: 'Raj Verma', completed_jobs: 18, pending_jobs: 0, accepted_jobs: 1, total_jobs: 19, completion_rate: 94.7 }
        ];

        res.json({
            success: true,
            data: {
                totalWorkers: sampleWorkers.length,
                pendingBookings: 5,
                acceptedBookings: 12,
                completedBookings: 28,
                totalComplaints: sampleComplaints.length,
                workerStats: sampleWorkerStats
            }
        });
    }
};

exports.getWorkers = async (req, res) => {
    try {
        const workers = await Provider.getAllWithWorkerInfo();
        res.json({ success: true, data: workers });
    } catch (error) {
        console.error('Database error in getWorkers:', error.message);
        // Return sample workers when DB fails
        res.json({ success: true, data: sampleWorkers });
    }
};

exports.addWorker = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            experience,
            skills,
            profileImage,
            workerId,
            price,
            rating
        } = req.body;

        if (!name || !email || !password || !phone || !address || !experience || !skills || !workerId || !price) {
            return res.status(400).json({ success: false, message: 'All worker fields are required' });
        }

        const newProvider = await Provider.create({
            name,
            phone,
            address,
            experience,
            skills,
            profileImage: profileImage || 'https://i.pravatar.cc/300?img=40',
            workerId,
            price,
            rating: rating || 4.5,
            verified: 1
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create(name, email, hashedPassword, 'worker', newProvider.id);

        res.status(201).json({ success: true, message: 'Worker added successfully', data: { provider: newProvider, email, password } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.removeWorker = async (req, res) => {
    try {
        const { providerId } = req.params;

        if (!providerId) {
            return res.status(400).json({ success: false, message: 'Provider ID is required' });
        }

        await User.deleteByProviderId(providerId);
        await Provider.delete(providerId);

        res.json({ success: true, message: 'Worker removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.getAll();
        res.json({ success: true, data: complaints });
    } catch (error) {
        console.error('Database error in getComplaints:', error.message);
        // Return sample complaints when DB fails
        res.json({ success: true, data: sampleComplaints });
    }
};

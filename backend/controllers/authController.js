// ===== Auth Controller =====
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const sampleUsers = [
    { id: 1, email: 'admin@service.com', password: 'Admin@123', role: 'admin', providerId: null, name: 'Admin User' },
    { id: 2, email: 'worker1@service.com', password: 'Worker@123', role: 'worker', providerId: 1, name: 'Worker One' },
    { id: 3, email: 'worker2@service.com', password: 'Worker@123', role: 'worker', providerId: 2, name: 'Worker Two' },
    { id: 4, email: 'customer@service.com', password: 'Customer@123', role: 'customer', providerId: null, name: 'Customer User' }
];

let nextSampleUserId = 5;

// Login endpoint
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find user - try database first, then fallback to sample
        let user = null;
        try {
            user = await User.findByEmail(email);
        } catch (dbError) {
            console.log('Database connection failed, checking sample users:', dbError.message);
            user = null;
        }
        
        if (!user) {
            user = sampleUsers.find(item => item.email.toLowerCase() === email.toLowerCase());
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password (support hashed and plain text for sample accounts)
        let isPasswordValid = false;
        if (user.password && user.password.startsWith && user.password.startsWith('$2')) {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            isPasswordValid = password === user.password;
        }
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Return user data (without password)
        const { password: _, provider_id, providerId, ...userWithoutPassword } = user;
        const userData = {
            ...userWithoutPassword,
            providerId: provider_id || providerId || null
        };
        res.json({
            success: true,
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Register endpoint
exports.register = async (req, res) => {
    try {
        const { name, email, password, role = 'customer', providerId = null } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        if (role === 'worker' && !providerId) {
            return res.status(400).json({ success: false, message: 'Worker registration requires a provider ID' });
        }

        // Check if user already exists in sample users first
        const existingInSample = sampleUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingInSample) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Try database registration
        let newUser = null;
        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            newUser = await User.create(name, email, hashedPassword, role, providerId);
        } catch (dbError) {
            console.log('Database registration failed, using sample fallback:', dbError.message);
            
            // Fallback: register in memory
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            newUser = {
                id: nextSampleUserId++,
                name,
                email,
                password: hashedPassword,
                role,
                providerId: providerId || null
            };
            
            sampleUsers.push(newUser);
        }

        // Return user data
        const { password: _, provider_id, ...userWithoutPassword } = newUser;
        const userData = {
            ...userWithoutPassword,
            providerId: provider_id || newUser.providerId || null
        };
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

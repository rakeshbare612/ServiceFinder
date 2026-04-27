// ===== Services Controller (Providers) =====
const Provider = require('../models/Provider');

// Get all services/providers
exports.getAllServices = async (req, res) => {
    try {
        const search = req.query.search || null;
        const providers = await Provider.getAll(search);

        res.json({
            success: true,
            data: providers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get provider details
exports.getProviderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await Provider.findById(id);

        if (!provider) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        res.json({
            success: true,
            data: provider
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

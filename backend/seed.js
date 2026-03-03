const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Route = require('./models/Route');

dotenv.config();

const seedRoutes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing routes
        await Route.deleteMany();

        const initialRoutes = [
            {
                routeName: 'North Campus Express',
                stops: [
                    { stopName: 'City Center', time: '7:30 AM' },
                    { stopName: 'Lake View', time: '7:45 AM' },
                    { stopName: 'Main Gate', time: '8:15 AM' }
                ],
                pricing: { monthly: 500, semester: 2500, yearly: 4500 }
            },
            {
                routeName: 'South Suburban Route',
                stops: [
                    { stopName: 'Metro Station', time: '7:15 AM' },
                    { stopName: 'Highway Junction', time: '7:40 AM' },
                    { stopName: 'University Gate', time: '8:10 AM' }
                ],
                pricing: { monthly: 600, semester: 3000, yearly: 5500 }
            }
        ];

        await Route.insertMany(initialRoutes);
        console.log('Routes Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedRoutes();

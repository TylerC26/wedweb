const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 5500;
const cors = require('cors');

app.use(cors()); // Allow all origins

// Middleware to parse JSON
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./json/wedwe-6c046-firebase-adminsdk-fbsvc-1bf613cac4.json'); // Replace with the path to your Firebase service account JSON file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wedwe-6c046-default-rtdb.asia-southeast1.firebasedatabase.app' // Replace with your Firebase Realtime Database URL
});

const db = admin.firestore(); // Firestore instance

// Endpoint to handle RSVP form submission
app.post('/rsvp', async (req, res) => {
    console.log('RSVP request received:', req.body); // Debugging info
    const { name, contact, car_plate, diet } = req.body;

    // Validate required input fields (name and contact are mandatory)
    if (!name || !contact) {
        return res.status(400).send('Name and contact are required.');
    }

    try {
        // Save the RSVP to Firestore
        const rsvpRef = db.collection('rsvps'); // 'rsvps' is the Firestore collection name
        await rsvpRef.add({
            name,
            contact,
            car_plate: car_plate || null, // Save as null if not provided
            diet: diet || null,           // Save as null if not provided
            createdAt: admin.firestore.FieldValue.serverTimestamp() // Add a timestamp
        });

        res.status(200).send('RSVP saved successfully.');
    } catch (err) {
        console.error('Error saving RSVP to Firestore:', err);
        res.status(500).send('Server error.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
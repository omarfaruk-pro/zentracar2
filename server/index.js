const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const verify = async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
    }
    catch (error) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
}

const verifyEmail = (req, res, next) => {
    if (req.query.email != req.decoded.email) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    next();
}
const uri = "mongodb+srv://zentraCar:zentraCar@practice1.stkfhhm.mongodb.net/?retryWrites=true&w=majority&appName=practice1"

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        const carCollection = client.db('zentraCar').collection('added-car');
        const bookingCollection = client.db('zentraCar').collection('booking');
        const reviewCollection = client.db('zentraCar').collection('reviews');
        const chatCollection = client.db('zentraCar').collection('chats');
        const usersCollection = client.db('zentraCar').collection('users');

        // user api
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // cars api
        app.get('/cars', async (req, res) => {
            const home = req.query.home;
            const sortDate = req.query.sortDate;
            const sortPrice = req.query.sortPrice;
            const search = req.query.search;

            let filter = {};
            if (search && search.trim()) {
                const regex = new RegExp(search.trim(), 'i');
                filter = {
                    $or: [
                        { carName: regex },
                        { carModel: regex },
                        { location: regex }
                    ]
                };
            }

            let cursor = carCollection.find(filter);

            if (home) {
                cursor = cursor.sort({ releaseDate: -1 }).limit(6);
            }

            if (sortDate == 'New') {
                cursor = cursor.sort({ releaseDate: -1 });
            } else if (sortDate == 'Old') {
                cursor = cursor.sort({ releaseDate: 1 });
            }

            if (sortPrice == 'Low') {
                cursor = cursor.sort({ dailyRentalPrice: 1 });
            } else if (sortPrice == 'High') {
                cursor = cursor.sort({ dailyRentalPrice: -1 });
            }

            const result = await cursor.toArray();

            res.send(result);
        })

        app.get('/myCars', verify, verifyEmail, async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await carCollection.find(query).toArray();
            for (const car of result) {
                const id = car._id.toString();
                const query = { carID: id };
                const booking = await bookingCollection.countDocuments(query);
                car.bookingCount = booking;

            }
            res.send(result);
        })

        app.get('/car/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };

                const car = await carCollection.findOne(query);
                if (!car) return res.status(404).send({ message: "Car not found" });

                const owner = await usersCollection.findOne({ email: car.ownerEmail });

                const response = {
                    ...car,
                    ownerID: owner ? owner._id.toString() : null,
                };

                res.send(response);
            } catch (error) {
                console.error("Error fetching car with ownerID:", error);
                res.status(500).send({ message: "Server error" });
            }
        });


        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        })

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCar = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedCar
            }
            const result = await carCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        app.delete('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            res.send(result);
        })

        // bookings api
        app.get('/bookings', verify, verifyEmail, async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        app.patch('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const bookingStartDate = req.body.bookingStartDate;
            const bookingEndDate = req.body.bookingEndDate;
            const bookingTime = req.body.bookingTime;
            const status = req.body.status;
            const updatedField = {};
            if (status) {
                updatedField.status = status
            } else {
                updatedField.bookingStartDate = bookingStartDate;
                updatedField.bookingEndDate = bookingEndDate;
                updatedField.bookingTime = bookingTime
            }
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedField
            }
            const result = await bookingCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { carID: id };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        // reviews api
        app.get('/review/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { carID: id };

                const reviews = await reviewCollection.find(query).toArray();

                const avgResult = await reviewCollection.aggregate([
                    { $match: { carID: id } },
                    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
                ]).toArray();

                const avgRating = avgResult.length > 0 ? avgResult[0].avgRating.toFixed(1) : 0;

                res.send({
                    avgRating: parseFloat(avgRating),
                    totalReviews: reviews.length,
                    reviews
                });
            } catch (error) {
                console.error("Error fetching reviews:", error);
                res.status(500).send({ message: "Server error" });
            }
        });


        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


        // chat api
        app.post('/find-or-create-chat', async (req, res) => {
            const { userA, userB } = req.body;

            let chat = await chatCollection.findOne({
                participants: { $all: [userA, userB] }
            });

            if (!chat) {
                const newChat = { participants: [userA, userB], messages: [] };
                const result = await chatCollection.insertOne(newChat);
                chat = { _id: result.insertedId, ...newChat };
            }

            res.send(chat);
        });

        app.post('/chat', async (req, res) => {
            const { userId, ownerId } = req.body;
            const query = { participants: { $all: [userId, ownerId] } };
            let chat = await chatCollection.findOne(query);

            if (!chat) {
                const newChat = {
                    participants: [userId, ownerId],
                    messages: []
                };
                const result = await chatCollection.insertOne(newChat);
                chat = await chatCollection.findOne({ _id: result.insertedId });
            }
            res.send(chat);
        });

        app.post('/chat/:id/message', async (req, res) => {
            const chatId = req.params.id;
            const { senderId, text } = req.body;

            await chatCollection.updateOne(
                { _id: new ObjectId(chatId) },
                {
                    $push: {
                        messages: {
                            senderId,
                            text,
                            timestamp: new Date()
                        }
                    }
                }
            );

            res.send({ success: true });
        });

        app.get('/chat/:id', async (req, res) => {
            const chatId = req.params.id;
            const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
            res.send(chat);
        });

        app.get('/chats/:ownerId', async (req, res) => {
            const ownerId = req.params.ownerId;
            const chats = await chatCollection.aggregate([
                { $match: { participants: ownerId } },
                {
                    $lookup: {
                        from: "users",
                        localField: "participants",
                        foreignField: "_id",
                        as: "participantsInfo"
                    }
                }
            ]).toArray();
            res.send(chats);
        });

        app.post('/chat/:chatId/message', async (req, res) => {
            const { chatId } = req.params;
            const { senderId, text } = req.body;
            const message = { senderId, text, timestamp: new Date() };

            const result = await chatCollection.findOneAndUpdate(
                { _id: new ObjectId(chatId) },
                { $push: { messages: message } },
                { returnDocument: 'after' }
            );

            res.send(result.value);
        });

        app.get('/chat/:chatId', async (req, res) => {
            const { chatId } = req.params;
            const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
            res.send(chat);
        });

        app.get('/my-chats/:userId', async (req, res) => {
            const { userId } = req.params; // Firebase UID

            try {
                const chats = await chatCollection.aggregate([
                    { $match: { participants: userId } },
                    {
                        $lookup: {
                            from: 'users',
                            let: { participantUids: '$participants' },
                            pipeline: [
                                { $match: { $expr: { $in: ['$uid', '$$participantUids'] } } },
                                { $project: { uid: 1, name: 1, email: 1, photoURL: 1 } }
                            ],
                            as: 'participantDetails'
                        }
                    }
                ]).toArray();

                res.send(chats);
            } catch (error) {
                console.error('Error fetching chats:', error);
                res.status(500).send({ message: 'Server error' });
            }
        });




    } finally { }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
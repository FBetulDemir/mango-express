import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose
    .connect('mongodb://localhost:27017/myfirstdatabase', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users' });
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to add user',
            details: error.message,
        });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update user',
            details: error.message,
        });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted', user: deletedUser });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete user',
            details: error.message,
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    exercise: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    notes: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const workout = mongoose.model('workout', workoutSchema);

module.exports = workout;
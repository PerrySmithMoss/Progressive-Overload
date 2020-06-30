const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    exercise: {
        type: String,
        required: true,
        trim: true,
    },
    notes: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
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

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
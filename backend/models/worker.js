import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
	ip: {
        type: String,
        required: true
    }
})

export const Worker =  mongoose.model('Worker', workerSchema)

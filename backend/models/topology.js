import mongoose from 'mongoose';

const topologySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

export const Topology =  mongoose.model('Topology', topologySchema)

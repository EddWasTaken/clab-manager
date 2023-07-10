import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
    worker_name: {
        type: String,
        required: true
    },
    worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    topo_name: {
        type: String,
        required: true
    },
    topo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topology',
        required: true
    },
	port: {
        type: Number,
        required: true
    }


})

export const Deployment =  mongoose.model('Deployment', deploymentSchema)

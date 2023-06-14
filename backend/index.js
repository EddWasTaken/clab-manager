import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import topologyRoutes from './routes/topologies.js'
import workerRoutes from './routes/workers.js'
import deploymentRoutes from './routes/deployments.js'

// local dev URI
//const URI = 'mongodb://127.0.0.1:27017/clab-orchestrator'
// docker URI
const URI = 'mongodb://mongodb:27017/clab-orchestrator'
const PORT = 5000;
const app = express();



app.use(bodyParser.json());

app.use(cors())
// all routes here start with /api/yaml (routePrefix)
app.use('/api/topologies', topologyRoutes)

// worker routes for creating new workers when the agent is ran
app.use('/api/workers', workerRoutes)

app.use('/api/deployments', deploymentRoutes)

app.get('/', (req, res) =>{
    res.send('CLab Orchestrator Backend')
});

// connect to the database
async function connect() {
    try {
        await mongoose.connect(URI, { useNewUrlParser: true})
        console.log('Connected to the DB');
        app.listen(PORT, () => {
            console.log(`Server running on port: http://localhost:${PORT}`)
        });        
    } catch(error) {
        console.log(error);
    }
}

connect();


import express from 'express';

import { getTopologies, getTopologyByName, createTopology, deleteTopology } from '../controllers/topologies.js';


const router = express.Router();

// all routes are prefixed with /api/topologies

router.get('/', getTopologies);

router.post('/', createTopology);

router.get('/:name', getTopologyByName);

router.delete('/:name', deleteTopology);


export default router;
import express from 'express';

import { getWorkers, getWorkerByName, updateWorker, deleteWorker, createWorker } from '../controllers/workers.js';

const router = express.Router();

// all routes are prefixed with /api/workers

router.get('/', getWorkers);

router.get('/:name', getWorkerByName);

router.patch('/:name', updateWorker);

router.delete('/:name', deleteWorker);

router.post('/', createWorker);

export default router;
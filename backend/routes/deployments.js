import express from 'express';

import { getDeployments, getDeploymentById, getDeploymentsByTopologyName, getDeploymentsByWorkerName, createDeployment, deleteDeployment} from '../controllers/deployments.js'

const router = express.Router();

// all routes are prefixed with /api/deployments

router.get('/', getDeployments);

router.get('/:deployment_id', getDeploymentById);

//router.get('/topology/:topo_id', getDeploymentsByTopologyId);

router.get('/topology/:topo_name', getDeploymentsByTopologyName);

//router.get('/worker/:worker_id', getDeploymentsByWorkerId);

router.get('/worker/:worker_name', getDeploymentsByWorkerName);

router.post('/', createDeployment);

router.delete('/:deployment_id', deleteDeployment);

export default router;
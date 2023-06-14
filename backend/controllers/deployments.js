import { Deployment } from '../models/deployment.js'


export const getDeployments = async(req, res) => {

    try {
        const deployments = await Deployment.find({})
        res.status(200).json(deployments)
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message})
    }

}

export const getDeploymentById = async(req, res) => {

    try {
        const { deployment_id } = req.params
        const deployment = await Deployment.find({_id: deployment_id})
        res.status(200).json(deployment)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const getDeploymentsByTopologyId = async(req, res) => {

    try {
        const { topo_id } = req.params;
        const deployment = await Deployment.find({topo_id: topo_id})
        res.status(200).json(deployment)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const getDeploymentsByTopologyName = async(req, res) => {

    try { 
        const { topo_name } = req.params;
        const deployments = await Deployment.find({topo_name: topo_name})
        res.status(200).json(deployments)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const getDeploymentsByWorkerId = async(req, res) => {
    
    try {
        const { worker_id } = req.params;
        const deployments = await Deployment.find({worker_id: worker_id})
        res.status(200).json(deployments)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const getDeploymentsByWorkerName = async(req, res) => {

    try { 
        const { worker_name } = req.params;
        const deployments = await Deployment.find({worker_name: worker_name})
        res.status(200).json(deployments)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const createDeployment = async(req, res) => {

    try {
        // should add some verification to the req.body
        const deployment = await Deployment.create(req.body)

        res.status(201).json(deployment);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message});
    }
}

export const deleteDeployment = async(req, res) => {

    try {
        const { deployment_id } = req.params;
        const deployment = await Deployment.deleteOne({ _id: deployment_id})
        res.status(200).json(deployment);
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message});
    }
    

    // match Worker in db if it exists and delete, else 404
    //res.status(200).send(`Worker #${id} - [${name}] deleted successfully`)
}
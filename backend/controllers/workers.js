import { Worker } from '../models/worker.js'

export const getWorkers = async(req, res) => {

    try {
        const workers = await Worker.find({})
        res.status(200).json(workers)
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message})
    }
}

export const getWorkerByName = async(req, res) => {

    try {
        const { name } = req.params;
        const worker = await Worker.findOne({ name: name})
        res.status(200).json(worker)
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
    // match Worker in db if it exists else return code 404
    
    //res.send(matchedWorker)
}

export const updateWorker = async(req, res) => {

    // TODO (maybe)
    // add request stuff to specific params
    // const { name } = req.body
    // check if params exist to patch it
    // if(name) {
    //      worker.name = name;  
    // }

    // res.send(`Worker #${id} - [${name}] edited successfully`)
}

export const deleteWorker = async(req, res) => {

    try {
        const { name } = req.params;
        const worker = await Worker.deleteOne({ name: name})
        res.status(200).json(worker);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message});
    }
    

    // match Worker in db if it exists and delete, else 404
    //res.status(200).send(`Worker #${id} - [${name}] deleted successfully`)
}

export const createWorker = async(req, res) => {

    try {
        // add worker to db
        const worker = await Worker.create(req.body)
        //res.send(`Worker #${worker.id} - [${worker.name}] registered successfully.`);
        res.status(201).json(worker);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message});
    }
}
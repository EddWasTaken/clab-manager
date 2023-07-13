import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { rootPath } from '../root-path.js';

import { Topology } from '../models/topology.js'




export const getTopologies = async(req, res) => {

    try {
        const topos = await Topology.find({})
        res.status(200).json(topos)
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message})
    }
}

export const getTopologyByName = async(req, res) => {

    try {
        const { name } = req.params;
        const filename = name + '.yaml'
        const filepath = path.join(rootPath, 'topos', filename);
        const yamlFile = fs.readFileSync(filepath, 'utf8');
        const data = yaml.load(yamlFile);
        // replies in json (for now)
        // can also reply in yaml using the following line of code and using .send() instead of .json()
        // res.setHeader('Content-Type', 'application/x-yaml');
        // but it might be easier to go yaml > json > yaml
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message})
    }
}

export const createTopology = async(req, res) => {

    try {
        // read yaml data from body
        const data = req.body;
        // make the path
        const filename = req.body.name + '.yaml'
        const filepath = path.join(rootPath, 'topos', filename);

        const topo = new Topology({name: req.body.name})
        const yamlData = yaml.dump(data)
        fs.writeFileSync(filepath, yamlData);
        
        topo.save()
        res.status(201).json(topo)
    } catch (e) {
        console.log(e);
        res.status(500).json({message: e.message});
    }
}

export const deleteTopology = async(req, res) => {

    try {
        const { name } = req.params;
        const topo = await Topology.deleteOne({ name: name})
        res.status(200).json(topo);
    } catch (e) {
        console.log(e);
        res.status(404).json({message: e.message});
    }
    

    // match Worker in db if it exists and delete, else 404
    //res.status(200).send(`Worker #${id} - [${name}] deleted successfully`)
}
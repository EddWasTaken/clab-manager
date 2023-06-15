import requests
import json
import yaml
import os
from pathlib import Path

'''
These constants store the necessary variables for a successful connection
to the API, and should be set before running the agent script and/or setting it up
with cron. 
Important note, the /api endpoint doesn't reply with anything, and should not be used for testing.
By default, the agent tests the connection on the /api/deployments endpoint
'''
MANAGER_IP = "192.168.153.130"
MANAGER_PORT = "5000"
WORKER_NAME = "worker01"

BASE_MANAGER_URL = f"http://{MANAGER_IP}:{MANAGER_PORT}/api"
WORKER_DEPLOYMENTS = f"{BASE_MANAGER_URL}/deployments/worker/{WORKER_NAME}"


def test_connection():
    res = requests.get(BASE_MANAGER_URL + "/deployments")

    if res.status_code != 200:
        print("Couldn't reach the CLab-Manager API")
        return 1
    return 0
        
def get_all_deployments():
    res = requests.get(WORKER_DEPLOYMENTS)
    res_json = json.loads(res.content.decode())

    deployed_topos = list()
    for deployment in res_json:
        deployed_topos.append(deployment.get('topo_name'))
    return deployed_topos
    
def get_topos(topo_list):

    base_path = Path.cwd()
    save_topos_path = base_path.joinpath("topos")

    if not Path.exists(save_topos_path):
        save_topos_path.mkdir()
    
    for topo in topo_list:
        res = requests.get(BASE_MANAGER_URL + "/topologies/" + topo)

        res_json = json.loads(res.content.decode())
        res_yaml = yaml.dump(res_json, sort_keys=False)

        file_name = topo + ".yaml"
        topo_path = save_topos_path.joinpath(file_name)
        # Check if the file exists and compare its content with the new YAML data
        if Path.exists(topo_path):
            with open(topo_path, 'r') as file:
                existing_yaml_data = file.read()

            if existing_yaml_data == res_yaml:
                print(f"File {file_name} already exists and has not changed. No replacement needed.")
            else:
                with open(topo_path, 'w') as file:
                    file.write(res_yaml)
                print(f"File {file_name} already exists but has changed. Replaced with new data.")
        else:
            with open(topo_path, 'w') as file:
                file.write(res_yaml)
            print(f"New file {file_name} created.")
                

def main():
    if test_connection() != 0:
        return
    
    topo_list = get_all_deployments()

    if len(topo_list) == 0:
        print("No deployments found associated with this worker. Exiting...")

    get_topos(topo_list)
    
main()

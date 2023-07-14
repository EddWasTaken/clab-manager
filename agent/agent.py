import requests
import json
import yaml
import subprocess
from pathlib import Path

'''
These constants store the necessary variables for a successful connection
to the API, and should be set before running the agent script and/or setting it up
with cron. 
Important note, the /api endpoint doesn't reply with anything, and should not be used for testing.
By default, the agent tests the connection on the /api/deployments endpoint
'''
MANAGER_IP = "192.168.153.129"
MANAGER_PORT = "5000"
WORKER_NAME = "worker01"

BASE_MANAGER_URL = f"http://{MANAGER_IP}:{MANAGER_PORT}/api"
WORKER_DEPLOYMENTS = f"{BASE_MANAGER_URL}/deployments/worker/{WORKER_NAME}"


def test_connection():
    res = requests.get(BASE_MANAGER_URL + "/deployments")

    if res.status_code != 200:
        print("[ERROR] Unable to reach the CLab-Manager API")
        return 1
    return 0
        
def get_all_deployments():
    res = requests.get(WORKER_DEPLOYMENTS)
    res_json = json.loads(res.content.decode())

    deployment_dict = {}
    for deployment in res_json:
        topo_name = deployment.get('topo_name')
        port = deployment.get('port')
        deployment_dict[topo_name] = port
    return deployment_dict
    
def get_topos(topo_dict):

    base_path = Path.cwd()
    save_topos_path = base_path.joinpath("topos")

    if not Path.exists(save_topos_path):
        save_topos_path.mkdir()
    
    topo_list = list(topo_dict.keys())
    topo_path_dict = dict()
    topo_port_dict = dict()
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
                print(f"[INFO] Topology {file_name} already exists and has not changed, skipping")
                topo_path_dict[topo_path] = False
                topo_port_dict[topo_path] = topo_dict[topo]
            else:
                with open(topo_path, 'w') as file:
                    file.write(res_yaml)
                print(f"[INFO] Topology {file_name} already exists and has changed, rewriting.")
                topo_path_dict[topo_path] = True
                topo_port_dict[topo_path] = topo_dict[topo]
        else:
            with open(topo_path, 'w') as file:
                file.write(res_yaml)
            print(f"[INFO] Topology {file_name} created.")
            topo_path_dict[topo_path] = True
            topo_port_dict[topo_path] = topo_dict[topo]
    return topo_path_dict, topo_port_dict
                
def deploy_topos(path_dict, topo_dict):

    for topo in path_dict:
        # check if the deployment exists
        if subprocess.run(["clab", "inspect", "--topo", topo], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
            # check if yaml was changed before destroying
            if path_dict[topo]:
                print("[INFO] Topology file was updated, redeploying")
                redeploy = subprocess.run(["clab", "deploy", "--topo", topo, "--reconfigure"])
                if redeploy.returncode != 0:
                    print("[ERROR] Unable to redeploy the topology. Code: %d" % redeploy.returncode)
                    print(f"{topo}\n {topo_dict[topo]}\n") 
                graph_topos(topo, topo_dict[topo])
            else:
                print("[INFO] Topology file wasn't updated and the lab is running, skipping")
        else:
            deployment = subprocess.run(["clab", "deploy", "--topo", topo])
            graph_topos(topo, topo_dict[topo])
            if deployment.returncode != 0:
                print("[ERROR] Unable to deploy the topology. Code: %d" % deployment.returncode)

def graph_topos(topo_path, port):

    port_str = f":{port}"
    graph = subprocess.Popen(["clab", "graph", "--topo", topo_path, "--srv", port_str, "&"], close_fds=True, start_new_session=True)

def main():
    if test_connection() != 0:
        return
    

    topo_dict = get_all_deployments()

    if len(topo_dict) == 0:
        print("No deployments found associated with this worker. Exiting...")

    path_dict, port_dict = get_topos(topo_dict)

    deploy_topos(path_dict, port_dict)
    
main()

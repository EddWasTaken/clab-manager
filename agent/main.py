import requests
import json
import yaml
import os

url = "http://localhost:5000/yaml/test"
response = requests.get(url)
get = json.loads(response.content.decode())

yaml_data = yaml.dump(get, sort_keys=False)#short-keys para organizar o ficheiro yaml como pretendido

name = get.get("name")

# Generate the file path and name based on the "name" parameter
file_path = fr"C:\Users\Gerson\Desktop\Escola\3 Ano\2 Semestre\Projeto Informatico\Agente\{name}.yaml"

# Check if the file exists and compare its content with the new YAML data
if os.path.exists(file_path):
    with open(file_path, 'r') as file:
        existing_yaml_data = file.read()

    if existing_yaml_data == yaml_data:
        print(f"File {file_path} already exists and has not changed. No replacement needed.")
    else:
        with open(file_path, 'w') as file:
            file.write(yaml_data)
        print(f"File {file_path} already exists but has changed. Replaced with new data.")
else:
    with open(file_path, 'w') as file:
        file.write(yaml_data)
    print(f"New file {file_path} created.")
print(get)
#print(f"YAML data has been saved to {file_path}")

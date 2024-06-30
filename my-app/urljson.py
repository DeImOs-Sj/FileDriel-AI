import requests
import json

def fetch_ipfs_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching content from IPFS: {e}")
        return None

def parse_json_content(content):
    try:
        data = json.loads(content)
        return data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON content: {e}")
        return None

ipfs_url = "https://gateway.lighthouse.storage/ipfs/bafkreic4glv76da6qvfiqneegzsbeolpbmx24ix4xdp4uqhrhvmskgeqyq"

content = fetch_ipfs_content(ipfs_url)
if content:
    json_data = parse_json_content(content)
    if json_data:
        print("Parsed JSON content:")
        print(json_data)
else:
    print("Failed to fetch or parse content.")

import requests
import sys


def fetch_ipfs_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching content from IPFS: {e}")
        return None

def save_as_text(content, file_name):
    with open(file_name, 'w') as file:
        file.write(content)
    print(f"Content saved as text file: {file_name}")




if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python fetch_and_save_ipfs.py <IPFS_URL>")
        sys.exit(1)

    ipfs_url = sys.argv[1]

content = fetch_ipfs_content(ipfs_url)
if content:
    print("Content fetched from IPFS:")
    print(content)
    
    # Save content as text file
    save_as_text(content, 'ipfs_content.txt')
    
else:
    print("Failed to fetch content.")

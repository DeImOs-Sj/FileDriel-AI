from filecoin import Filecoin

# Initialize the Filecoin client
client = Filecoin('https://rpc.ankr.com/filecoin_testnet')

# Fetch a file using its CID
cid = ''
file_data = client.cat(cid)

print(file_data)

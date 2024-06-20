#!/bin/bash

# Step 1: Clone the Galadriel repository
echo "Step 1: Cloning Galadriel repository..."
git clone https://github.com/galadriel-ai/contracts.git
cd contracts/rag_tools

# Step 2: Create a virtual environment for Python dependencies
echo "Step 2: Creating Python virtual environment..."
python -m venv venv
source venv/bin/activate

# Step 3: Install the required Python packages
echo "Step 3: Installing Python dependencies..."
pip install -r requirements.txt

# Step 4: Create a .env file with necessary API keys
echo "Step 4: Setting up environment variables..."
echo "ORACLE_ADDRESS=0x4168668812C94a3167FCd41D12014c5498D74d7e" > .env
echo "PRIVATE_KEY=your_wallet_private_key_here" >> .env
echo "PINATA_API_KEY=your_pinata_api_key_here" >> .env

# Step 5: Collect knowledge base files into a directory
echo "Step 5: Setting up knowledge base files..."
mkdir -p kb
# Example files (replace with actual files you want to use)
cp path/to/bitcoin.pdf kb/
cp path/to/ethereum.pdf kb/

# Step 6: Execute the script to index the knowledge base
echo "Step 6: Indexing the knowledge base..."
python add_knowledge_base.py -d kb -s 1500

# Step 7: Delayed completion messages and IPFS CID URL
sleep 2
echo "Knowledge base setup complete."
echo "Make sure to store the index IPFS CID for use in your contract."
echo "Pinata IPFS CID URL: https://gateway.pinata.cloud/ipfs/YOUR_IPFS_CID_HERE"


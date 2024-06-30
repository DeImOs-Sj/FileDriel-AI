"use client";
import React, { useState, useEffect } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CornerDownLeft } from "lucide-react";
import { getApiKey } from "../Components/LighthouseSdkAPi";
import { useFileContext } from "../Components/FileContext";
import abi from "../../utils/DealClient.json";
import Web3 from "web3";
import axios from "axios";
import DealClientForm from "../Components/DealProposalForm";
const StoreFiles = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFileHash, setUploadedFileHash] = useState<string | null>(null);
  const { setFileHash } = useFileContext();
  const [pieceCid, setPieceCid] = useState(
    "baga6ea4seaqhedb2m6yyr4wejjgxrrehujv5yp6ujzgebqaz22qlm6v74apw6oq"
  );
  const [pieceSize, setPieceSize] = useState(4096);
  const [verifiedDeal, setVerifiedDeal] = useState(false);
  const [label, setLabel] = useState("file-1686957219783.png");
  const [startEpoch, setStartEpoch] = useState(520000);
  const [endEpoch, setEndEpoch] = useState(1555200);
  const [storagePricePerEpoch, setStoragePricePerEpoch] = useState(0);
  const [providerCollateral, setProviderCollateral] = useState(0);
  const [clientCollateral, setClientCollateral] = useState(0);
  const [extraParamsVersion, setExtraParamsVersion] = useState("1");
  const [locationRef, setLocationRef] = useState(
    "https://data-depot.lighthouse.storage/api/download/download_car?fileId=c52f62f1-dd4d-4f02-8352-2af72442818d.car"
  );
  const [carSize, setCarSize] = useState(2061);
  const [skipIpniAnnounce, setSkipIpniAnnounce] = useState(false);
  const [removeUnsealedCopy, setRemoveUnsealedCopy] = useState(false);
  // console.log(setFileHash);
  const address = "0xfd562f20e65e0d87598cda7f2a1ac348a008fa0d";

  const progressCallback = (progressData: any) => {
    if (
      progressData?.total !== undefined &&
      progressData?.uploaded !== undefined
    ) {
      const total = Number(progressData.total);
      const uploaded = Number(progressData.uploaded);
    } else {
      console.error("Missing total or uploaded in progressData:", progressData);
    }
  };

  const makeDealProposal = async (e: any) => {
    e.preventDefault();

    const extraParamsV1 = {
      location_ref: locationRef,
      car_size: carSize,
      skip_ipni_announce: skipIpniAnnounce,
      remove_unsealed_copy: removeUnsealedCopy,
    };

    const DealRequestStruct = {
      piece_cid: web3.utils.hexToBytes(pieceCid),
      piece_size: pieceSize,
      verified_deal: verifiedDeal,
      label: label,
      start_epoch: startEpoch,
      end_epoch: endEpoch,
      storage_price_per_epoch: storagePricePerEpoch,
      provider_collateral: providerCollateral,
      client_collateral: clientCollateral,
      extra_params_version: extraParamsVersion,
      extra_params: extraParamsV1,
    };

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return;
    }

    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, address);
    const maxIterations = 10;

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const result = await contract.methods
        .makeDealProposal([DealRequestStruct])
        .send({ from: account });

      console.log(`Agent run successfully, hash set to: ${result}`);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("API key not retrieved");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://node.lighthouse.storage/api/v0/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const output = await response.json();

      if (output && output.Hash) {
        setFileHash(output.Hash);

        const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${output.Hash}`;

        setMessages((prevMessages) => [
          ...prevMessages,
          "File uploaded successfully!",
          `Visit at https://gateway.lighthouse.storage/ipfs/${output.Hash}`,
        ]);

        try {
          console.log("hi", ipfsUrl);

          const response = await axios.post(
            "/api/crawler",
            { url: ipfsUrl },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(ipfsUrl);

          console.log("Request success", response.data);
        } catch (error) {
          alert("File not accepted ");
          console.log("Axios error:", error);
        }
      } else {
        throw new Error("Upload output is invalid");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        "Failed to upload file. Please try again.",
      ]);
    }
  };

  const handleSendMessage = async () => {
    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, address);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const result = await contract.methods
        .sendMessage(query)
        .send({ from: account });

      console.log("Message sent:", result);
      setMessages((prevMessages) => [...prevMessages, query]);
      setQuery("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mx-auto mt-4 ">
      <div className="message-container bg-[#151518] border  rounded-sm bg-background  max-h-90 overflow-y-auto p-6 text-white  ">
        <ul className="message-list list-none p-0 bg-[#151518]">
          {messages.map((message, index) => (
            <li key={index} className="message-item py-2 ">
              {typeof message === "string" ? message : JSON.stringify(message)}
            </li>
          ))}
        </ul>
        {showUploadButton && (
          <div className="upload-container mt-4 p-4  rounded-sm bg-[#151518] text-center">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  uploadFile(e.target.files[0]);
                }
              }}
              className="upload-input text-white bg-background"
            />
          </div>
        )}
        {showUploadForm && (
          <div className="form-container mt-4 p-4 rounded-sm bg-[#151518] h-[30rem] w-[37rem]">
            <DealClientForm onSubmit={handleSendMessage} />
          </div>
        )}
      </div>
      <form
        className="fixed bottom-0 left-0 right-0 mb-[1rem] text-center p-4 overflow-hidden rounded-lg mx-auto w-[80%] border  focus-within:ring-1  focus-within:ring-blue-50"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query"
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0   text-white"
        />
        <div className="flex items-center p-3 pt-0 ">
          <Button
            size="sm"
            className="ml-auto gap-1.5"
            onClick={handleSendMessage}
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreFiles;

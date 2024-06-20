"use client";
import React, { useState, useEffect } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CornerDownLeft } from "lucide-react";
import { getApiKey } from "../Components/LighthouseSdkAPi";
import { useFileContext } from "../Components/FileContext";

const StoreFiles = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [uploadedFileHash, setUploadedFileHash] = useState<string | null>(null);
  const { setFileHash } = useFileContext();
  // console.log(setFileHash);

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

        setMessages((prevMessages) => [
          ...prevMessages,
          "File uploaded successfully!",
          `Visit at https://gateway.lighthouse.storage/ipfs/${output.Hash}`,
        ]);
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

  const handleSendMessage = () => {
    setTimeout(() => {
      if (
        query.trim().toLowerCase() === "can you help me to upload the file?"
      ) {
        setShowUploadButton(true);
        setMessages(() => ["Sure, please upload your file below."]);
      } else {
        setMessages((prevMessages) => [...prevMessages, query]);
      }
      setQuery("");
    }, 2000);
  };

  // bg-[#151518]

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

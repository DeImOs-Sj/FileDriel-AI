"use client";
import React, { useState, useEffect } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CornerDownLeft } from "lucide-react";
import { getApiKey } from "../Components/LighthouseSdkAPi";

const StoreFiles = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const progressCallback = (progressData: any) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const uploadFile = async (file: File) => {
    try {
      const apiKey = await getApiKey();
      console.log(apiKey);
      if (!apiKey) {
        console.error("API key not retrieved");
        return;
      }
      const output = await lighthouse.upload(
        file,
        apiKey,
        false,
        null,
        progressCallback
      );
      console.log("File Status:", output);
      console.log(
        "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        "File uploaded successfully!",
        `Visit at https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`,
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        "Failed to upload file. Please try again.",
      ]);
    }
  };

  const handleSendMessage = () => {
    if (query.trim().toLowerCase() === "can you help me to upload the file?") {
      setShowUploadButton(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        "Can you help me to upload the file?",
        "Sure, please upload your file below.",
      ]);
    } else {
      setMessages((prevMessages) => [...prevMessages, query]);
    }
    setQuery("");
  };

  return (
    <div className="flex-1">
      <div className="mt-4 w-[50rem] mx-auto">
        <ul className="border rounded-sm mx-auto bg-background focus-within:ring-1 focus-within:ring-ring max-h-90 overflow-y-auto p-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <li
                key={index}
                className="text-white p-2 border-b border-gray-700"
              >
                {message}
              </li>
            ))
          ) : (
            <p className="text-white">No messages found</p>
          )}
        </ul>
        {showUploadButton && (
          <div className="mt-4 p-4 border rounded-sm bg-background text-center">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  uploadFile(e.target.files[0]);
                }
              }}
              className="text-white"
            />
          </div>
        )}
      </div>
      <form
        className="fixed bottom-0 left-0 right-0 mb-[1rem] text-center p-4 overflow-hidden rounded-lg mx-auto w-[80%] border bg-background focus-within:ring-1 focus-within:ring-ring"
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
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
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

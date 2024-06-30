"use client";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../../utils/kb.json";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CornerDownLeft } from "lucide-react";

const StoreFiles = () => {
  const [query, setQuery] = useState("");
  const [runId, setRunId] = useState<number | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);

  const address = "0x3F3b6fC91fA6C55949266C0f9c13e33034Dc8FDe";

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable().catch((error: any) => {
        console.error("User denied account access", error);
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }, []);

  const handleRunAgent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, address);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const result = await contract.methods
        .startChat(query)
        .send({ from: account });
      const chatId = result.events.ChatCreated.returnValues.chatId;
      console.log("Chat started with ID:", chatId);

      setRunId(chatId);
      setLoading(true);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  const getMessages = async () => {
    if (runId === null) {
      console.log("runId is null, skipping getMessages call");
      return;
    }

    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, address);

    try {
      const result = await contract.methods
        .getMessageHistoryContents(runId)
        .call();
      console.log("Messages fetched successfully:", result);
      setMessages(result);

      if (result.length > 0) {
        setLoading(false);
        clearInterval(polling!);
        setPolling(null);
      }
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  useEffect(() => {
    if (runId !== null && polling === null) {
      const intervalId = setInterval(() => {
        getMessages();
      }, 9000);
      setPolling(intervalId);
    }

    return () => {
      if (polling !== null) {
        clearInterval(polling);
      }
    };
  }, [runId, polling]);

  return (
    <div className="flex-1">
      <div className="mt-4 w-[50rem] mx-auto">
        {runId !== null && (
          <>
            {loading ? (
              <p className="text-white">Loading messages...</p>
            ) : (
              <ul className="border rounded-sm mx-auto bg-background focus-within:ring-1 focus-within:ring-ring max-h-90 overflow-y-auto h-[40rem]">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <li key={index} className="text-white p-2">
                      {message}
                    </li>
                  ))
                ) : (
                  <p className="text-white">No messages found</p>
                )}
              </ul>
            )}
          </>
        )}
      </div>
      <form
        className="fixed bottom-0 left-0 right-0 mb-[1rem] text-center p-4 overflow-hidden rounded-lg mx-auto w-[80%] border bg-background focus-within:ring-1 focus-within:ring-ring"
        onSubmit={(e) => e.preventDefault()}
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
        <div className="flex items-center justify-between p-3 pt-0">
          <Button
            onClick={handleRunAgent}
            size="sm"
            className="ml-auto gap-1.5"
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

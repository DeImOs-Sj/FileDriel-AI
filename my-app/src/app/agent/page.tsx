"use client";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Abi, address } from "../../utils/contract";
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

  console.log(`query= ${query}, runId= ${runId}, messages= ${messages}`);

  const handleRunAgent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
    const contract = new web3.eth.Contract(Abi, address);
    const maxIterations = 10;

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const result = await contract.methods
        .runAgent(query, maxIterations)
        .send({ from: account });

      const newRunId = result.events.AgentRunCreated.returnValues.runId;
      setRunId(newRunId);
      setLoading(true);
      console.log(`Agent run successfully, runId set to: ${newRunId}`);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  const getMessages = async () => {
    if (runId === null) {
      console.log("runId is null, skipping getMessages call");
      return;
    }

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
    const contract = new web3.eth.Contract(Abi, address);

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
              <ul className="border rounded-sm mx-auto bg-background focus-within:ring-1 focus-within:ring-ring max-h-90 overflow-y-auto">
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

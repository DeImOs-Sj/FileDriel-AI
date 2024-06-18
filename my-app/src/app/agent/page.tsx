"use client";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { Abi, address } from "../../utils/contract";

const StoreFiles = () => {
  const [query, setQuery] = useState("");
  const [agentIdInput, setAgentIdInput] = useState<string>("");
  const [agentId, setAgentId] = useState<number | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);

  console.log(`query= ${query}, agentId= ${agentId}, messages= ${messages}`);

  const handleRunAgent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let agentRunCount = 0;

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

      const receipt = await contract.methods
        .runAgent(query, maxIterations)
        .send({ from: account });

      setAgentIdInput(agentRunCount.toString());
      console.log(`Agent run successfully, agentId set to: ${agentRunCount}`);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  const getMessages = async (agentId: number | null) => {
    if (agentId === null) {
      console.log("agentId is null, skipping getMessages call");
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
        .getMessageHistoryContents(agentId)
        .call();
      setMessages(result);
      console.log("Messages fetched successfully:", result);
      return result;
    } catch (error: any) {
      console.error("Error fetching message history:", error.message);
    }
  };

  const startPolling = useCallback(() => {
    // console.log("Starting polling...");
    const intervalId = setInterval(async () => {
      try {
        const result = await getMessages(agentId);
        if (result && result.length > 0) {
          clearInterval(intervalId);
          setLoading(false);
          console.log("Polling stopped, messages found.");
        }
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, 9000);
    setPolling(intervalId);
  }, [agentId]);

  useEffect(() => {
    if (agentId !== null) {
      setLoading(true);
      startPolling();
    }

    return () => {
      if (polling) {
        clearInterval(polling);
        // console.log("Polling cleared.");
      }
    };
  }, [agentId, startPolling, polling]);

  const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentIdInput(e.target.value);
  };

  const handleSetAgentId = () => {
    const inputId = parseInt(agentIdInput, 10);
    setAgentId(inputId);
  };

  return (
    <div className="flex-1">
      <div className="mt-4 w-[20rem] mx-auto">
        {agentId !== null && (
          <>
            <h2 className="bg-red-50 text-black">Agent ID: {agentId}</h2>
            {loading ? (
              <p className="text-white">Loading messages...</p>
            ) : (
              <ul className="bg-yellow-300">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <li key={index} className="bg-red-50 text-black">
                      {message}
                    </li>
                  ))
                ) : (
                  <p className="text-white">No messages found.</p>
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
        <div className="flex items-center p-3 pt-0">
          <Button
            onClick={handleRunAgent}
            size="sm"
            className="ml-auto gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
        <div className="mt-2">
          <Label htmlFor="agentIdInput" className="sr-only">
            Agent ID
          </Label>
          <Input
            type="number"
            id="agentIdInput"
            placeholder="Enter agent ID"
            value={agentIdInput}
            onChange={handleAgentIdChange}
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <Button onClick={handleSetAgentId} size="sm" className="ml-2">
            Set Agent ID
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreFiles;

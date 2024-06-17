"use client"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios"
import React, { useState ,useEffect} from 'react';

const StoreFiles = () => {
 const [query, setQuery] = useState('');
  const [agentId, setAgentId] = useState<number | null>(null);
  const [messages, setMessages] = useState<string[]>([]);


  console.log(`this is the query= ${query} and this is the agentId= ${agentId}and this is the message= ${messages}`)

  useEffect(() => {
    console.log('Component mounted   or agentId changed', { agentId });

    const handleGetMessages = async () => {
      if (agentId !== null) {
        try {
          const response = await fetch(`/api/getMessageHistoryContents?agentId=${agentId}`);
          const data = await response.json();
          console.log('Messages fetched', data);
          setMessages(data.messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    handleGetMessages();
  }, [agentId]);

  const handleRunAgent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const response = await axios.post("/api/agent", {
        query,
        account: accounts[0],
      });
      const result = response.data;
      setAgentId(result.agentId);
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  return (
    <div className="flex-1">
  
      <div className="mt-4 w-[20rem] mx-auto">
        {agentId !== null && (
                <>
                    <h2 className="bg-red-50">Agent ID: {agentId}</h2>
                    <ul className="bg-yellow-300">
                        {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                </>
            )}
        
      </div>
      <form className="fixed bottom-0 left-0 right-0 mb-[1rem] text-center p-4 overflow-hidden rounded-lg mx-auto w-[80%] border bg-background focus-within:ring-1 focus-within:ring-ring" onSubmit={(e) => e.preventDefault()}>
        <Label htmlFor="message" className="sr-only">Message</Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query"

          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button onClick={handleRunAgent} size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
          
        </div>
      </form>
    </div>
  );
};

export default StoreFiles;
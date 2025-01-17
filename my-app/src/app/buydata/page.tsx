"use client";
import React, { useState } from "react";
import { useFileContext } from "../Components/FileContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { data } from "../../lib/data";

const BuyDataPage = () => {
  const { fileHash } = useFileContext();
  const [deploying, setDeploying] = useState(false);

  const runScript = async (directory: string) => {
    try {
      const response = await fetch("/api/run-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directory,
          chunkSize: 8000,
          chunkOverlap: 100,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Script ran successfully:", data.output);
      } else {
        console.error("Error running script:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeploy = () => {
    setDeploying(true);

    setTimeout(() => {
      setDeploying(false);
      alert(
        `Deployment action simulated successfully! IPFS CID:${output.Hash}`
      );
    }, 5000);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Get Precision Data Set</h1>
      <br />
      {/* {fileHash && <p>File Hash: {fileHash}</p>} */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((model, index) => (
          <Card className="w-[350px] mb-4" key={index}>
            <CardHeader>
              <CardTitle>{model.title}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`name-${index}`}>Providers Name</Label>
                    <CardDescription>{model.createrName}</CardDescription>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`framework-${index}`}>
                      Model Description
                    </Label>
                    <CardDescription className="w-[20rem] h-[13rem]">
                      {model.modeldescription}
                    </CardDescription>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Buy</Button>
              <Button onClick={handleDeploy}>Deploy</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuyDataPage;

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BuyDataPage = () => {
  return (
    <div className=" ml-[10rem] ">
      <h1 className="text-2xl font-bold text-center">Analyze Models</h1>
      <br />
      {/* {fileHash && <p>File Hash: {fileHash}</p>} */}
      <div className="ml-6-10 ">
        <Card className="w-[350px] h-[80vh] ">
          <CardHeader>
            <CardTitle>{}</CardTitle>
            <CardDescription>{}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4 ">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`name`}>Providers Name</Label>
                  <CardDescription>John Doe</CardDescription>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`framework`}>Model Description</Label>
                  <CardDescription className="w-[20rem] h-[13rem]">
                    Employing neural networks, this model accurately classifies
                    and identifies different malware types based on heuristic
                    and signature analysis. It leverages large datasets of known
                    malware behaviors to train its classification algorithms,
                    ensuring high accuracy and reliability. The model is
                    designed to quickly adapt to new malware strains, making it
                    an essential tool for cybersecurity professionals.,
                  </CardDescription>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px] justify-center  mb-[12rem]">
                    <SelectValue placeholder="Select a Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Algorithms</SelectLabel>
                      <SelectItem value="apple">Linear Regression</SelectItem>
                      <SelectItem value="banana">
                        Logistic Regression
                      </SelectItem>
                      <SelectItem value="blueberry">Random Forests</SelectItem>
                      <SelectItem value="grapes">Q-Learning</SelectItem>
                      <SelectItem value="pineapple">
                        K-Means Clustering
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Store to Filecoin</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BuyDataPage;

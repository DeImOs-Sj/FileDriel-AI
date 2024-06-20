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

const BuyDataPage = () => {
  return (
    <div className=" ml-[10rem] ">
      <h1 className="text-2xl font-bold text-center">Run Models</h1>
      <br />
      {/* {fileHash && <p>File Hash: {fileHash}</p>} */}
      <div className="ml-6-10">
        <Card className="w-[350px] ">
          <CardHeader>
            <CardTitle>{}</CardTitle>
            <CardDescription>{}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4 ">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`name`}>Providers Name</Label>
                  <CardDescription>{}</CardDescription>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`framework`}>Model Description</Label>
                  <CardDescription className="w-[20rem] h-[13rem]">
                    {}
                  </CardDescription>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Buy</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BuyDataPage;

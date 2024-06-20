"use client";
import React from "react";
import { useFileContext } from "../Components/FileContext";

const BuyDataPage = () => {
  const { fileHash } = useFileContext();
  console.log(fileHash);

  return (
    <div className="mx-auto">
      <h1 className="">Buy Data Page</h1>
      {fileHash && <p>File Hash: {fileHash}</p>}
    </div>
  );
};

export default BuyDataPage;

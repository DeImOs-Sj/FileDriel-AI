"use client";
import React, { createContext, useState, useContext } from "react";

const defaultContextValue = {
  fileHash: undefined,
  setFileHash: () => {},
};

const FileContext = createContext(defaultContextValue);

export const useFileContext = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [fileHash, setFileHash] = useState();

  return (
    <FileContext.Provider value={{ fileHash, setFileHash }}>
      {children}
    </FileContext.Provider>
  );
};

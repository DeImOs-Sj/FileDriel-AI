"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface FileContextType {
  fileHash: string | null;
  setFileHash: (hash: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileHash, setFileHash] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ fileHash, setFileHash }}>
      {children}
    </FileContext.Provider>
  );
};

import React, { useContext, useState } from "react";
import axios from "axios";
import { PathAction } from "../pages/api/route";
import styles from "./UploadLighthouseComponent.module.css";
import sampleDynamicComponent from "../../src/components/payloads/lighthouseUploadViewAllFiles.json";
import { MyContext } from "../pages";

interface Props {
  apiKey: string;
  style?: React.CSSProperties;
}

function LighthouseUpload({ apiKey }: Props) {
  const [uploadState, setUploadState] = useState<string>("");
  const [pendingUpload, setPendingUpload] = useState<boolean>(false);
  const { dynamicAction, setDynamicAction } = useContext(MyContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Files", e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      generateCAR(file, apiKey);
    }
  };

  const generateCAR = async (file: File, apiKey: string) => {
    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    try {
      // Set up FormData to hold the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("apiKey", apiKey);

      // Send a POST request to the endpoint
      setPendingUpload(true);
      const response = await axios.post(PathAction.GENERATE_CAR, formData);
      setPendingUpload(false);

      // Handle the response
      if (response.status == 200) {
        setUploadState("Upload successful");
        dynamicAction.section1;
        setDynamicAction(sampleDynamicComponent);
      } else {
        setUploadState("Upload failed");
      }
    } catch (error) {
      console.log("LighthouseUpload Component Error:", error);
      setUploadState("Upload failed");
      setPendingUpload(false);
    }
  };

  return (
    <div className={styles["upload-lighthouse-component"]}>
      <label
        htmlFor="file-input"
        className={styles["upload-lighthouse-header"]}
      >
        FILECOIN DATA DEPOT
      </label>
      <p className={styles["upload-lighthouse-subheader"]}>
        Data prep for deal making made easy. Upload files, generate CAR and get
        CAR links - all in one place.
        <a
          href="https://data.lighthouse.storage/"
          style={{ color: "blue", fontStyle: "italic" }}
        >
          https://data.lighthouse.storage/
        </a>
      </p>

      <input onChange={handleFileChange} type="file" />
      {pendingUpload && <p>Uploading...</p>}
      {uploadState && <p>{uploadState}</p>}
    </div>
  );
}

export default LighthouseUpload;

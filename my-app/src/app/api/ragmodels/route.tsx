import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { connect } from "../../../../dbConfig/connection";
import path from "path";

connect();
const scriptPath = path.resolve(
  "/home/shlok/Desktop/galadriel/contracts/rag_tools/add_knowledge_base.py"
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { directory, chunkSize = 8000, chunkOverlap = 100 } = req.body;

    if (!directory) {
      return res.status(400).json({ error: "Directory is required" });
    }

    const command = `python3 ${scriptPath} -d ${directory} -s ${chunkSize} -o ${chunkOverlap}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return res
          .status(500)
          .json({ error: "Failed to run script", details: stderr });
      }

      console.log(stdout);
      res
        .status(200)
        .json({ message: "Script ran successfully", output: stdout });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

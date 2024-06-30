import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);

    const { url } = reqBody;

    console.log(url);

    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    } else {
      const scriptPath = "./url.py";
      const execPromise = new Promise((resolve, reject) => {
        exec(
          `python3 ${scriptPath} ${url}`,
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.error(`Error executing script: ${error.message}`);
              reject({ message: "Failed to run script", error: stderr });
            } else {
              resolve({ message: "Script ran successfully", output: stdout });
            }
          }
        );
      });

      const result = await execPromise;
      console.log(result);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

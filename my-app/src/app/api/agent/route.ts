import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "../../../utils/functions";

let agentRunCount = 0;

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { query, account } = reqBody;
  // console.log(query,account)
  const maxIterations = 10;

  try {
    console.log(query,account)
    const runId = await runAgent(query, maxIterations, account);
    const agentId = agentRunCount;
    agentRunCount++;
    return NextResponse.json({ agentId, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getMessageHistoryContents } from "../../../utils/functions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");
  console.log("hello", agentId);
  try {
    const messages = await getMessageHistoryContents(Number(agentId));
    console.log(messages);
    return NextResponse.json({ messages, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

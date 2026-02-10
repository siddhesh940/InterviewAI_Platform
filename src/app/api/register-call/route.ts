import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request, res: Response) {
  logger.info("register-call request received");

  try {
    // Check if RETELL_API_KEY is configured
    if (!process.env.RETELL_API_KEY || process.env.RETELL_API_KEY === "your_retell_api_key_here") {
      logger.error("RETELL_API_KEY is not configured");

      return NextResponse.json(
        { error: "Retell API key is not configured. Please set up your environment variables." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const interviewerId = body.interviewer_id;

    if (!interviewerId) {

      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 }
      );
    }

    const interviewer = await InterviewerService.getInterviewer(interviewerId);

    if (!interviewer || !interviewer.agent_id) {
      logger.error(`Interviewer not found or missing agent_id for ID: ${interviewerId}`);

      return NextResponse.json(
        { error: "Interviewer configuration is invalid" },
        { status: 400 }
      );
    }

    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agent_id,
      retell_llm_dynamic_variables: body.dynamic_data,
    });

    logger.info("Call registered successfully");

    return NextResponse.json(
      {
        registerCallResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error registering call:", error as Error);

    return NextResponse.json(
      { error: "Failed to register call. Please check your configuration and try again." },
      { status: 500 }
    );
  }
}

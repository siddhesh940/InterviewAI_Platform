import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function GET(res: NextRequest) {
  logger.info("create-interviewer request received");

  try {
    let newInterviewer, newSecondInterviewer;
    
    // Check if RETELL_API_KEY is available
    if (process.env.RETELL_API_KEY) {
      // Full integration with Retell AI
      const newModel = await retellClient.llm.create({
        model: "gpt-4o",
        general_prompt: RETELL_AGENT_GENERAL_PROMPT,
        general_tools: [
          {
            type: "end_call",
            name: "end_call_1",
            description:
              "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
          },
        ],
      });

      // Create Lisa
      const newFirstAgent = await retellClient.agent.create({
        response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
        voice_id: "11labs-Chloe",
        agent_name: "Lisa",
      });

      newInterviewer = await InterviewerService.createInterviewer({
        agent_id: newFirstAgent.agent_id,
        ...INTERVIEWERS.LISA,
      });

      // Create Bob
      const newSecondAgent = await retellClient.agent.create({
        response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
        voice_id: "11labs-Brian",
        agent_name: "Bob",
      });

      newSecondInterviewer = await InterviewerService.createInterviewer({
        agent_id: newSecondAgent.agent_id,
        ...INTERVIEWERS.BOB,
      });
    } else {
      // Fallback: Create interviewers without Retell integration
      logger.info("RETELL_API_KEY not found, creating interviewers without Retell integration");
      
      newInterviewer = await InterviewerService.createInterviewer({
        agent_id: "temp-lisa-" + Date.now(),
        ...INTERVIEWERS.LISA,
      });

      newSecondInterviewer = await InterviewerService.createInterviewer({
        agent_id: "temp-bob-" + Date.now(),
        ...INTERVIEWERS.BOB,
      });
    }

    logger.info("");

    return NextResponse.json(
      {
        newInterviewer,
        newSecondInterviewer,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error creating interviewers:");

    return NextResponse.json(
      { error: "Failed to create interviewers" },
      { status: 500 },
    );
  }
}

"use server";

// Simple server action without LangChain dependencies
export async function parsePdf(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // For now, return a simple response since we're using the API route instead
    // This server action is kept for compatibility but the main parsing is done in /api/parse-pdf
    return {
      success: true,
      text: "Please use the /api/parse-pdf endpoint for PDF parsing",
    };
  } catch (error) {
    console.error("Error in parse PDF action:", error);

    return {
      success: false,
      error: "Failed to parse PDF",
    };
  }
}

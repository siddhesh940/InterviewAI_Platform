import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Lazy initialization to avoid build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables are not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - Fetch all resumes for the user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient();
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      
return NextResponse.json(
        { error: "Failed to fetch resumes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("GET /api/resume-builder error:", error);
    
return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, resumeData } = body;

    if (!title || !resumeData) {
      return NextResponse.json(
        { error: "Title and resume data are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data: resume, error } = await supabase
      .from("resumes")
      .insert({
        user_id: userId,
        title,
        target_role: resumeData.contact?.jobTitle || "Professional",
        template: "professional",
        resume_data: resumeData,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      
return NextResponse.json(
        { error: "Failed to create resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error("POST /api/resume-builder error:", error);
    
return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

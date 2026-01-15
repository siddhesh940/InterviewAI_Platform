import { CreateResumeRequest, UpdateResumeRequest } from '@/types/resume';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch user's resumes
export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching resumes:', error);
      
return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }

    return NextResponse.json({ resumes: resumes || [] });
  } catch (error) {
    console.error('Error in GET /api/resumes:', error);
    
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new resume
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateResumeRequest = await request.json();
    
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert([
        {
          user_id: userId,
          title: body.title,
          target_role: body.targetRole,
          template: body.template,
          resume_data: body.resumeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating resume:', error);
      
return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
    }

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/resumes:', error);
    
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update existing resume
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateResumeRequest = await request.json();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (body.title) {updateData.title = body.title;}
    if (body.targetRole) {updateData.target_role = body.targetRole;}
    if (body.template) {updateData.template = body.template;}
    if (body.resumeData) {updateData.resume_data = body.resumeData;}

    const { data: resume, error } = await supabase
      .from('resumes')
      .update(updateData)
      .eq('id', body.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating resume:', error);
      
return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error in PUT /api/resumes:', error);
    
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

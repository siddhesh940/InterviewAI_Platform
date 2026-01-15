-- Create resumes table for storing user resume data
CREATE TABLE resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    target_role TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'executive-minimal',
    resume_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own resumes
CREATE POLICY "Users can view their own resumes" ON resumes
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes" ON resumes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own resumes
CREATE POLICY "Users can update their own resumes" ON resumes
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" ON resumes
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

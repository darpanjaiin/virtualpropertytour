-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS tour_requests;
DROP TABLE IF EXISTS properties;

-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    available BOOLEAN DEFAULT true
);

-- Create tour requests table
CREATE TABLE tour_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    property_id UUID REFERENCES properties(id),
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    call_id TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_requests ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Allow public read access to properties" 
    ON properties FOR SELECT 
    TO anon
    USING (available = true);

CREATE POLICY "Allow public insert access to tour_requests" 
    ON tour_requests FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Add sample properties
INSERT INTO properties (name, description) VALUES
    ('Ocean View Villa', 'Beautiful villa with stunning ocean views'),
    ('Mountain Retreat', 'Cozy cabin in the mountains'),
    ('Downtown Loft', 'Stylish urban living space'); 
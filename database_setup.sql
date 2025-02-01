-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS tour_requests;
DROP TABLE IF EXISTS properties;

-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    caretaker_id UUID
);

-- Create tour_requests table
CREATE TABLE tour_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    property_id UUID REFERENCES properties(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    scheduled_time TIMESTAMP WITH TIME ZONE
);

-- Add some sample properties
INSERT INTO properties (name, description) VALUES
    ('Ocean View Villa', 'Beautiful 3-bedroom villa with stunning ocean views'),
    ('Mountain Retreat', 'Cozy cabin in the mountains with modern amenities'),
    ('Downtown Loft', 'Stylish urban living space in the heart of the city');

-- Set up Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to properties" ON properties;
DROP POLICY IF EXISTS "Allow public insert access to tour_requests" ON tour_requests;

-- Create policies
CREATE POLICY "Allow public read access to properties" 
    ON properties FOR SELECT 
    TO anon
    USING (true);

CREATE POLICY "Allow public insert access to tour_requests" 
    ON tour_requests FOR INSERT 
    TO anon
    WITH CHECK (true); 
-- Create airplanes table
CREATE TABLE airplanes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    position_z FLOAT NOT NULL,
    rotation_x FLOAT NOT NULL,
    rotation_y FLOAT NOT NULL,
    rotation_z FLOAT NOT NULL,
    health INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projectiles table
CREATE TABLE projectiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    position_z FLOAT NOT NULL,
    direction_x FLOAT NOT NULL,
    direction_y FLOAT NOT NULL,
    direction_z FLOAT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE airplanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projectiles ENABLE ROW LEVEL SECURITY;

-- Allow all users to read airplane positions
CREATE POLICY "Allow public read access to airplanes" ON airplanes
    FOR SELECT USING (true);

-- Allow authenticated users to update their own airplane
CREATE POLICY "Allow users to update their own airplane" ON airplanes
    FOR UPDATE USING (auth.uid() = player_id);

-- Allow all users to read projectiles
CREATE POLICY "Allow public read access to projectiles" ON projectiles
    FOR SELECT USING (true);

-- Allow authenticated users to insert projectiles
CREATE POLICY "Allow users to insert projectiles" ON projectiles
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_airplanes_updated_at
    BEFORE UPDATE ON airplanes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
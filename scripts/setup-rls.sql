-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
-- Profile policies
CREATE POLICY "Allow all operations for authenticated users" ON profile
  FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Allow all operations for authenticated users" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Technologies policies
CREATE POLICY "Allow all operations for authenticated users" ON technologies
  FOR ALL USING (auth.role() = 'authenticated');

-- Projects policies
CREATE POLICY "Allow all operations for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Project features policies
CREATE POLICY "Allow all operations for authenticated users" ON project_features
  FOR ALL USING (auth.role() = 'authenticated');

-- Project technologies policies
CREATE POLICY "Allow all operations for authenticated users" ON project_technologies
  FOR ALL USING (auth.role() = 'authenticated');

-- Work experiences policies
CREATE POLICY "Allow all operations for authenticated users" ON work_experiences
  FOR ALL USING (auth.role() = 'authenticated');

-- Education policies
CREATE POLICY "Allow all operations for authenticated users" ON education
  FOR ALL USING (auth.role() = 'authenticated');

-- Organizational experiences policies
CREATE POLICY "Allow all operations for authenticated users" ON organizational_experiences
  FOR ALL USING (auth.role() = 'authenticated');

-- Achievements policies
CREATE POLICY "Allow all operations for authenticated users" ON achievements
  FOR ALL USING (auth.role() = 'authenticated');

-- Certifications policies
CREATE POLICY "Allow all operations for authenticated users" ON certifications
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow public read access for portfolio display (optional)
CREATE POLICY "Allow public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON project_features FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON work_experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON organizational_experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON certifications FOR SELECT USING (true);

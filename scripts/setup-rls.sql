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
CREATE POLICY "Enable all operations for authenticated users" ON profile
FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Enable all operations for authenticated users" ON services
FOR ALL USING (auth.role() = 'authenticated');

-- Technologies policies
CREATE POLICY "Enable all operations for authenticated users" ON technologies
FOR ALL USING (auth.role() = 'authenticated');

-- Projects policies
CREATE POLICY "Enable all operations for authenticated users" ON projects
FOR ALL USING (auth.role() = 'authenticated');

-- Project features policies
CREATE POLICY "Enable all operations for authenticated users" ON project_features
FOR ALL USING (auth.role() = 'authenticated');

-- Project technologies policies
CREATE POLICY "Enable all operations for authenticated users" ON project_technologies
FOR ALL USING (auth.role() = 'authenticated');

-- Work experiences policies
CREATE POLICY "Enable all operations for authenticated users" ON work_experiences
FOR ALL USING (auth.role() = 'authenticated');

-- Education policies
CREATE POLICY "Enable all operations for authenticated users" ON education
FOR ALL USING (auth.role() = 'authenticated');

-- Organizational experiences policies
CREATE POLICY "Enable all operations for authenticated users" ON organizational_experiences
FOR ALL USING (auth.role() = 'authenticated');

-- Achievements policies
CREATE POLICY "Enable all operations for authenticated users" ON achievements
FOR ALL USING (auth.role() = 'authenticated');

-- Certifications policies
CREATE POLICY "Enable all operations for authenticated users" ON certifications
FOR ALL USING (auth.role() = 'authenticated');

-- Enable public read access for portfolio display
CREATE POLICY "Enable read access for all users" ON profile
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON services
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON technologies
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON projects
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON project_features
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON project_technologies
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON work_experiences
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON education
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON organizational_experiences
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON achievements
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON certifications
FOR SELECT USING (true);

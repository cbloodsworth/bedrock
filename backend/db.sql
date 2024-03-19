CREATE TABLE Resumes (
  resume_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)  -- Assuming Users table exists
);

CREATE TABLE Sections (
  section_id INT PRIMARY KEY AUTO_INCREMENT,
  resume_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  order_number INT NOT NULL,
  FOREIGN KEY (resume_id) REFERENCES Resumes(resume_id)
);

CREATE TABLE Entries (
  entry_id INT PRIMARY KEY AUTO_INCREMENT,
  section_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  order_number INT NOT NULL,
  FOREIGN KEY (section_id) REFERENCES Sections(section_id)
);

CREATE TABLE BulletPoints (
  bulletpoint_id INT PRIMARY KEY AUTO_INCREMENT,
  entry_id INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES Entries(entry_id)
);

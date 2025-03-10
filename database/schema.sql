--Current info below for admin info is basic to test out usage. 
--Information can/will be changed for final draft

CREATE TABLE adminInfo
(
    ID INT IDENTITY(1,1) PRIMARY KEY,
    -- Auto-incrementing ID column
    MemberName TEXT DEFAULT 'unknown',
    E_mail TEXT DEFAULT 'user@mail.com',
    PhoneNum INTEGER DEFAULT 0000000000
);
-- create database
CREATE DATABASE
IF NOT EXISTS togetherculture;
USE togetherculture;
-- Alex's memberships table
CREATE TABLE
IF NOT EXISTS memberships
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  membership_name VARCHAR
(100) NOT NULL,
  monthly_cost DECIMAL
(5,2) NOT NULL,
  joining_fee DECIMAL
(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--  Create the membership_benefits table
CREATE TABLE
IF NOT EXISTS membership_benefits
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  membership_id BIGINT NOT NULL,
  benefit_text VARCHAR
(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_membership_id
    FOREIGN KEY
(membership_id) 
    REFERENCES memberships
(id)
    ON
DELETE CASCADE
    ON
UPDATE CASCADE
) ENGINE=InnoDB;

-- Create the events table
CREATE TABLE
IF NOT EXISTS events
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR
(255) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR
(255) NOT NULL,
  description TEXT,
  image_path VARCHAR
(255),
  category VARCHAR
(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--  Create the workspace_applications table
CREATE DATABASE
IF NOT EXISTS togetherculture;
USE togetherculture;

CREATE TABLE
IF NOT EXISTS workspace_applications
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR
(100),
  last_name VARCHAR
(100),
  email VARCHAR
(100),
  phone VARCHAR
(50),
  membership_reason TEXT,
  company_address TEXT,
  participated_cultural TEXT,
  referral_source TEXT
);

--  Create the support_requests table
CREATE TABLE
IF NOT EXISTS support_requests
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR
(255) NOT NULL,
  email VARCHAR
(255) NOT NULL,
  issue_type VARCHAR
(50) NOT NULL,
  issue_description TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

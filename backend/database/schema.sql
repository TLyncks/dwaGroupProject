--Information below is a draft of the final tables

--Admin(only us 4)
CREATE TABLE adminInfo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    MemberName VARCHAR(255) DEFAULT 'unknown',
    E_mail VARCHAR(255) DEFAULT 'user@mail.com',
    PhoneNum VARCHAR(15) DEFAULT '0000000000'
);

--All base users, key members, company members will be here
--memberID is the identifier key that links to other tables
CREATE TABLE BaseUser (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    UserName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    UserAddress TEXT,
    UserPhone VARCHAR(20) UNIQUE NOT NULL,
    isKeyMember BOOLEAN DEFAULT FALSE,  -- Key members have more permissions
    dateAccountMade DATETIME DEFAULT CURRENT_TIMESTAMP,
    eventsHosted INT DEFAULT 0 CHECK (eventsHosted >= 0),
    eventsAttended INT DEFAULT 0 CHECK (eventsAttended >= 0),
    interest1 VARCHAR(100),  -- 5 words (approximate)
    interest2 VARCHAR(100),
    interest3 VARCHAR(100),
    memberID INT UNIQUE NOT NULL CHECK (memberID BETWEEN 100000 AND 999999),  -- Unique identifier across the system
    timesWorkspaceReserved INT DEFAULT 0 CHECK (timesWorkspaceReserved >= 0)
    benefitProgress INT NOT NULL DEFAULT 0
);


--This table will be replicated for each company. 
--This is the template for the table that will hold each company member. 
--memberID links to each person's base user account
--companyID links to the master company table that lists all the generic info for each company
CREATE TABLE company_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each role entry
    memberID INT NOT NULL,  -- Links to BaseUser
    company_id INT NOT NULL,  -- Links to companies
    role VARCHAR(100) NOT NULL,  -- Employee title (e.g., Manager, Engineer)
    area ENUM('Management', 'Leadership', 'HR', 'Marketing', 'Finance', 
              'Sales', 'Product Development', 'Support Staff', 'Other') NOT NULL,
    is_company_admin BOOLEAN DEFAULT FALSE,  -- Admin status
    FOREIGN KEY (memberID) REFERENCES BaseUser(memberID) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);


--master company info that hold the generic info that must be completed when filling out an application 
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    leader VARCHAR(255) NOT NULL,  -- Main leader (e.g., CEO)
    companyAddress VARCHAR(255), -- Address of the company
    companyPhone VARCHAR(20), --main contact number
    companyEmail VARCHAR(255), --main contact email
    companyWebsite VARCHAR(255), --main website
    memberCountUsingTC INT,
    companyBio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Calendar (
    event_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique event identifier
    organizer_id INT NOT NULL, -- Link to the user creating the event
    title VARCHAR(255) NOT NULL, -- Event title
    description TEXT, -- Event details
    start_date DATE NOT NULL, -- Event start date
    end_date DATE NOT NULL, -- Event end date
    start_time TIME NOT NULL, -- Event start time
    end_time TIME NOT NULL, -- Event end time
    recurrence ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none', -- Recurrence settings
    visibility ENUM('public', 'private', 'members-only') DEFAULT 'public', -- Event visibility settings
    CONSTRAINT fk_calendar_user FOREIGN KEY (organizer_id) REFERENCES BaseUser(id) -- Foreign key to link organizer_id to BaseUser table
    ON DELETE CASCADE -- If user is deleted, their events are removed
);

CREATE TABLE EventAttendees (
    attendee_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique record for each attendee-event combination
    event_id INT NOT NULL, -- Links to Calendar table
    user_id INT NOT NULL, -- Links to BaseUser table
    status ENUM('attending', 'maybe', 'declined') DEFAULT 'attending', -- RSVP status

    -- Foreign keys to ensure relationships
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES Calendar(event_id) 
    ON DELETE CASCADE, -- If an event is deleted, remove its attendees
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES BaseUser(id) 
    ON DELETE CASCADE -- If a user is deleted, remove their attendance records
);



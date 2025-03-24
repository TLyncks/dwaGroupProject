-- =========================================
-- ========== Malcom's Tables ==============
-- =========================================

-- Admin (Only us 4)
CREATE TABLE adminInfo
(
        ID INT
        AUTO_INCREMENT PRIMARY KEY,
    MemberName VARCHAR
        (255) DEFAULT 'unknown',
    E_mail VARCHAR
        (255) DEFAULT 'user@mail.com',
    PhoneNum VARCHAR
        (15) DEFAULT '0000000000'
);

        -- All base users, key members, company members will be here
        -- memberID is the identifier key that links to other tables
        CREATE TABLE BaseUser
        (
                id INT
                AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    UserName VARCHAR
                (100) NOT NULL,
    userEmail VARCHAR
                (255) UNIQUE NOT NULL,
    password_hash VARCHAR
                (255) NOT NULL,
    UserAddress TEXT,
    UserPhone VARCHAR
                (20) UNIQUE NOT NULL,
    isKeyMember BOOLEAN DEFAULT FALSE,  -- Key members have more permissions
    dateAccountMade DATETIME DEFAULT CURRENT_TIMESTAMP,
    eventsHosted INT DEFAULT 0 CHECK
                (eventsHosted >= 0),
    eventsAttended INT DEFAULT 0 CHECK
                (eventsAttended >= 0),
    interest1 VARCHAR
                (100),  -- Up to 5 words
    interest2 VARCHAR
                (100),
    interest3 VARCHAR
                (100),
    memberID INT UNIQUE NOT NULL CHECK
                (memberID BETWEEN 100000 AND 999999),
    timesWorkspaceReserved INT DEFAULT 0 CHECK
                (timesWorkspaceReserved >= 0),
    benefitProgress INT NOT NULL DEFAULT 0
);

                -- This table will be replicated for each company.
                -- memberID links to each person's base user account
                -- companyID links to the master company table that lists all the generic info for each company
                CREATE TABLE company_roles
                (
                        role_id INT
                        AUTO_INCREMENT PRIMARY KEY,    -- Unique ID for each role entry
    memberID INT NOT NULL,                     -- Links to BaseUser
    company_id INT NOT NULL,                   -- Links to companies
    role VARCHAR
                        (100) NOT NULL,                -- Employee title (e.g., Manager, Engineer)
    area ENUM
                        ('Management', 'Leadership', 'HR', 'Marketing', 'Finance',
              'Sales', 'Product Development', 'Support Staff', 'Other') NOT NULL,
    is_company_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY
                        (memberID) REFERENCES BaseUser
                        (memberID) ON
                        DELETE CASCADE,
    FOREIGN KEY (company_id)
                        REFERENCES companies
                        (company_id) ON
                        DELETE CASCADE
);

                        -- Master company info that holds the generic info
                        CREATE TABLE companies
                        (
                                company_id INT
                                AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR
                                (255) NOT NULL UNIQUE,
    leader VARCHAR
                                (255) NOT NULL,
    companyAddress VARCHAR
                                (255),
    companyPhone VARCHAR
                                (20),
    companyEmail VARCHAR
                                (255),
    companyWebsite VARCHAR
                                (255),
    memberCountUsingTC INT,
    companyBio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
                                CREATE TABLE Calendar
                                (
                                        event_id INT
                                        AUTO_INCREMENT PRIMARY KEY, -- Unique event identifier
    title VARCHAR
                                        (255) NOT NULL, -- Event title
    description TEXT, -- Event details
    image_url VARCHAR
                                        (255) NOT NULL, -- Event image URL
=======
CREATE TABLE Calendar (
    event_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique event identifier
    title VARCHAR(255) NOT NULL, -- Event title
    description TEXT, -- Event details
    image_url VARCHAR(255) NOT NULL, -- Event image URL
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211
    start_date DATE NOT NULL, -- Event start date
    end_date DATE NOT NULL, -- Event end date
    start_time TIME NOT NULL, -- Event start time
    end_time TIME NOT NULL, -- Event end time
<<<<<<< HEAD
    recurrence ENUM
                                        ('none', 'daily', 'weekly', 'monthly') DEFAULT 'none', -- Recurrence settings
    visibility ENUM
                                        ('public', 'private', 'members-only') DEFAULT 'public' -- Event visibility settings
=======
    recurrence ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none', -- Recurrence settings
    visibility ENUM('public', 'private', 'members-only') DEFAULT 'public' -- Event visibility settings
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211
);

                                        CREATE TABLE EventAttendees
                                        (
                                                attendee_id INT
                                                AUTO_INCREMENT PRIMARY KEY, -- Unique record for each attendee-event combination
    event_id INT NOT NULL, -- Links to Calendar table
    user_id INT NOT NULL, -- Links to BaseUser table
    status ENUM
                                                ('attending', 'maybe', 'declined') DEFAULT 'attending', -- RSVP status

    -- Foreign keys to ensure relationships
    CONSTRAINT fk_event FOREIGN KEY
                                                (event_id) REFERENCES Calendar
                                                (event_id) 
    ON
                                                DELETE CASCADE, -- If an event is deleted, remove its attendees
    CONSTRAINT fk_user FOREIGN KEY
                                                (user_id) REFERENCES BaseUser
                                                (id) 
    ON
                                                DELETE CASCADE -- If a user is deleted, remove their attendance records
);



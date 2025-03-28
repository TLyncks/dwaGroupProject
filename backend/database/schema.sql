-- ========================================
-- ========== Malcom's Tables ============
-- ========================================

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

        -- BaseUser: All base users (key members, company members, etc.)
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
                (20) UNIQUE,        -- Allows NULL values if not provided
    isKeyMember BOOLEAN DEFAULT FALSE,
    dateAccountMade DATETIME DEFAULT CURRENT_TIMESTAMP,
    eventsHosted INT DEFAULT 0 CHECK
                (eventsHosted >= 0),
    eventsAttended INT DEFAULT 0 CHECK
                (eventsAttended >= 0),
    interest1 VARCHAR
                (100),
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

                -- Company roles: Links BaseUser to companies with specific roles
                CREATE TABLE company_roles
                (
                        role_id INT
                        AUTO_INCREMENT PRIMARY KEY,    -- Unique ID for each role entry
    memberID INT NOT NULL,                     -- Links to BaseUser
    company_id INT NOT NULL,                   -- Links to companies
    role VARCHAR
                        (100) NOT NULL,                -- Employee title (e.g., Manager, Engineer)
    area ENUM
                        ('Management','Leadership','HR','Marketing','Finance','Sales','Product Development','Support Staff','Other') NOT NULL,
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

                        -- Companies: Master table for company information
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

                                -- Calendar: Events table
                                CREATE TABLE Calendar
                                (
                                        event_id INT
                                        AUTO_INCREMENT PRIMARY KEY,  -- Unique event identifier
    title VARCHAR
                                        (255) NOT NULL,              -- Event title
    description TEXT,                         -- Event details
    image_url VARCHAR
                                        (255) NOT NULL,          -- Event image URL
    start_date DATE NOT NULL,                 -- Event start date
    end_date DATE NOT NULL,                   -- Event end date
    start_time TIME NOT NULL,                 -- Event start time
    end_time TIME NOT NULL,                   -- Event end time
    recurrence ENUM
                                        ('none','daily','weekly','monthly') DEFAULT 'none',
    visibility ENUM
                                        ('public','private','members-only') DEFAULT 'public'
);

                                        -- EventAttendees: Records which user joined which event
                                        CREATE TABLE EventAttendees
                                        (
                                                attendee_id INT
                                                AUTO_INCREMENT PRIMARY KEY,  -- Unique record for each attendee-event combination
    event_id INT NOT NULL,                       -- Links to Calendar table
    user_id INT NOT NULL,                        -- Links to BaseUser table
    status ENUM
                                                ('attending','maybe','declined') DEFAULT 'attending',
    CONSTRAINT fk_event FOREIGN KEY
                                                (event_id) REFERENCES Calendar
                                                (event_id) ON
                                                DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY
                                                (user_id) REFERENCES BaseUser
                                                (id) ON
                                                DELETE CASCADE
);

                                                -- ========================================
                                                -- ========== Support Requests ============
                                                -- ========================================
                                                CREATE TABLE support_request
                                                (
                                                        id INT
                                                        AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR
                                                        (100),
    email VARCHAR
                                                        (255),
    issue_type VARCHAR
                                                        (50),
    issue_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

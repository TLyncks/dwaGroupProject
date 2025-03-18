-- =========================================
-- ========== Malcom's tables    ===========
-- =========================================

-- Admin(only us 4)
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
    --Admin(only us 4)
    CREATE TABLE adminInfo
    (
        ID tinyint
        AUTO_INCREMENT PRIMARY KEY,
    MemberName VARCHAR
        (255) DEFAULT 'unknown',
    E_mail VARCHAR
        (255) DEFAULT 'user@mail.com'
);

        -- All base users, key members, company members will be here
        -- memberID is the identifier key that links to other tables
        CREATE TABLE BaseUser
        (
            id INT
            AUTO_INCREMENT PRIMARY KEY,          -- Unique identifier for each user
    UserName VARCHAR
            (100) NOT NULL,
    userEmail VARCHAR
            (255) UNIQUE NOT NULL,
    password_hash VARCHAR
            (255) NOT NULL,
    UserAddress TEXT,
    UserPhone VARCHAR
            (20) UNIQUE NOT NULL,
    isKeyMember BOOLEAN DEFAULT FALSE,          -- Key members have more permissions
    dateAccountMade DATETIME DEFAULT CURRENT_TIMESTAMP,
    eventsHosted INT DEFAULT 0 CHECK
            (eventsHosted >= 0),
    eventsAttended INT DEFAULT 0 CHECK
            (eventsAttended >= 0),
    interest1 VARCHAR
            (100),  -- up to 5 words
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
            -- This is the template for the table that will hold each company member.
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

                    -- Calendar for events
                    CREATE TABLE Calendar
                    (
                        event_id INT
                        AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,   -- Link to the user creating the event
    title VARCHAR
                        (255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    recurrence ENUM
                        ('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    visibility ENUM
                        ('public', 'private', 'members-only') DEFAULT 'public',
    CONSTRAINT fk_calendar_user FOREIGN KEY
                        (organizer_id)
        REFERENCES BaseUser
                        (id)
        ON
                        DELETE CASCADE
);

                        CREATE TABLE EventAttendees
                        (
                            attendee_id INT
                            AUTO_INCREMENT PRIMARY KEY,  -- Unique record for each attendee-event combination
    event_id INT NOT NULL,                       -- Links to Calendar table
    user_id INT NOT NULL,                        -- Links to BaseUser table
    status ENUM
                            ('attending', 'maybe', 'declined') DEFAULT 'attending',

    CONSTRAINT fk_event FOREIGN KEY
                            (event_id) REFERENCES Calendar
                            (event_id) ON
                            DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY
                            (user_id) REFERENCES BaseUser
                            (id) ON
                            DELETE CASCADE
);


                            -- =========================================
                            -- ========== Alex's tables   ===========
                            -- =========================================


                            -- 1) Memberships: Stores membership tiers (Community, Key Access, etc.)
                            CREATE TABLE Memberships
                            (
                                membership_id INT
                                AUTO_INCREMENT PRIMARY KEY,
    membership_name VARCHAR
                                (255) NOT NULL,
    monthly_cost DECIMAL
                                (10,2) DEFAULT 0.00,
    joining_fee DECIMAL
                                (10,2) DEFAULT 0.00,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

                                -- 2) membership_benefits: Each membership can have multiple benefits
                                CREATE TABLE membership_benefits
                                (
                                    benefit_id INT
                                    AUTO_INCREMENT PRIMARY KEY,
    membership_id INT NOT NULL,
    benefit_text VARCHAR
                                    (255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY
                                    (membership_id)
        REFERENCES Memberships
                                    (membership_id)
        ON
                                    DELETE CASCADE
);

                                    -- 3) events: A simpler events table (if you want an alternative to Calendar)
                                    CREATE TABLE events
                                    (
                                        id INT
                                        AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR
                                        (255) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR
                                        (255),
    description TEXT,
    image_path VARCHAR
                                        (255),
    category VARCHAR
                                        (100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

                                        -- 4) support_request: For storing Contact/Support form submissions
                                        CREATE TABLE support_request
                                        (
                                            id INT
                                            AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR
                                            (255) NOT NULL,
    email VARCHAR
                                            (255) NOT NULL,
    issue_type VARCHAR
                                            (100),
    issue_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

                                            -- 5) workspace_application: For Creative Workspace membership application forms
                                            CREATE TABLE workspace_application
                                            (
                                                id INT
                                                AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR
                                                (100),
    last_name VARCHAR
                                                (100),
    email VARCHAR
                                                (255) NOT NULL,
    phone VARCHAR
                                                (20),
    reason TEXT,
    company_address TEXT,
    participant_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
                                                -- Login and Signup table
                                                CREATE TABLE users
                                                (
                                                    id INT
                                                    AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR
                                                    (100) NOT NULL,
  email VARCHAR
                                                    (255) NOT NULL UNIQUE,
  password_hash VARCHAR
                                                    (255) NOT NULL
);

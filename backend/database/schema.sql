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
    full_name VARCHAR (100),
    email VARCHAR   (255),
    issue_type VARCHAR  (50),
    issue_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);






-- MySQL Script generated by MySQL Workbench
-- Mon Mar 31 13:19:33 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
--
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table admininfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS`admininfo` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `MemberName` VARCHAR(255) NULL DEFAULT 'unknown',
  `E_mail` VARCHAR(255) NULL DEFAULT 'user@mail.com',
  `PhoneNum` VARCHAR(15) NULL DEFAULT '0000000000',
  PRIMARY KEY (`ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `baseuser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `baseuser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `UserName` VARCHAR(100) NOT NULL,
  `userEmail` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `UserAddress` TEXT NULL DEFAULT NULL,
  `UserPhone` VARCHAR(20) NULL DEFAULT NULL,
  `isKeyMember` TINYINT(1) NULL DEFAULT '0',
  `dateAccountMade` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `eventsHosted` INT NULL DEFAULT '0',
  `eventsAttended` INT NULL DEFAULT '0',
  `interest1` VARCHAR(100) NULL DEFAULT NULL,
  `interest2` VARCHAR(100) NULL DEFAULT NULL,
  `interest3` VARCHAR(100) NULL DEFAULT NULL,
  `memberID` INT NOT NULL,
  `timesWorkspaceReserved` INT NULL DEFAULT '0',
  `benefitProgress` INT NOT NULL DEFAULT '0',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `userEmail` (`userEmail` ASC) VISIBLE,
  UNIQUE INDEX `memberID` (`memberID` ASC) VISIBLE,
  UNIQUE INDEX `UserPhone` (`UserPhone` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table`calendar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `recurrence` ENUM('none', 'daily', 'weekly', 'monthly') NULL DEFAULT 'none',
  `visibility` ENUM('public', 'private', 'members-only') NULL DEFAULT 'public',
  PRIMARY KEY (`event_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `companies` (
  `company_id` INT NOT NULL AUTO_INCREMENT,
  `companyName` VARCHAR(255) NOT NULL,
  `leader` VARCHAR(255) NOT NULL,
  `companyAddress` VARCHAR(255) NULL DEFAULT NULL,
  `companyPhone` VARCHAR(20) NULL DEFAULT NULL,
  `companyEmail` VARCHAR(255) NULL DEFAULT NULL,
  `companyWebsite` VARCHAR(255) NULL DEFAULT NULL,
  `memberCountUsingTC` INT NULL DEFAULT NULL,
  `companyBio` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`company_id`),
  UNIQUE INDEX `companyName` (`companyName` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `company_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `company_roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `memberID` INT NOT NULL,
  `company_id` INT NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `area` ENUM('Management', 'Leadership', 'HR', 'Marketing', 'Finance', 'Sales', 'Product Development', 'Support Staff', 'Other') NOT NULL,
  `is_company_admin` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`role_id`),
  INDEX `memberID` (`memberID` ASC) VISIBLE,
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `company_roles_ibfk_1`
    FOREIGN KEY (`memberID`)
    REFERENCES `dwa_website_db`.`baseuser` (`memberID`)
    ON DELETE CASCADE,
  CONSTRAINT `company_roles_ibfk_2`
    FOREIGN KEY (`company_id`)
    REFERENCES `dwa_website_db`.`companies` (`company_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventattendees`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventattendees` (
  `attendee_id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `status` ENUM('attending', 'maybe', 'declined') NULL DEFAULT 'attending',
  PRIMARY KEY (`attendee_id`),
  INDEX `fk_event` (`event_id` ASC) VISIBLE,
  INDEX `fk_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `dwa_website_db`.`calendar` (`event_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `dwa_website_db`.`baseuser` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table ``.`membership_application`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `membership_application` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(15) NULL DEFAULT NULL,
  `membership_type` ENUM('user', 'admin', 'key member') NOT NULL DEFAULT 'user',
  `reason` TEXT NULL DEFAULT NULL,
  `participated` TEXT NULL DEFAULT NULL,
  `heard_about` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `support_request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `support_request` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `issue_type` VARCHAR(50) NULL DEFAULT NULL,
  `issue_description` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
--Current info below for admin info is basic to test out usage. 
--Information can/will be changed for final draft

CREATE TABLE adminInfo (
    ID INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incrementing ID column
    MemberName TEXT DEFAULT 'unknown',
    E_mail TEXT DEFAULT 'user@mail.com',
    PhoneNum INTEGER DEFAULT 0000000000
);
--Added myself as example
--TODO FInalize all columns with appropriate data
--TODO create databases for different member levels?
--TODO create seperate password/user database?
--TODO calendar database?

const db = require('../config/database.js');
const bcrypt = require('bcrypt');



// Controller to get user details for settings and benefits??
const getUserProfile = async (req, res) => {
  try {

    console.log('🔹 Checking session:', req.session); // TODO Debugging log
    const userId = req.session.userId;      //TODO check which information is transfered over and used here

    if (!userId) {
      console.log('NOOOOO Unauthorized: No userId in session');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(`🔹 Fetching user data for userId: ${userId}`); //TODO delete debug
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE memberID = ?', [userId]); //TODO needs to accurately take data from mysql
    if (rows.length === 0) {
      console.log('NOOOO User not found in database'); //TODO delete debug
      return res.status(404).json({ error: 'User not found' });
    } 

    const user = rows[0];
    console.log('YESSSSSS User Data Retrieved:', user); //TODO debug
    res.json(user);                           //TODO adjust depending on data taken from mysql

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//first call for the dashboard data
const getUserProfileForDash = async (req, res) => {
  try {
    console.log('🔹 Checking session:', req.session); // TODO Debugging log
    const userId = req.session.userId;      //TODO check which information is transfered over and used here

    if (!userId) {
      console.log('NOOOOOO Unauthorized: No userId in session');
      return res.status(401).json({ error: 'Unauthorized' });

    }
    console.log(`🔹 Fetching user data for userId: ${userId}`); //TODO delete debug
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE memberID = ?', [userId]); //TODO needs to accurately take data from mysql
    if (rows.length === 0) {
      console.log('NOOOOOO User not found in database'); //TODO delete debug
      return res.status(404).json({ error: 'User not found' });
    } 


    const user = rows[0];
    console.log('YESSSSS User Data Retrieved:', user); //TODO debug
    res.json({                              //TODO adjust depending on data taken from mysql
      fullName: user.UserName,
      email: user.userEmail,
      ID : user.memberID,
      Membership: user.membershipType, 
      otherInfo: user.otherInfo || 'No additional info available'

    });


  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}







const updateUserProfile = async (req, res) => {
  try {

      const userId = req.session.userId; //TODO does this need to be changed to match memberID
      const { UserName, userEmail, UserPhone, UserAddress, interest1, interest2, interest3 } = req.body;

      console.log('Updating profile for memberID:', userId);
      console.log('Received update data:', { UserName, userEmail, UserPhone, UserAddress, interest1, interest2, interest3 });

      


      await db.pool.query(
          `UPDATE baseuser 
           SET UserName = ?, userEmail = ?, UserPhone = ?, UserAddress = ?, interest1 = ?, interest2 = ?, interest3 = ? 
           WHERE memberID = ?`,
          [UserName, userEmail, UserPhone, UserAddress, interest1, interest2, interest3, userId]
      );

      res.json({ message: 'Profile updated successfully' });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



  const updateUserPassword = async (req, res) =>{

    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.session.userId; // TODO make sure the middleware part makes sense

    
      const [user] = await db.pool.execute('SELECT password_hash FROM baseuser WHERE memberID = ?', [userId]);
      if (!user || user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const storedHash = user[0].password_hash;

      
      const isMatch = await bcrypt.compare(currentPassword, storedHash);
      if (!isMatch) {
          return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // TODO see if adding salt instead of base hash messes with what alex initially made for login
      const saltRounds = 10;
      const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

      console.log('heres db: ', db);
      
      await db.pool.execute('UPDATE baseuser SET password_hash = ? WHERE memberID = ?', [newHashedPassword, userId]);

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }



  };

 

  //then this updates the progress bar
  const updateBenefitProgress = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { benefitProgress } = req.body;
      await db.pool.query(
        'UPDATE baseuser SET benefitProgress = ? WHERE memberID = ?',
        [benefitProgress, userId]
      );
      res.json({ message: 'Benefit progress updated successfully' });
    } catch (error) {
      console.error('Error updating benefit progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  //getting data for the benefits dashboard TODO maybe delete??
  const getBenefitData = async (req, res) => {
    try {
      const userId = req.session.userId; 
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const [rows] = await db.pool.query(
        `SELECT membershipType, benefitProgress, timesWorkspaceReserved, eventsAttended, eventsHosted, memberID 
         FROM baseuser 
         WHERE memberID = ?`,
        [userId]
          
      );
      if (rows.length === 0) {
        console.log('user data for', userId,' fetched: ', rows)
        return res.status(404).json({ error: 'User not found' });
        
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching benefit data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  const showMyEvents = async (req, res) => {
    try {
      const sessionMemberId = req.session.userId;
      if (!sessionMemberId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userQuery = 'SELECT id, UserName, eventsHosted, eventsAttended FROM baseuser WHERE memberID = ?';
      const [userRows] = await db.pool.query(userQuery, [sessionMemberId]);
      const userIncrementID = userRows[0].id;
      console.log('userIncrementID:', userIncrementID);

      if (!userRows || userRows.length === 0) {
      return res.status(404).send('User not found.');
    }
    const user = userRows[0];

    const hostedEventsQuery = 'SELECT event_id, user_id, title, description, image_url, start_date, end_date, end_time FROM calendar WHERE user_id = ?';
    const [hostedEvents] = await db.pool.query(hostedEventsQuery, [userIncrementID]);

    const attendedEventsQuery = `
      SELECT c.event_id, c.title, c.description, c.image_url, c.start_date, c.end_date, c.end_time
      FROM calendar AS c
      INNER JOIN eventattendees AS ea ON c.event_id = ea.event_id
      WHERE ea.user_id = ?
    `;
    const [attendedEvents] = await db.pool.query(attendedEventsQuery, [userIncrementID]);

    const uniqueAttendedEvents = attendedEvents.filter((event, index, self) =>
      index === self.findIndex((e) => e.event_id === event.event_id)
    );
    console.log('unique events:' + uniqueAttendedEvents);

    return res.json({
         user,
         hostedEvents,
         attendedEvents: uniqueAttendedEvents,
       });
    } catch (error) {
      console.error('Error on page:', error);
      return res.status(500).send('Server error retrieving events.');
    }
  };
        
      
    


    




  

//take id from baseuser that matches memberID which is req.session.userId. The id from baseuser is then used to scan event_attendees. 
//if there is a user_id that matches the id from baseuser, it takes all the rows with the id. Then compares the event_id from the row
//and takes the event information from calendar. The event info is displayed. A button will display as well. If the user selects
//a sweet alert appears suggesting do you want to remove from event. If yes then the will be removed from event_attendee table for that event




  module.exports = { getUserProfile, updateUserProfile, updateUserPassword, getUserProfileForDash, updateBenefitProgress, getBenefitData, showMyEvents };

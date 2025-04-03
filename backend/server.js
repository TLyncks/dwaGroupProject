require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();



app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ====== MIDDLEWARE ======
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session setup (store secret in .env)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,

    //TODO THIS NEEDS TO BE COMMENTED OUT TO RUN LOCALLY. IF USING ZROK, NEEDS THIS AND MORE TO PROPERLY STORE AND USE SESSION DATA
   /* cookie: {
      //secure: process.env.NODE_ENV === 'production', could this have worked idk boo this is frustrating me
      secure: false, // Change to 'true' if using HTTPS
      httpOnly: true, // Prevents client-side JS from accessing it
      sameSite: 'None', // Required for cross-site cookies with zrok
    },*/
  })
);

// Serve static files from the "frontend" folder
// e.g., "frontend/index.html" → "http://localhost:5000/index.html"
app.use(express.static(path.join(__dirname, '../frontend')));




//  event routes
const eventRoutes = require('./admin/routes/eventRoutes.js');

// Registration routes
const userRoutes = require('./non members/Routes/registrationRoute.js');

// Support route

const supportRoute = require('./non members/Routes/SupportRoute.js');

//authorisation route
const authRoute = require('./non members/Routes/authRoute.js')

//loggedin users route
const memberRoutesThis = require('./Members/memberRoutes.js');
// ====== ROUTES ======

//TODO THESE ROUTES NEED TO BE CHANGED, AS THEY ALL START AT THE SAME PLACE AND CAN CONFLICT. THEY NEED TO BE NAMED /Events, /routes...
//THE location they are called at needs to be changed as well. 

// Registration routes on root
app.use('/', userRoutes);

// Event routes mounted at /events
app.use('/', eventRoutes);

// Auth routes on root
app.use('/', authRoute); 


app.use('/member', memberRoutesThis);


app.use('/', supportRoute);


app.get('/', (req, res) => {
  res.send('API is running...');
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


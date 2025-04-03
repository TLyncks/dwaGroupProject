async function fetchUserProfile() {
    try {
      const response = await fetch('/member/dashboard', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      displayUserProfile(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Could not load user data. Please try again.');
    }
  }

/*
  async function fetchUserSettings() {
    try {
      const response = await fetch('/member/settings', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      displayUserProfile(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Could not load user data. Please try again.');
    }
  }
    */


  /*
  function displayUserProfile(user) {
    const profileImage = document.getElementById('userProfileImage');
    const profileDetails = document.getElementById('profile-Details');
    profileDetails.innerHTML = ''; // Clear previous content
  
    // Set Profile Image
    profileImage.src = user.profileImage || 'UserDashPhotos/defaultIcon.jpg';
  
    // Create data mapping
    const userInfo = {
      'Name': user.UserName || 'Unknown',
      'Email': user.userEmail || 'No Email Provided',
      'Phone': user.UserPhone || 'No Phone Number',
      'Member ID': user.memberID || 'N/A'
    };
  
    // Dynamically create and append the user details
    for (const [label, value] of Object.entries(userInfo)) {
      const infoItem = document.createElement('p');
      infoItem.innerHTML = `<strong>${label}:</strong> ${value}`;
      profileDetails.appendChild(infoItem);
    }
  }
  */



  function displayUserProfile(userData) {
    const profileElement = document.getElementById('profile-details'); // Replace with actual element ID
  
    //  ${userData.profileImage ||_____________________}
    // add ^^^ this line above <h2>Welcome</h2> if we incorporate profile pictures to swap between user and default photo
   // <img src="  ../UserDashPhotos/default-profile.png" alt="Profile Image"></img> 
    //ROUTE CORRECT DEFAULT PHOTO BELOW FJIGOUJIBD:LIJSGHKBVIWLNOD:SGILHJ>B 
    if (profileElement) {
      profileElement.innerHTML = `
       
        <h2>Welcome</h2>
        <p> ${userData.fullName}</p>
        <p>Email: ${userData.email}</p>
        
        
      `;
    } else {
      console.error("Profile element not found.");
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    fetchUserProfile();
  });
  // Call function on load
  //document.addEventListener('DOMContentLoaded', fetchUserProfile);
  
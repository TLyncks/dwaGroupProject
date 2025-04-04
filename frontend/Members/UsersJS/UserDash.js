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








  function displayUserProfile(userData) {
    const profileElement = document.getElementById('userProfileThis'); 
    if (profileElement) {
      profileElement.innerHTML = `
        <div id="userProfileImage">
          <img src="UserDashPhotos/defaultIcon.jpg" alt="User Profile">
        </div>
        <div class="profile-info">
          <div class="contact-info">
            <p class="email">${userData.email}</p>
            <p class="member-id">ID: ${userData.ID}</p>
          </div>
          <div class="welcome-name">
            <span class="welcome-text">Welcome,</span>
            <span class="user-name">${userData.fullName}</span>
          </div>
        </div>
        <div class="profile-settings">
          <a href= "./Settings.html" class="btn btn-primary">Settings</a>
        </div>
      `;
    } else {
      console.error("Profile element not found.");
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", function() {
    fetchUserProfile();
  });
  
  
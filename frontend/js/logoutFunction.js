
//USE THIS AT END OF HTML       <script src = "../js/logoutFunction.js"></script>           MAKE SURE THE PATH IS ACCURATE



      // SESSION MANAGEMENT: Force redirect if not logged in (for protected dashboard)
      (function checkSession() {
        if (localStorage.getItem("loggedIn") !== "true") {
          window.location.href = "/non members/registration.html?tab=login";
        }
      })();
      
      // Update Dashboard header based on login status.
      function updateDashboardUI() {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";
        const logoutBtnDashboard = document.getElementById("logoutBtnDashboard");
        const userIconLinkDashboard = document.getElementById("userIconLinkDashboard");
        if (isLoggedIn) {
          logoutBtnDashboard.style.display = "inline-block";
          // If logged in, clicking the user icon goes to the dashboard.
          userIconLinkDashboard.href = "/Members/UserDashboard.html";
        } else {
          logoutBtnDashboard.style.display = "none";
          // If not logged in, clicking the user icon goes to login.
          userIconLinkDashboard.href = "/non members/registration.html?tab=login";
        }
      }
      updateDashboardUI();
      
      // Logout functionality for dashboard header.
      document.getElementById("logoutBtnDashboard").addEventListener("click", async () => {
        try {
          const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
          });
          if (response.ok) {
            localStorage.removeItem("loggedIn");
            //alert("Logged out successfully!");
               Swal.fire({
              icon: 'success',
              title: 'Logout Successful',
              timer: 3000,
              showConfirmButton: false
            });
            window.location.href = "/non members/registration.html?tab=login";
          } else {
            //alert("Logout failed.");
             Swal.fire({
              icon: 'error',
              title: 'Logout Failed',
              text: 'An error occurred during logout. Please try again.',
            });
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      });


//USE THIS AT END OF HTML       <script src = "../js/logoutFunction.js"></script>           MAKE SURE THE PATH IS ACCURATE



      // SESSION MANAGEMENT: Force redirect if not logged in (for protected dashboard)
      (function checkSession() {
        if (localStorage.getItem("loggedIn") !== "true") {
          window.location.href = "/non members/registration.html?tab=login";
        }
      })();
     



      // Logout functionality for dashboard header. CHANGED 'logotBtnDashboard' to 'logoutBtn'
      document.getElementById("logoutBtn").addEventListener("click", async () => {
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
            localStorage.clear();
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

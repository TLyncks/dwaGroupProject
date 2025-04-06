document.addEventListener("DOMContentLoaded", function() {
    // Load progress when the page loads
    loadProgress();
  
    // and the 1
    const benefit1Btn = document.querySelector("#benefit1 .btn.btn-primary");
    if (benefit1Btn) {
      benefit1Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit1Claimed")) {
          localStorage.setItem("benefit1Claimed", true);
          updateProgress(1);
          saveProgressToDB();
        }
        // Redirect to the calendar page WHY DOESNT IT WORK
        window.location.href = "../../nonmembers/events.html";
      });
    }
  
    // im the 2
    const vendorClaimBtn = document.getElementById("vendorClaimBtn");
    const vendorMembershipInput = document.getElementById("vendorMembershipInput");
    const vendorError = document.getElementById("vendorError");
    if (vendorClaimBtn) {
      vendorClaimBtn.addEventListener("click", function() {
        const enteredMemberID = vendorMembershipInput.value.trim();
        const correctMemberID = localStorage.getItem('memberID'); 
        if (enteredMemberID === correctMemberID) {
          vendorError.style.display = "none";
          if (!localStorage.getItem("benefit2Claimed")) {
            localStorage.setItem("benefit2Claimed", true);
            updateProgress(1);
            saveProgressToDB();
          }
          Swal.fire({
            icon: 'success',
            title: 'Vendor Benefit Claimed!',
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          vendorError.style.display = "block";
        }
      });
    }
  
    // 3
    const benefit3Btn = document.querySelector("benefit3Btn");
    if (benefit3Btn) {
      benefit3Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit3Claimed")) {
          localStorage.setItem("benefit3Claimed", true);
          updateProgress(1);
          saveProgressToDB();
        }
        window.location.href = "../../nonmembers/events.html";
      });
    }
  
    // for number 4
    const benefit4Btn = document.querySelector("benefit4Btn");
    if (benefit4Btn) {
      benefit4Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit4Claimed")) {
          localStorage.setItem("benefit4Claimed", true);
          updateProgress(1);
          saveProgressToDB();
        }
        window.location.href = "../../nonmembers/events.html";
      });
    }
  
    // Bnumber 5
    const benefit5Btn = document.querySelector("benefit5Btn");
    if (benefit5Btn) {
      benefit5Btn.addEventListener("click", function() {
        const membershipType = localStorage.getItem("membershipType") || "Community Member";
        if (membershipType === "Community Member") {
          window.location.href = "../non members/community-membership.html";
        } else if (membershipType === "Key Access Member" || membershipType === "Workspace Member") {
          Swal.fire({
            icon: 'info',
            title: 'Attention',
            text: 'Please contact us to reserve workspace, or come in person.',
          });
        }
        if (!localStorage.getItem("benefit5Claimed")) {
          localStorage.setItem("benefit5Claimed", true);
          updateProgress(1);
          saveProgressToDB();
        }
      });
    }
  
    // this is benefit 6
    const benefit6Btn = document.querySelector("benefit6Btn");
    if (benefit6Btn) {
      benefit6Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit6Claimed")) {
          localStorage.setItem("benefit6Claimed", true);
          updateProgress(1);
          saveProgressToDB();
        }
        Swal.fire({
          icon: 'info',
          title: 'Attention',
          text: 'Please contact us to organize your first event!',
        });
      });
    }
  });
  
  
  function updateProgress(increment) {
    let currentProgress = parseInt(localStorage.getItem("benefitProgress")) || 0;
    if (currentProgress < 6) {
      currentProgress = Math.min(currentProgress + increment, 6);
      localStorage.setItem("benefitProgress", currentProgress);
      updateProgressBar((currentProgress / 6) * 100);
    }
  }
  
 
  function updateProgressBar(progressPercentage) {
    const bar = document.getElementById("myBar");
    if (bar) {
      bar.style.width = progressPercentage + "%";
      bar.textContent = progressPercentage.toFixed(0) + "%";
    }
  }
  
  // get the current benefit progress from the server
  function loadProgress() {
    fetch('/member/benefitProgress', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("benefitProgress", data.benefitProgress);
        updateProgressBar((data.benefitProgress / 6) * 100);
        if (data.memberID) localStorage.setItem("memberID", data.memberID);
        if (data.membershipType) localStorage.setItem("membershipType", data.membershipType);
        if (data.timesWorkspaceReserved !== undefined) localStorage.setItem("timesWorkspaceReserved", data.timesWorkspaceReserved);
        if (data.eventsAttended !== undefined) localStorage.setItem("eventsAttended", data.eventsAttended);
        if (data.eventsHosted !== undefined) localStorage.setItem("eventsHosted", data.eventsHosted);
      })
      .catch(error => console.error('Error loading progress:', error));
  }
  
  // Save your updated benefit progress to the database
  function saveProgressToDB() {
    let progress = parseInt(localStorage.getItem("benefitProgress")) || 0;
    fetch('/member/save-benefitProgress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ benefitProgress: progress })
    })
      .then(response => response.json())
      .then(data => console.log('Progress saved:', data))
      .catch(error => console.error('Error saving progress:', error));
  }
  
  // Function to allow the bootstrap accordion animation on button click
  function toggleAccordion(id) {
    var content = document.getElementById(id);
    if (content.classList.contains("show")) {
      content.classList.remove("show");
    } else {
      document.querySelectorAll(".accordion-content").forEach(el => el.classList.remove("show"));
      content.classList.add("show");
    }
  }
  
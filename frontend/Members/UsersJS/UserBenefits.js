

 //The scripts below  are to save and update the benefits-progress bar
    
 document.addEventListener("DOMContentLoaded", function() {
    loadProgress(); // Load progress when page loads


        //old function
        /*
        function handleButtonClick(accordionId, increment, buttonId) {
            // Check if this benefit has already been claimed (using localStorage)
            if (!localStorage.getItem(buttonId)) {
                localStorage.setItem(buttonId, true); 
                updateProgress(increment);
                saveProgressToDB(); 
            }
            toggleAccordion(accordionId);
        }*/



 


//new function benefit 1
const benefit1Btn = document.querySelector("#benefit1 .btn.btn-primary");
    if (benefit1Btn) {
        benefit1Btn.addEventListener("click", function() {
            if (!localStorage.getItem("benefit1Claimed")) {
                localStorage.setItem("benefit1Claimed", true);
                updateProgress(1);
                saveProgressToDB();
            }
            // Redirect to the calendar page
            window.location.href = "Calendar.html";
        });
    }
 

 //benefit 2
 const vendorClaimBtn = document.getElementById("vendorClaimBtn");
 const vendorMembershipInput = document.getElementById("vendorMembershipInput");
 const vendorError = document.getElementById("vendorError");
 if (vendorClaimBtn) {
     vendorClaimBtn.addEventListener("click", function() {
         const enteredMemberID = vendorMembershipInput.value.trim();
         const correctMemberID = req.session.userId; 
         if (enteredMemberID === correctMemberID) {
             vendorError.style.display = "none";
             if (!localStorage.getItem("benefit2Claimed")) {
                 localStorage.setItem("benefit2Claimed", true);
                 updateProgress(1);
                 saveProgressToDB();
             }
             //alert("Vendor benefit claimed!"); //TODO sweet alert
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

//bnenfit 3 aru
const benefit3Btn = document.querySelector("#benefit3 .btn.btn-primary");
if (benefit3Btn) {
    benefit3Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit3Claimed")) {
            localStorage.setItem("benefit3Claimed", true);
            updateProgress(1);
            saveProgressToDB();
        }
        window.location.href = "Calendar.html";
    });
}


//benefit 4 campbridge
const benefit4Btn = document.querySelector("#benefit4 .btn.btn-primary");
if (benefit4Btn) {
    benefit4Btn.addEventListener("click", function() {
        if (!localStorage.getItem("benefit4Claimed")) {
            localStorage.setItem("benefit4Claimed", true);
            updateProgress(1);
            saveProgressToDB();
        }
        window.location.href = "Calendar.html";
    });
}


//benefit 5 
 const benefit5Btn = document.querySelector("#benefit5 .btn.btn-primary");
 if (benefit5Btn) {
     benefit5Btn.addEventListener("click", function() {
         
         const membershipType = localStorage.getItem("membershipType") || "Community Member";
         if (membershipType === "Community Member") {
             window.location.href = "../non members/community-membership.html";
         } else if (membershipType === "Key Access Member" || membershipType === "Workspace Member") {
             //alert("Please contact us to reserve workspace, or come in person");
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



  /* Benefit 6: Host your own Event! */
  const benefit6Btn = document.querySelector("#benefit6 .btn.btn-primary");
  if (benefit6Btn) {
      benefit6Btn.addEventListener("click", function() {
          if (!localStorage.getItem("benefit6Claimed")) {
              localStorage.setItem("benefit6Claimed", true);
              updateProgress(1);
              saveProgressToDB();
          }
          // Here you might link to a page with more info or an event creation form
          window.location.href = "EventCreation.html";
      });
  }



// Update benefit progress: Each benefit increases progress by 1 (total 6 benefits)
function updateProgress(increment) {
    let currentProgress = parseInt(localStorage.getItem("benefitProgress")) || 0;
    if (currentProgress < 6) {
        currentProgress = Math.min(currentProgress + increment, 6);
        localStorage.setItem("benefitProgress", currentProgress);
        updateProgressBar((currentProgress / 6) * 100);
    }
}

// Update the progress bar's width and text
function updateProgressBar(progressPercentage) {
    const bar = document.getElementById("myBar");
    bar.style.width = progressPercentage + "%";
    bar.textContent = progressPercentage.toFixed(0) + "%";
}


// Load current benefit progress from the server

function loadProgress() {
    fetch('/api/benefitProgress', {
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

// Save updated benefit progress to the database
function saveProgressToDB() {
    let progress = parseInt(localStorage.getItem("benefitProgress")) || 0;
    fetch('/api/save-benefitProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ benefitProgress: progress })
    })
    .then(response => response.json())
    .then(data => console.log('Progress saved:', data))
    .catch(error => console.error('Error saving progress:', error));
}
});





  //fjangi;lrwjn;br




/*
TODO Change member id check to req.session.userId instead of local storage

Ensure that your backend has:


TODO GET /api/benefitProgress: Returns a JSON object with at least the keys benefitProgress, memberID, and membershipType from the baseuser table.

TODO POST /api/save-benefitProgress: Accepts a JSON body with benefitProgress and updates the baseuser table accordingly.
*/





//Script below is to allow the bootstrap accordion movement on button click-->
function toggleAccordion(id) {
    var content = document.getElementById(id);
    if (content.classList.contains("show")) {
        content.classList.remove("show");
    } else {
        document.querySelectorAll(".accordion-content").forEach(el => el.classList.remove("show"));
        content.classList.add("show");
    }
}
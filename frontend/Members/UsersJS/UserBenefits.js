

 //The scripts below  are to save and update the benefits-progress bar
    
 document.addEventListener("DOMContentLoaded", function() {
    loadProgress(); // Load progress when page loads
});

function handleButtonClick(accordionId, increment, buttonId) {
    // Check if this benefit has already been claimed (using localStorage)
    if (!localStorage.getItem(buttonId)) {
        localStorage.setItem(buttonId, true); 
        updateProgress(increment);
        saveProgressToDB(); 
    }
    toggleAccordion(accordionId);
}


const vendorClaimBtn = document.getElementById("vendorClaimBtn");
    const vendorMembershipInput = document.getElementById("vendorMembershipInput");
    const vendorError = document.getElementById("vendorError");
    
    vendorClaimBtn.addEventListener("click", function() {
        // Assume the user's correct memberID is stored in localStorage (set during login or profile fetch)
        //const correctMemberID = localStorage.getItem("memberID"); 
        const correctMemberID = req.session.userId;
        const enteredMemberID = vendorMembershipInput.value.trim();
        
        if (enteredMemberID === correctMemberID) {
            // Hide any error message
            vendorError.style.display = "none";
            // Mark this benefit as claimed (using a unique key in localStorage)
            if (!localStorage.getItem("vendorClaimed")) {
                localStorage.setItem("vendorClaimed", true);
                // Increase benefit progress by one benefit (out of 6)
                updateProgress(1);
                saveProgressToDB();
                alert("Vendor benefit claimed!");
            }
        } else {
            // Show error message
            vendorError.style.display = "block";
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
    let bar = document.getElementById("myBar");
    bar.style.width = progressPercentage + "%";
    bar.textContent = progressPercentage.toFixed(0) + "%";
}

function loadProgress() {
    fetch('/api/benefitProgress', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        // Save progress in localStorage and update progress bar
        localStorage.setItem("benefitProgress", data.benefitProgress);
        updateProgressBar((data.benefitProgress / 6) * 100);
    })
    .catch(error => console.error('Error loading progress:', error));
}

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
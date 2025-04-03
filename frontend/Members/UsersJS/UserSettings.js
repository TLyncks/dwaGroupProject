

document.addEventListener('DOMContentLoaded', async () => {
    // Define selectors first
    const userForm = document.querySelector('#section-general');
    const userFormNext = document.querySelector('#section-info');
    const passwordForm = document.querySelector('#section-password');
    const updatePasswordBtn = passwordForm.querySelector('#updatePasswordBtn');
    const updateProfileBtn = document.querySelector('#updateProfileBtn');
    
    // Now call fetchUserData() since userForm and userFormNext are defined
    fetchUserData();

    if (passwordForm) {
        updatePasswordBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const currentPassword = passwordForm.querySelector('input[name="current_password"]').value;
            const newPassword = passwordForm.querySelector('input[name="new_password"]').value;
            const confirmPassword = passwordForm.querySelector('input[name="confirm_password"]').value; 

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            try {
                const response = await fetch('/member/update-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ currentPassword, newPassword }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Password updated successfully!');
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error updating password:', error);
                alert('Error updating password. Please try again.');
            }
        });
    }

    // Fetch user data WAS '/member/updateSettings
    async function fetchUserData() {
        try {
            const response = await fetch('/member/settings', {  
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();

            //Debugging to deal with null values, im sure this could have been a loop but whatever i dont want to put more thought to this
            const userInt1Input = userForm.querySelector('input[name="interest1"]');
            const userInt2Input = userForm.querySelector('input[name="interest2"]');
            const userInt3Input = userForm.querySelector('input[name="interest3"]');
                if (userInt1Input) {
                    userInt1Input.value = userData.interest1 || '';
                }
                if (userInt2Input) {
                    userInt2Input.value = userData.interest2 || '';
                }
                if (userInt3Input) {
                    userInt3Input.value = userData.interest3 || '';
                }


            // Populate form fields; userForm and userFormNext are now defined
            userForm.querySelector('input[name="UserName"]').value = userData.UserName || '';  
            userForm.querySelector('input[name="userEmail"]').value = userData.userEmail || '';
            //userForm.querySelector('input[name="password"]').value = userData.password_hash || '';  
            userForm.querySelector('input[name="UserPhone"]').value = userData.UserPhone || '';
            userForm.querySelector('input[name="UserAddress"]').value = userData.UserAddress || '';
            userFormNext.querySelector('input[name="interest1"]').value = userData.interest1 || '';
            userFormNext.querySelector('input[name="interest2"]').value = userData.interest2 || '';
            userFormNext.querySelector('input[name="interest3"]').value = userData.interest3 || '';
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Handle profile update
    updateProfileBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent unintended form submission

        const updatedData = {
            UserName: userForm.querySelector('input[name="UserName"]').value,
            userEmail: userForm.querySelector('input[name="userEmail"]').value,
            //password_hash: userForm.querySelector('input[name="password"]').value,
            UserPhone: userForm.querySelector('input[name="UserPhone"]').value,
            UserAddress: userForm.querySelector('input[name="UserAddress"]').value,
            interest1: userFormNext.querySelector('input[name="interest1"]').value,
            interest2: userFormNext.querySelector('input[name="interest2"]').value,
            interest3: userFormNext.querySelector('input[name="interest3"]').value,
        };

        try {
            const response = await fetch('/member/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });
});


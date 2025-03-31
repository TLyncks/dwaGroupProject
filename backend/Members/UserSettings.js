//TODO edit here to get the correct data from the backend




document.addEventListener('DOMContentLoaded', async () => {
    const userForm = document.querySelector('.tab-pane#account-general');
  
    // Fetch user data
    async function fetchUserData() {
      try {
        const response = await fetch('/user/settings', {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const userData = await response.json();
        userForm.querySelector('[value="nmaxwell"]').value = userData.username;
        userForm.querySelector('[value="Nelle Maxwell"]').value = userData.name;
        userForm.querySelector('[value="nmaxwell@mail.com"]').value = userData.email;
        userForm.querySelector('[value="Company Ltd."]').value = userData.company;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  
    // Handle form submission
    document.querySelector('.btn-primary').addEventListener('click', async () => {
      const updatedData = {
        username: userForm.querySelector('[value="nmaxwell"]').value,
        name: userForm.querySelector('[value="Nelle Maxwell"]').value,
        email: userForm.querySelector('[value="nmaxwell@mail.com"]').value,
        company: userForm.querySelector('[value="Company Ltd."]').value,
      };
  
      try {
        const response = await fetch('/user/settings', {
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
  
    fetchUserData();
  });
  
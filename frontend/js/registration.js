document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registration-form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();
  
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phonePattern = /^(\+44\s?|0)7\d{9}$/;
  
      if (!emailPattern.test(email)) {
        alert("Invalid email format.");
        return;
      }
  
      if (!phonePattern.test(phone)) {
        alert("Invalid UK phone number.");
        return;
      }
  
      // Check address validity with the backend
      try {
        const response = await fetch("/validate-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
  
        const result = await response.json();
        if (!result.valid) {
          alert("Address must be within Cambridgeshire, UK.");
          return;
        }
      } catch (error) {
        console.error("Error validating address:", error);
        alert("Address validation failed.");
        return;
      }
  
      // Send valid data to the backend
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, address }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            alert(data.errors.map((err) => err.msg).join("\n"));
          } else {
            alert("Registration successful!");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
  
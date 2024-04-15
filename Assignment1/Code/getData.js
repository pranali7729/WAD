xhr.onload = function() {
    if (xhr.status == 200) {
      // Store user data in local storage
      localStorage.setItem('username', formData.get('username'));
      localStorage.setItem('email', formData.get('email'));
  
      // Redirect to the page displaying the list of registered users
      window.location.href = 'registered_users.html';
    } else {
      console.error('Error:', xhr.statusText);
    }
  };
  
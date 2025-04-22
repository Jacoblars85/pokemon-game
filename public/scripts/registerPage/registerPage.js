const registerUser = (event) => {
  event.preventDefault();

  let getUsernameInput = document.getElementById("registerUsernameInput").value;
  let getPasswordInput = document.getElementById("registerPasswordInput").value;

  document.getElementById("registerUsernameInput").value = "";
  document.getElementById("registerPasswordInput").value = "";

  if (getUsernameInput && getPasswordInput) {
    registerUserPost({
      username: getUsernameInput,
      password: getPasswordInput,
    });
  } else {
    console.log("username or password error");
  }
};

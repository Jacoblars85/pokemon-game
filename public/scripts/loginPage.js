const login = (event) => {
  event.preventDefault();

  let getUsernameInputLogin =
    document.getElementById("loginUsernameInput").value;
  let getPasswordInputLogin =
    document.getElementById("loginPasswordInput").value;

  document.getElementById("loginUsernameInput").value = "";
  document.getElementById("loginPasswordInput").value = "";

  if (getUsernameInputLogin && getPasswordInputLogin) {
    loginUser({
      username: getUsernameInputLogin,
      password: getPasswordInputLogin,
    });
  } else {
    console.log("username or password error");
  }
};

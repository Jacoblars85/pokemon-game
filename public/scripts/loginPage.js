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

function flipTheLoginPage(pageGettingFlipped) {
  if (pageGettingFlipped === "loginPage") {
    document.getElementById("loginInterface").style.display = "flex";
    document.getElementById("registerInterface").style.display = "none";
  } else if (pageGettingFlipped === "registerPage") {
    document.getElementById("registerInterface").style.display = "flex";
    document.getElementById("loginInterface").style.display = "none";
  }
}

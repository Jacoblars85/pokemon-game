

// const errors = useSelector((store) => store.errors);

const registerUser = (event) => {
  event.preventDefault();

  let getUsernameInput = document.getElementById("registerUsernameInput").value;
let getPasswordInput = document.getElementById("registerPasswordInput").value;

document.getElementById("registerUsernameInput").value = "";
document.getElementById("registerPasswordInput").value = "";

registerUserPost({
  username: getUsernameInput,
  password: getPasswordInput,
})


};

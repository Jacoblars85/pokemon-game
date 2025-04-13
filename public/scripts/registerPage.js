

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

  axios({
    method: "POST",
    url: "/api/user/register",
    data: {
      username: username,
      password: password,
    },
  })
    .then((response) => {
      console.log("register worked?", response);
    })
    .catch((err) => {
      console.log("error registering user", err);
    });


};

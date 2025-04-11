let getUsernameInput = document.getElementById("registerUsernameInput").value;
let getPasswordInput = document.getElementById("registerPasswordInput").value;

document.getElementById("registerUsernameInput").value = "";
document.getElementById("registerPasswordInput").value = "";

// const errors = useSelector((store) => store.errors);

// const registerUser = (event) => {
//   event.preventDefault();

//   axios({
//     method: "POST",
//     url: "/api/user/register",
//     data: {
//       username: username,
//       password: password,
//     },
//   })
//     .then((response) => {
//       console.log("register worked?", response);
//     })
//     .catch((err) => {
//       console.log("error registering user", err);
//     });

// //   function* registerUser(action) {
// //     // clear any existing error on the registration page
// //     yield put({ type: "CLEAR_REGISTRATION_ERROR" });

// //     // automatically log a user in after registration
// //     yield put({ type: "LOGIN", payload: action.payload });

// //     // set to 'login' mode so they see the login screen
// //     // after registration or after they log out
// //     yield put({ type: "SET_TO_LOGIN_MODE" });
// //   }
// };

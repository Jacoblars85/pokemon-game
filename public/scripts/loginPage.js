let username = "";
let password = "";

// const errors = useSelector((store) => store.errors);

const login = (event) => {
  event.preventDefault();

  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  if (username && password) {
    axios({
      method: "POST",
      url: "/api/user/login",
      data: {
        username: username,
        password: password,
      },
      config,
    })
      .then((response) => {
        console.log("login worked?", response);
      })
      .catch((err) => {
        console.log("error logging in user", err);
      });
  } else {
    dispatch({ type: "LOGIN_INPUT_ERROR" });
  }
};

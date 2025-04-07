function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: "CLEAR_REGISTRATION_ERROR" });

    // passes the username and password from the payload to the server
    yield axios.post("/api/user/register", action.payload);

    // automatically log a user in after registration
    yield put({ type: "LOGIN", payload: action.payload });

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: "SET_TO_LOGIN_MODE" });
  } catch (error) {
    console.log("Error with user registration:", error);
    yield put({ type: "REGISTRATION_FAILED" });
  }
}

function* loginUser(action) {
  try {
    // clear any existing error on the login page
    yield put({ type: "CLEAR_LOGIN_ERROR" });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // send the action.payload as the body
    // the config includes credentials which
    // allow the server session to recognize the user
    yield axios.post("/api/user/login", action.payload, config);

    // after the user has logged in
    // get the user information from the server
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.log("Error with user login:", error);
    if (error.response.status === 401) {
      // The 401 is the error status sent from passport
      // if user isn't in the database or
      // if the username and password don't match in the database
      yield put({ type: "LOGIN_FAILED" });
    } else {
      // Got an error that wasn't a 401
      // Could be anything, but most common cause is the server is not started
      yield put({ type: "LOGIN_FAILED_NO_CODE" });
    }
  }
}

// worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // when the server recognizes the user session
    // it will end the session
    yield axios.post("/api/user/logout", config);

    // now that the session has ended on the server
    // remove the client-side user object to let
    // the client-side code know the user is logged out
    yield put({ type: "UNSET_USER" });
  } catch (error) {
    console.log("Error with user logout:", error);
  }
}

function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

// starter stats/info
let starterOneHp = 0;
let starterOneStamina = 0;
let starterPicture = "";
let starterFxImg = "";
let starterOneName = "";
let starterOneSpeed = 0;
let starterOneInfo = {};
let starterOneAttackStats = {};

// starter 2 stats/info
let starterTwoHp = 0;
let starterTwoStamina = 0;
let starterTwoPicture = "";
let starterTwoFxImg = "";
let starterTwoName = "";
let starterTwoSpeed = 0;
let starterTwoInfo = {};
let starterTwoAttackStats = {};

// enemy stats/info
let enemyHp = 0;
let enemyStamina = 0;
let enemyPicture = "";
let enemyFxImg = "";
let enemyName = "";
let enemySpeed = 0;
let enemyInfo = {};
let enemyAttackStats = {};

// kick attack name and stamina
let kickAttackStats = {};
let kickAttack = "";
let kickStamina = 0;

// poke attack name and stamina
let pokeAttackStats = {};
let pokeAttack = "";
let pokeStamina = 0;

// setting each starter/enemy to a varriable
let starters = [];
let enemyOne;
let starterOne;
let starterTwo;
let usersConsumableItems = [];

// axios functions
function getStarters() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/characters/starter",
  })
    .then((response) => {
      starterOne = response.data[0];

      starterOneHp = Math.floor(response.data[0].hp);
      starterOneStamina = Math.floor(response.data[0].stamina);
      starterOneName = response.data[0].character_name;
      starterOneSpeed = Math.floor(response.data[0].speed);
      starterPicture = response.data[0].battle_pic;
      starterFxImg = response.data[0].fx_img;

      starterOneInfo = {
        character_name: response.data[0].character_name,
        hp: Math.floor(response.data[0].hp),
        stamina: Math.floor(response.data[0].stamina),
        speed: Math.floor(response.data[0].speed),
        battle_pic: response.data[0].battle_pic,
      };

      starterOneAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: Math.floor(response.data[0].attack_damage),
        attack_stamina: Math.floor(response.data[0].attack_stamina),
        attack_type: response.data[0].attack_type,
        fx_img: response.data[0].fx_img,
        max_frames: response.data[0].max_frames,
        hold_time: response.data[0].hold_time,
      };

      if (response.data.length === 2) {
        starterTwo = response.data[1];

        starterTwoHp = Math.floor(response.data[1].hp);
        starterTwoStamina = Math.floor(response.data[1].stamina);
        starterTwoName = response.data[1].character_name;
        starterTwoSpeed = Math.floor(response.data[1].speed);
        starterTwoPicture = response.data[1].battle_pic;
        starterTwoFxImg = response.data[1].fx_img;

        starterTwoInfo = {
          character_name: response.data[1].character_name,
          hp: Math.floor(response.data[1].hp),
          stamina: Math.floor(response.data[1].stamina),
          speed: Math.floor(response.data[1].speed),
          battle_pic: response.data[1].battle_pic,
        };

        starterTwoAttackStats = {
          attack_name: response.data[1].attack_name,
          attack_damage: Math.floor(response.data[1].attack_damage),
          attack_stamina: Math.floor(response.data[1].attack_stamina),
          attack_type: response.data[1].attack_type,
          fx_img: response.data[1].fx_img,
          max_frames: response.data[1].max_frames,
          hold_time: response.data[1].hold_time,
        };
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getEnemy(enemyId) {
  axios({
    method: "GET",
    url: `http://localhost:5001/api/characters/enemy/${enemyId}`,
  })
    .then((response) => {
      enemyOne = response.data[0];

      enemyHp = response.data[0].hp;
      enemyStamina = response.data[0].stamina;
      enemyName = response.data[0].character_name;
      enemySpeed = response.data[0].speed;
      enemyPicture = response.data[0].battle_pic;
      enemyFxImg = response.data[0].fx_img;

      enemyInfo = {
        character_name: response.data[0].character_name,
        hp: response.data[0].hp,
        stamina: response.data[0].stamina,
        speed: response.data[0].speed,
        battle_pic: response.data[0].battle_pic,
      };

      enemyAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: response.data[0].attack_damage,
        attack_stamina: response.data[0].attack_stamina,
        attack_type: response.data[0].attack_type,
        fx_img: response.data[0].fx_img,
        max_frames: response.data[0].max_frames,
        hold_time: response.data[0].hold_time,
      };
    })
    .catch((err) => {
      console.log(err);
    });
}

function getBasicAttacks() {
  axios({
    method: "GET",
    url: `http://localhost:5001/api/characters/basic`,
  })
    .then((response) => {
      kickAttack = response.data[0].attack_name;
      kickStamina = response.data[0].attack_stamina;
      // setKickAttackType(response.data[0].attack_type);

      kickAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: response.data[0].attack_damage,
        attack_stamina: response.data[0].attack_stamina,
        attack_type: response.data[0].attack_type,
      };

      pokeAttack = response.data[1].attack_name;
      pokeStamina = response.data[1].attack_stamina;
      // setPokeAttackType(response.data[1].attack_type);

      pokeAttackStats = {
        attack_name: response.data[1].attack_name,
        attack_damage: response.data[1].attack_damage,
        attack_stamina: response.data[1].attack_stamina,
        attack_type: response.data[1].attack_type,
      };
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllUsersItems(resetBattleFunc) {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/user/consumable",
  })
    .then((response) => {
      usersConsumableItems = response.data;

      if (resetBattleFunc) resetBattleFunc();
    })
    .catch((err) => {
      console.log(err);
    });
}

function putWonBattle(reward) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/won/battle`,
    data: reward,
  })
    .then((response) => {
      console.log("finished winning battle axios");
    })
    .catch((err) => {
      console.log(err);
    });
}

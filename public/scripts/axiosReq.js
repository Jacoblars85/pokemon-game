// axios functions for user info

let user = [];

const config = {
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

function fetchUser() {
  axios
    .get(`http://localhost:5001/api/user`, config)
    .then((response) => {
      user = response.data;

      console.log("user", user);

      getStarters();

      document.getElementById("usernameNavHeader").innerHTML = user.username;
      document.getElementById("userLevelNavHeader").innerHTML += user.xp_level;
      document.getElementById("usersCoinsNavHeader").innerHTML += user.coins;
    })
    .catch((err) => {
      console.log(err);
    });
}

function registerUserPost(userInfo) {
  axios({
    method: "POST",
    url: `http://localhost:5001/api/user/register`,
    data: userInfo,
    withCredentials: true,
  })
    .then((response) => {
      console.log("registered the new user", response);

      window.location.href = "../mainMenuPage/mainMenu.html";

      fetchUser();
    })
    .catch((err) => {
      console.log(err);
    });
}

function loginUser(userInfo) {
  console.log("userInfo", userInfo);

  axios
    .post(`http://localhost:5001/api/user/login`, userInfo, config)
    .then((response) => {
      console.log("logged in", response);

      window.location.href = "../mainMenuPage/mainMenu.html";

      fetchUser();
    })
    .catch((err) => {
      console.log(err);
    });
}

function logoutUser() {
  axios
    .post(`http://localhost:5001/api/user/logout`, {}, config)
    .then((response) => {
      console.log("logged out", response);

      window.location.href = "../loginPage/login.html";
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteUser() {
  axios({
    method: "DELETE",
    url: `http://localhost:5001/api/user`,
    withCredentials: true,
  })
    .then((response) => {
      console.log("deleted the user", response);

      window.location.href = "../registerPage/register.html";
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeUsername(newName) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/change`,
    data: { newName: newName },
    withCredentials: true,
  })
    .then((response) => {
      console.log("finished changing the username axios");
    })
    .catch((err) => {
      console.log(err);
    });
}

function userOpenChest(chestInfo) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/chest/open`,
    data: chestInfo,
    withCredentials: true,
  })
    .then((response) => {
      console.log("finished opening the chest axios");
    })
    .catch((err) => {
      console.log(err);
    });
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
let usersBattleItems = [];
let usersConsumableItems = [];
let usersThrowablesItems = [];
let allItems = [];
let usersCharacters = [];

let isAnimating = false;

// axios functions for user info for battle
function getStarters() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/characters/starter",
    withCredentials: true,
  })
    .then((response) => {

      console.log('starters', response.data);
      
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

      if (response.data.length >= 2) {
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

function getAllUsersCharacters() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/characters/user/characters",
    withCredentials: true,
  })
    .then((response) => {
      usersCharacters = response.data;

      console.log("usersCharacters", usersCharacters);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllUsersConsumables(resetBattleFunc) {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/user/consumable",
    withCredentials: true,
  })
    .then((response) => {
      usersConsumableItems = response.data;

      if (resetBattleFunc) resetBattleFunc();
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllUsersThrowables(resetBattleFunc) {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/user/throwable",
    withCredentials: true,
  })
    .then((response) => {
      usersThrowablesItems = response.data;

      if (resetBattleFunc) resetBattleFunc();
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllUsersBattleItems(resetBattleFunc) {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/user/battle/items",
    withCredentials: true,
  })
    .then((response) => {
      usersBattleItems = response.data;

      if (resetBattleFunc) resetBattleFunc();
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllItems() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/all/items",
  })
    .then((response) => {
      allItems = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function putWonBattle(rewardInfo) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/won/battle`,
    data: rewardInfo,
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
    })
    .catch((err) => {
      console.log(err);
    });
}

function postNewUserCharacter(newCharacter) {
  axios({
    method: "POST",
    url: `http://localhost:5001/api/characters/new/character`,
    data: newCharacter,
    withCredentials: true,
  })
    .then((response) => {
      console.log("posted new character!!!");
      getAllUsersCharacters();
    })
    .catch((err) => {
      console.log(err);
    });
}

function putStarterSwitching(newStarterInfo) {
  console.log("newStarterInfo", newStarterInfo);

  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/starter/update`,
    data: newStarterInfo,
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      getAllUsersCharacters();
    })
    .catch((err) => {
      console.log(err);
    });
}

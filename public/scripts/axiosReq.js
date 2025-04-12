function fetchUser() {
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  axios({
    method: "GET",
    url: `http://localhost:5001/api/user`,
    data: config,
    config,
  })
    .then((response) => {
      console.log("got the user", response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function registerUser(userInfo) {
  axios({
    method: "POST",
    url: `http://localhost:5001/api/user/register`,
    data: userInfo,
  })
    .then((response) => {
      console.log("registered the new user", response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function loginUser(userInfo) {
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/login`,
    data: { config, userInfo },
    config,
  })
    .then((response) => {
      console.log("logged in", response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function logoutUser() {
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  axios({
    method: "PUT",
    url: `http://localhost:5001/api/user/logout`,
    data: config,
    config,
  })
    .then((response) => {
      console.log("logged out", response);
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

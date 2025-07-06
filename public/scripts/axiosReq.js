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
      document.getElementById("userLevelNavHeader").innerHTML += Math.floor(
        user.xp_level
      );
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
      fetchUser();
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
      getAllItems();
      getAllUsersBattleItems();
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
let usersStarters = [];
let enemyOne;
let starterOne;
let starterTwo;
let usersBattleItems = [];
let usersConsumableItems = [];
let usersThrowablesItems = [];
let usersItems = [];
let allItems = [];
let usersCharacters = [];

let isAnimating = false;

function renderStarterGrid(containerElement) {
  containerElement.innerHTML = "";

  const totalSlots = 6;

  for (let i = 0; i < totalSlots; i++) {
    const cell = document.createElement("div");
    cell.style = `
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: black;
      border: 1px solid white;
      min-height: 50px;
      color: white;
    `;

    if (usersStarters[i]) {
      const starter = usersStarters[i];

      cell.style = `
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: black;
      border: 1px solid white;
      min-height: 50px;
      color: white;
      cursor: pointer;
    `;

      const img = document.createElement("img");
      img.src = starter.profile_pic;
      img.width = 57;
      img.height = 57;

      const infoContainer = document.createElement("div");
      infoContainer.style.flex = "1";

      const name = document.createElement("div");
      name.textContent = starter.character_name;
      name.style.fontWeight = "bold";

      // HP Bar
      const hpBar = document.createElement("div");
      hpBar.style = `
    height: 6.5px;
    width: 90%;
    background-color: lightgray;
    margin-top: 4px;
    overflow: hidden;
  `;

      const hpFill = document.createElement("div");
      const hpPercent = (starter.hp / starter.max_hp) * 100;
      hpFill.style = `
    width: ${hpPercent}%;
    height: 100%;
    background-color: red;
  `;

      hpBar.appendChild(hpFill);

      // Stamina Bar
      const staminaBar = document.createElement("div");
      staminaBar.style = `
    height: 3px;
    width: 90%;
    background-color: lightgray;
    margin-top: 4px;
    overflow: hidden;
  `;

      const staminaFill = document.createElement("div");
      const staminaPercent = (starter.stamina / starter.max_stamina) * 100;
      staminaFill.style = `
    width: ${staminaPercent}%;
    height: 100%;
    background-color: green;
  `;

      staminaBar.appendChild(staminaFill);

      // Combine everything
      infoContainer.appendChild(name);
      infoContainer.appendChild(hpBar);
      infoContainer.appendChild(staminaBar);

      cell.appendChild(img);
      cell.appendChild(infoContainer);

      cell.addEventListener("click", () => {
        showCharacterDetails(starter);
      });
    } else {
      const placeholder = document.createElement("span");
      placeholder.textContent = "Empty Slot";
      placeholder.style.opacity = 0.5;
      cell.appendChild(placeholder);
    }

    containerElement.appendChild(cell);
  }
}

// axios functions for user info for battle
function getStarters() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/characters/starter",
    withCredentials: true,
  })
    .then((response) => {
      usersStarters = response.data;

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

      const pcStarterGrid = document.getElementById("pcStarterBody");
      if (pcStarterGrid) renderStarterGrid(pcStarterGrid);

      const bagStarterGrid = document.getElementById("bagStarterBody");
      if (bagStarterGrid) renderStarterGrid(bagStarterGrid);
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
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllUsersItems() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/inventory/user/inventory",
    withCredentials: true,
  })
    .then((response) => {
      usersItems = response.data;

      document.getElementById("bagInventoryBody").innerHTML = "";

      for (const items of usersItems) {
        document.getElementById("bagInventoryBody").innerHTML += `
        <div height="140px">
            <div
              style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-around;
                  height: 45px;
                  padding: 5px; 
                "
                >
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      column-gap: 5px;
                      justify-content: space-around;
                      align-items: center;
                    "
                       >
                    <p
                      style="
                        color: black;
                        font-size: 25px;
                      "
                    >
                      ${items.number}X
                    </p>
                    <img
                      height="35"
                      width="35"
                      src=${items.item_pic}
                    />
                  </div>
                  <p
                    style="
                      ml: 20;
                    "">
                    ${items.item_name}
                  </p>
  
                  <p
                    style="
                      ml: 5;
                      font-size: 20px;
                      width: 150px;
                      text-align: center;
                    ">
                    ${items.item_hp === 0 ? "" : `+${items.item_hp} hp`} ${
          items.item_stamina === 0
            ? ""
            : items.item_hp === 0
            ? `+${items.item_stamina} stamina`
            : `| +${items.item_stamina} stamina`
        } ${items.item_speed === 0 ? "" : `| +${items.item_speed} speed`}
                  </p>
                  <button
                  id=${items.items_id}
                    style="
                      color: black;
                      font-size: 15;
                      border-color: black;
                      cursor: pointer;
                    "
                  >Use Item</button>
                </div>
            </div>
            <div style="
                  display: block;
                  height: 2px;
                  border: 0;
                  border-top: 2px solid black;
                  margin: 0 0;
                  padding: 0;
                " />
     `;
      }
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
      getAllUsersCharacters();
    })
    .catch((err) => {
      console.log(err);
    });
}

function putStarterSwitching(newStarterInfo) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/starter/${newStarterInfo.route}`,
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

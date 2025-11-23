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

      // console.log("user", user);

      getStarters();

      let usersNameHeader = document.getElementById("usernameNavHeader");
      if (usersNameHeader) {
        usersNameHeader.innerHTML = user.username;
      }

      let usersLevelHeader = document.getElementById("userLevelNavHeader");
      if (usersLevelHeader) {
        usersLevelHeader.innerHTML = "lvl " + Math.floor(user.xp_level);
      }

      let usersCoinsHeader = document.getElementById("usersCoinsNavHeader");
      if (usersCoinsHeader) usersCoinsHeader.innerHTML = "$" + user.coins;
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

// starter variables
let usersStarters = [];
let starterOne;
let starterTwo;

// enemy stats/info
let enemyOne;
let enemyAttackStats = {};

// attack stats/info
let allAttacks = [];
let kickAttackStats = {};
let pokeAttackStats = {};

// users items and starters info
let usersBattleItems = [];
let usersConsumableItems = [];
let usersThrowablesItems = [];
let usersItems = [];
let usersCharacters = [];
let usersChests = [];

// basic info
let allItems = [];
let allCharacters = [];

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
      name.textContent = starter.nickname || starter.character_name;
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

      let contextForStarterButtons = "pc";
      if (containerElement.id === "bagStarterBody")
        contextForStarterButtons = "bag";

      cell.addEventListener("click", () => {
        showCharacterDetails(starter, contextForStarterButtons);
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

let currentPage = 0;
const itemsPerPage = 35;

function renderPcGrid() {
  document.getElementById("pcBody").innerHTML = "";

  const pcGrid = document.getElementById("pcBody");

  const startIndex = currentPage * itemsPerPage;
  const pageItems = usersCharacters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  for (let i = 0; i < itemsPerPage; i++) {
    const cell = document.createElement("div");
    cell.classList.add("pcGridItem");

    if (i < pageItems.length) {
      const img = document.createElement("img");
      img.src = pageItems[i].profile_pic;
      // img.alt = `item-${i}`;
      img.classList.add("pcItemImg");

      img.addEventListener("click", () => {
        showCharacterDetails(pageItems[i], "pc");
      });

      cell.appendChild(img);
    }

    pcGrid.appendChild(cell);
  }
  document.getElementById("pageNumber").textContent = `Page ${currentPage + 1}`;
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

      console.log("starterOne", starterOne);

      if (response.data.length >= 2) {
        starterTwo = response.data[1];
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

function getWildCharacter(enemyId) {
  axios({
    method: "GET",
    url: `http://localhost:5001/api/characters/enemy/${enemyId}`,
  })
    .then((response) => {
      enemyOne = response.data[0];

      enemyAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: response.data[0].attack_damage,
        attack_stamina: response.data[0].attack_stamina,
        attack_style: response.data[0].attack_style,
        attack_type_id: response.data[0].attack_type_id,
        attack_type_name: response.data[0].attack_type_name,
        attack_type_effective: response.data[0].attack_type_effective,
        attack_type_weakness: response.data[0].attack_type_weakness,
        fx_img: response.data[0].fx_img,
        max_frames: response.data[0].max_frames,
        hold_time: response.data[0].hold_time,
      };
    })
    .catch((err) => {
      console.log(err);
    });
}

function getBossCharacter(enemyId) {
  axios({
    method: "GET",
    url: `http://localhost:5001/api/characters/boss/${enemyId}`,
  })
    .then((response) => {
      enemyOne = response.data[0];

      enemyAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: response.data[0].attack_damage + 50,
        attack_stamina: response.data[0].attack_stamina,
        attack_style: response.data[0].attack_style,
        attack_type_id: response.data[0].attack_type_id,
        attack_type_name: response.data[0].attack_type_name,
        attack_type_effective: response.data[0].attack_type_effective,
        attack_type_weakness: response.data[0].attack_type_weakness,
        fx_img: response.data[0].fx_img,
        max_frames: response.data[0].max_frames,
        hold_time: response.data[0].hold_time,
      };
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllCharacters() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/characters/all/characters",
  })
    .then((response) => {
      allCharacters = response.data;
      // console.log("allCharacters", allCharacters);
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
      // allAttacks.push(response.data);

      kickAttackStats = {
        attack_name: response.data[0].attack_name,
        attack_damage: response.data[0].attack_damage,
        attack_stamina: response.data[0].attack_stamina,
        attack_style: response.data[0].attack_style,
        attack_type_id: response.data[0].attack_type_id,
        attack_type_name: response.data[0].attack_type_name,
        attack_type_effective: response.data[0].attack_type_effective,
        attack_type_weakness: response.data[0].attack_type_weakness,
        fx_img: "",
      };

      pokeAttackStats = {
        attack_name: response.data[1].attack_name,
        attack_damage: response.data[1].attack_damage,
        attack_stamina: response.data[1].attack_stamina,
        attack_style: response.data[1].attack_style,
        attack_type_id: response.data[1].attack_type_id,
        attack_type_name: response.data[1].attack_type_name,
        attack_type_effective: response.data[1].attack_type_effective,
        attack_type_weakness: response.data[1].attack_type_weakness,
        fx_img: "",
      };
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAllAttacks() {
  axios({
    method: "GET",
    url: `http://localhost:5001/api/characters/attacks`,
  })
    .then((response) => {
      allAttacks = response.data;
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

      renderPcGrid();
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

      const bagBody = document.getElementById("bagInventoryBody");
      bagBody.innerHTML = "";

      usersItems.forEach((item) => {
        const container = document.createElement("div");

        const row = document.createElement("div");
        row.style = `
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 45px;
          width: 516px;
          padding: 5px;
          cursor: pointer;
        `;

        const countAndImage = document.createElement("div");
        countAndImage.style = `
          display: flex;
          flex-direction: row;
          column-gap: 10px;
          justify-content: space-between;
          align-items: center;
          width: 95px;
        `;

        const count = document.createElement("p");
        count.textContent = `${item.number}X`;
        count.style = `color: black; font-size: 25px; width: 50px; text-align: left;`;

        const img = document.createElement("img");
        img.src = item.item_pic;
        img.width = 35;
        img.height = 35;
        img.style = `text-align: center; align-self: center;`;

        countAndImage.appendChild(count);
        countAndImage.appendChild(img);

        const name = document.createElement("p");
        name.textContent = item.item_name;
        name.style = "font-size: 20px; width: 125px; text-align: center;";

        const effects = document.createElement("p");
        effects.style = "font-size: 16px; width: 100px; text-align: center;";

        effects.textContent = `
          ${item.item_hp ? `+${item.item_hp} HP ` : ""}
          ${item.item_stamina ? `+${item.item_stamina} Stamina ` : ""}
          ${item.item_speed ? `+${item.item_speed} Speed` : ""}
          ${item.item_damage ? `+${item.item_damage} Damage` : ""}
        `;

        let useButton;
        if (item.item_type === "throwable") {
          useButton = document.createElement("div");
          useButton.style = `width: 120px;`;
        } else if (item.item_type === "held") {
          useButton = document.createElement("button");
          useButton.textContent = "Equip Item";
          useButton.style = `
            color: black;
            font-size: 15px;
            border-color: black;
            cursor: pointer;
            width: 120px;
          `;

          useButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop it from triggering detail popup
            renderUseItemOverlay(item);
          });
        } else if (item.item_type === "tm") {
          useButton = document.createElement("button");
          useButton.textContent = "Use Item";
          useButton.style = `
            color: black;
            font-size: 15px;
            border-color: black;
            cursor: pointer;
            width: 120px;
          `;

          useButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop it from triggering detail popup
            renderUseItemOverlay(item);
          });
        } else {
          useButton = document.createElement("button");
          useButton.textContent = "Use Item";
          useButton.style = `
            color: black;
            font-size: 15px;
            border-color: black;
            cursor: pointer;
            width: 120px;
          `;

          useButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop it from triggering detail popup
            renderUseItemOverlay(item);
          });
        }

        row.addEventListener("click", () => {
          showItemDetails(item);
        });

        row.appendChild(countAndImage);
        row.appendChild(name);
        row.appendChild(effects);
        row.appendChild(useButton);

        container.appendChild(row);

        const hr = document.createElement("div");
        hr.style = `
          display: block;
          height: 2px;
          border: 0;
          border-top: 2px solid black;
          margin: 0;
          padding: 0;
        `;
        container.appendChild(hr);

        bagBody.appendChild(container);
      });

      document.getElementById("shopBodySell").innerHTML = "";

      for (const item of usersItems) {
        document.getElementById("shopBodySell").innerHTML += `
          <div style="
              width: 100%;
              height: 60px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              border-bottom: 2px solid black;
            ">
            <div style="width: 50px; display: flex; justify-content: center; margin: 5px;">
              <img src=${item.item_pic} height="50" />
            </div>

            <p style="width: 150px; text-align: center">x${item.number}</p>
            <p style="width: 150px; text-align: center">${item.item_name}</p>
            <p style="width: 60px; text-align: center">$${
              item.item_cost / 2
            }</p>

            <button onclick="sellItem({itemId: ${item.id}, totalCoins: ${
          item.item_cost / 2
        }})">Sell</button>
          </div>
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

      document.getElementById("shopBodyBuy").innerHTML = "";

      for (const item of allItems) {
        document.getElementById("shopBodyBuy").innerHTML += `
          <div style="
              width: 100%;
              height: 60px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              border-bottom: 2px solid black;
            ">
            <div style="width: 50px; display: flex; justify-content: center; margin: 5px;">
              <img src=${item.item_pic} height="50" />
            </div>

            <p style="width: 150px; text-align: center">${item.item_name}</p>
            <p style="width: 60px; text-align: center">$${item.item_cost}</p>

            <button onclick="buyItem({itemId: ${item.id}, itemCost: ${item.item_cost}})">Buy</button>
          </div>
                `;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getUsersChests() {
  axios({
    method: "GET",
    url: "http://localhost:5001/api/user/chests",
    withCredentials: true,
  })
    .then((response) => {
      usersChests = response.data;
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
      getAllUsersItems();
      getAllUsersBattleItems();
      getUsersChests();
    })
    .catch((err) => {
      console.log(err);
    });
}

function useItem(itemBeingUsed, resetBattleFunc) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/inventory/use/item`,
    data: itemBeingUsed,
    withCredentials: true,
  })
    .then((response) => {
      if (resetBattleFunc) getAllUsersBattleItems(resetBattleFunc);
      getAllUsersItems();
    })
    .catch((err) => {
      console.log(err);
    });
}

function useItemOnStarter(itemBeingUsed, starter) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/use/item`,
    data: { itemBeingUsed, starter },
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      getAllUsersCharacters();
      getAllUsersItems();
    })
    .catch((err) => {
      console.log(err);
    });
}

function equipItem(itemBeingUsed, starter) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/inventory/equip/item`,
    data: { itemBeingUsed, starter },
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      getAllUsersCharacters();
      getAllUsersItems();
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeItem({ character, itemId }) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/inventory/remove/item`,
    data: { characterId: character.id, itemId },
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      getAllUsersCharacters();
      getAllUsersItems();
      showCharacterDetails(response.data, "bag");
    })
    .catch((err) => {
      console.log(err);
    });
}

function buyItem(item) {
  if (user.coins >= item.itemCost) {
    audio.buyAndSellItem.play();

    axios({
      method: "PUT",
      url: `http://localhost:5001/api/inventory/buy/item`,
      data: item,
      withCredentials: true,
    })
      .then((response) => {
        fetchUser();
        getAllUsersItems();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("im broke :(");
  }
}

function sellItem(item) {
  audio.buyAndSellItem.play();
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/inventory/sell/item`,
    data: item,
    withCredentials: true,
  })
    .then((response) => {
      fetchUser();
      getAllUsersItems();
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
      fetchUser();
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

function healStarters() {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/heal/starters`,
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editCharactersNickname(e, character) {
  e.preventDefault();

  let editCharacterInput = document.getElementById("editNicknameInput");

  let characterInfo = {
    characterID: character.id,
    newCharacterName: editCharacterInput.value,
  };

  character.nickname = editCharacterInput.value;

  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/edit/nickname`,
    data: characterInfo,
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      editCharacterInput.value = "";
      showCharacterDetails(character, "bag");
    })
    .catch((err) => {
      console.log(err);
    });
}

function postAddAttackToCharacter(newAttackInfo) {
  axios({
    method: "POST",
    url: `http://localhost:5001/api/characters/add/attack`,
    data: newAttackInfo,
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

function putCharacterAttackSwitching(characterInfo) {
  axios({
    method: "PUT",
    url: `http://localhost:5001/api/characters/attack/swap`,
    data: characterInfo,
    withCredentials: true,
  })
    .then((response) => {
      getStarters();
      getAllUsersCharacters();

      document.getElementById("pickAttackChangeOverlay").style.display = "none";

      showChangeCharacterAttacks(response.data);
      showCharacterDetails(response.data, "bag");
    })
    .catch((err) => {
      console.log(err);
    });
}

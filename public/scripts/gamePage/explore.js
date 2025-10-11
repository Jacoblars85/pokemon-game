let randomEnemy = Math.floor(Math.random() * 8 + 1);
// let randomEnemy = 8;

fetchUser();
getStarters();
getWildCharacter(randomEnemy);
getBasicAttacks();
getAllAttacks();
getAllUsersBattleItems();
getAllUsersConsumables();
getAllUsersThrowables();
getAllUsersItems();
getAllItems();
getAllUsersCharacters();
getAllCharacters();
getUsersChests();

const canvas = document.getElementById("canvasRef");
const c = canvas.getContext("2d");

const collisionsMap = [];

for (let i = 0; i < collisionsArray.length; i += 95) {
  collisionsMap.push(collisionsArray.slice(i, 95 + i));
}

const battleZonesMap = [];

for (let i = 0; i < battleZonesArray.length; i += 95) {
  battleZonesMap.push(battleZonesArray.slice(i, 95 + i));
}

const chestZonesMap = [];

for (let i = 0; i < chestZonesArray.length; i += 95) {
  chestZonesMap.push(chestZonesArray.slice(i, 95 + i));
}

const doorZonesMap = [];

for (let i = 0; i < doorZonesArray.length; i += 95) {
  doorZonesMap.push(doorZonesArray.slice(i, 95 + i));
}

const offset = {
  x: -15.5,
  y: -5990,
};

const startingWorldPosition = {
  x: 488,
  y: 254,
};

const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const chestZones = [];
let chestCounter = 1;

chestZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      chestZones.push(
        new Boundary({
          id: chestCounter++,
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const doorZones = [];

doorZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      doorZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const worldImage = new Image();
worldImage.src = "./img/backgroundImg/bowsermon-map-v3.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/backgroundImg/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/sprites/Player/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/sprites/Player/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/sprites/Player/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/sprites/Player/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
    attackFx: true,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const exploringBackground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: worldImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
};

function rectangularCollisions({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

const battle = {
  initiated: false,
};

const chest = {
  opened: false,
};

const pc = {
  opened: false,
};

const bag = {
  opened: false,
};

const settings = {
  opened: false,
};

const healing = {
  started: false,
};

const shop = {
  opened: false,
};

let movables;
let moving = true;

function getNearby(boundaries, distance = 100) {
  return boundaries.filter(
    (b) =>
      Math.abs(b.position.x - player.position.x) < distance &&
      Math.abs(b.position.y - player.position.y) < distance
  );
}

function movementIf(boundryParam) {
  const nearbyBoundaries = getNearby(boundryParam);

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < nearbyBoundaries.length; i++) {
      const boundary = nearbyBoundaries[i];

      const overlappingArea =
        Math.min(
          player.position.y + player.height,
          boundary.position.y + boundary.height
        ) - Math.max(player.position.y, boundary.position.y);

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        }) &&
        overlappingArea > player.height / 2.2
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < nearbyBoundaries.length; i++) {
      const boundary = nearbyBoundaries[i];

      const overlappingArea =
        Math.min(
          player.position.y + player.height,
          boundary.position.y + boundary.height
        ) -
        Math.max(player.position.y, boundary.position.y - player.height / 2);

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        }) &&
        overlappingArea > player.height / 2
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < nearbyBoundaries.length; i++) {
      const boundary = nearbyBoundaries[i];

      const overlappingArea =
        Math.min(
          player.position.y + player.height,
          boundary.position.y + boundary.height
        ) -
        Math.max(
          player.position.y,
          boundary.position.y - (player.height / 2 + 2)
        );

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        }) &&
        overlappingArea > player.height / 2
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < nearbyBoundaries.length; i++) {
      const boundary = nearbyBoundaries[i];

      const overlappingArea =
        Math.min(
          player.position.y + player.height,
          boundary.position.y + boundary.height
        ) -
        Math.max(player.position.y, boundary.position.y - player.height / 2);

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        }) &&
        overlappingArea > player.height / 2
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}

// chest functions
function openChest(boundryId) {
  let itemId = Math.floor(Math.random() * 19 + 1);
  let chestId = boundryId;

  userOpenChest({ itemId, chestId });

  document.getElementById("chestOverlay").style.display = "flex";

  allItems.forEach((item) => {
    if (item.id === itemId) {
      document.getElementById("rewardPicDiv").innerHTML = `
      <h3>${item.item_name}</h3>

      <img
        height="75"
        width="75"
        src=${item.item_pic}
      />
      `;
    }
  });
}

function closeChest() {
  document.getElementById("chestOverlay").style.display = "none";
  chest.opened = false;
  audio.closeButton.play();
}

document.getElementById("chestOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("chestInterfacePopUp");

  // Only close if clicking directly on the overlay (not inside the popup)
  if (!popup.contains(event.target)) {
    closeChest();
  }
});

// bag functions
function openBag() {
  moving = false;
  bag.opened = true;
  audio.openBag.play();

  document.getElementById("bagOverlay").style.display = "flex";
}

function closeBag() {
  moving = true;
  bag.opened = false;
  document.getElementById("bagOverlay").style.display = "none";
  audio.closeButton.play();
}

document.getElementById("bagOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("bagPopup");

  if (!popup.contains(event.target)) {
    closeBag();
  }
});

// item detail functions
function showItemDetails(item) {
  document.getElementById("itemDetailsOverlay").style.display = "flex";

  document.getElementById("itemDetailName").textContent = item.item_name;
  document.getElementById("itemDetailImage").src = item.item_pic;
  document.getElementById("itemDetailStats").textContent = `
    ${item.item_hp ? `+${item.item_hp} HP ` : ""}
    ${item.item_stamina ? `+${item.item_stamina} Stamina ` : ""}
    ${item.item_speed ? `+${item.item_speed} Speed` : ""}
    ${item.item_damage ? `+${item.item_damage} Damage` : ""}
  `;
}

function closeItemDetails() {
  document.getElementById("itemDetailsOverlay").style.display = "none";
  audio.closeButton.play();
}

document
  .getElementById("itemDetailsOverlay")
  .addEventListener("click", (event) => {
    const popup = document.getElementById("itemDetailsPopup");

    // Only close if clicking directly on the overlay (not inside the popup)
    if (!popup.contains(event.target)) {
      closeItemDetails();
    }
  });

// use item functions
function renderUseItemOverlay(item) {
  const container = document.getElementById("useItemStarterList");
  container.innerHTML = "";

  for (let i = 0; i < usersStarters.length; i++) {
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
      {
        item.item_type === "held"
          ? equipItem(item, starter)
          : useItemOnStarter(item, starter);
      }
      document.getElementById("useItemOverlay").style.display = "none";
    });

    container.appendChild(cell);
  }

  document.getElementById("useItemOverlay").style.display = "flex";
}

function closeUseItemOverlay() {
  document.getElementById("useItemOverlay").style.display = "none";
  audio.closeButton.play();
}

document.getElementById("useItemOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("useItemPopup");

  // Only close if clicking directly on the overlay (not inside the popup)
  if (!popup.contains(event.target)) {
    closeUseItemOverlay();
  }
});

function isOnScreen(obj, buffer = 50) {
  return (
    obj.position.x + obj.width > -buffer &&
    obj.position.x < canvas.width + buffer &&
    obj.position.y + obj.height > -buffer &&
    obj.position.y < canvas.height + buffer
  );
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  exploringBackground.draw();
  boundaries.forEach((boundary) => {
    if (isOnScreen(boundary)) boundary.draw();
    // boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    if (isOnScreen(battleZone)) battleZone.draw();
    // battleZone.draw();
  });
  chestZones.forEach((chestZone) => {
    if (isOnScreen(chestZone)) chestZone.draw();
    // chestZone.draw();
  });
  doorZones.forEach((doorZone) => {
    if (isOnScreen(doorZone)) doorZone.draw();
    // doorZone.draw();
  });
  player.draw();
  foreground.draw();

  movables = [
    exploringBackground,
    ...boundaries,
    foreground,
    ...battleZones,
    ...chestZones,
    ...doorZones,
  ];

  moving = true;
  player.animate = false;

  if (
    battle.initiated ||
    chest.opened ||
    pc.opened ||
    bag.opened ||
    settings.opened ||
    healing.started ||
    shop.opened
  )
    return;

  // open chest
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < chestZones.length; i++) {
      const chestZone = chestZones[i];
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: chestZone,
        })
      ) {
        const usersChest = usersChests.find(
          (chest) => chest.chest_id === chestZone.id
        );

        if (usersChest && usersChest.is_opened === false) {
          chest.opened = true;
          audio.openChest.play();
          openChest(chestZone.id);
        }
      }
    }
  }

  // open door
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < doorZones.length; i++) {
      const doorZone = doorZones[i];

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: doorZone,
        })
      ) {
        window.cancelAnimationFrame(animationId);
        audio.openDoorIn.play();
        gsap.to("#fadeOutDiv", {
          opacity: 1,
          repeat: 1,
          yoyo: true,
          duration: 0.6,
          onComplete() {
            animateHouse();

            gsap.to("#fadeOutDiv", {
              opacity: 0,
              duration: 0.4,
            });
          },
        });
        break;
      }
    }
  }

  // activate battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        // Math.random() < 0.8
        Math.random() < 0.015
      ) {
        window.cancelAnimationFrame(animationId);
        audio.map.stop();
        audio.initBattle.play();
        audio.battle.play();
        battle.initiated = true;
        gsap.to("#fadeOutDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#fadeOutDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle();
                animateBattle();
                document.getElementById("bagButton").style.display = "none";

                gsap.to("#fadeOutDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  // moving in all directions
  movementIf(boundaries);
}
animate();

movables.forEach((obj) => {
  obj.originalPosition = {
    x: obj.position.x,
    y: obj.position.y,
  };
});

let lastKey = "";
window.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") {
    keys.w.pressed = true;
    lastKey = "w";
  } else if (e.key === "a" || e.key === "ArrowLeft") {
    keys.a.pressed = true;
    lastKey = "a";
  } else if (e.key === "s" || e.key === "ArrowDown") {
    keys.s.pressed = true;
    lastKey = "s";
  } else if (e.key === "d" || e.key === "ArrowRight") {
    keys.d.pressed = true;
    lastKey = "d";
  } else if (e.key === "e") {
    keys.e.pressed = true;
    lastKey = "e";
  } else if (e.key === "f") {
    keys.f.pressed = true;
    lastKey = "f";
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") {
    keys.w.pressed = false;
  } else if (e.key === "a" || e.key === "ArrowLeft") {
    keys.a.pressed = false;
  } else if (e.key === "s" || e.key === "ArrowDown") {
    keys.s.pressed = false;
  } else if (e.key === "d" || e.key === "ArrowRight") {
    keys.d.pressed = false;
  } else if (e.key === "e") {
    keys.e.pressed = false;
  } else if (e.key === "f") {
    keys.f.pressed = false;
  }
});

let clicked = false;
function startAudio() {
  if (!clicked) {
    audio.map.play();
    clicked = true;

    removeEventListener("click", startAudio);
    removeEventListener("keydown", startAudio);
  }
}

addEventListener("click", startAudio);
addEventListener("keydown", startAudio);

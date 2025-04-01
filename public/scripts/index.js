// let randomEnemy = Math.floor(Math.random() * 8 + 1);
let randomEnemy = 8


getStarters();
getEnemy(randomEnemy);
getBasicAttacks();
getAllUsersItems();

// import lakeBackground from "./img/backgroundImg/LakeBackground.png";
// import forestBackground from "./img/backgroundImg/RockForest.webp";
// import battleMusic from "../../audio/battleMusic.mp3";

// // starter stats/info
// let starterOneHp = 0;
// let starterOneStamina = 0;
// let starterPicture = "";
// let starterFxImg = "";
// let starterOneName = "";
// let starterOneSpeed = 0;
// let starterOneInfo = {};
// let starterOneAttackStats = {};

// // starter 2 stats/info
// let starterTwoHp = 0;
// let starterTwoStamina = 0;
// let starterTwoPicture = "";
// let starterTwoFxImg = "";
// let starterTwoName = "";
// let starterTwoSpeed = 0;
// let starterTwoInfo = {};
// let starterTwoAttackStats = {};

// // enemy stats/info
// let enemyHp = 0;
// let enemyStamina = 0;
// let enemyPicture = "";
// let enemyFxImg = "";
// let enemyName = "";
// let enemySpeed = 0;
// let enemyInfo = {};
// let enemyAttackStats = {};

// // kick attack name and stamina
// let kickAttackStats = {};
// let kickAttack = "";
// let kickStamina = 0;

// // poke attack name and stamina
// let pokeAttackStats = {};
// let pokeAttack = "";
// let pokeStamina = 0;

// // setting each starter/enemy to a varriable
// let starters = [];
// let enemyOne;
// let starterOne;
// let starterTwo;
// let usersConsumableItems = [];

// // axios functions
// function getStarters() {
//   axios({
//     method: "GET",
//     url: "http://localhost:5001/api/characters/starter",
//   })
//     .then((response) => {
//       starterOne = response.data[0];

//       starterOneHp = response.data[0].hp;
//       starterOneStamina = response.data[0].stamina;
//       starterOneName = response.data[0].character_name;
//       starterOneSpeed = response.data[0].speed;
//       starterPicture = response.data[0].battle_pic;
//       starterFxImg = response.data[0].fx_img;

//       starterOneInfo = {
//         character_name: response.data[0].character_name,
//         hp: response.data[0].hp,
//         stamina: response.data[0].stamina,
//         speed: response.data[0].speed,
//         battle_pic: response.data[0].battle_pic,
//       };

//       starterOneAttackStats = {
//         attack_name: response.data[0].attack_name,
//         attack_damage: response.data[0].attack_damage,
//         attack_stamina: response.data[0].attack_stamina,
//         attack_type: response.data[0].attack_type,
//         fx_img: response.data[0].fx_img,
//         max_frames: response.data[0].max_frames,
//         hold_time: response.data[0].hold_time,
//       };

//       if (response.data.length === 2) {
//         starterTwo = response.data[1];

//         starterTwoHp = response.data[1].hp;
//         starterTwoStamina = response.data[1].stamina;
//         starterTwoName = response.data[1].character_name;
//         starterTwoSpeed = response.data[1].speed;
//         starterTwoPicture = response.data[1].battle_pic;
//         starterTwoFxImg = response.data[1].fx_img;

//         starterTwoInfo = {
//           character_name: response.data[1].character_name,
//           hp: response.data[1].hp,
//           stamina: response.data[1].stamina,
//           speed: response.data[1].speed,
//           battle_pic: response.data[1].battle_pic,
//         };

//         starterTwoAttackStats = {
//           attack_name: response.data[1].attack_name,
//           attack_damage: response.data[1].attack_damage,
//           attack_stamina: response.data[1].attack_stamina,
//           attack_type: response.data[1].attack_type,
//           fx_img: response.data[1].fx_img,
//           max_frames: response.data[1].max_frames,
//           hold_time: response.data[1].hold_time,
//         };
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function getEnemy(enemyId) {
//   axios({
//     method: "GET",
//     url: `http://localhost:5001/api/characters/enemy/${enemyId}`,
//   })
//     .then((response) => {
//       enemyOne = response.data[0];

//       enemyHp = response.data[0].hp;
//       enemyStamina = response.data[0].stamina;
//       enemyName = response.data[0].character_name;
//       enemySpeed = response.data[0].speed;
//       enemyPicture = response.data[0].battle_pic;
//       enemyFxImg = response.data[0].fx_img;

//       enemyInfo = {
//         character_name: response.data[0].character_name,
//         hp: response.data[0].hp,
//         stamina: response.data[0].stamina,
//         speed: response.data[0].speed,
//         battle_pic: response.data[0].battle_pic,
//       };

//       enemyAttackStats = {
//         attack_name: response.data[0].attack_name,
//         attack_damage: response.data[0].attack_damage,
//         attack_stamina: response.data[0].attack_stamina,
//         attack_type: response.data[0].attack_type,
//         fx_img: response.data[0].fx_img,
//         max_frames: response.data[0].max_frames,
//         hold_time: response.data[0].hold_time,
//       };
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function getBasicAttacks() {
//   axios({
//     method: "GET",
//     url: `http://localhost:5001/api/characters/basic`,
//   })
//     .then((response) => {
//       kickAttack = response.data[0].attack_name;
//       kickStamina = response.data[0].attack_stamina;
//       // setKickAttackType(response.data[0].attack_type);

//       kickAttackStats = {
//         attack_name: response.data[0].attack_name,
//         attack_damage: response.data[0].attack_damage,
//         attack_stamina: response.data[0].attack_stamina,
//         attack_type: response.data[0].attack_type,
//       };

//       pokeAttack = response.data[1].attack_name;
//       pokeStamina = response.data[1].attack_stamina;
//       // setPokeAttackType(response.data[1].attack_type);

//       pokeAttackStats = {
//         attack_name: response.data[1].attack_name,
//         attack_damage: response.data[1].attack_damage,
//         attack_stamina: response.data[1].attack_stamina,
//         attack_type: response.data[1].attack_type,
//       };
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function getAllUsersItems(resetBattleFunc) {
//   axios({
//     method: "GET",
//     url: "http://localhost:5001/api/inventory/user/consumable",
//   })
//     .then((response) => {
//       usersConsumableItems = response.data;

//       if (resetBattleFunc) resetBattleFunc();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

const canvas = document.getElementById("canvasRef");
const c = canvas.getContext("2d");

const collisionsMap = [];

for (let i = 0; i < collisionsArray.length; i += 235) {
  collisionsMap.push(collisionsArray.slice(i, 235 + i));
}

const battleZonesMap = [];

for (let i = 0; i < battleZonesArray.length; i += 235) {
  battleZonesMap.push(battleZonesArray.slice(i, 235 + i));
}

// const cheastZonesMap = []

// for (let i = 0; i < cheastZonesArray.length; i += 235) {
//   cheastZonesMap.push(cheastZonesArray.slice(i, 235 + i));
// }

const offset = {
  x: -4767.5,
  y: -5990,
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

// const cheastZones = [];

// cheastZonesMap.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     if (symbol === 1025) {
//       cheastZones.push(
//         new Boundary({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y,
//           },
//         })
//       );
//     }
//   });
// });

const worldImage = new Image();
worldImage.src = "./scripts/img/bowsermon-map-v1.png";

const foregroundImage = new Image();
foregroundImage.src = "./scripts/img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./scripts/img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./scripts/img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./scripts/img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./scripts/img/playerRight.png";

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
};

const movables = [
  exploringBackground,
  ...boundaries,
  foreground,
  ...battleZones,
];

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

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  exploringBackground.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

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
        Math.random() < 0.8
        // Math.random() < 0.015
      ) {
        window.cancelAnimationFrame(animationId);
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

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

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
animate();

let lastKey = "";

window.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    keys.w.pressed = true;
    lastKey = "w";
  } else if (e.key === "a") {
    keys.a.pressed = true;
    lastKey = "a";
  } else if (e.key === "s") {
    keys.s.pressed = true;
    lastKey = "s";
  } else if (e.key === "d") {
    keys.d.pressed = true;
    lastKey = "d";
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w") {
    keys.w.pressed = false;
  } else if (e.key === "a") {
    keys.a.pressed = false;
  } else if (e.key === "s") {
    keys.s.pressed = false;
  } else if (e.key === "d") {
    keys.d.pressed = false;
  }
});

let randomEnemy = Math.floor(Math.random() * 8 + 1);
// let randomEnemy = 8;

getStarters();
getEnemy(randomEnemy);
getBasicAttacks();
getAllUsersItems();

// import lakeBackground from "./img/backgroundImg/LakeBackground.png";
// import forestBackground from "./img/backgroundImg/RockForest.webp";
// import battleMusic from "../../audio/battleMusic.mp3";

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

const chestZonesMap = [];

for (let i = 0; i < chestZonesArray.length; i += 235) {
  chestZonesMap.push(chestZonesArray.slice(i, 235 + i));
}

const doorZonesMap = [];

for (let i = 0; i < doorZonesArray.length; i += 235) {
  doorZonesMap.push(doorZonesArray.slice(i, 235 + i));
}

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

const chestZones = [];

chestZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      chestZones.push(
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
worldImage.src = "./img/bowsermon-map-v1.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

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

let movables;

let moving = true;

function movementIf(boundryParam) {
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundryParam.length; i++) {
      const boundary = boundryParam[i];

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
    for (let i = 0; i < boundryParam.length; i++) {
      const boundary = boundryParam[i];

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
    for (let i = 0; i < boundryParam.length; i++) {
      const boundary = boundryParam[i];

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
    for (let i = 0; i < boundryParam.length; i++) {
      const boundary = boundryParam[i];

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

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  exploringBackground.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  chestZones.forEach((chestZone) => {
    chestZone.draw();
  });
  doorZones.forEach((doorZone) => {
    doorZone.draw();
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

  if (battle.initiated) return;

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
        console.log("trying to open a chest");
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

  // moving in all directions
  movementIf(boundaries);
}
animate();

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

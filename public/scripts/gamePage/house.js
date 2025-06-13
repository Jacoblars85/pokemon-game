const houseCollisionsMap = [];

for (let i = 0; i < houseCollisionsArray.length; i += 50) {
  houseCollisionsMap.push(houseCollisionsArray.slice(i, 50 + i));
}

const houseDoorZonesMap = [];

for (let i = 0; i < houseDoorZonesArray.length; i += 50) {
  houseDoorZonesMap.push(houseDoorZonesArray.slice(i, 50 + i));
}

const housePcZonesMap = [];

for (let i = 0; i < housePcZonesArray.length; i += 50) {
  housePcZonesMap.push(housePcZonesArray.slice(i, 50 + i));
}

const houseOffset = {
  x: -732,
  y: -1020,
};

const houseBoundaries = [];

houseCollisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1185) {
      houseBoundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + houseOffset.x,
            y: i * Boundary.height + houseOffset.y,
          },
        })
      );
    }
  });
});

const houseDoorZones = [];

houseDoorZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1185) {
      houseDoorZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + houseOffset.x,
            y: i * Boundary.height + houseOffset.y,
          },
        })
      );
    }
  });
});

const housePcZones = [];

housePcZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1185) {
      housePcZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + houseOffset.x,
            y: i * Boundary.height + houseOffset.y,
          },
        })
      );
    }
  });
});

const houseBackgroundImage = new Image();
houseBackgroundImage.src = "./img/backgroundImg/house-interior-background.png";

const houseBackground = new Sprite({
  position: {
    x: houseOffset.x,
    y: houseOffset.y,
  },
  image: houseBackgroundImage,
});

let houseAnimationId;

function animateHouse() {
  houseAnimationId = window.requestAnimationFrame(animateHouse);
  houseBackground.draw();

  houseBoundaries.forEach((houseBoundary) => {
    houseBoundary.draw();
  });

  houseDoorZones.forEach((houseDoorZone) => {
    houseDoorZone.draw();
  });

  housePcZones.forEach((housePcZone) => {
    housePcZone.draw();
  });

  player.draw();

  movables = [
    houseBackground,
    ...houseBoundaries,
    ...houseDoorZones,
    ...housePcZones,
  ];

  moving = true;
  player.animate = false;

  movementIf(houseBoundaries);

  // open door back to explore
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < houseDoorZones.length; i++) {
      const doorZone = houseDoorZones[i];

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: doorZone,
        })
      ) {
        window.cancelAnimationFrame(houseAnimationId);
        gsap.to("#fadeOutDiv", {
          opacity: 1,
          repeat: 1,
          yoyo: true,
          duration: 0.6,
          onComplete() {
            animate();

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

  // open pc to show all users characters
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < housePcZones.length; i++) {
      const pcZone = housePcZones[i];

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: pcZone,
        })
      ) {
        window.cancelAnimationFrame(houseAnimationId);

        document.getElementById("pcInterfacePopUp").style.display = "flex";

        document.getElementById("pcBody").innerHTML = "";

        for (let i = 0; i < usersCharacters.length; i++) {
          const characters = usersCharacters[i];

          document.getElementById("pcBody").innerHTML += `
        <div style=" 
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;
                padding: 5px; 
        ">
            <img height="50" width="50" src=${characters.profilePic} />
            <p style=" 
              text-align: center;
              width: 230px;
             "
             >${characters.character_name} </p>
            <div>
              <p style=" 
              margin: 0px;
              text-align: center;
              "
              >${characters.hp} hp | ${characters.stamina} stamina
              </p>
              <p style=" 
              margin: 0px;
              text-align: center;
              "
              >${characters.speed} speed</p>
            </div>
            <button
              id=${characters.id}
              style="
                color: black;
                font-size: 15;
                border-color: black;
                cursor: pointer;
                width: 100px;
              "
            >Set Starter 1</button>

            <button
              id=${characters.id}
              style="
                color: black;
                font-size: 15;
                border-color: black;
                cursor: pointer;
                width: 100px;
              "
            >Set Starter 2</button>

            <button
              id=${characters.id}
              style="
                color: black;
                font-size: 15;
                border-color: black;
                cursor: pointer;
                width: 100px;
              "
            >Remove Starter</button>
        </div>
      `;
        }
      }
    }
  }
}

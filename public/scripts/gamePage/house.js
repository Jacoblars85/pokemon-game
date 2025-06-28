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

function setStarter(e) {
  let route = "update"
  let characterId = Number(e.target.dataset.characterId)

  // if (e.target.innerHTML === "Remove") switchRoute = "clear";
  // else if (e.target.innerHTML === "Starter 1") switchRoute = "one";
  // else if (e.target.innerHTML === "Starter 2") switchRoute = "two";

  // console.log("switchRoute", switchRoute);


  let currentStarter
  let otherStarter

  if (e.target.innerHTML === "Remove") route = "clear";
  else if (e.target.innerHTML === "Starter 1") currentStarter = 1;
  else if (e.target.innerHTML === "Starter 2") currentStarter = 2;

  if (route !== "clear") {
const totalStarters = 2;
const allSlots = Array.from({ length: totalStarters }, (_, i) => i + 1);
const otherSlots = allSlots.filter((slot) => slot !== currentStarter);

    // Find if the character is currently in the other slot
    const isInOtherSlot = usersStarters.find(
      (start) => start.id === characterId && start[`starter_${otherSlots}`]
    );

    if (isInOtherSlot) {
      otherStarter = otherSlots;
    }
  }


  let newStarterInfo = {
    route,
    characterId,
    currentStarter,
    otherStarter,
  };

  console.log('newStarterInfo', newStarterInfo);
  

  putStarterSwitching(newStarterInfo);
}

function showCharacterDetails(character) {
  document.getElementById("characterDetailsOverlay").style.display = "flex";

  document.getElementById("switchStarter1Button").dataset.characterId =
    character.id;
  document.getElementById("switchStarterButton").dataset.characterId =
    character.id;
  document.getElementById("switchStarter2Button").dataset.characterId =
    character.id;

  document.getElementById("detailImage").src = character.profile_pic;
  document.getElementById("detailName").textContent = character.character_name;
  document.getElementById("detailHp").textContent = "hp: " + character.hp;
  document.getElementById("detailStamina").textContent =
    "stamina: " + character.stamina;
  document.getElementById("detailSpeed").textContent =
    "speed: " + character.speed;
  document.getElementById("detailAttackName").textContent =
    "attack: " + character.attack_name;
  document.getElementById("detailAttackDamage").textContent =
    "damage: " + character.attack_damage;
  document.getElementById("detailAttackStamina").textContent =
    "stamina used: " + character.attack_stamina;

  document.getElementById("detailDescription").textContent =
    character.description || "No description.";
}

function closeCharacterDetails() {
  document.getElementById("characterDetailsOverlay").style.display = "none";
}

document
  .getElementById("characterDetailsOverlay")
  .addEventListener("click", (event) => {
    const popup = document.getElementById("characterDetailsPopup");

    // Only close if clicking directly on the overlay (not inside the popup)
    if (!popup.contains(event.target)) {
      closeCharacterDetails();
    }
  });

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
        showCharacterDetails(pageItems[i]);
      });

      cell.appendChild(img);
    }

    pcGrid.appendChild(cell);
  }
  document.getElementById("pageNumber").textContent = `Page ${currentPage + 1}`;
}

function eventListenersForPc() {
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage === 49) {
      currentPage = 0;
      renderPcGrid();
    } else {
      currentPage++;
      renderPcGrid();
    }
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderPcGrid();
    } else {
      currentPage = 49;
      renderPcGrid();
    }
  });
}

function closePc() {
  document.getElementById("pcOverlay").style.display = "none";
  pc.opened = false;
}

document.getElementById("pcOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("pcInterfacePopUp");

  // Only close if clicking directly on the overlay (not inside the popup)
  if (!popup.contains(event.target)) {
    closePc();
  }
});

eventListenersForPc();

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

  if (battle.initiated || chest.opened || pc.opened) return;

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
        pc.opened = true;
        document.getElementById("pcOverlay").style.display = "flex";
        renderPcGrid();
      }
    }
  }

  // moving in all directions
  movementIf(houseBoundaries);
}

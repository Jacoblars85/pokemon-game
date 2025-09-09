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

const houseHealerZonesMap = [];

for (let i = 0; i < houseHealerZonesArray.length; i += 50) {
  houseHealerZonesMap.push(houseHealerZonesArray.slice(i, 50 + i));
}

const houseShopZonesMap = [];

for (let i = 0; i < houseShopZonesArray.length; i += 50) {
  houseShopZonesMap.push(houseShopZonesArray.slice(i, 50 + i));
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

const houseHealerZones = [];

houseHealerZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1185) {
      houseHealerZones.push(
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

const houseShopZones = [];

houseShopZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1185) {
      houseShopZones.push(
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
  let route = "update";
  let characterId = Number(e.target.dataset.characterId);
  let currentStarter;
  let otherStarter;

  if (e.target.innerHTML === "Remove") route = "clear";
  else if (e.target.innerHTML === "Starter 1") currentStarter = 1;
  else if (e.target.innerHTML === "Starter 2") currentStarter = 2;

  document.getElementById("starterHeader").textContent = e.target.innerHTML;
  if (e.target.innerHTML === "Remove")
    document.getElementById("starterHeader").textContent = "";

  if (route !== "clear") {
    const totalStarters = 2;
    const allSlots = Array.from({ length: totalStarters }, (_, i) => i + 1);
    const otherSlots = allSlots.filter((slot) => slot !== currentStarter);

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

  if (usersStarters.length === 1 && newStarterInfo.route === "clear") return;

  putStarterSwitching(newStarterInfo);
}

function showCharacterDetails(character, context = "") {
  document.getElementById("characterDetailsOverlay").style.display = "flex";

  document.getElementById("switchStarter1Button").dataset.characterId =
    character.id;
  document.getElementById("switchStarterButton").dataset.characterId =
    character.id;
  document.getElementById("switchStarter2Button").dataset.characterId =
    character.id;

  document.getElementById("starterHeader").textContent = character.starter_1
    ? "Starter 1"
    : (document.getElementById("starterHeader").textContent =
        character.starter_2 ? "Starter 2" : "");

  document.getElementById("detailImage").src = character.profile_pic;
  document.getElementById("detailLevel").textContent =
    "lvl: " + Math.floor(character.xp_level);
  document.getElementById("detailName").textContent = character.nickname || character.character_name;
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

  console.log("character", character);

  const container = document.getElementById("detailsItem");
  container.innerHTML = "";

  if (character.item_id) {
    container.style = `
          position: absolute; 
          top: 15%; 
          right: 15%; 
          display: flex; 
          flex-direction: column; 
          align-items: center;
        `;

    const img = document.createElement("img");
    img.src = character.item_pic;
    img.height = "70px";

    const itemName = document.createElement("div");
    itemName.textContent = character.item_name;
    itemName.style.fontWeight = "bold";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style = `
            cursor: pointer;
          `;

    removeButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Stop it from triggering detail popup
      removeItem({ character, itemId: character.item_id });
    });

    container.appendChild(itemName);
    container.appendChild(img);
    container.appendChild(removeButton);
  }

  let starterButtonContainer = document.getElementById(
    "starterButtonContainer"
  );

  if (context === "pc") starterButtonContainer.style.display = "flex";
  else starterButtonContainer.style.display = "none";
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

function closeShop() {
  document.getElementById("shopOverlay").style.display = "none";
  shop.opened = false;
}

document.getElementById("shopOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("shopInterfacePopUp");

  // Only close if clicking directly on the overlay (not inside the popup)
  if (!popup.contains(event.target)) {
    closeShop();
  }
});

function switchToBuy() {
  document.getElementById("shopBodyBuy").style.display = "flex";
  document.getElementById("shopBodySell").style.display = "none";
}

function switchToSell() {
  document.getElementById("shopBodyBuy").style.display = "none";
  document.getElementById("shopBodySell").style.display = "flex";
}

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

  houseHealerZones.forEach((houseHealerZone) => {
    houseHealerZone.draw();
  });

  houseShopZones.forEach((houseShopZone) => {
    houseShopZone.draw();
  });

  player.draw();

  movables = [
    houseBackground,
    ...houseBoundaries,
    ...houseDoorZones,
    ...housePcZones,
    ...houseHealerZones,
    ...houseShopZones,
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
        audio.openDoor.play();
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
        audio.openPc.play();

        document.getElementById("pcOverlay").style.display = "flex";
        renderPcGrid();
      }
    }
  }

  // heal the current starters
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < houseHealerZones.length; i++) {
      const HealerZone = houseHealerZones[i];

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: HealerZone,
        })
      ) {
        healing.started = true;
        audio.healingCharacters.play();

        setTimeout(() => {
          healStarters();
          healing.started = false;
        }, 3000);
      }
    }
  }

  // open shop to show all items
  if (keys.e.pressed || keys.f.pressed) {
    for (let i = 0; i < houseShopZones.length; i++) {
      const shopZone = houseShopZones[i];

      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: shopZone,
        })
      ) {
        shop.opened = true;
        audio.openShop.play();
        document.getElementById("shopOverlay").style.display = "flex";
      }
    }
  }

  // moving in all directions
  movementIf(houseBoundaries);
}

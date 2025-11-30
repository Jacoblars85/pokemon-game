const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/backgroundImg/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let enemy;
let starter;
let starter2;
let attackButtonsArray;
let renderedSprites;
let currentStarter;
let queue;
let battleAnimationId;

// animation for fading back to explore
function fadeBackToExplore() {
  gsap.to("#fadeOutDiv", {
    opacity: 1,
    onComplete: () => {
      cancelAnimationFrame(battleAnimationId);
      randomEnemy = Math.floor(Math.random() * 18 + 1);
      getWildCharacter(randomEnemy);
      animate();
      document.getElementById("battleInterface").style.display = "none";
      document.getElementById("userHud").style.display = "flex";
      gsap.to("#fadeOutDiv", {
        opacity: 0,
      });
      battle.initiated = false;
      audio.battle.stop();
      audio.map.play();
    },
  });
}

// reset user back to start on loss
function resetToStart() {
  const offsetX = player.position.x - startingWorldPosition.x;
  const offsetY = player.position.y - startingWorldPosition.y;

  // make sure movables is the array that contains every object that moves
  movables.forEach((obj) => {
    // Use originalPosition so we don't accumulate offsets
    if (!obj.originalPosition) {
      // fallback: if originalPosition wasn't saved, save it now based on current position
      obj.originalPosition = { x: obj.position.x, y: obj.position.y };
    }
    obj.position.x = obj.originalPosition.x + offsetX;
    obj.position.y = obj.originalPosition.y + offsetY;
  });

  player.image = player.sprites.down;
}

// func to reset the display for the attack box
function resetBattleFunc() {
  document.getElementById("attackBox").innerHTML = "";
  document.getElementById("switchBox").innerHTML = "";
  document.getElementById("inventoryBox").innerHTML = "";
  document.getElementById("deadSwitchBox").innerHTML = "";

  // InnerHtml for the attack box
  let attackNum = 10;
  for (let i = 0; i < attackButtonsArray.length; i++) {
    const attack = attackButtonsArray[i];
    attackNum++;

    document.getElementById("attackBox").innerHTML += `
      <button
              id=${attackNum}
              class="attackButton"
              disabled
              style="
                display: flex;
                width: 33.33%;
                height: 100%;
                text-align: center;
                font-size: 30px;
                color: black;
                justify-content: center;
                align-items: center;
                border: 0;
                border-bottom: 4px solid black;
                cursor: pointer;
                box-shadow: 0 0 0 0;
                "
            >${attack.attack_name}</button>
            `;

    if (attack.attack_stamina <= currentStarter.stamina) {
      let currentButton = document.getElementById(attackNum);

      currentButton.disabled = false;
    }
  }

  // InnerHtml for the switch box
  let starterNum = 0;
  for (let i = 0; i < starters.length; i++) {
    const start = starters[i];
    starterNum++;

    document.getElementById("switchBox").innerHTML += `
        <div style=" 
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;
                padding: 5px; 
        ">
            <img height="50" width="50" src=${start.profilePic} />
            <p style=" 
              text-align: center;
              width: 230px;
             "
             >starter ${starterNum}: ${start.name} </p>
            <div>
              <p style=" 
              margin: 0px;
              text-align: center;
              "
              >${start.health}/${start.maxHealth} hp | ${start.stamina}/${start.maxStamina} stamina
              </p>
              <p style=" 
              margin: 0px;
              text-align: center;
              "
              >${start.speed} speed</p>
            </div>
            <button
              id=${starterNum}
              style="
                color: black;
                font-size: 15;
                border-color: black;
                cursor: pointer;
                width: 100px;
              "
            >Change Starter</button>
        </div>
      `;
  }

  // InnerHtml for the inventory box
  for (const usersItems of usersBattleItems) {
    document.getElementById("inventoryBox").innerHTML += `
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
                      ${usersItems.number}X
                    </p>
                    <img
                      height="35"
                      width="35"
                      src=${usersItems.item_pic}
                    />
                  </div>
                  <p
                    style="
                      ml: 20;
                    "">
                    ${usersItems.item_name}
                  </p>
  
                  <p
                    style="
                      ml: 5;
                      font-size: 20px;
                      width: 150px;
                      text-align: center;
                    ">
                    ${
                      usersItems.item_hp === 0
                        ? ""
                        : `+${usersItems.item_hp} hp`
                    } ${
      usersItems.item_stamina === 0
        ? ""
        : usersItems.item_hp === 0
        ? `+${usersItems.item_stamina} stamina`
        : `| +${usersItems.item_stamina} stamina`
    } ${usersItems.item_speed === 0 ? "" : `| +${usersItems.item_speed} speed`}
                  </p>
                  <button
                  id=${usersItems.items_id}
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

  // InnerHtml for the dead switch box
  let starterNumInDead = 0;
  for (let i = 0; i < starters.length; i++) {
    const start = starters[i];
    starterNumInDead++;

    document.getElementById("deadSwitchBox").innerHTML += `
        <div style=" 
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;
                padding: 5px; 
                height: 50px;
        ">
            <img height="50" width="50" src=${start.profilePic} />
            <p style=" 
              text-align: center;
              font-size: 20px;
              width: 300px;
             "
             >starter ${starterNumInDead}: ${start.name} </p>
            <div>
              <p style=" 
              margin: 0px;
              text-align: center;
              font-size: 20px;
              "
              >${start.health}/${start.maxHealth} hp | ${start.stamina}/${start.maxStamina} stamina
              </p>
              <p style=" 
              margin: 0px;
              text-align: center;
              font-size: 20px;
              "
              >${start.speed} speed</p>
            </div>
            <button
              id=${starterNumInDead}
              style="
                color: black;
                font-size: 15;
                border-color: black;
                cursor: pointer;
                width: 100px;
              "
            >Change Starter</button>
        </div>
      `;
  }

  function enemyFaintIf(winningInfo) {
    if (enemy.health <= 0) {
      queue.push(() => {
        enemy.faint();
        audio.victory.play();
      });

      putWonBattle(winningInfo);

      queue.push(() => {
        document.getElementById("dialogueBox").innerHTML =
          "you won the battle!";
      });

      queue.push(() => {
        fadeBackToExplore();
      });
    }
  }

  function starterFaintIf() {
    if (currentStarter.health <= 0) {
      queue.push(() => {
        currentStarter.faint();
      });

      if (
        starter.health <= 0 &&
        (starterTwo != null ? starter2.health <= 0 : currentStarter.health <= 0)
      ) {
        queue.push(() => {
          document.getElementById("dialogueBox").innerHTML =
            "you lost the battle";
          audio.defeat.play();
        });

        queue.push(() => {
          resetToStart();
          fadeBackToExplore();
          healStarters();
        });
      }
      {
        queue.push(() => {
          document.getElementById("deadSwitchBox").style.display = "block";
        });
      }
    }
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const matchedStarter = usersStarters.find(
        (userStarter) => userStarter.id === currentStarter.id
      );

      let winningInfo = {
        xp: 0.25,
        characterXp: 0.2,
        winningStarter: {
          currentStarterId: currentStarter.id,
          level: currentStarter.level,
          current_hp: currentStarter.health,
          current_stamina: currentStarter.stamina,
          base_hp: allCharacters[currentStarter.id - 1].hp,
          base_stamina: allCharacters[currentStarter.id - 1].stamina,
          item: {
            item_hp: matchedStarter.item_hp ? matchedStarter.item_hp : null,
            item_stamina: matchedStarter.item_stamina
              ? matchedStarter.item_stamina
              : null,
          },
        },
      };

      if (e.target.className === "attackButton") {
        const characterSelectedAttack = e.target.innerHTML;
        let selectedAttack = {};
        audio.menuButton.play();

        for (const attack of currentStarter.attacks) {
          if (characterSelectedAttack === attack.attack_name) {
            selectedAttack = attack;
          }
        }

        if (currentStarter.speed >= enemyOne.speed) {
          currentStarter.attack({
            attack: selectedAttack,
            recipient: enemy,
            renderedSprites,
          });

          enemyFaintIf(winningInfo);
          // enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
          queue.push(() => {
            enemy.attack({
              attack: selectedAttack,
              recipient: currentStarter,
              renderedSprites,
            });

            starterFaintIf();
            resetBattleFunc();
          });
        } else if (currentStarter.speed < enemyOne.speed) {
          // enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
          enemy.attack({
            attack: selectedAttack,
            recipient: currentStarter,
            renderedSprites,
          });

          starterFaintIf();

          queue.push(() => {
            currentStarter.attack({
              attack: selectedAttack,
              recipient: enemy,
              renderedSprites,
            });

            enemyFaintIf(winningInfo);
            resetBattleFunc();
          });
        }
      } else if (e.target.innerHTML === "Attack") {
        audio.menuButton.play();
        document.getElementById("attackBox").style.display = "flex";
        document.getElementById("switchBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";
      } else if (e.target.innerHTML === "Switch") {
        audio.menuButton.play();
        document.getElementById("switchBox").style.display = "block";
        document.getElementById("attackBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";
      } else if (e.target.innerHTML === "Inventory") {
        audio.menuButton.play();
        document.getElementById("inventoryBox").style.display = "block";
        document.getElementById("attackBox").style.display = "none";
        document.getElementById("switchBox").style.display = "none";
      } else if (e.target.innerHTML === "Run") {
        document.getElementById("dialogueBox").style.display = "block";
        audio.menuButton.play();

        if (
          currentStarter.maxHealth +
            currentStarter.maxStamina +
            currentStarter.speed >=
          enemy.maxHealth + enemy.maxStamina + enemy.speed
        ) {
          document.getElementById("dialogueBox").innerHTML =
            "you ran away successfully";

          queue.push(() => {
            fadeBackToExplore();
          });
        } else {
          document.getElementById("dialogueBox").innerHTML =
            "you failed to run away";
          console.log("failed to run");
if (queue.length === 0) {
          queue.push(() => {
            
              enemy.attack({
              attack: {},
              recipient: currentStarter,
              renderedSprites,
            });
            console.log("failed to run inside the queue");

            starterFaintIf();
            resetBattleFunc();
            
            
          });
        }
        }
      } else if (e.target.innerHTML === "Use Item" && battle.initiated) {
        audio.menuButton.play();
        document.getElementById("attackBox").style.display = "flex";
        document.getElementById("switchBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";

        let itemBeingUsed;

        for (const usersItems of usersBattleItems) {
          if (usersItems.items_id == e.target.id) {
            itemBeingUsed = usersItems;
          }
        }

        let numOfShakes = 0;
        let isCaught = false;
        let randomRoll = Math.random();

        const hpFactor = Math.max(0.2, 1 - enemy.health / enemy.maxHealth);
        const levelFactor =
          (Math.floor(Number(currentStarter.level)) + 2) / (enemy.level + 2);

        let baseCatchChance = hpFactor * levelFactor;
        let finalCatchChance =
          baseCatchChance * Number(itemBeingUsed.item_capture_rate);

        finalCatchChance = Math.min(finalCatchChance, 1);

        const margin = finalCatchChance - randomRoll;

        // console.log("finalCatchChance", finalCatchChance);
        // console.log("randomRoll", randomRoll);
        // console.log("margin", margin);

        if (itemBeingUsed.item_type === "throwable") {
          if (
            randomRoll < finalCatchChance ||
            Number(itemBeingUsed.item_capture_rate) === 9
          ) {
            console.log("caught");

            isCaught = true;
            numOfShakes = 3;

            let newCharacter = {
              characterId: enemy.id,
              level: enemy.level,
              health: enemy.health,
              stamina: enemy.stamina,
              maxHealth: enemy.maxHealth,
              maxStamina: enemy.maxStamina,
            };

            postNewUserCharacter(newCharacter);
            putWonBattle(winningInfo);

            queue.push(() => {
              fadeBackToExplore();
            });
          } else if (margin > -0.15) {
            console.log("2 shake");

            // Close call — almost caught
            isCaught = false;
            numOfShakes = 2;
          } else if (margin > -0.3) {
            console.log("1 shake");

            // Not very close
            isCaught = false;
            numOfShakes = 1;
          } else {
            console.log("0 shake");

            // Total fail
            isCaught = false;
            numOfShakes = 0;
          }
        }

        currentStarter.usingItem({
          item: itemBeingUsed,
          recipient: enemy,
          renderedSprites,
          numOfShakes: numOfShakes,
          isCaught: isCaught,
        });

        useItem(itemBeingUsed, resetBattleFunc);

        if (!isCaught) {
          queue.push(() => {
            enemy.attack({
              attack: {},
              recipient: currentStarter,
              renderedSprites,
            });

            starterFaintIf();
            resetBattleFunc();
          });
        }
      } else if (
        e.target.innerHTML === "Change Starter" &&
        e.target.id != currentStarter.id
      ) {
        audio.menuButton.play();
        let changingStarter;
        if (e.target.id == 1) changingStarter = starter;
        else if (e.target.id == 2) changingStarter = starter2;

        if (changingStarter.health > 0) {
          document.getElementById("attackBox").style.display = "flex";
          document.getElementById("switchBox").style.display = "none";
          document.getElementById("inventoryBox").style.display = "none";
          document.getElementById("deadSwitchBox").style.display = "none";

          let currentStarterIsDead = false;
          if (currentStarter.health <= 0) currentStarterIsDead = true;

          currentStarter.switching({
            recipient: changingStarter,
          });

          currentStarter = changingStarter;

          attackButtonsArray.splice(0, 1, currentStarter.attackStats);

          if (!currentStarterIsDead) {
            queue.push(() => {
              enemy.attack({
                attack: {},
                recipient: currentStarter,
                renderedSprites,
              });

              starterFaintIf();
              resetBattleFunc();
            });
          }

          resetBattleFunc();
        }
      }
    });
  });
}

// Initialize the battle
function initBattle() {
  document.getElementById("battleInterface").style.display = "block";
  document.getElementById("dialogueBox").style.display = "none";

  enemy = new Character({
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: enemyOne.battle_pic,
    },
    frames: {
      max: 4,
      hold: 30,
      alignment: 0,
    },
    animate: true,
    isEnemy: true,
    id: enemyOne.id,
    name: enemyOne.character_name,
    health: enemyOne.hp,
    maxHealth: enemyOne.hp,
    stamina: enemyOne.stamina,
    maxStamina: enemyOne.stamina,
    speed: enemyOne.speed,
    character_type_id: enemyOne.character_type_id,
    character_type_name: enemyOne.character_type_name,
    character_type_effective: enemyOne.character_type_effective,
    character_type_weakness: enemyOne.character_type_weakness,
    level: enemyOne.xp_level,
    attacks: enemyAttackStats,
  });

  starter = new Character({
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: starterOne.battle_pic,
    },
    frames: {
      max: 4,
      hold: 30,
      alignment: 86,
    },
    animate: true,
    isCurrentStarter: true,
    id: starterOne.id,
    name: starterOne.character_name,
    profilePic: starterOne.profile_pic,
    health: starterOne.hp,
    maxHealth: starterOne.max_hp,
    stamina: starterOne.stamina,
    maxStamina: starterOne.max_stamina,
    speed: starterOne.speed,
    character_type_id: starterOne.character_type_id,
    character_type_name: starterOne.character_type_name,
    character_type_effective: starterOne.character_type_effective,
    character_type_weakness: starterOne.character_type_weakness,
    level: starterOne.xp_level,
    attacks: starterOne.attacks,
  });

  starters = [starter];

  currentStarter = starter;

  document.getElementById("starterName").innerHTML = currentStarter.name;
  document.getElementById("enemyName").innerHTML = enemy.name;

  document.getElementById("enemyHealthBar").style.width = "100%";
  document.getElementById("enemyStaminaBar").style.width = "100%";

  document.getElementById("starterHealthBar").style.width =
    (starter.health / starter.maxHealth) * 100 + "%";
  document.getElementById("starterStaminaBar").style.width =
    (starter.stamina / starter.maxStamina) * 100 + "%";

  document.getElementById("starterLevel").innerHTML =
    "lv." + Math.floor(currentStarter.level);
  document.getElementById("enemyLevel").innerHTML = "lv." + enemy.level;

  attackButtonsArray = [
    currentStarter.attacks[0],
    currentStarter.attacks[1],
    currentStarter.attacks[2],
  ];

  renderedSprites = [enemy, starter];

  if (starterTwo != null) {
    starter2 = new Character({
      position: {
        x: 280,
        y: 325,
      },
      image: {
        src: starterTwo.battle_pic,
      },
      frames: {
        max: 4,
        hold: 30,
        alignment: 86,
      },
      animate: true,
      opacity: 0,
      id: starterTwo.id,
      name: starterTwo.character_name,
      profilePic: starterTwo.profile_pic,
      health: starterTwo.hp,
      maxHealth: starterTwo.max_hp,
      stamina: starterTwo.stamina,
      maxStamina: starterTwo.max_stamina,
      speed: starterTwo.speed,
      character_type_id: starterTwo.character_type_id,
      character_type_name: starterTwo.character_type_name,
      character_type_effective: starterTwo.character_type_effective,
      character_type_weakness: starterTwo.character_type_weakness,
      level: starterTwo.xp_level,
      attacks: starterTwo.attacks,
    });

    starters.push(starter2);

    renderedSprites.push(starter2);
  }

  queue = [];

  resetBattleFunc();
}

// animates the battle
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

// func to go through the queue
document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (isAnimating) return;
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});

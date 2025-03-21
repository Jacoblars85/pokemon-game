const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./scripts/img/backgroundImg/battleBackground.png";

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

let renderedSprites;

let currentStarter;

let queue;

let battleAnimationId;

function initBattle() {
  document.getElementById("battleInterface").style.display = "block";
  document.getElementById("dialogueBox").style.display = "none";

  document.getElementById("enemyHealthBar").style.width = "100%";
  document.getElementById("enemyStaminaBar").style.width = "100%";

  document.getElementById("starterHealthBar").style.width = "100%";
  document.getElementById("starterStaminaBar").style.width = "100%";

  enemy = new Character({
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: enemyPicture,
    },
    frames: {
      max: 4,
      hold: 30,
      alignment: 0,
    },
    animate: true,
    isEnemy: true,
    name: enemyName,
    health: enemyHp,
    maxHealth: enemyHp,
    stamina: enemyStamina,
    maxStamina: enemyStamina,
    speed: enemySpeed,
    fx_img: enemyAttackStats.fx_img,
    attackStats: enemyAttackStats,
    max_frames: enemyAttackStats.max_frames,
    hold_time: enemyAttackStats.hold_time,
  });

  starter = new Character({
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: starterPicture,
    },
    frames: {
      max: 4,
      hold: 30,
      alignment: 86,
    },
    animate: true,
    isCurrentStarter: true,
    name: starterOneName,
    health: starterOneHp,
    maxHealth: starterOneHp,
    stamina: starterOneStamina,
    maxStamina: starterOneStamina,
    speed: starterOneSpeed,
    fx_img: starterOneAttackStats.fx_img,
    attackStats: starterOneAttackStats,
    max_frames: starterOneAttackStats.max_frames,
    hold_time: starterOneAttackStats.hold_time,
  });

  starter2 = new Character({
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: starterTwoPicture,
    },
    frames: {
      max: 4,
      hold: 30,
      alignment: 86,
    },
    animate: true,
    opacity: 0,
    name: starterTwoName,
    health: starterTwoHp,
    maxHealth: starterTwoHp,
    stamina: starterTwoStamina,
    maxStamina: starterTwoStamina,
    speed: starterTwoSpeed,
    fx_img: starterTwoAttackStats.fx_img,
    attackStats: starterTwoAttackStats,
    max_frames: starterTwoAttackStats.max_frames,
    hold_time: starterTwoAttackStats.hold_time,
  });

  currentStarter = starter;

  document.getElementById("starterName").innerHTML = currentStarter.name;
  document.getElementById("enemyName").innerHTML = enemy.name;

  // InnerHtml for the attack box
  document.getElementById("attackBox").innerHTML = `
<button
            id="attackButton"
            class="btn"
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
                  border-left: 4px solid black;
                  cursor: pointer;
                  box-shadow: 0 0 0 0;
                  "
          >${starterOne.attack_name}</button>

          <button
            id="attackButton"
            class="btn"
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
          >${kickAttack}</button>

          <button
            id="attackButton"
            class="btn"
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
          >${pokeAttack}</button>
`;

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
          <img height="50" width="50" src=${start.profile_pic} />
          <p style=" 
            text-align: center;
           "
           >starter ${starterNum}: ${start.character_name} </p>
          <div>
            <p style=" 
            margin: 0px;
            text-align: center;
            "
            >${start.hp}/${start.hp} hp | ${start.stamina}/${start.stamina} stamina
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
  for (const usersConsumables of usersConsumableItems) {
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
                    ${usersConsumables.number}X
                  </p>
                  <img
                    height="35"
                    width="35"
                    src=${usersConsumables.item_pic}
                  />
                </div>
                <p
                  style="
                    ml: 20;
                  "">
                  ${usersConsumables.item_name}
                </p>

                <p
                  style="
                    ml: 5;
                    font-size: 20px;
                    width: 150px;
                    text-align: center;
                  ">
                  ${
                    usersConsumables.item_hp === 0
                      ? ""
                      : `+${usersConsumables.item_hp} hp`
                  } ${
      usersConsumables.item_stamina === 0
        ? ""
        : usersConsumables.item_hp === 0
        ? `+${usersConsumables.item_stamina} stamina`
        : `| +${usersConsumables.item_stamina} stamina`
    } ${
      usersConsumables.item_speed === 0
        ? ""
        : `| +${usersConsumables.item_speed} speed`
    }
                </p>
                <button
                  id="attackButton"
                  class="consumable"
                  style="
                    color: black;
                    font-size: 15;
                    border-color: black;
                    cursor: pointer;
                  "
                  disabled=${usersConsumables.number <= 0 ? true : false}
                >
                  Use Consumable
                </button>
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

  renderedSprites = [enemy, starter, starter2];

  queue = [];

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.id === "attackButton") {
        console.log('clicked attack');
        
        const characterSelectedAttack = e.target.innerHTML;
        let selectedAttack = {};

        if (characterSelectedAttack === starterOneAttackStats.attack_name)
          selectedAttack = starterOneAttackStats;
        else if (characterSelectedAttack === starterTwoAttackStats.attack_name)
            selectedAttack = starterTwoAttackStats;
        else if (characterSelectedAttack === kickAttackStats.attack_name)
          selectedAttack = kickAttackStats;
        else if (characterSelectedAttack === pokeAttackStats.attack_name)
          selectedAttack = pokeAttackStats;

        if (currentStarter.speed >= enemySpeed) {
            currentStarter.attack({
            attack: selectedAttack,
            recipient: enemy,
            renderedSprites,
          });

          if (enemy.health <= 0) {
            queue.push(() => {
              enemy.faint();
            });

            queue.push(() => {
              gsap.to("#fadeOutDiv", {
                opacity: 1,
                onComplete: () => {
                  cancelAnimationFrame(battleAnimationId);
                  randomEnemy = Math.floor(Math.random() * 18 + 1);
                  getEnemy(randomEnemy);
                  animate();
                  document.getElementById("battleInterface").style.display =
                    "none";
                  gsap.to("#fadeOutDiv", {
                    opacity: 0,
                  });
                  battle.initiated = false;
                },
              });
            });
          }
          // enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
          queue.push(() => {
            enemy.attack({
              attack: selectedAttack,
              recipient: currentStarter,
              renderedSprites,
            });

            if (currentStarter.health <= 0) {
              queue.push(() => {
                currentStarter.faint();
              });

              queue.push(() => {
                gsap.to("#fadeOutDiv", {
                  opacity: 1,
                  onComplete: () => {
                    cancelAnimationFrame(battleAnimationId);
                    randomEnemy = Math.floor(Math.random() * 18 + 1);
                    getEnemy(randomEnemy);
                    animate();
                    document.getElementById("battleInterface").style.display =
                      "none";
                    gsap.to("#fadeOutDiv", {
                      opacity: 0,
                    });
                    battle.initiated = false;
                  },
                });
              });
            }
          });
        } else if (currentStarter.speed < enemySpeed) {
          console.log("enemy is faster");

          // enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
          enemy.attack({
            attack: selectedAttack,
            recipient: currentStarter,
            renderedSprites,
          });

          if (currentStarter.health <= 0) {
            queue.push(() => {
                currentStarter.faint();
            });

            queue.push(() => {
              gsap.to("#fadeOutDiv", {
                opacity: 1,
                onComplete: () => {
                  cancelAnimationFrame(battleAnimationId);
                  randomEnemy = Math.floor(Math.random() * 18 + 1);
                  getEnemy(randomEnemy);
                  animate();
                  document.getElementById("battleInterface").style.display =
                    "none";
                  gsap.to("#fadeOutDiv", {
                    opacity: 0,
                  });
                  battle.initiated = false;
                },
              });
            });
          }

          queue.push(() => {
            currentStarter.attack({
              attack: selectedAttack,
              recipient: enemy,
              renderedSprites,
            });

            if (enemy.health <= 0) {
              // console.log("are we really in the enemy fainting");

              queue.push(() => {
                enemy.faint();
              });

              queue.push(() => {
                gsap.to("#fadeOutDiv", {
                  opacity: 1,
                  onComplete: () => {
                    cancelAnimationFrame(battleAnimationId);
                    randomEnemy = Math.floor(Math.random() * 18 + 1);
                    getEnemy(randomEnemy);
                    animate();
                    document.getElementById("battleInterface").style.display =
                      "none";
                    gsap.to("#fadeOutDiv", {
                      opacity: 0,
                    });
                    battle.initiated = false;
                  },
                });
              });
            }
          });
        }
      } else if (e.target.innerHTML === "Attack") {
        document.getElementById("attackBox").style.display = "flex";
        document.getElementById("switchBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";
      } else if (e.target.innerHTML === "Switch") {
        document.getElementById("switchBox").style.display = "block";
        document.getElementById("attackBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";
      } else if (e.target.innerHTML === "Inventory") {
        document.getElementById("inventoryBox").style.display = "block";
        document.getElementById("attackBox").style.display = "none";
        document.getElementById("switchBox").style.display = "none";
      } else if (e.target.innerHTML === "Run") {
        gsap.to("#fadeOutDiv", {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(battleAnimationId);
            randomEnemy = Math.floor(Math.random() * 18 + 1);
            getEnemy(randomEnemy);
            animate();
            document.getElementById("battleInterface").style.display = "none";
            gsap.to("#fadeOutDiv", {
              opacity: 0,
            });
            battle.initiated = false;
          },
        });
      } else if (e.target.innerHTML === "Change Starter") {
        document.getElementById("attackBox").style.display = "flex";
        document.getElementById("switchBox").style.display = "none";
        document.getElementById("inventoryBox").style.display = "none";

        

        let changingStarter
        if (e.target.id == 1) changingStarter = starter
        else if (e.target.id == 2) changingStarter = starter2
        


        currentStarter.switching({
          recipient: changingStarter,
        });

        currentStarter = changingStarter;

        queue.push(() => {
          enemy.attack({
            attack: {},
            recipient: currentStarter,
            renderedSprites,
          });

          if (currentStarter.health <= 0) {
            queue.push(() => {
              currentStarter.faint();
            });

            queue.push(() => {
              gsap.to("#fadeOutDiv", {
                opacity: 1,
                onComplete: () => {
                  cancelAnimationFrame(battleAnimationId);
                  randomEnemy = Math.floor(Math.random() * 18 + 1);
                  getEnemy(randomEnemy);
                  animate();
                  document.getElementById("battleInterface").style.display =
                    "none";
                  gsap.to("#fadeOutDiv", {
                    opacity: 0,
                  });
                  battle.initiated = false;
                },
              });
            });
          }
        });
      }
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});

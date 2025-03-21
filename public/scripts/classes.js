class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10, alignment: 0, attackFx: false },
    sprites,
    animate = false,
    rotation = 0,
    opacity = 1,
  }) {
    this.position = position;
    this.image = new Image();
    (this.frames = { ...frames, val: 0, elapsed: 0 }),
      (this.image.onload = () => {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
      });

    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = opacity;
    this.rotation = rotation;
  }

  draw() {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;

    if (this.frames.attackFx) {
      c.drawImage(
        this.image,
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
      );
    } else {
      c.drawImage(
        this.image,
        this.frames.alignment,
        this.frames.val * this.width,
        this.image.width / this.frames.max,
        this.image.height / this.frames.max,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height / this.frames.max
      );
    }

    c.restore();

    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Character extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10, alignment: 0, attackFx: false },
    sprites,
    animate = false,
    rotation = 0,
    opacity = 1,
    isEnemy = false,
    isCurrentStarter = false,
    id,
    name = "no name",
    health,
    maxHealth,
    stamina,
    maxStamina,
    speed,
    fx_img,
    attackStats = {},
    max_frames,
    hold_time,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
      opacity,
    });
    this.isEnemy = isEnemy;
    this.isCurrentStarter = isCurrentStarter;
    this.id = id
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.stamina = stamina;
    this.maxStamina = maxStamina;
    this.speed = speed;
    this.fx_img = fx_img;
    this.attackStats = attackStats
    this.max_frames = max_frames;
    this.hold_time = hold_time;
  }

  faint() {
    document.getElementById("dialogueBox").innerHTML = this.name + " fainted!";

    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }

  switching({ recipient }) {
    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("dialogueBox").innerHTML =
      this.name + " switched into " + recipient.name;

    // document.getElementById("attackBox").innerHTML = `
    //   <button
    //               id="attackButton"
    //               class="btn"
    //                 style="
    //                     display: flex;
    //                     width: 33.33%;
    //                     height: 100%;
    //                     text-align: center;
    //                     font-size: 30px;
    //                     color: black;
    //                     justify-content: center;
    //                     align-items: center;
    //                     border: 0;
    //                     border-bottom: 4px solid black;
    //                     border-left: 4px solid black;
    //                     cursor: pointer;
    //                     box-shadow: 0 0 0 0;
    //                     "
    //             >${recipient.attackStats.attack_name}</button>
      
    //             <button
    //               id="attackButton"
    //               class="btn"
    //               style="
    //                     display: flex;
    //                     width: 33.33%;
    //                     height: 100%;
    //                     text-align: center;
    //                     font-size: 30px;
    //                     color: black;
    //                     justify-content: center;
    //                     align-items: center;
    //                     border: 0;
    //                     border-bottom: 4px solid black;
    //                     cursor: pointer;
    //                     box-shadow: 0 0 0 0;
    //                     "
    //             >${kickAttack}</button>
      
    //             <button
    //               id="attackButton"
    //               class="btn"
    //               style="
    //                     display: flex;
    //                     width: 33.33%;
    //                     height: 100%;
    //                     text-align: center;
    //                     font-size: 30px;
    //                     color: black;
    //                     justify-content: center;
    //                     align-items: center;
    //                     border: 0;
    //                     border-bottom: 4px solid black;
    //                     cursor: pointer;
    //                     box-shadow: 0 0 0 0;
    //                     "
    //             >${pokeAttack}</button>
    //   `;

    this.isCurrentStarter = false;
    recipient.isCurrentStarter = true;

    gsap.to(this.position, {
      x: this.position.x - 20,
    });
    gsap.to(this, {
      opacity: 0,
      onComplete: () => {
        document.getElementById("starterName").innerHTML = recipient.name;
        gsap.to("#starterHealthBar", {
          width: (recipient.health / recipient.maxHealth) * 100 + "%",
        });
        gsap.to("#starterStaminaBar", {
          width: (recipient.stamina / recipient.maxStamina) * 100 + "%",
        });
        gsap.to(recipient, {
          opacity: 1,
        });
        gsap.to(recipient.position, {
          x: recipient.position.x - 20,
        });
        gsap.to(recipient.position, {
          x: recipient.position.x,
        });
      },
    });
  }

  usingItem({ item }) {
    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("dialogueBox").innerHTML = this.name + " used " + item.item_name;

    this.health + item.hp
    
  }

  attack({ attack, recipient, renderedSprites }) {
    if (this.isEnemy) {
      if (this.stamina >= enemyAttackStats.attack_stamina)
        attack = enemyAttackStats;
      else if (this.stamina >= kickStamina) attack = kickAttackStats;
      else if (this.stamina >= pokeStamina) attack = pokeAttackStats;
      else if (this.stamina === 0) {
        attack = {
          attack_type: "tired",
          attack_name: "tired",
          attack_damage: 0,
          attack_stamina: 0,
        };
      }
    }

    recipient.health -= attack.attack_damage;
    this.stamina -= attack.attack_stamina;

    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("dialogueBox").innerHTML =
      this.name + " used " + attack.attack_name + "...";

    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#starterHealthBar";

    let staminaBar = "#starterStaminaBar";
    if (this.isEnemy) staminaBar = "#enemyStaminaBar";

    gsap.to(staminaBar, {
      width: (this.stamina / this.maxStamina) * 100 + "%",
    });

    const uniqueAttackFxImage = new Image();
    uniqueAttackFxImage.src = this.fx_img;

    if (attack.attack_type === "physical") {
      const tl = gsap.timeline();

      let movementDistance = 20;
      if (this.isEnemy) movementDistance = -20;

      tl.to(this.position, {
        x: this.position.x - movementDistance,
      })
        .to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            gsap.to(healthBar, {
              width: (recipient.health / recipient.maxHealth) * 100 + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
          },
        })
        .to(this.position, {
          x: this.position.x,
        });
    } else if (attack.attack_type === "projectile") {
      //   const enemyProjectileAttackFxImage = new Image();
      //   enemyProjectileAttackFxImage.src = enemyFxImg;

      //   const starterProjectileAttackFxImage = new Image();
      //   starterProjectileAttackFxImage.src = starterFxImg;

      const projectileAttackFx = new Sprite({
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        image: uniqueAttackFxImage,
        // this.isEnemy
        //   ? enemyProjectileAttackFxImage
        //   : starterProjectileAttackFxImage,
        frames: {
          // max: this.isEnemy ? enemyOne.max_frames : starterOne.max_frames,
          // hold: this.isEnemy ? enemyOne.hold_time : starterOne.hold_time,
          max: this.max_frames,
          hold: this.hold_time,
          attackFx: true,
        },
        animate: true,
        rotation,
      });

      renderedSprites.splice(2, 0, projectileAttackFx);

      gsap.to(projectileAttackFx.position, {
        x: recipient.position.x,
        y: recipient.position.y,
        onComplete: () => {
          gsap.to(healthBar, {
            width: (recipient.health / recipient.maxHealth) * 100 + "%",
          });
          gsap.to(recipient.position, {
            x: recipient.position.x + 10,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          });
          gsap.to(recipient, {
            opacity: 0,
            repeat: 5,
            yoyo: true,
            duration: 0.08,
          });

          renderedSprites.splice(2, 1);
        },
      });
    } else if (attack.attack_type === "summon") {
      //   const enemySummonAttackFxImage = new Image();
      //   enemySummonAttackFxImage.src = enemyFxImg;

      //   const starterSummonAttackFxImage = new Image();
      //   starterSummonAttackFxImage.src = starterFxImg;

      const summonAttackFx = new Sprite({
        position: {
          x: recipient.position.x + 10,
          y: recipient.position.y + 30,
        },
        image: uniqueAttackFxImage,
        // this.isEnemy
        //   ? enemySummonAttackFxImage
        //   : starterSummonAttackFxImage,
        frames: {
          // max: this.isEnemy ? enemyOne.max_frames : starterOne.max_frames,
          // hold: this.isEnemy ? enemyOne.hold_time : starterOne.hold_time,
          max: this.max_frames,
          hold: this.hold_time,
          attackFx: true,
        },
        animate: true,
      });

      renderedSprites.splice(3, 0, summonAttackFx);

      gsap.to(summonAttackFx.position, {
        x: recipient.position.x + 10,
        y: recipient.position.y + 30,
        duration: 1.3,
        onComplete: () => {
          gsap.to(healthBar, {
            width: (recipient.health / recipient.maxHealth) * 100 + "%",
          });
          gsap.to(recipient.position, {
            x: recipient.position.x + 10,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          });
          gsap.to(recipient, {
            opacity: 0,
            repeat: 5,
            yoyo: true,
            duration: 0.08,
          });

          renderedSprites.splice(3, 1);
        },
      });
    } else if (attack.attack_type === "tired") {
      gsap.to(this.position, {
        x: this.position.x + 10,
        yoyo: true,
        repeat: 5,
        duration: 0.08,
      });
      gsap.to(this, {
        opacity: 0.5,
        repeat: 5,
        yoyo: true,
        duration: 0.08,
      });
    }
  }
}

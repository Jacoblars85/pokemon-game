class Boundary {
  static width = 48;
  static height = 48;
  constructor({ id, position }) {
    this.id = id;
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
    profilePic,
    health,
    maxHealth,
    stamina,
    maxStamina,
    speed,
    level,
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
    this.id = id;
    this.name = name;
    this.profilePic = profilePic;
    this.health = health;
    this.maxHealth = maxHealth;
    this.stamina = stamina;
    this.maxStamina = maxStamina;
    this.speed = speed;
    this.level = level;
    this.fx_img = fx_img;
    this.attackStats = attackStats;
    this.max_frames = max_frames;
    this.hold_time = hold_time;
  }

  faint() {
    document.getElementById("dialogueBox").innerHTML = this.name + " fainted!";

    isAnimating = true;

    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
      onComplete: () => {
        isAnimating = false;
      },
    });
    audio.battle.stop();
    audio.victory.play();
  }

  switching({ recipient }) {
    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("dialogueBox").innerHTML =
      this.name + " switched into " + recipient.name;

    isAnimating = true;

    this.isCurrentStarter = false;
    recipient.isCurrentStarter = true;

    gsap.to(this.position, {
      x: this.position.x - 20,
    });
    gsap.to(this, {
      opacity: 0,
      onComplete: () => {
        audio.switchingCaracters.play();
        document.getElementById("starterName").innerHTML = recipient.name;
        document.getElementById("starterLevel").innerHTML =
          "lv." + Math.floor(recipient.level);
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
          onComplete: () => {
            isAnimating = false;
          },
        });
      },
    });
  }

  usingItem({ item, recipient, renderedSprites, numOfShakes, isCaught }) {
    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("dialogueBox").innerHTML =
      this.name + " used " + item.item_name;

    isAnimating = true;

    if (item.item_type === "throwable") {
      const throwableFxImage = new Image();
      throwableFxImage.src = item.item_pic;

      const throwableFx = new Sprite({
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        image: throwableFxImage,
        frames: {
          max: 1,
          hold: 1,
          attackFx: true,
        },
        animate: true,
        rotation: 1,
      });

      audio.usingThrowableItem.play();

      renderedSprites.splice(2, 0, throwableFx);

      gsap.to(throwableFx.position, {
        x: recipient.position.x + 5,
        y: recipient.position.y,
        onComplete: () => {
          audio.characterGoingIntoBall.play();

          gsap.to(recipient, {
            opacity: 0,
            duration: 0.5,
          });

          if (isCaught) {
            audio.ballShake.play();
            gsap.to(throwableFx.position, {
              x: throwableFx.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
              delay: 1,
              onComplete: () => {
                audio.ballShake.play();
                gsap.to(throwableFx.position, {
                  x: throwableFx.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08,
                  delay: 2,
                  onComplete: () => {
                    audio.ballShake.play();
                    gsap.to(throwableFx.position, {
                      x: throwableFx.position.x + 10,
                      yoyo: true,
                      repeat: 5,
                      duration: 0.08,
                      delay: 2,
                      onComplete: () => {
                        audio.caughtCharacter.play();

                        document.getElementById("dialogueBox").innerHTML =
                          "you caught " + recipient.name;
                        isAnimating = false;
                      },
                    });
                  },
                });
              },
            });
          } else if (numOfShakes === 0) {
            gsap.to(throwableFx.position, {
              x: throwableFx.position.x,
              delay: 0.5,

              onComplete: () => {
                audio.failedCatchingCharacter.play();
                gsap.to(recipient, {
                  opacity: 1,
                  duration: 1,
                });

                document.getElementById("dialogueBox").innerHTML =
                  "you failed to catch " + recipient.name;
                renderedSprites.splice(2, 1);
                isAnimating = false;
              },
            });
          } else if (numOfShakes === 1) {
            audio.ballShake.play();
            gsap.to(throwableFx.position, {
              x: throwableFx.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
              delay: 1,
              onComplete: () => {
                gsap.to(throwableFx.position, {
                  delay: 1,
                  onComplete: () => {
                    audio.failedCatchingCharacter.play();
                    gsap.to(recipient, {
                      opacity: 1,
                      duration: 0.5,
                    });

                    document.getElementById("dialogueBox").innerHTML =
                      "you failed to catch " + recipient.name;
                    renderedSprites.splice(2, 1);
                    isAnimating = false;
                  },
                });
              },
            });
          } else if (numOfShakes === 2) {
            audio.ballShake.play();
            gsap.to(throwableFx.position, {
              x: throwableFx.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
              delay: 1,
              onComplete: () => {
                audio.ballShake.play();
                gsap.to(throwableFx.position, {
                  x: throwableFx.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08,
                  delay: 2,
                  onComplete: () => {
                    gsap.to(throwableFx.position, {
                      delay: 1,
                      onComplete: () => {
                        audio.failedCatchingCharacter.play();

                        gsap.to(recipient, {
                          opacity: 1,
                          duration: 0.5,
                        });

                        document.getElementById("dialogueBox").innerHTML =
                          "you failed to catch " + recipient.name;
                        renderedSprites.splice(2, 1);
                        isAnimating = false;
                      },
                    });
                  },
                });
              },
            });
          }
        },
      });
    } else if (item.item_type === "consumable") {
      this.health += item.item_hp;
      this.stamina += item.item_stamina;
      this.speed += item.item_speed;

      if (this.health > this.maxHealth) this.health = this.maxHealth;
      if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;

      gsap.to(this.position, {
        x: this.position.x + 10,
        yoyo: true,
        repeat: 5,
        duration: 0.08,
      });
      gsap.to(this, {
        opacity: 0,
        repeat: 5,
        yoyo: true,
        duration: 0.08,
        onComplete: () => {
          audio.usingHealingItem.play();

          gsap.to("#starterHealthBar", {
            width: (this.health / this.maxHealth) * 100 + "%",
          });
          gsap.to("#starterStaminaBar", {
            width: (this.stamina / this.maxStamina) * 100 + "%",
          });
          isAnimating = false;
        },
      });
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    console.log("attack", attack);
    console.log("recipient", recipient);

    if (attack.attack_type_effective === recipient.character_type_id) {
      console.log("attack is effectiive");
    }

    if (attack.attack_type_weakness === recipient.character_type_id) {
      console.log("attack is weak");
    }

    if (this.isEnemy) {
      if (this.stamina >= enemyAttackStats.attack_stamina)
        attack = enemyAttackStats;
      else if (this.stamina >= kickStamina) attack = kickAttackStats;
      else if (this.stamina >= pokeStamina) attack = pokeAttackStats;
      else if (this.stamina === 0) {
        attack = {
          attack_style: "tired",
          attack_name: "tired",
          attack_damage: 0,
          attack_stamina: 0,
        };
      }
    }

    isAnimating = true;

    recipient.health -= attack.attack_damage;
    this.stamina -= attack.attack_stamina;

    if (recipient.health < 0) recipient.health = 0;

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

    if (attack.attack_style === "physical") {
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
            audio.physicalHit.play();
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
          onComplete: () => {
            isAnimating = false;
          },
        });
    } else if (attack.attack_style === "projectile") {
      audio.initFireball.play();

      const projectileAttackFx = new Sprite({
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        image: uniqueAttackFxImage,
        frames: {
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
          audio.fireballHit.play();
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
            onComplete: () => {
              isAnimating = false;
            },
          });

          renderedSprites.splice(2, 1);
        },
      });
    } else if (attack.attack_style === "summon") {
      audio.initFireball.play();
      const summonAttackFx = new Sprite({
        position: {
          x: recipient.position.x + 10,
          y: recipient.position.y + 30,
        },
        image: uniqueAttackFxImage,
        frames: {
          max: this.max_frames,
          hold: this.hold_time,
          attackFx: true,
        },
        animate: true,
      });

      renderedSprites.splice(2, 0, summonAttackFx);

      gsap.to(summonAttackFx.position, {
        x: recipient.position.x + 10,
        y: recipient.position.y + 30,
        duration: 1.3,
        onComplete: () => {
          audio.fireballHit.play();
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
            onComplete: () => {
              isAnimating = false;
            },
          });

          renderedSprites.splice(2, 1);
        },
      });
    } else if (attack.attack_style === "tired") {
      this.health -= 5;

      let tiredHealthBar = "#starterHealthBar";
      if (this.isEnemy) tiredHealthBar = "#enemyHealthBar";

      document.getElementById("dialogueBox").innerHTML =
        this.name + " hurt itself in exhaustion";

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
        onComplete: () => {
          audio.physicalHit.play();
          gsap.to(tiredHealthBar, {
            width: (this.health / this.maxHealth) * 100 + "%",
            onComplete: () => {
              isAnimating = false;
            },
          });
        },
      });
    }
  }
}

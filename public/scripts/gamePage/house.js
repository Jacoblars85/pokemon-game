const houseBackgroundImage = new Image();
houseBackgroundImage.src = "./img/backgroundImg/battleBackground.png";

const houseBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: houseBackgroundImage,
});

let houseAnimationId;

function animateHouse() {
  houseAnimationId = window.requestAnimationFrame(animateHouse);
  houseBackground.draw();

  player.draw();
  moving = true;
  player.animate = false;

  movementIf()
}


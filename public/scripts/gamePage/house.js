const houseBackgroundImage = new Image();
houseBackgroundImage.src = "./img/bowsermon-map-v1.png";

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

  movables = [houseBackground];

  moving = true;
  player.animate = false;

  movementIf();
}

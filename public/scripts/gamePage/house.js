const houseCollisionsMap = [];

for (let i = 0; i < houseCollisionsArray.length; i += 235) {
  houseCollisionsMap.push(houseCollisionsArray.slice(i, 235 + i));
}

const houseBoundaries = [];

houseCollisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 2207) {
      houseBoundaries.push(
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

const houseBackgroundImage = new Image();
houseBackgroundImage.src = "./img/backgroundImg/house-interior-background.png";

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

  houseBoundaries.forEach((houseBoundary) => {
    houseBoundary.draw();
  });

  player.draw();

  movables = [houseBackground, ...houseBoundaries,];

  moving = true;
  player.animate = false;

  movementIf();
}

const houseCollisionsMap = [];

for (let i = 0; i < houseCollisionsArray.length; i += 235) {
  houseCollisionsMap.push(houseCollisionsArray.slice(i, 235 + i));
}

const houseOffset = {
    x: -200.5,
    y: -200,
  };

const houseBoundaries = [];

houseCollisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 2207) {
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

  player.draw();

  movables = [houseBackground, ...houseBoundaries];

  moving = true;
  player.animate = false;

  movementIf();
}

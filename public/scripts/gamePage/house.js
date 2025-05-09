function animateHouse() {

        houseAnimationId = window.requestAnimationFrame(animateHouse);
        battleBackground.draw();
      
        renderedSprites.forEach((sprite) => {
          sprite.draw();
        });
      
}
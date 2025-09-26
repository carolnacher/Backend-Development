  const cat = document.getElementById("cat");
    const ball = document.getElementById("ball");

    let catPos = 50;
    let ballPos = window.innerWidth - 120;
    let direction = 1;

    function animate() {
      // mover el gato
      catPos += 2 * direction;
      cat.style.left = catPos + "px";

      // cuando el gato se acerque demasiado al ovillo, este se mueve
      if (catPos + 100 >= ballPos) {
        ballPos = Math.random() * (window.innerWidth - 120);
        ball.style.right = (window.innerWidth - ballPos - 60) + "px";
        direction = -direction; // cambia la dirección del gato
      }

      requestAnimationFrame(animate);
    }

    animate();
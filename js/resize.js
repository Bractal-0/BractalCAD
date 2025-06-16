export function addResizeListener(canvas, camera, frustrumSize = 10, renderer) {
  function onWindowResize() {
    const aspect = canvas.clientWidth / canvas.clientHeight;

    camera.left = -aspect * frustrumSize / 2;
    camera.right = aspect * frustrumSize / 2;
    camera.top = frustrumSize / 2;
    camera.bottom = -frustrumSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize(); // call once to set initial size
}
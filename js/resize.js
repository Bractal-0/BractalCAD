export function addResizeListener(camera, renderer, zoomScale = 1000) {
  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = -aspect * zoomScale / 2;
    camera.right = aspect * zoomScale / 2;
    camera.top = zoomScale / 2;
    camera.bottom = -zoomScale / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize(); // call once to set initial size
}
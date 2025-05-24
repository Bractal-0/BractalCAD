export function addResizeListener(camera, renderer, d = 1000) {
  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = -aspect * d / 2;
    camera.right = aspect * d / 2;
    camera.top = d / 2;
    camera.bottom = -d / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize(); // call once to set initial size
}
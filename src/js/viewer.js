import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODEL_CATALOG } from './catalog.js';

const params = new URLSearchParams(window.location.search);
const firstItemKey = Object.keys(MODEL_CATALOG)[0];
const selectedItem = params.get('item') || firstItemKey;
const selectedModel = MODEL_CATALOG[selectedItem] || MODEL_CATALOG[firstItemKey];

const container = document.getElementById('viewer-canvas');
const statusEl = document.getElementById('viewer-status');
const titleEl = document.getElementById('viewer-title');
const descEl = document.getElementById('viewer-description');

if (titleEl) titleEl.textContent = `${selectedModel.title} 3D Viewer`;
if (descEl) descEl.textContent = selectedModel.description;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(0, 1.2, 3.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 8;
controls.target.set(0, 0.6, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 8, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xbfd6ff, 0.6);
fillLight.position.set(-4, 3, -3);
scene.add(fillLight);

const loader = new GLTFLoader();
let mixer = null;

loader.load(
  selectedModel.modelPath,
  (gltf) => {
    const model = gltf.scene;

    // Normalize model size and center it
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.8 / maxDim;
    model.scale.setScalar(scale);

    const boxAfterScale = new THREE.Box3().setFromObject(model);
    const centerAfterScale = new THREE.Vector3();
    boxAfterScale.getCenter(centerAfterScale);
    model.position.sub(centerAfterScale);

    scene.add(model);

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }

    statusEl.classList.add('hidden');
  },
  (xhr) => {
    if (xhr.total) {
      const progress = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      statusEl.textContent = `Memuat model 3D... ${progress}%`;
    }
  },
  (error) => {
    console.error('Gagal memuat model 3D:', error);
    statusEl.textContent = 'Gagal memuat model 3D. Cek path file model.';
  }
);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

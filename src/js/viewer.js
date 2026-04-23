import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODEL_CATALOG } from './catalog.js';
import { musicPlayer } from './music.js';

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

// Add Play Sound Button if sound effect exists
if (selectedModel.soundEffect) {
  const soundBtn = document.createElement('button');
  soundBtn.className = 'play-sound-btn';
  soundBtn.innerHTML = `<span class="icon">🔊</span> Dengarkan Suaranya!`;
  
  const audio = new Audio(selectedModel.soundEffect);
  
  soundBtn.addEventListener('click', () => {
    // Turunkan volume backsound ke 5% dengan transisi cepat (0.3 detik)
    musicPlayer.setVolume(0.05, 0.3);

    // Beri selah 0.8 detik (gap) agar telinga anak siap mendengarkan suara alat musik baru
    setTimeout(() => {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log("Gagal memutar suara:", err);
        musicPlayer.setVolume(1, 0.3); // Kembalikan volume jika gagal play
      });
    }, 800);

    // Ketika sound effect selesai
    audio.onended = () => {
      // Tunggu 1 detik setelah suara habis agar kesan suaranya tidak terpotong (gap akhir)
      setTimeout(() => {
        musicPlayer.setVolume(1, 0.4);
      }, 1000);
    };
    
    // Animasi klik
    soundBtn.style.transform = 'scale(0.95)';
    setTimeout(() => soundBtn.style.transform = '', 100);
  });

  // Sisipkan sebelum deskripsi
  const descBox = document.querySelector('.desc-box');
  if (descBox) {
    descBox.insertBefore(soundBtn, descEl);
  }
}

// Check if the model is an external embed (like Sketchfab)
if (selectedModel.isEmbed) {
  statusEl.classList.add('hidden');
  container.innerHTML = `
    <iframe 
      title="${selectedModel.title}" 
      frameborder="0" 
      allowfullscreen 
      mozallowfullscreen="true" 
      webkitallowfullscreen="true" 
      allow="autoplay; fullscreen; xr-spatial-tracking" 
      xr-spatial-tracking 
      execution-while-out-of-viewport 
      execution-while-not-rendered 
      web-share 
      src="${selectedModel.embedUrl}"
      style="width: 100%; height: 100%; border-radius: 20px;">
    </iframe>`;
  // Stop Three.js initialization for embedded models
  throw new Error('Using Sketchfab Embed - Three.js skip intentional');
}

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

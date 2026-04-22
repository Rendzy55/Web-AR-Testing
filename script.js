import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Get the loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');

    // 1. Initialize MindARThree
    const mindarThree = new MindARThree({
      container: document.querySelector("#ar-container"),
      imageTargetSrc: './targets.mind',
      maxTrack: 1,
    });

    // 2. Initialize Three.js renderer, scene, and camera
    const { renderer, scene, camera } = mindarThree;
    
    // 3. Create a light for the 3D model
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // 4. Create an anchor for the target image
    const anchor = mindarThree.addAnchor(0);

    // 5. Load the 3D model (GLB)
    const loader = new GLTFLoader();
    loader.load('./assets/models/Laptop.gltf', (gltf) => {
      const model = gltf.scene;
      
      // Scale and position the model as needed
      model.scale.set(0.2, 0.2, 0.2);
      model.position.set(0, -0.4, 0);

      // Add the model to the anchor
      anchor.group.add(model);

      // Hide loading overlay once the model is loaded
      loadingOverlay.classList.add('hidden');
    },
    // Optional: Progress callback
    (xhr) => {
      console.log(`Model loading: ${(xhr.loaded / xhr.total * 100)}% loaded`);
    },
    // Optional: Error callback
    (error) => {
      console.error('An error happened while loading the model:', error);
      loadingOverlay.innerHTML = '<p>Error loading 3D model. Please check the console.</p>';
    });

    // 6. Start the AR engine
    await mindarThree.start();

    // 7. Set up the render loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();
});

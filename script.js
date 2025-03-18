// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("viewer").appendChild(renderer.domElement);
renderer.setClearColor(0xd3d3d3); // Light grey

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(5, 5, 5);
scene.add(light);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);




// Camera Position
camera.position.set(0, 1, 3);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2;

// Load Environment Map (HDRI)
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load("textures/environment.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

// Load 3D Model
const loader = new THREE.GLTFLoader();
let model;

loader.load(
    "models/my_model.glb", // Replace with your model
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
        console.error("Error loading model", error);
    }
);

// Texture Switching
const textureLoader = new THREE.TextureLoader();

document.getElementById("texture1").addEventListener("click", () => {
    if (model) {
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                textureLoader.load("textures/texture1.jpg", (texture) => {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.map = texture;
                            child.material.color.set(0xffffff); // Reset color to allow texture
                            child.material.needsUpdate = true;
                        }
                    });
                });
            }
        });
    }
});

document.getElementById("texture2").addEventListener("click", () => {
    if (model) {
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                textureLoader.load("textures/texture2.jpg", (texture) => {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.map = texture;
                            child.material.color.set(0xffffff); // Reset color to allow texture
                            child.material.needsUpdate = true;
                        }
                    });
                }); 
            }
        });
    }
});


// Animation Loop with Auto-Rotation
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.005;  // Rotate the model slowly
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Keyboard Controls for Model Movement
document.addEventListener("keydown", (event) => {
    if (!model) return;

    switch (event.key) {
        case "ArrowUp":
            model.position.z -= 0.1;
            break;
        case "ArrowDown":
            model.position.z += 0.1;
            break;
        case "ArrowLeft":
            model.position.x -= 0.1;
            break;
        case "ArrowRight":
            model.position.x += 0.1;
            break;
    }
});

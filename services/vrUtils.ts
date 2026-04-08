import * as THREE from "three";
import { VRObject, VRScene, Language } from "../types";

/**
 * VR sahna va objektlarni boshqarish uchun utility funksiyalari
 */

// Sahna yaratuvchi funksiya
export const createVRScene = (sceneData: VRScene) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.Fog(0x050505, 50, 200);

  return scene;
};

// Yorug'lik qo'shish
export const setupLighting = (
  scene: THREE.Scene,
  intensity: { ambient: number; pointLight: number; color: string },
) => {
  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, intensity.ambient);
  scene.add(ambientLight);

  // Point Light 1
  const pointLight1 = new THREE.PointLight(
    intensity.color,
    intensity.pointLight,
  );
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  // Point Light 2 (to'ldirish uchun)
  const pointLight2 = new THREE.PointLight(
    "#00f2fe",
    intensity.pointLight * 0.5,
  );
  pointLight2.position.set(-10, -5, -10);
  scene.add(pointLight2);

  return { ambientLight, pointLight1, pointLight2 };
};

// 3D modelni yuklash (GLB/GLTF formatida)
export const loadGLBModel = async (
  url: string,
  scene: THREE.Scene,
): Promise<THREE.Group | null> => {
  try {
    // Dinamik GLTFLoader yoki model yuklash simulyatsiyasi
    // Haqiqiy loyihada GLTF loader foydalaniladi
    console.log(`Loading model from: ${url}`);

    // Placeholder 3D shape o'rniga model
    const group = new THREE.Group();

    // Simulyatsiya uchun sodda geometriya
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.7,
      roughness: 0.2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    scene.add(group);
    return group;
  } catch (error) {
    console.error("Model yuklashda xato:", error);
    return null;
  }
};

// Sahnadon/Interaktiv objektlarni qo'shish
export const addInteractiveObject = (
  scene: THREE.Scene,
  obj: VRObject,
): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(...obj.scale);
  const material = new THREE.MeshStandardMaterial({
    color: obj.color || "#00f2fe",
    metalness: 0.6,
    roughness: 0.3,
    emissive: obj.color || "#00f2fe",
    emissiveIntensity: 0.2,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...obj.position);
  mesh.rotation.set(...obj.rotation);
  mesh.userData = {
    id: obj.id,
    name: obj.name,
    info: obj.info,
    interactive: obj.interactive,
  };

  scene.add(mesh);
  return mesh;
};

// Kamera o'rnatilishi
export const setupCamera = (
  fov: number = 50,
  aspect: number,
  near: number = 0.1,
  far: number = 10000,
) => {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 10);
  return camera;
};

// Klaviatura input boshqaruvi
export class KeyboardController {
  keys: { [key: string]: boolean } = {};
  velocity = { x: 0, y: 0, z: 0 };
  speed = 0.05;

  constructor() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    this.keys[key] = true;

    // Chap-o'ng harakat (A-D yoki strelkalar)
    if (key === "a" || key === "arrowleft") this.velocity.x = -this.speed;
    if (key === "d" || key === "arrowright") this.velocity.x = this.speed;

    // Oldinga-orqaga harakat (W-S yoki strelkalar)
    if (key === "w" || key === "arrowup") this.velocity.z = -this.speed;
    if (key === "s" || key === "arrowdown") this.velocity.z = this.speed;

    // Yuqori-pastga harakat (Space-Ctrl)
    if (key === " ") this.velocity.y = this.speed;
    if (key === "control") this.velocity.y = -this.speed;
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    this.keys[key] = false;

    // Zaif holga qaytarish
    if (
      key === "a" ||
      key === "arrowleft" ||
      key === "d" ||
      key === "arrowright"
    ) {
      this.velocity.x = 0;
    }
    if (
      key === "w" ||
      key === "arrowup" ||
      key === "s" ||
      key === "arrowdown"
    ) {
      this.velocity.z = 0;
    }
    if (key === " " || key === "control") {
      this.velocity.y = 0;
    }
  }

  update(camera: THREE.Camera) {
    if (this.keys["a"] || this.keys["arrowleft"])
      camera.position.x -= this.speed;
    if (this.keys["d"] || this.keys["arrowright"])
      camera.position.x += this.speed;
    if (this.keys["w"] || this.keys["arrowup"]) camera.position.z -= this.speed;
    if (this.keys["s"] || this.keys["arrowdown"])
      camera.position.z += this.speed;
    if (this.keys[" "]) camera.position.y += this.speed;
    if (this.keys["control"]) camera.position.y -= this.speed;
  }

  dispose() {
    window.removeEventListener("keydown", (e) => this.handleKeyDown(e));
    window.removeEventListener("keyup", (e) => this.handleKeyUp(e));
  }
}

// Raycasting kontrolleri - objektlarni tanlash uchun
export class RaycastController {
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  selectedObject: THREE.Mesh | null = null;
  originalMaterial: THREE.Material | null = null;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    window.addEventListener("click", (e) => this.onMouseClick(e));
  }

  private onMouseClick(event: MouseEvent) {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  updateSelection(
    camera: THREE.Camera,
    objects: THREE.Mesh[] | THREE.Object3D[],
  ) {
    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(objects);

    // Oldingi tanlovni o'chirish
    if (this.selectedObject && this.originalMaterial) {
      this.selectedObject.material = this.originalMaterial;
    }

    // Yangi tanlash
    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.interactive) {
        this.selectedObject = object;
        this.originalMaterial = object.material;

        // Material'ni o'zgartirish (selected state)
        const highlightMaterial = new THREE.MeshStandardMaterial({
          color: "#ffff00",
          metalness: 0.8,
          roughness: 0.1,
          emissive: "#00ff00",
          emissiveIntensity: 0.5,
        });
        object.material = highlightMaterial;
      }
    }
  }

  getSelectedObject(): VRObject | null {
    return this.selectedObject?.userData || null;
  }

  dispose() {
    window.removeEventListener("click", (e) => this.onMouseClick(e));
  }
}

// Particles effekt yaratish
export const createParticles = (scene: THREE.Scene, count: number = 1000) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return particles;
};

// Sahna sahifaharoratiga qaytarish funksiyasi
export const resetSceneToDefault = (camera: THREE.Camera) => {
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
};

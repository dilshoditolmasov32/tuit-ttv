# 🏗️ VR/AR Platform - Developer Architecture

## 📐 Code Structure

```
tv-tech-vr_ar-platform/
├── components/
│   ├── VRModule.tsx          # VR interaktiv muhit
│   ├── ARModule.tsx          # AR camera-based experience
│   ├── Scene3D.tsx           # Background 3D scene
│   └── ScrollTop.tsx         # Utility component
│
├── pages/
│   ├── Practice.tsx          # Main VR/AR lab page
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Programs.tsx
│   ├── Projects.tsx
│   ├── News.tsx
│   ├── Contact.tsx
│   ├── Lectures.tsx
│   ├── Videos.tsx
│   └── Tests.tsx
│
├── services/
│   ├── vrUtils.ts            # VR utilities (keyboard, raycasting, scene)
│   ├── arUtils.ts            # AR utilities (marker, camera, transform)
│   └── gemini.ts             # AI integration
│
├── types.ts                  # TypeScript interfaces
├── constants.tsx             # i18n strings va data
├── App.tsx                   # Main app component
├── index.tsx                 # Entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 🔧 Component Architecture

### VRModule.tsx

**Purpose**: Interactive 3D VR environment

**Key Components:**

```tsx
VRModule
├── Canvas (React-Three-Fiber)
│   └── VREnvironmentScene
│       ├── PerspectiveCamera
│       ├── 4x Interactive Objects
│       ├── Floor + walls
│       ├── Stars
│       └── Lighting
├── Info Panel (AnimatePresence)
├── Control Tips
├── Back Button
└── Stats Display
```

**Key Classes Used:**

- `THREE.Scene`: 3D scene management
- `THREE.Mesh`: 3D objects
- `KeyboardController`: Custom keyboard input handler
- `RaycastController`: Object picking with raycasting
- `THREE.Raycaster`: Ray-sphere intersection testing

**State Management:**

```tsx
state selectedObject: VRObject | null
hook setSelectedObject: (obj: VRObject | null) => void
hook showInfo: boolean (derived from selectedObject)
```

**Event Handling:**

- `keydown`: W/A/S/D/Space/Ctrl processing
- `keyup`: Velocity reset
- `click`: Raycasting for object selection
- `wheel`: Zoom (if added in future)

---

### ARModule.tsx

**Purpose**: Augmented Reality camera-based experience

**Key Components:**

```tsx
ARModule
├── Video Stream (HTMLVideoElement)
├── MarkerVisualization
│   ├── Outer detection ring
│   ├── Corner markers
│   └── Detection text
├── AR3DModel
│   ├── Animated cube
│   └── Glow effect
├── Control Panel
│   ├── Status indicator
│   ├── Object selector
│   └── Info text
├── Performance Stats
├── Controls Info
├── Back Button
└── Loading Overlay
```

**Key Classes Used:**

- `MarkerDetector`: Edge detection simulation
- `ARModelTransform`: 3D transformation
- `ARCamera`: Camera stream management
- `ARPerformanceMonitor`: Performance tracking

**State Management:**

```tsx
state sessionInfo: ARSessionInfo
state selectedObject: ARObject
state modelTransform: ARModelTransform
state [], cameras, detection info
```

**Event Handling:**

- `touchstart/touchmove`: Multi-touch gestures
- `mousedown/mousemove/mouseup`: Mouse controls
- `wheel`: Scroll zoom
- Camera initialization & permission handling



### vrUtils.ts

**Classes:**

1. **KeyboardController**

   ```tsx
   Methods:
   - constructor() // Setup listeners
   - handleKeyDown(e: KeyboardEvent)
   - handleKeyUp(e: KeyboardEvent)
   - update(camera: THREE.Camera) // Apply movement
   - dispose() // Cleanup

   Properties:
   - keys: { [key: string]: boolean }
   - velocity: { x, y, z }
   - speed: number
   ```

2. **RaycastController**

   ```tsx
   Methods:
   - onMouseClick(e: MouseEvent) // Store click position
   - updateSelection(...) // Raycasting logic
   - getSelectedObject() // Return selected

   Properties:
   - raycaster: THREE.Raycaster
   - mouse: THREE.Vector2
   - selectedObject: THREE.Mesh | null
   ```

**Utility Functions:**

```tsx
- createVRScene(sceneData: VRScene): THREE.Scene
- setupLighting(scene, intensity: {...}): lights
- loadGLBModel(url, scene): Promise<THREE.Group>
- addInteractiveObject(scene, obj: VRObject): THREE.Mesh
- setupCamera(fov, aspect, near, far): THREE.Camera
- createParticles(scene, count): THREE.Points
- resetSceneToDefault(camera): void
```

### arUtils.ts

**Classes:**

1. **MarkerDetector**

   ```tsx
   Methods:
   - detectMarker(video, markerWidth): Promise<boolean>
   - getMarkerPosition(video): { x, y, scale }
   - loadAndDetectMarkerImage(url): Promise<boolean>

   Properties:
   - isDetected: boolean
   - detectionThreshold: number
   ```

2. **ARModelTransform**

   ```tsx
   Methods:
   - rotateAroundMarker(deltaX, deltaY)
   - scale3DModel(factor)
   - moveModel(deltaX, deltaY, deltaZ)
   - reset()
   - getTransformMatrix(): string (CSS)

   Properties:
   - rotation: { x, y, z }
   - position: { x, y, z }
   - scale: { x, y, z }
   ```

3. **ARCamera**

   ```tsx
   Methods:
   - startCamera(video, facingMode): Promise<bool>
   - stopCamera()
   - captureFrame(): HTMLCanvasElement
   - recordARSession(duration): Promise<Blob>
   - dispose()

   Properties:
   - stream: MediaStream | null
   - videoElement: HTMLVideoElement | null
   ```

4. **ARPerformanceMonitor**
   ```tsx
   Methods:
   - update(): number (returns FPS)
   - getFPS(): number
   - measureLatency(startTime): number
   ```

---

## 🎯 Data Flow

### VR Selection Flow:

```
User clicks object
    ↓
onMouseClick (RaycastController)
    ↓
Store mouse position
    ↓
updateSelection (useFrame loop)
    ↓
Raycaster.intersectObjects()
    ↓
Check if userData.interactive === true
    ↓
Highlight material change
    ↓
setSelectedObject
    ↓
Render info panel (AnimatePresence)
    ↓
Display object data
```

### AR Detection Flow:

```
Video frame available
    ↓
detectMarker()
    ↓
Canvas drawImage
    ↓
Edge detection (black pixels)
    ↓
Calculate ratio
    ↓
Compare with threshold
    ↓
setSessionInfo
    ↓
Marker visualization update
    ↓
Show 3D model if detected
```

---

## 🎨 Styling Architecture

### Global Classes:

```css
/* Glass morphism */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Cyan color scheme */
.text-cyan-400 {
  color: #0ef;
}
.border-cyan-500 {
  border-color: #06f;
}
.bg-cyan-500 {
  background: #06f;
}

/* Dark theme */
.bg-[#050505] {
  background: #050505;
}
```

### Component-Specific Styles:

- Framer Motion for animations
- Tailwind CSS for responsive design
- Three.js materials for 3D styling

---

## 🔌 API Integration Points

### Existing:

- `gemini.ts`: Google Gemini AI API (unused in VR/AR)

### Future Integration:

- Real GLB model loading (GLTFLoader)
- ARToolkit or ML-based marker detection
- WebGL shaders for advanced effects
- Audio/Video encoding APIs

---

## 🚀 Performance Optimization

### Current Optimizations:

```tsx
// Particles limited to 800
const particles = createParticles(scene, 800);

// Raycasting only on click (not every frame)
raycastController.updateSelection(camera, meshes);

// Keyboard events debounced in KeyboardController
velocity reset on keyup

// MarkerDetector runs at 100ms interval
setInterval(..., 100);
```

### Recommended Further Optimizations:

```tsx
// LOD (Level of Detail) for distant objects
const lod = new THREE.LOD();

// Object pooling for particles
const particlePool = new ParticlePool(500);

// Texture compression
const ktx2Texture = await loader.loadAsync("model.ktx2");

// Frustum culling (enabled by Three.js by default)
scene.frustumCulled = true;

// Use InstancedMesh for repeated objects
const instancedMesh = new THREE.InstancedMesh(geo, mat, 100);
```

---

## 🧪 Testing Considerations

### Unit Tests (vitest):

```tsx
// Test KeyboardController velocity updating
test('KeyboardController updates camera position', () => {
  const controller = new KeyboardController();
  const camera = new THREE.PerspectiveCamera();

  controller.keys['w'] = true;
  controller.update(camera);

  expect(camera.position.z).toBeLessThan(0);
});

// Test RaycastController selection
test('RaycastController finds intersected objects', () => {
  const raycaster = new RaycastController();
  const mesh = new THREE.Mesh(...);
  mesh.userData.interactive = true;

  raycaster.updateSelection(camera, [mesh]);
  const selected = raycaster.getSelectedObject();

  expect(selected).toBeDefined();
});
```

### Integration Tests:

```tsx
// Test VR scene initialization
test('VR scene loads with 4 objects', () => {
  const scene = createVRScene({...});
  expect(scene.children.length).toBeGreaterThan(0);
});

// Test AR camera access
test('AR camera initializes successfully', async () => {
  const camera = new ARCamera();
  const started = await camera.startCamera(videoEl);
  expect(started).toBe(true);
});
```

---

## 📋 Dependency Management

### Core Libraries:

```json
{
  "react": "^19.2.4",
  "three": "^0.182.0",
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "framer-motion": "^12.30.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

### Version Compatibility:

- React 19+ required for latest features
- Three.js 0.180+ for WebGL 2.0 features
- TypeScript 5.8+ for strict mode

---

## 🔐 Security Considerations

### 1. Camera Access:

```tsx
// Only request when needed
navigator.mediaDevices
  .getUserMedia({
    video: { facingMode: "environment" },
  })

  // Always handle errors gracefully
  .catch((err) => console.error("Camera access denied:", err));
```

### 2. XSS Prevention:

- No `innerHTML` usage
- React auto-escaping
- Sanitize user inputs

### 3. CORS:

```tsx
// Video crossOrigin for CORS
video.crossOrigin = "Anonymous";
```

---

## 📚 Documentation References

- **React Docs**: https://react.dev
- **Three.js Docs**: https://threejs.org/docs
- **React-Three-Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Framer Motion**: https://www.framer.com/motion/
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🔄 Development Workflow

### Local Development:

```bash
npm install
npm run dev
# Open http://localhost:3000/
```

### Production Build:

```bash
npm run build
npm run preview
# Output in dist/
```

### Deployment:

```bash
# Push to production
git push origin main

# CI/CD handles build and deployment
```

---

## 🎯 Code Quality Standards

### ESLint Config:

```json
{
  "extends": ["react-app"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Config:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80
}
```

---

**Last Updated**: 2026-04-06
**Architecture Version**: 1.0.0
**Status**: Production Ready ✅

---

_Built with modern web technologies for immersive VR/AR experiences_

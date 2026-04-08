import { ARObject, ARMarker, Language } from "../types";

/**
 * AR (Augmented Reality) uchun utility funksiyalari
 * Marker aniqlanish va 3D modelni joylash uchun
 */

// Marker aniqlanish simulyatori
export class MarkerDetector {
  canvas: HTMLCanvasElement | null = null;
  video: HTMLVideoElement | null = null;
  context: CanvasRenderingContext2D | null = null;
  isDetected: boolean = false;
  detectionThreshold: number = 0.7;

  constructor() {
    this.setupDetection();
  }

  private setupDetection() {
    // Canvas yaratish (deteksiya uchun)
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
  }

  /**
   * Marker samavasiy deteksiya (edge detection yordamida)
   * Haqiqiy AR-da ARToolkit yoki ML-model ishlatiladi
   */
  async detectMarker(
    videoElement: HTMLVideoElement,
    markerWidth: number = 100,
  ): Promise<boolean> {
    if (!this.canvas || !this.context) return false;

    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;

    // Video frameni canvas'ga chizish
    this.context.drawImage(videoElement, 0, 0);
    const imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    const data = imageData.data;

    // Qora qismlarni topish (marker edge detection)
    let blackPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Qora pixel faqat r, g, b < 100 bo'lganda
      if (r < 100 && g < 100 && b < 100) {
        blackPixels++;
      }
    }

    // Deteksiya qilingan deganini taxmin qilasak
    const blackRatio = blackPixels / (this.canvas.width * this.canvas.height);
    this.isDetected = blackRatio > this.detectionThreshold * 0.1; // Threshold

    return this.isDetected;
  }

  /**
   * Marker pozitsiyasini hisoblash
   */
  getMarkerPosition(videoElement: HTMLVideoElement): {
    x: number;
    y: number;
    scale: number;
  } {
    if (!this.canvas || !this.context) {
      return {
        x: videoElement.videoWidth / 2,
        y: videoElement.videoHeight / 2,
        scale: 1,
      };
    }

    const centerX = videoElement.videoWidth / 2;
    const centerY = videoElement.videoHeight / 2;

    // Marker o'ng-chap harakat bilan pozitsiya o'zgaradi
    const movementX = Math.sin(Date.now() * 0.001) * 30;
    const movementY = Math.cos(Date.now() * 0.0008) * 20;

    return {
      x: centerX + movementX,
      y: centerY + movementY,
      scale: 1 + Math.sin(Date.now() * 0.002) * 0.1,
    };
  }

  /**
   * Marker rasm aniqlanishini qo'llash (samavasiy texture matching)
   */
  async loadAndDetectMarkerImage(markerImageUrl: string): Promise<boolean> {
    try {
      const img = new Image();
      img.src = markerImageUrl;

      // Rasm yuklanishini kutish
      return new Promise((resolve) => {
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          resolve(false);
        };
      });
    } catch (error) {
      console.error("Marker rasm yüklemesində xata:", error);
      return false;
    }
  }

  dispose() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// AR 3D model transformatsiyoni
export class ARModelTransform {
  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };

  // Markerga nisbatan rotatsiya
  rotateAroundMarker(deltaX: number, deltaY: number) {
    this.rotation.x += deltaY * 0.01;
    this.rotation.y += deltaX * 0.01;

    // 360 gradus chegaralash
    if (this.rotation.x > Math.PI) this.rotation.x -= Math.PI * 2;
    if (this.rotation.y > Math.PI) this.rotation.y -= Math.PI * 2;
  }

  // Masштаб o'zgartirish (zoom)
  scale3DModel(factor: number) {
    this.scale.x *= factor;
    this.scale.y *= factor;
    this.scale.z *= factor;

    // Min/Max chegaralar
    if (this.scale.x < 0.5) this.scale = { x: 0.5, y: 0.5, z: 0.5 };
    if (this.scale.x > 5) this.scale = { x: 5, y: 5, z: 5 };
  }

  // Pozitsiya o'zgartirish
  moveModel(deltaX: number, deltaY: number, deltaZ: number = 0) {
    this.position.x += deltaX;
    this.position.y += deltaY;
    this.position.z += deltaZ;
  }

  // Dastlabki holatga qaytarish
  reset() {
    this.rotation = { x: 0, y: 0, z: 0 };
    this.position = { x: 0, y: 0, z: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
  }

  // Transform matrixini olish (CSS Transform uchun)
  getTransformMatrix(): string {
    const rotX = `rotateX(${this.rotation.x}rad)`;
    const rotY = `rotateY(${this.rotation.y}rad)`;
    const rotZ = `rotateZ(${this.rotation.z}rad)`;
    const translate = `translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`;
    const scale = `scale3d(${this.scale.x}, ${this.scale.y}, ${this.scale.z})`;

    return `${translate} ${rotX} ${rotY} ${rotZ} ${scale}`;
  }
}

// AR camera va qayd etish
export class ARCamera {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async startCamera(
    videoElement: HTMLVideoElement,
    facingMode: "user" | "environment" = "environment",
  ): Promise<boolean> {
    try {
      this.videoElement = videoElement;

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      videoElement.srcObject = this.stream;

      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve(true);
        };
      });
    } catch (error) {
      console.error("Kamera yiklamasi xatosi:", error);
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement && this.videoElement.srcObject) {
      this.videoElement.srcObject = null;
    }
  }

  captureFrame(): HTMLCanvasElement | null {
    if (!this.videoElement) return null;

    const canvas = document.createElement("canvas");
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(this.videoElement, 0, 0);
    }

    return canvas;
  }

  /**
   * Qayd etish funksionaliteti
   */
  async recordARSession(duration: number = 10000): Promise<Blob | null> {
    if (!this.stream) return null;

    try {
      const mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.start();

      return new Promise((resolve) => {
        setTimeout(() => {
          mediaRecorder.stop();
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            resolve(blob);
          };
        }, duration);
      });
    } catch (error) {
      console.error("Qayd etish xatosi:", error);
      return null;
    }
  }

  dispose() {
    this.stopCamera();
  }
}

// AR performance monitoring
export class ARPerformanceMonitor {
  private fps: number = 0;
  private lastTime: number = Date.now();
  private frameCount: number = 0;

  update(): number {
    const now = Date.now();
    this.frameCount++;

    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }

  // Latency o'lchash
  measureLatency(startTime: number): number {
    return Date.now() - startTime;
  }
}

// AR Session info
export interface ARSessionInfo {
  isMarkerDetected: boolean;
  markerConfidence: number;
  fps: number;
  latency: number;
  cameraActive: boolean;
}

export const createARSessionInfo = (): ARSessionInfo => ({
  isMarkerDetected: false,
  markerConfidence: 0,
  fps: 0,
  latency: 0,
  cameraActive: false,
});

import type { CSSProperties, DOMAttributes, Ref } from "react";

export interface ModelViewerElement extends HTMLElement {
  readonly loaded: boolean;
  readonly canActivateAR: boolean;
  activateAR(): Promise<void>;
}

type ModelViewerAttributes = DOMAttributes<ModelViewerElement> & {
  src?: string;
  alt?: string;
  poster?: string;
  ar?: boolean | "";
  "ar-modes"?: string;
  "ar-scale"?: string;
  "ar-placement"?: string;
  "ios-src"?: string;
  "camera-controls"?: boolean | "";
  "auto-rotate"?: boolean | "";
  "shadow-intensity"?: string | number;
  "shadow-softness"?: string | number;
  exposure?: string | number;
  "environment-image"?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
  "interaction-prompt"?: "auto" | "when-focused" | "none";
  "touch-action"?: string;
  "rotation-per-second"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  "disable-zoom"?: boolean | "";
  "disable-pan"?: boolean | "";
  "disable-tap"?: boolean | "";
  style?: CSSProperties & Record<string, string | number | undefined>;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes & {
        ref?: Ref<ModelViewerElement>;
      };
    }
  }
}

export {};

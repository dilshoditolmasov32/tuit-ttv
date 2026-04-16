/**
 * VR Laboratory Demo - Dynamic Zones Data
 * Textures bilan ishlovchi dinamik zonalar ma'lumotlari
 */

export interface VRZone {
  id: string;
  title: string;
  image: string;
  desc: string;
  position: [number, number, number];
}

export const ZONES: VRZone[] = [
  {
    id: "studio",
    title: "Teleko'rsatuv studiyasi",
    image: "/assets/studio.jpg",
    desc: "Yoritish va dekoratsiya maydoni",
    position: [-5, 0, 0],
  },
  {
    id: "control_room",
    title: "Rejissyor pulti",
    image: "/assets/control_room.jpg",
    desc: "Markaziy monitoring qismi",
    position: [-2.5, 0, 0],
  },
  {
    id: "audio_room",
    title: "Ovoz yozish bo'limi",
    image: "/assets/audio_room.jpg",
    desc: "Mikrofon va akustik muhit",
    position: [0, 0, 0],
  },
  {
    id: "news_desk",
    title: "Yangiliklar desk zonasi",
    image: "/assets/news_desk.jpg",
    desc: "Spiker chiqishi va teleprompter hududi",
    position: [2.5, 0, 0],
  },
];

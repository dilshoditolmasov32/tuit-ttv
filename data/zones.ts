
export interface VRZone {
  id: string;
  image: string;
  position: [number, number, number];
  label?: string;
}


export const vrZones: VRZone[] = [
  {
    id: 'studio',
    image: '/assests/050A7790.JPG',
    position: [-4.5, 1.8, -2],
    label: 'Broadcast Studio',
  },
  {
    id: 'control',
    image: '/assests/050A7793.JPG',
    position: [0, 1.4, -4],
    label: 'Control Room',
  },
  {
    id: 'audio',
    image: '/assests/IMG_3288.jpg',
    position: [4.5, 1.4, -1.8],
    label: 'Audio Booth',
  },
  {
    id: 'news',
    image: '/assests/IMG_3327.jpg',
    position: [0, 1.2, 2.8],
    label: 'News Desk',
  },
];

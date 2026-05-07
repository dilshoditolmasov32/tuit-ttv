/**
 * VRZone type definition
 * Used by VRZoneBlock component to render a 3D zone with a texture image.
 */
export interface VRZone {
  /** Unique identifier for the zone */
  id: string;
  /** Path to the image used as a texture on the front face of the block */
  image: string;
  /** [x, y, z] position in 3D space */
  position: [number, number, number];
  /** Human-readable label for the zone */
  label?: string;
}

/**
 * Default VR zones data.
 * You can import and use these in your scene, or define your own array.
 */
export const vrZones: VRZone[] = [
  {
    id: 'studio',
    image: '/assests/050A7651.jpg',
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

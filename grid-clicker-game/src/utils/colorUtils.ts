// Color utility functions for blending and validation

/**
 * Blends two hex colors using RGB averaging
 * @param hex1 First color in hex format (#RRGGBB)
 * @param hex2 Second color in hex format (#RRGGBB)
 * @returns Blended color in hex format
 */
export function blendColors(hex1: string, hex2: string): string {
  // Remove # if present
  const c1 = hex1.replace('#', '');
  const c2 = hex2.replace('#', '');
  
  // Parse RGB components
  const r1 = parseInt(c1.substring(0, 2), 16);
  const g1 = parseInt(c1.substring(2, 4), 16);
  const b1 = parseInt(c1.substring(4, 6), 16);
  
  const r2 = parseInt(c2.substring(0, 2), 16);
  const g2 = parseInt(c2.substring(2, 4), 16);
  const b2 = parseInt(c2.substring(4, 6), 16);
  
  // Average the components
  const r = Math.floor((r1 + r2) / 2);
  const g = Math.floor((g1 + g2) / 2);
  const b = Math.floor((b1 + b2) / 2);
  
  // Convert back to hex with padding
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Validates if a string is a valid hex color
 * @param color Color string to validate
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Converts a hex color to standard 6-digit format
 * @param color Hex color (3 or 6 digits)
 * @returns Standardized 6-digit hex color
 */
export function normalizeHexColor(color: string): string {
  if (!color.startsWith('#')) {
    color = '#' + color;
  }
  
  // Convert 3-digit to 6-digit
  if (color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  
  return color.toLowerCase();
}

/**
 * Generates a random hex color
 * @returns Random hex color
 */
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Calculates the luminance of a color for contrast calculations
 * @param hex Hex color string
 * @returns Luminance value (0-1)
 */
export function getLuminance(hex: string): number {
  const color = normalizeHexColor(hex);
  const r = parseInt(color.substring(1, 3), 16) / 255;
  const g = parseInt(color.substring(3, 5), 16) / 255;
  const b = parseInt(color.substring(5, 7), 16) / 255;
  
  // Apply gamma correction
  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Determines if white or black text should be used on a colored background
 * @param backgroundColor Hex color of the background
 * @returns 'white' or 'black' for optimal contrast
 */
export function getContrastColor(backgroundColor: string): 'white' | 'black' {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Adds opacity to a hex color by converting to rgba
 * @param hex Hex color string
 * @param opacity Opacity value (0-1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, opacity: number): string {
  const color = normalizeHexColor(hex);
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
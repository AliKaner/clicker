// Unit tests for color utilities

import { it } from 'node:test';
import { describe } from 'node:test';
import { blendColors, isValidHexColor, normalizeHexColor, getContrastColor } from '../colorUtils';

describe('colorUtils', () => {
  describe('blendColors', () => {
    it('should blend two colors correctly', () => {
      const result = blendColors('#ff0000', '#0000ff');
      expect(result).toBe('#7f007f'); // Red + Blue = Purple
    });

    it('should handle colors without # prefix', () => {
      const result = blendColors('ff0000', '0000ff');
      expect(result).toBe('#7f007f');
    });

    it('should blend white and black to gray', () => {
      const result = blendColors('#ffffff', '#000000');
      expect(result).toBe('#7f7f7f');
    });
  });

  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#ff0000')).toBe(true);
      expect(isValidHexColor('#ABCDEF')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('#ABC')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(isValidHexColor('ff0000')).toBe(false); // No #
      expect(isValidHexColor('#gg0000')).toBe(false); // Invalid chars
      expect(isValidHexColor('#ff00')).toBe(false); // Wrong length
    });
  });

  describe('normalizeHexColor', () => {
    it('should convert 3-digit to 6-digit', () => {
      expect(normalizeHexColor('#f00')).toBe('#ff0000');
      expect(normalizeHexColor('#abc')).toBe('#aabbcc');
    });

    it('should add # prefix if missing', () => {
      expect(normalizeHexColor('ff0000')).toBe('#ff0000');
    });

    it('should convert to lowercase', () => {
      expect(normalizeHexColor('#FF0000')).toBe('#ff0000');
    });
  });

  describe('getContrastColor', () => {
    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('white');
      expect(getContrastColor('#333333')).toBe('white');
    });

    it('should return black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('black');
      expect(getContrastColor('#ffff00')).toBe('black');
    });
  });
});
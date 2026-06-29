import { describe, expect, it } from 'vitest';
import { swatchColor } from './CategorySelect';

describe('swatchColor', () => {
  it('maps black-coded categories to the theme text color', () => {
    // Legacy treats Qt::black as "use WindowText"; web mirrors that with
    // currentColor so the swatch is visible on the dark theme.
    expect(swatchColor('#000000')).toBe('currentColor');
    expect(swatchColor('#000')).toBe('currentColor');
    expect(swatchColor('black')).toBe('currentColor');
    expect(swatchColor('  #000000  ')).toBe('currentColor');
    expect(swatchColor('#000000'.toUpperCase())).toBe('currentColor');
  });

  it('passes non-black colors through unchanged', () => {
    expect(swatchColor('#00008b')).toBe('#00008b'); // Hunting / DarkBlue
    expect(swatchColor('#8b008b')).toBe('#8b008b'); // Alert / DarkMagenta
  });

  it('renders a missing color as transparent', () => {
    expect(swatchColor(undefined)).toBe('transparent');
    expect(swatchColor('')).toBe('transparent');
  });
});

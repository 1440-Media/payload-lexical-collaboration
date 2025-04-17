/**
 * CSS module declarations
 * 
 * This file declares CSS modules to TypeScript so that we can import CSS files directly.
 */

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D, options?: any): void;
  update?: () => void;
}

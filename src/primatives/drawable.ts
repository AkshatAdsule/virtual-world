export interface Drawable {
  draw(ctx: CanvasRenderingContext2D, ...opts: any[]): void;
  update?: () => void;
}

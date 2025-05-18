import React, { useEffect, useRef } from "react";

class Point {
  parent: Blob;
  azimuth: number;
  private _components: { x: number; y: number };
  private _acceleration = 0;
  private _speed = 0;
  private _radialEffect = 0;
  private _elasticity = 0.001;
  private _friction = 0.0085;

  constructor(azimuth: number, parent: Blob) {
    this.parent = parent;
    this.azimuth = Math.PI - azimuth;
    this._components = {
      x: Math.cos(this.azimuth),
      y: Math.sin(this.azimuth),
    };

    this.acceleration = -0.3 + Math.random() * 0.6;
  }

  solveWith(leftPoint: Point, rightPoint: Point) {
    this.acceleration =
      (-0.3 * this.radialEffect +
        (leftPoint.radialEffect - this.radialEffect) +
        (rightPoint.radialEffect - this.radialEffect)) *
        this.elasticity -
      this.speed * this.friction;
  }

  set acceleration(value: number) {
    if (typeof value === "number") {
      this._acceleration = value;
      this.speed += this._acceleration * 2;
    }
  }
  get acceleration() {
    return this._acceleration;
  }

  set speed(value: number) {
    if (typeof value === "number") {
      this._speed = value;
      this.radialEffect += this._speed * 5;
    }
  }
  get speed() {
    return this._speed;
  }

  set radialEffect(value: number) {
    if (typeof value === "number") {
      this._radialEffect = value;
    }
  }
  get radialEffect() {
    return this._radialEffect;
  }

  get position() {
    return {
      x:
        this.parent.center.x +
        this.components.x * (this.parent.radius + this.radialEffect),
      y:
        this.parent.center.y +
        this.components.y * (this.parent.radius + this.radialEffect),
    };
  }

  get components() {
    return this._components;
  }

  set elasticity(value: number) {
    if (typeof value === "number") {
      this._elasticity = value;
    }
  }
  get elasticity() {
    return this._elasticity;
  }
  set friction(value: number) {
    if (typeof value === "number") {
      this._friction = value;
    }
  }
  get friction() {
    return this._friction;
  }
}

class Blob {
  points: Point[] = [];
  private _color: string = "#000000";
  private _canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  private _numPoints: number = 32;
  private _radius: number = 300;
  private _position: { x: number; y: number } = { x: 0.5, y: 0.5 };

  mousePos: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {}

  init() {
    for (let i = 0; i < this.numPoints; i++) {
      let point = new Point(this.divisional * (i + 1), this);
      this.points.push(point);
    }
  }

  render = () => {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const position = this.position;
    const pointsArray = this.points;
    const radius = this.radius;
    const points = this.numPoints;
    const divisional = this.divisional;
    const center = this.center;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pointsArray[0].solveWith(pointsArray[points - 1], pointsArray[1]);

    let p0 = pointsArray[points - 1].position;
    let p1 = pointsArray[0].position;
    let _p2 = p1;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

    for (let i = 1; i < points; i++) {
      pointsArray[i].solveWith(
        pointsArray[i - 1],
        pointsArray[i + 1] || pointsArray[0]
      );

      let p2 = pointsArray[i].position;
      let xc = (p1.x + p2.x) / 2;
      let yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

      p1 = p2;
    }

    let xc = (p1.x + _p2.x) / 2;
    let yc = (p1.y + _p2.y) / 2;
    ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

    ctx.fillStyle = this.color || "#000000"; // fallback color
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    requestAnimationFrame(this.render);
  };

  set color(value: string) {
    this._color = value;
  }
  get color() {
    return this._color;
  }

  set canvas(value: HTMLCanvasElement) {
    if (
      value instanceof HTMLElement &&
      value.tagName.toLowerCase() === "canvas"
    ) {
      this._canvas = value;
      this.ctx = this._canvas.getContext("2d")!;
    }
  }
  get canvas() {
    return this._canvas;
  }

  set numPoints(value: number) {
    if (value > 2) {
      this._numPoints = value;
    }
  }
  get numPoints() {
    return this._numPoints;
  }

  set radius(value: number) {
    if (value > 0) {
      this._radius = value;
    }
  }
  get radius() {
    return this._radius;
  }

  set position(value: { x: number; y: number }) {
    if (
      typeof value === "object" &&
      value.x !== undefined &&
      value.y !== undefined
    ) {
      this._position = value;
    }
  }
  get position() {
    return this._position;
  }

  get divisional() {
    return (Math.PI * 2) / this.numPoints;
  }

  get center() {
    return {
      x: this.canvas.width * this.position.x,
      y: this.canvas.height * this.position.y,
    };
  }
}

const BlobComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const blob = new Blob();

    const init = () => {
      const canvas = canvasRef.current!;
      canvas.setAttribute("touch-action", "none");

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", resize);
      resize();

      let oldMousePoint = { x: 0, y: 0 };
      let hover = false;

      const mouseMove = (e: MouseEvent) => {
        const pos = blob.center;
        const diff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        let angle: number | null = null;

        blob.mousePos = { x: pos.x - e.clientX, y: pos.y - e.clientY };

        if (dist < blob.radius && !hover) {
          const vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          angle = Math.atan2(vector.y, vector.x);
          hover = true;
        } else if (dist > blob.radius && hover) {
          const vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          angle = Math.atan2(vector.y, vector.x);
          hover = false;
          blob.color = "#000000";
        }

        if (typeof angle === "number") {
          let nearestPoint: Point | null = null;
          let distanceFromPoint = 100;

          for (const point of blob.points) {
            const diffAngle = Math.abs(angle - point.azimuth);
            if (diffAngle < distanceFromPoint) {
              nearestPoint = point;
              distanceFromPoint = diffAngle;
            }
          }

          if (nearestPoint !== null) {
            let strength = {
              x: oldMousePoint.x - e.clientX,
              y: oldMousePoint.y - e.clientY,
            };
            const strengthValue =
              Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
            strength = { x: strengthValue, y: strengthValue };
            if (strengthValue > 100) strength = { x: 100, y: 100 };

            nearestPoint.acceleration = (strength.x / 100) * (hover ? -1 : 1);
          }
        }

        oldMousePoint = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener("pointermove", mouseMove);

      blob.canvas = canvas;
      blob.init();
      blob.render();
    };

    init();

    return () => {
      window.removeEventListener("pointermove", () => {});
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full touch-none"
      />
    </div>
  );
};

export default BlobComponent;

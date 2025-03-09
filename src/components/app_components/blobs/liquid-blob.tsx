import React, { useEffect, useRef } from "react";

const BlobComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let canvas: any, ctx: any;
    let blob: any;

    class Blob {
      points: Point[];
      ctx: any;
      _color: any;
      _canvas: any;
      _points: any;
      _radius: any;
      _position: any;
      _running: any;

      constructor() {
        this.points = [];
      }

      init() {
        for (let i = 0; i < this.numPoints; i++) {
          let point = new Point(this.divisional * (i + 1), this);
          this.push(point);
        }
      }

      render() {
        let canvas = this.canvas;
        let ctx = this.ctx;
        let position = this.position;
        let pointsArray = this.points;
        let radius = this.radius;
        let points = this.numPoints;
        let divisional = this.divisional;
        let center = this.center;

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
          var xc = (p1.x + p2.x) / 2;
          var yc = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

          p1 = p2;
        }

        var xc = (p1.x + _p2.x) / 2;
        var yc = (p1.y + _p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#000000";

        requestAnimationFrame(this.render.bind(this));
      }

      push(item: any) {
        if (item instanceof Point) {
          this.points.push(item);
        }
      }

      set color(value) {
        this._color = value;
      }
      get color() {
        return this._color || "#000000";
      }

      set canvas(value) {
        if (
          value instanceof HTMLElement &&
          value.tagName.toLowerCase() === "canvas"
        ) {
          this._canvas = canvas;
          this.ctx = this._canvas.getContext("2d");
        }
      }
      get canvas() {
        return this._canvas;
      }

      set numPoints(value) {
        if (value > 2) {
          this._points = value;
        }
      }
      get numPoints() {
        return this._points || 32;
      }

      set radius(value) {
        if (value > 0) {
          this._radius = value;
        }
      }
      get radius() {
        return this._radius || 300; // Increased blob size (default: 150)
      }

      set position(value) {
        if (typeof value == "object" && value.x && value.y) {
          this._position = value;
        }
      }
      get position() {
        return this._position || { x: 0.5, y: 0.5 };
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

      set running(value) {
        this._running = value === true;
      }
      get running(): boolean {
        return this.running !== false;
      }
    }

    class Point {
      parent: any;
      azimuth: any;
      _components: any;
      _acceleration: any;
      _speed: any;
      _radialEffect: any;
      _elasticity: any;
      _friction: any;

      constructor(azimuth: any, parent: any) {
        this.parent = parent;
        this.azimuth = Math.PI - azimuth;
        this._components = {
          x: Math.cos(this.azimuth),
          y: Math.sin(this.azimuth),
        };

        this.acceleration = -0.3 + Math.random() * 0.6;
      }

      solveWith(leftPoint: any, rightPoint: any) {
        this.acceleration =
          (-0.3 * this.radialEffect +
            (leftPoint.radialEffect - this.radialEffect) +
            (rightPoint.radialEffect - this.radialEffect)) *
            this.elasticity -
          this.speed * this.friction;
      }

      set acceleration(value) {
        if (typeof value == "number") {
          this._acceleration = value;
          this.speed += this._acceleration * 2;
        }
      }
      get acceleration() {
        return this._acceleration || 0;
      }

      set speed(value) {
        if (typeof value == "number") {
          this._speed = value;
          this.radialEffect += this._speed * 5;
        }
      }
      get speed() {
        return this._speed || 0;
      }

      set radialEffect(value) {
        if (typeof value == "number") {
          this._radialEffect = value;
        }
      }
      get radialEffect() {
        return this._radialEffect || 0;
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

      set elasticity(value) {
        if (typeof value === "number") {
          this._elasticity = value;
        }
      }
      get elasticity() {
        return this._elasticity || 0.001;
      }
      set friction(value) {
        if (typeof value === "number") {
          this._friction = value;
        }
      }
      get friction() {
        return this._friction || 0.0085;
      }
    }

    blob = new Blob();

    const init = () => {
      canvas = canvasRef.current;
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
        let pos = blob.center;
        let diff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        let dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        let angle = null;

        blob.mousePos = { x: pos.x - e.clientX, y: pos.y - e.clientY };

        if (dist < blob.radius && hover === false) {
          let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          angle = Math.atan2(vector.y, vector.x);
          hover = true;
        } else if (dist > blob.radius && hover === true) {
          let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          angle = Math.atan2(vector.y, vector.x);
          hover = false;
          blob.color = null;
        }

        if (typeof angle == "number") {
          let nearestPoint: Point | null = null;
          let distanceFromPoint = 100;

          blob.points.forEach((point: any) => {
            if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
              nearestPoint = point;
              distanceFromPoint = Math.abs(angle - point.azimuth);
            }
          });

          if (nearestPoint) {
            let strength = {
              x: oldMousePoint.x - e.clientX,
              y: oldMousePoint.y - e.clientY,
            };
            const strengthValue =
              Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
            strength = { x: strengthValue, y: strengthValue };
            if (strengthValue > 100) strength = { x: 100, y: 100 };
            if (nearestPoint) {
              nearestPoint.acceleration = (strength.x / 100) * (hover ? -1 : 1);
            }
          }
        }

        oldMousePoint.x = e.clientX;
        oldMousePoint.y = e.clientY;
      };
      window.addEventListener("pointermove", mouseMove);

      blob.canvas = canvas;
      blob.init();
      blob.render();
    };

    init();
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


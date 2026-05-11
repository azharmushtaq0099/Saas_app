"use client";

import { useEffect, useRef } from "react";

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };
  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;
  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt((this.pos.x - this.target.x) ** 2 + (this.pos.y - this.target.y) ** 2);
    if (distance < this.closeEnoughTarget) proximityMult = distance / this.closeEnoughTarget;

    const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y };
    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }
    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };
    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  }

  kill(width: number, height: number) {
    if (this.isKilled) return;
    const angle = Math.random() * Math.PI * 2;
    const mag = (width + height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    this.target.x = centerX + Math.cos(angle) * mag;
    this.target.y = centerY + Math.sin(angle) * mag;
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.isKilled = true;
  }
}

export function ParticleTextEffect({ words }: { words: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelSteps = 6;

    const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
      const angle = Math.random() * Math.PI * 2;
      return { x: x + Math.cos(angle) * mag, y: y + Math.sin(angle) * mag };
    };

    const nextWord = (word: string) => {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      if (!offscreenCtx) return;
      offscreenCtx.fillStyle = "white";
      offscreenCtx.font = "bold 100px Arial";
      offscreenCtx.textAlign = "center";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 3);

      const pixels = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height).data;
      const particles = particlesRef.current;
      let particleIndex = 0;
      const coordsIndexes: number[] = [];

      for (let i = 0; i < pixels.length; i += pixelSteps * 4) coordsIndexes.push(i);
      for (let i = coordsIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
      }

      for (const pixelIndex of coordsIndexes) {
        if (pixels[pixelIndex + 3] === 0) continue;
        const x = (pixelIndex / 4) % canvas.width;
        const y = Math.floor(pixelIndex / 4 / canvas.width);
        let particle: Particle;
        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.width + canvas.height) / 2,
          );
          particle.pos = randomPos;
          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = { r: 255, g: 255, b: 255 };
        particle.colorWeight = 0;
        particle.target = { x, y };
      }

      for (let i = particleIndex; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.move();
        particle.draw(ctx);
        if (
          particle.isKilled &&
          (particle.pos.x < 0 ||
            particle.pos.x > canvas.width ||
            particle.pos.y < 0 ||
            particle.pos.y > canvas.height)
        ) {
          particles.splice(i, 1);
        }
      }
      frameCountRef.current++;
      if (frameCountRef.current % 240 === 0) {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        nextWord(words[wordIndexRef.current]);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    const handleResize = () => {
      resizeCanvas();
      nextWord(words[wordIndexRef.current]);
    };

    resizeCanvas();
    nextWord(words[0]);
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [words]);

  return (
    <div className="absolute inset-0 h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" style={{ background: "black", zIndex: 10 }} />
    </div>
  );
}

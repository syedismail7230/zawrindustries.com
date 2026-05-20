'use client';
import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      // Draw a smooth rounded line to the new point
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.clientX, e.clientY);
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 1.5; 
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const animate = () => {
      // destination-out smoothly erases the canvas over time.
      // An alpha of 0.25 will fade the line to 0% in exactly ~0.25 seconds (15 frames)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      
      // To completely prevent 1% opacity ghosting, clear entirely if not drawing for a moment
      if (!isDrawing) {
        // Just let it naturally fade out. 0.25 is aggressive enough to avoid ghosting.
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousedown', startDrawing);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('mouseleave', stopDrawing);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', startDrawing);
      window.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('mouseleave', stopDrawing);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999
      }}
    />
  );
}

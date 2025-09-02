'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Booth } from '../data/booths';
import { Table } from '../data/tables';
import styles from './page.module.css';

interface CanvasMapProps {
  mapPosition: 'middle' | 'left';
}

const CanvasMap: React.FC<CanvasMapProps> = ({
  mapPosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the SVG map
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the CSS dimensions (not the high-DPI dimensions)
    const cssWidth = parseInt(canvas.style.width);
    const cssHeight = parseInt(canvas.style.height);

    // Clear canvas
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Load and draw the SVG image
    const img = new Image();
    img.onload = () => {
      // Clear any previous content
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      
      // Use imageSmoothingEnabled for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the SVG image to fill the canvas at CSS dimensions
      ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
    };
    img.src = '/oh_map.svg';
  }, []);



  // Set up canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      // Get the container dimensions
      const container = canvas.parentElement;
      if (!container) return;

      // Use the actual SVG dimensions for crisp quality
      const svgWidth = 1440;  // Original SVG width
      const svgHeight = 810;  // Original SVG height
      const svgAspectRatio = svgWidth / svgHeight;
      
      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      let canvasWidth, canvasHeight;
      
      // Calculate canvas size to fit container while maintaining aspect ratio
      if (containerWidth / containerHeight > svgAspectRatio) {
        // Container is wider than SVG aspect ratio
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * svgAspectRatio;
      } else {
        // Container is taller than SVG aspect ratio
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / svgAspectRatio;
      }
      
      // Ensure minimum size for quality
      const minWidth = 1200;
      const minHeight = 675;
      
      if (canvasWidth < minWidth || canvasHeight < minHeight) {
        if (minWidth / minHeight > svgAspectRatio) {
          canvasHeight = minHeight;
          canvasWidth = minHeight * svgAspectRatio;
        } else {
          canvasWidth = minWidth;
          canvasHeight = minWidth / svgAspectRatio;
        }
      }

      // Set canvas size with high DPI for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      
      // Set CSS size
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      
      // Scale context for high DPI
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      drawMap();
    };

    setupCanvas();
    
    // Add resize listener
    window.addEventListener('resize', setupCanvas);
    
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [drawMap]);

  return (
    <div className={`${styles.mapContainer} ${styles[`map-${mapPosition}`]}`}>
      <canvas
        ref={canvasRef}
        className={styles.venueMap}
        style={{ cursor: 'default' }}
      />
    </div>
  );
};

export default CanvasMap;

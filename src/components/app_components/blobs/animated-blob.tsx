import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedBlobProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  size?: number;
}

const AnimatedBlob: React.FC<AnimatedBlobProps> = ({ 
  className, 
  colors = { primary: '#DDDDDD', secondary: '#333333' },
  size = 8
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const blobRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000); // Black background

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create the twisted blob geometry
    const torusGeometry = new THREE.TorusGeometry(size * 0.8, size * 0.3, 128, 64);
    
    // Create metallic material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.primary),
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
    });

    // Create multiple torus meshes for the layered effect
    const torus1 = new THREE.Mesh(torusGeometry, material);
    const torus2 = new THREE.Mesh(torusGeometry, material);
    const torus3 = new THREE.Mesh(torusGeometry, material);

    // Position and rotate the tori to create the spiral effect
    torus1.rotation.x = Math.PI / 2;
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 3;
    torus3.rotation.x = Math.PI / 4;
    torus3.rotation.z = Math.PI / 4;

    // Group all tori
    const blobGroup = new THREE.Group();
    blobGroup.add(torus1);
    blobGroup.add(torus2);
    blobGroup.add(torus3);
    scene.add(blobGroup);
    blobRef.current = blobGroup as any;

    // Add environment lighting for the metallic material
    const hdrCubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    hdrCubeRenderTarget.texture.type = THREE.HalfFloatType;
    const hdrEquirect = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(hdrEquirect);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Add directional lights from different angles
    const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
    light3.position.set(0, 0, 10);
    scene.add(light3);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !blobRef.current) return;
      
      const elapsed = clock.current.getElapsedTime();
      
      // Rotate the entire group
      if (blobRef.current) {
        // Slow constant rotation
        blobRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.1;
        blobRef.current.rotation.y = elapsed * 0.15;
        blobRef.current.rotation.z = Math.cos(elapsed * 0.1) * 0.05;
        
        // Individual torus animations for organic movement
        ((blobRef.current as unknown) as THREE.Group).children.forEach((torus, i) => {
          torus.rotation.x += Math.sin(elapsed * 0.1 + i) * 0.001;
          torus.rotation.y += Math.cos(elapsed * 0.15 + i) * 0.001;
        });
      }
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [colors, size]);

  return <div ref={containerRef} className={`w-full h-full ${className || ''}`} />;
};

export default AnimatedBlob;
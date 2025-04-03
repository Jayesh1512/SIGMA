"use client";

import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

export default function ThreeDPage() {
  const canvasRef = useRef(null);
  const splineRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      splineRef.current = new Application(canvas);
      splineRef.current
        .load('https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode')
        .then(() => {
          console.log("3D Scene Loaded");
        });
    }
  }, []);

  // Function to update existing object
  const updateObject = () => {
    const obj = splineRef.current?.findObjectByName('Cube');
    if (obj) {
      obj.position.x = position.x;
      obj.position.y = position.y;
      obj.position.z = position.z;

      obj.rotation.x = rotation.x;
      obj.rotation.y = rotation.y;
      obj.rotation.z = rotation.z;

      console.log("Object updated:", obj);
    } else {
      console.log("Object not found.");
    }
  };

  return (
    <div className="w-full h-screen">
      <canvas ref={canvasRef} id="canvas3d" className="w-full h-full" />

      <div className="absolute top-4 left-4 space-y-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold">Position Controls</h3>
        {["x", "y", "z"].map((axis) => (
          <div key={axis}>
            <label>{axis.toUpperCase()}:</label>
            <input
              type="number"
              value={position[axis]}
              onChange={(e) => setPosition({ ...position, [axis]: Number(e.target.value) })}
              className="border p-1 rounded w-16 mx-2"
            />
          </div>
        ))}

        <h3 className="font-bold mt-4">Rotation Controls</h3>
        {["x", "y", "z"].map((axis) => (
          <div key={axis}>
            <label>{axis.toUpperCase()}:</label>
            <input
              type="number"
              value={rotation[axis]}
              onChange={(e) => setRotation({ ...rotation, [axis]: Number(e.target.value) })}
              className="border p-1 rounded w-16 mx-2"
            />
          </div>
        ))}

        <button onClick={updateObject} className="bg-blue-500 text-white p-2 rounded mt-4">Apply Changes</button>
      </div>
    </div>
  );
}

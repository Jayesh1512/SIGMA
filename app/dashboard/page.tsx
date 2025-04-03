'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();
  const [joinKey, setJoinKey] = useState("");
  const [is3D, setIs3D] = useState(false);

  const generateRandomKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleCreateTeam = () => {
    const randomKey = generateRandomKey();
    const route = is3D ? `/three-d/${randomKey}` : `/draw/${randomKey}`;
    router.push(route);
  };

  const handleJoinTeam = () => {
    if (joinKey.trim()) {
      router.push(`/draw/${joinKey}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center bg-black text-white">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <img src="/your-background-image.png" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      </div>

      {/* Hero Content */}
      <h1 className="text-6xl md:text-7xl font-bold relative">Let’s Design!</h1>
      <p className="mt-4 text-lg text-gray-300 relative">Sigma: Where Your Ideas Collide, Not Your Cursors</p>

      {/* Options and Buttons */}
      <div className="mt-6 flex flex-col items-center space-y-4 relative">
        <label className="flex items-center text-lg">
          <input type="checkbox" checked={is3D} onChange={(e) => setIs3D(e.target.checked)} className="mr-2" />
          Enable 3D Mode
        </label>
        <button onClick={handleCreateTeam} className="px-6 py-3 bg-gray-200 text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gray-300 transition">
          CREATE YOUR TEAM →
        </button>
        <input
          type="text"
          value={joinKey}
          onChange={(e) => setJoinKey(e.target.value)}
          placeholder="Enter Key"
          className="px-4 py-2 text-black rounded-md"
        />
        <button onClick={handleJoinTeam} className="px-6 py-3 bg-gray-200 text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gray-300 transition">
          JOIN TEAM →
        </button>
      </div>
    </div>
  );
};

export default HeroSection;

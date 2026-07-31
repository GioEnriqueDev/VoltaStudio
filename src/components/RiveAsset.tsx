"use client";
import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export default function RiveAsset() {
  const { rive, RiveComponent } = useRive({
    // Using a very popular community Interactive eye that tracks mouse
    // It provides a highly sci-fi feel
    src: 'https://cdn.rive.app/animations/vehicles.riv', // fallback to reliable Rive URL
    stateMachines: 'bumpy',
    autoplay: true,
  });

  // Example of capturing mouse to feed to Rive
  // Actually the vehicles.riv has a state machine but we just let it run.
  // If the user replaces this with their own interactive logo, they can use useStateMachineInput
  
  return (
    <div className="w-[150px] h-[150px] flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
      <RiveComponent />
    </div>
  );
}

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ManufacturingRobot3D = dynamic(
  () => import('@/components/ManufacturingRobot3D'),
  { ssr: false }
);

export default function ManufacturingHeroClient() {
  return <ManufacturingRobot3D />;
}

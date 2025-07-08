import React from 'react';
import { ChartBarIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="p-4 shadow-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <div className="container mx-auto flex items-center">
        <ChartBarIcon className="h-8 w-8 text-white mr-3" />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Vibrant Financial Dashboard
        </h1>
      </div>
    </header>
  );
};

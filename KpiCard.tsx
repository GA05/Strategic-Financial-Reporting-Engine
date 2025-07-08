import React from 'react';
import { Kpi } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons';

interface KpiCardProps {
  kpi: Kpi;
  color: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, color }) => {
  const trendColor = kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  const TrendIcon = kpi.changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className={`bg-white rounded-lg p-5 shadow-lg border-t-4 ${color}`}>
      <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{kpi.value}</p>
      {kpi.change && (
        <div className={`flex items-center text-sm mt-2 ${trendColor}`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          <span>{kpi.change} vs last period</span>
        </div>
      )}
    </div>
  );
};

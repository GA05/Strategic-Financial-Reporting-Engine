import React from 'react';
import { DataRow, Kpi } from '../types';
import { KpiCard } from './KpiCard';
import { ChartComponent } from './ChartComponent';
import { SparklesIcon, DocumentTextIcon } from './icons';

interface DashboardProps {
  kpis: Kpi[];
  chartData: DataRow[];
  forecastData: DataRow[] | null;
  chartKeys: { xAxis: string; yAxis: string };
  isForecasting: boolean;
  isGeneratingReport: boolean;
  onForecast: () => void;
  onGenerateReport: () => void;
}

const kpiColors = ['border-pink-500', 'border-yellow-500', 'border-green-500', 'border-sky-500'];

export const Dashboard: React.FC<DashboardProps> = ({ 
  kpis, chartData, forecastData, chartKeys, 
  isForecasting, isGeneratingReport, 
  onForecast, onGenerateReport 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4">
        <button
          onClick={onForecast}
          disabled={isForecasting || isGeneratingReport}
          className="px-5 py-2.5 bg-purple-500 text-white font-semibold rounded-lg shadow hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <SparklesIcon className="h-5 w-5" />
          {isForecasting ? 'Forecasting...' : 'AI Forecast'}
        </button>
        <button
          onClick={onGenerateReport}
          disabled={isGeneratingReport || isForecasting}
          className="px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-lg shadow hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <DocumentTextIcon className="h-5 w-5" />
          {isGeneratingReport ? 'Analyzing...' : 'AI Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => <KpiCard key={kpi.label} kpi={kpi} color={kpiColors[index % kpiColors.length]} />)}
      </div>

      <ChartComponent 
        data={chartData} 
        forecastData={forecastData}
        xAxisKey={chartKeys.xAxis} 
        yAxisKey={chartKeys.yAxis} 
      />
    </div>
  );
};

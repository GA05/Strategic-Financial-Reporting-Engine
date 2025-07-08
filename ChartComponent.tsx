import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataRow } from '../types';

interface ChartComponentProps {
  data: DataRow[];
  forecastData?: DataRow[] | null;
  xAxisKey: string;
  yAxisKey: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, forecastData, xAxisKey, yAxisKey }) => {
  const combinedData = forecastData ? [...data, ...forecastData.map(d => ({...d, isForecast: true}))] : data;

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg">
          <p className="label text-gray-600 font-semibold">{`${xAxisKey}: ${label}`}</p>
          <p className="intro text-blue-500">{`${yAxisKey}: ${p[yAxisKey]}`}</p>
          {p.isForecast && <p className="text-sm text-purple-500 font-semibold">Forecasted</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96 bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey={xAxisKey} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={yAxisKey} 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 8 }} 
            name="Historical"
          />
          {forecastData && (
            <Line 
              type="monotone" 
              dataKey={yAxisKey} 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              name="Forecast"
              data={forecastData.map(d => ({ ...d, [yAxisKey]: d[yAxisKey] }))}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

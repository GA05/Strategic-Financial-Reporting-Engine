import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { DataInputForm } from './components/DataInputForm';
import { Dashboard } from './components/Dashboard';
import { ReportModal } from './components/ReportModal';
import { fetchFinancialData, insertFinancialData } from './services/supabaseService';
import { generateForecast, generateReport } from './services/geminiService';
import { DataRow, Kpi } from './types';
import { SparklesIcon } from './components/icons';

const INITIAL_FORM_STATE = {
    month: '',
    revenue: '',
    new_users: '',
    conversion_rate: '',
};

export const App: React.FC = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [data, setData] = useState<DataRow[] | null>(null);
    const [forecastData, setForecastData] = useState<DataRow[] | null>(null);
    const [kpis, setKpis] = useState<Kpi[]>([]);
    const [chartKeys, setChartKeys] = useState<{ xAxis: string; yAxis: string } | null>(null);
    
    const [report, setReport] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isForecasting, setIsForecasting] = useState<boolean>(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const processData = useCallback((result: DataRow[]) => {
        if (!result || result.length === 0) {
            setData([]);
            setKpis([]);
            return;
        }

        const keys = Object.keys(result[0]);
        const dateKey = 'month';
        const numericKeys = keys.filter(k => typeof result[0][k] === 'number' && k !== 'id');
        
        if (numericKeys.length === 0) {
             setData(result);
             setKpis([]);
             setChartKeys(null);
             return;
        }

        const primaryValueKey = 'revenue';
        setChartKeys({ xAxis: dateKey, yAxis: primaryValueKey });

        const newKpis: Kpi[] = numericKeys.map(key => {
            const values = result.map(r => r[key]);
            const latestValue = values[values.length - 1];
            return {
                label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: latestValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
            };
        });

        setKpis(newKpis);
        setData(result);
        setForecastData(null);
        setError(null);
    }, []);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFinancialData();
            processData(result);
        } catch (err: any) {
            setError(err.message);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [processData]);
    
    useEffect(() => {
      loadData();
    }, [loadData]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.month || !formData.revenue) {
            setError("Month and Revenue are required fields.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        const newRecord = {
            month: formData.month,
            revenue: parseFloat(formData.revenue) || null,
            new_users: parseInt(formData.new_users, 10) || null,
            conversion_rate: parseFloat(formData.conversion_rate) || null,
        }

        try {
            await insertFinancialData(newRecord);
            setFormData(INITIAL_FORM_STATE); // Reset form
            await loadData(); // Refresh data
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForecast = async () => {
        if (!data || !chartKeys) return;
        setIsForecasting(true);
        setError(null);
        try {
            const historicalData = data.map(d => ({ 
                [chartKeys.xAxis]: d[chartKeys.xAxis],
                [chartKeys.yAxis]: d[chartKeys.yAxis]
            }));
            const forecastResult = await generateForecast(historicalData, chartKeys.xAxis, chartKeys.yAxis);
            setForecastData(forecastResult);
        } catch (err: any) {
            setError(err.message || 'Failed to generate forecast.');
        } finally {
            setIsForecasting(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!data) return;
        setIsGeneratingReport(true);
        setError(null);
        try {
            const reportText = await generateReport(data);
            setReport(reportText);
        } catch (err: any) {
            setError(err.message || 'Failed to generate report.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const WelcomeScreen = () => (
        <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-lg mt-6">
            <SparklesIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard!</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
                It looks like there's no data yet. Use the form on the left to add your first financial record. 
                Once you have data, your dashboard and chart will appear here.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <DataInputForm 
                            formData={formData}
                            onChange={handleFormChange}
                            onSubmit={handleFormSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
                        
                        {isLoading && (
                             <div className="flex justify-center items-center h-64">
                                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}

                        {!isLoading && data && data.length > 0 && chartKeys ? (
                            <Dashboard
                                kpis={kpis}
                                chartData={data}
                                forecastData={forecastData}
                                chartKeys={chartKeys}
                                isForecasting={isForecasting}
                                isGeneratingReport={isGeneratingReport}
                                onForecast={handleForecast}
                                onGenerateReport={handleGenerateReport}
                            />
                        ) : (
                            !isLoading && <WelcomeScreen />
                        )}
                    </div>
                </div>
            </main>
            <ReportModal report={report || ''} onClose={() => setReport(null)} />
        </div>
    );
};

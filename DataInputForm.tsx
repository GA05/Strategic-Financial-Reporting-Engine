import React from 'react';

interface DataInputFormProps {
    formData: {
        month: string;
        revenue: string;
        new_users: string;
        conversion_rate: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
}

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; type?: string; required?: boolean }> = 
({ label, name, value, onChange, placeholder, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            placeholder={placeholder}
            required={required}
        />
    </div>
);


export const DataInputForm: React.FC<DataInputFormProps> = ({ formData, onChange, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Add New Financial Record</h2>
      <InputField
        label="Month"
        name="month"
        value={formData.month}
        onChange={onChange}
        placeholder="e.g., 2024-08"
        required
      />
       <InputField
        label="Revenue"
        name="revenue"
        type="number"
        value={formData.revenue}
        onChange={onChange}
        placeholder="e.g., 50000"
        required
      />
       <InputField
        label="New Users"
        name="new_users"
        type="number"
        value={formData.new_users}
        onChange={onChange}
        placeholder="e.g., 500"
      />
      <InputField
        label="Conversion Rate"
        name="conversion_rate"
        type="number"
        value={formData.conversion_rate}
        onChange={onChange}
        placeholder="e.g., 0.05"
      />
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Record...
            </>
          ) : (
            'Add Financial Record'
          )}
        </button>
      </div>
    </form>
  );
};
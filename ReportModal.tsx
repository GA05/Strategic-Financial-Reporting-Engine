import React, { useEffect, useRef } from 'react';

// A simple markdown-to-html converter for demonstration purposes
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-700">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/\n/g, '<br />');

    const listWrappedHtml = html
      .replace(/<br \/><li/g, '<li') // Fix extra space before list items
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, ''); // Join adjacent lists

    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: listWrappedHtml }} />;
};

interface ReportModalProps {
  report: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-gray-50 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">AI-Generated Business Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-700">
            <SimpleMarkdown content={report} />
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-100 text-right rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

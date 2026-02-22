import { memo } from 'react';

const ExportSection = memo(function ExportSection({ selectedCount, onExport, isProcessing }) {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">
              Ready to Export
            </h2>
            <p className="text-primary-100 mt-1 text-xs sm:text-sm">
              {selectedCount} pages will be processed with your selected options
            </p>
          </div>
          <button
            onClick={onExport}
            disabled={isProcessing || selectedCount === 0}
            className={`
              px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all flex items-center gap-2
              whitespace-nowrap text-sm sm:text-base
              ${isProcessing || selectedCount === 0
                ? 'bg-white/50 text-white/70 cursor-not-allowed'
                : 'bg-white text-primary-600 hover:bg-primary-50 shadow-md hover:shadow-lg'
              }
            `}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Optimized PDF
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
});

export default ExportSection;

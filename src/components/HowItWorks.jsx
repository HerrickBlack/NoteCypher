import { memo } from 'react';

const HowItWorks = memo(function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Upload PDFs',
      desc: 'Drag & drop or select multiple PDF files'
    },
    {
      num: 2,
      title: 'Select Pages',
      desc: 'Click thumbnails to choose pages to process'
    },
    {
      num: 3,
      title: 'Apply Filters',
      desc: 'Invert, clear background, or convert to B&W'
    },
    {
      num: 4,
      title: 'Export PDF',
      desc: 'Download optimized, print-ready PDF'
    }
  ];

  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          How It Works
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                {step.num}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-slate-700 dark:text-slate-200 text-xs sm:text-sm truncate">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;

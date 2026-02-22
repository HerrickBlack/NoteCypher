import { memo } from 'react';

const ProgressSection = memo(function ProgressSection({ progress, status }) {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
            Processing...
          </h2>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {status && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {status}
          </p>
        )}
      </div>
    </section>
  );
});

export default ProgressSection;

import { memo } from 'react';

const OptionsSection = memo(function OptionsSection({
  filters,
  updateFilters,
  layout,
  setLayout,
  orientation,
  setOrientation,
  margin,
  setMargin
}) {
  const layoutOptions = [
    { value: 1, label: '1 slide', icon: '▢' },
    { value: 2, label: '2 slides', icon: '▤' },
    { value: 3, label: '3 slides', icon: '⋮' },
    { value: 4, label: '4 slides', icon: '◫' },
    { value: 6, label: '6 slides', icon: '⊞' }
  ];

  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Processing Options
        </h2>
        
        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
            Filters
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.invert}
                onChange={(e) => updateFilters({ invert: e.target.checked })}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">🌓 Invert</span>
            </label>
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.threshold}
                onChange={(e) => updateFilters({ threshold: e.target.checked })}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">✨ Clear BG</span>
            </label>
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.grayscale}
                onChange={(e) => updateFilters({ grayscale: e.target.checked })}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">⚫ Grayscale</span>
            </label>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
            Slides Per Page (N-up)
          </h3>
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            {layoutOptions.map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-colors border-2
                  ${layout === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="grid-layout"
                  value={option.value}
                  checked={layout === option.value}
                  onChange={(e) => setLayout(parseInt(e.target.value))}
                  className="sr-only"
                />
                <span className="text-lg sm:text-xl">{option.icon}</span>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 hidden sm:inline">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Orientation & Margin */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
              Orientation
            </h3>
            <div className="flex gap-2 sm:gap-3">
              <label
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-colors border-2
                  ${orientation === 'portrait'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="orientation"
                  value="portrait"
                  checked={orientation === 'portrait'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="sr-only"
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="3" width="14" height="18" rx="1" strokeWidth="2" />
                </svg>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">Portrait</span>
              </label>
              <label
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-colors border-2
                  ${orientation === 'landscape'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="orientation"
                  value="landscape"
                  checked={orientation === 'landscape'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="sr-only"
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="1" strokeWidth="2" />
                </svg>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">Landscape</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
              Margin
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)))}
                min="0"
                max="5"
                step="0.5"
                className="w-20 px-3 py-2 sm:py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">cm</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">0 = No margins (full page)</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OptionsSection;

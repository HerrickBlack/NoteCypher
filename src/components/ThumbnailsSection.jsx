import { memo } from 'react';

const ThumbnailsSection = memo(function ThumbnailsSection({
  pages,
  selectedPages,
  togglePageSelection,
  selectAllPages,
  deselectAllPages,
  selectByPdf,
  pdfFiles
}) {
  // Group pages by PDF file
  const pagesByPdf = pdfFiles.map((file, index) => ({
    file,
    pdfIndex: index + 1,
    pages: pages.filter(p => p.pdfIndex === index + 1)
  }));

  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
            Page Preview
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={selectAllPages}
              className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 font-medium whitespace-nowrap"
            >
              Select All
            </button>
            <button
              onClick={deselectAllPages}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap"
            >
              Deselect All
            </button>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              <span className="font-medium text-slate-700 dark:text-slate-200">{selectedPages.size}</span> of{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">{pages.length}</span> selected
            </span>
          </div>
        </div>

        {/* PDF File Groups */}
        {pagesByPdf.map(({ file, pdfIndex, pages: pdfPages }) => {
          const pageStartIndex = pages.findIndex(p => p.pdfIndex === pdfIndex);
          const pdfSelectedCount = pdfPages.filter((_, i) => selectedPages.has(pageStartIndex + i)).length;
          const allSelected = pdfSelectedCount === pdfPages.length;

          return (
            <div key={pdfIndex} className="mb-6 last:mb-0">
              <div
                onClick={() => selectByPdf(pdfIndex)}
                className="flex items-center justify-between py-2 px-3 mb-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${
                    allSelected
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-slate-300 dark:border-slate-500'
                  }`}>
                    {allSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {pdfSelectedCount} of {pdfPages.length} pages selected
                    </p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {pdfPages.map((page, index) => {
                  const globalIndex = pageStartIndex + index;
                  const isSelected = selectedPages.has(globalIndex);

                  return (
                    <div
                      key={page.id}
                      onClick={() => togglePageSelection(globalIndex)}
                      className="thumbnail group cursor-pointer relative"
                    >
                      <div className={`
                        aspect-[3/4] bg-white dark:bg-slate-700 rounded-lg overflow-hidden transition-all duration-200
                        thumbnail-border border-2 shadow-sm
                        ${isSelected
                          ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-800'
                          : 'border-slate-200 dark:border-slate-600 group-hover:border-primary-300 dark:group-hover:border-primary-600'
                        }
                      `}>
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-full object-contain bg-white"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Selection overlay */}
                      <div className={`
                        thumbnail-overlay absolute inset-0 rounded-lg bg-primary-500/30 
                        flex items-center justify-center transition-opacity duration-200
                        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                      `}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      
                      {/* Page number badge */}
                      <div className="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-600">
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">{page.pageNumber}</span>
                      </div>
                      
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default ThumbnailsSection;

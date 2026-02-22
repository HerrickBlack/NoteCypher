import { memo, useState, useCallback } from 'react';

const UploadSection = memo(function UploadSection({ onFilesSelected, pdfFiles, removePdfFile }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <section className="mb-6 sm:mb-8">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        className={`
          border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center cursor-pointer
          transition-all duration-200 mb-4
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }
        `}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200">
              Drop PDFs here or click to browse
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Support multiple files • All processing happens locally
            </p>
          </div>
          <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-sm sm:text-base">
            Select PDF Files
          </button>
        </div>
      </div>

      {/* PDF Files List */}
      {pdfFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-slate-700 dark:text-slate-200 text-sm sm:text-base">
              Loaded Files ({pdfFiles.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-48 overflow-y-auto">
            {pdfFiles.map((file, index) => (
              <div
                key={index}
                className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removePdfFile(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default UploadSection;

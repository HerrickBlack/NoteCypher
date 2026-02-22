import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';
import UploadSection from './components/UploadSection';
import OptionsSection from './components/OptionsSection';
import ThumbnailsSection from './components/ThumbnailsSection';
import ProgressSection from './components/ProgressSection';
import ExportSection from './components/ExportSection';

// Use CDN-loaded libraries
const getPDFLib = () => window.PDFLib;
const getPDFjs = () => window.pdfjsLib;

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  
  const [pdfFiles, setPdfFiles] = useState([]);
  const [allPages, setAllPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [filters, setFilters] = useState({
    invert: false,
    threshold: false,
    grayscale: false
  });
  const [layout, setLayout] = useState(1);
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isLibsLoaded, setIsLibsLoaded] = useState(false);
  
  // Store loaded image data for export (prevents re-rendering)
  const pageImagesRef = useRef({});

  // Initialize PDF.js worker
  useEffect(() => {
    const initPDFjs = () => {
      const pdfjsLib = getPDFjs();
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setIsLibsLoaded(true);
      } else {
        setTimeout(initPDFjs, 100);
      }
    };
    initPDFjs();

    return () => {
      pageImagesRef.current = {};
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const handleFilesSelected = useCallback(async (files) => {
    const pdfjsLib = getPDFjs();
    if (!pdfjsLib) {
      alert('PDF library not loaded yet. Please wait a moment and try again.');
      return;
    }

    const newPdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (newPdfFiles.length === 0) return;

    setProgressStatus('Loading PDFs...');
    setProgress(10);

    const newPages = [];
    const currentPagesCount = allPages.length;
    const updatedPdfFiles = [...pdfFiles, ...newPdfFiles.map(f => ({
      name: f.name,
      size: f.size
    }))];

    let totalExpectedPages = 0;
    let loadedPages = 0;
    const startIndex = allPages.length;

    try {
      // First pass: load all PDFs and count pages
      const loadedPdfs = [];
      for (const file of newPdfFiles) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          totalExpectedPages += pdf.numPages;
          loadedPdfs.push({ pdf, arrayBuffer, fileName: file.name });
        } catch (error) {
          console.error('Error reading PDF:', file.name, error);
        }
      }

      // Second pass: render all pages from loaded PDFs
      for (let pdfIdx = 0; pdfIdx < loadedPdfs.length; pdfIdx++) {
        const { pdf, arrayBuffer, fileName } = loadedPdfs[pdfIdx];
        const globalPdfIndex = startIndex + newPages.length;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            
            // Higher scale for better thumbnail quality
            const thumbnailScale = 0.5;
            const thumbnailViewport = page.getViewport({ scale: thumbnailScale });
            
            const canvas = document.createElement('canvas');
            canvas.height = thumbnailViewport.height;
            canvas.width = thumbnailViewport.width;
            
            await page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: thumbnailViewport
            }).promise;
            
            // ULTRA HIGH quality viewport for export (4x scale for crisp output)
            const exportViewport = page.getViewport({ scale: 4.0 });

            // Store as high-quality PNG data URL for thumbnail
            const dataUrl = canvas.toDataURL('image/png');

            // Store ULTRA high-quality image for export
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = exportViewport.width;
            exportCanvas.height = exportViewport.height;
            const exportCtx = exportCanvas.getContext('2d');

            // Enable image smoothing for crisp rendering
            exportCtx.imageSmoothingEnabled = true;
            exportCtx.imageSmoothingQuality = 'high';

            await page.render({
              canvasContext: exportCtx,
              viewport: exportViewport
            }).promise;

            const pageKey = `${startIndex + newPages.length}`;
            pageImagesRef.current[pageKey] = {
              exportViewport: exportViewport,
              dataUrl: exportCanvas.toDataURL('image/png', 1.0)  // Maximum quality
            };
            exportCanvas.width = 0;
            exportCanvas.height = 0;
            
            newPages.push({
              id: `page-${Date.now()}-${newPages.length}-${i}`,
              pageNumber: i,
              pdfIndex: (startIndex / (loadedPdfs[0]?.pdf?.numPages || 1)) + pdfIdx + 1,
              fileName: fileName,
              dataUrl: dataUrl,
              pageNumberInPdf: i,
              pageIndex: startIndex + newPages.length
            });
            
            loadedPages++;
            const fileProgress = 10 + (loadedPages / totalExpectedPages) * 85;
            setProgress(fileProgress);
            setProgressStatus(`Loading pages... (${loadedPages}/${totalExpectedPages})`);
          } catch (pageError) {
            console.error(`Error loading page ${i} from ${fileName}:`, pageError);
          }
        }
      }

      setPdfFiles(updatedPdfFiles);
      setAllPages(prev => [...prev, ...newPages]);
      setSelectedPages(new Set(newPages.map((_, i) => currentPagesCount + i)));
      setProgress(100);
      setProgressStatus('Ready!');
      
      setTimeout(() => {
        setProgress(0);
        setProgressStatus('');
      }, 800);
    } catch (error) {
      console.error('Error processing files:', error);
      setProgressStatus('Error loading files');
      setTimeout(() => {
        setProgress(0);
        setProgressStatus('');
      }, 2000);
    }
  }, [pdfFiles, allPages]);

  const togglePageSelection = useCallback((index) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const selectAllPages = useCallback(() => {
    setSelectedPages(new Set(allPages.map((_, i) => i)));
  }, [allPages]);

  const deselectAllPages = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  const selectByPdf = useCallback((pdfIndex) => {
    const pdfPageIndices = allPages
      .map((page, i) => page.pdfIndex === pdfIndex ? i : -1)
      .filter(i => i !== -1);
    
    setSelectedPages(prev => {
      const next = new Set(prev);
      const allSelected = pdfPageIndices.every(i => next.has(i));
      
      if (allSelected) {
        pdfPageIndices.forEach(i => next.delete(i));
      } else {
        pdfPageIndices.forEach(i => next.add(i));
      }
      return next;
    });
  }, [allPages]);

  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const applyFiltersToCanvas = useCallback((ctx, width, height, invert, threshold, grayscale) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // GRAYSCALE: Convert to shades of gray (preserves tonal variations)
      // Uses luminance formula for perceptually accurate grayscale
      if (grayscale) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = Math.round(gray);  // Round for clean values
      }

      // Invert colors
      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Threshold (clear background) - only affects light areas
      if (threshold) {
        const avg = (r + g + b) / 3;
        const thresholdValue = 220;  // Higher threshold for better text preservation
        if (avg > thresholdValue) {
          r = g = b = 255;  // Make background pure white
        }
        // Dark areas (text) are preserved with original grayscale values
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const exportPDF = useCallback(async () => {
    if (selectedPages.size === 0) {
      alert('Please select at least one page to export.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const PDFDocument = getPDFLib().PDFDocument;
      const pdfDoc = await PDFDocument.create();
      const sortedIndices = Array.from(selectedPages).sort((a, b) => a - b);
      const totalPages = sortedIndices.length;
      
      // Grid dimensions based on layout
      let cols, rows;
      switch (layout) {
        case 1: cols = 1; rows = 1; break;
        case 2: cols = 1; rows = 2; break;
        case 3: cols = 1; rows = 3; break;
        case 4: cols = 2; rows = 2; break;
        case 6: cols = 2; rows = 3; break;
        default: cols = 1; rows = 1;
      }
      
      // Page dimensions (A4 in points)
      const pageWidth = orientation === 'landscape' ? 842 : 595;
      const pageHeight = orientation === 'landscape' ? 595 : 842;
      
      // NO margins - use full page
      const marginPt = 0;
      const availableWidth = pageWidth - (2 * marginPt);
      const availableHeight = pageHeight - (2 * marginPt);
      
      const slideWidth = availableWidth / cols;
      const slideHeight = availableHeight / rows;
      
      let outputPage = null;
      let slideCount = 0;
      
      for (let i = 0; i < sortedIndices.length; i++) {
        const pageIndex = sortedIndices[i];
        const pageInfo = allPages[pageIndex];
        const storedImage = pageImagesRef.current[pageIndex];
        
        if (!storedImage) {
          console.error('No stored image for page', pageIndex);
          continue;
        }
        
        setProgressStatus(`Processing page ${i + 1} of ${totalPages}...`);
        setProgress(((i) / totalPages) * 90);
        
        // Load image from stored data URL
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = storedImage.dataUrl;
        });
        
        // Create canvas for filters with high quality settings
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0);
        
        // Apply filters
        applyFiltersToCanvas(ctx, canvas.width, canvas.height, filters.invert, filters.threshold, filters.grayscale);
        
        // Convert to PNG
        const pngDataUrl = canvas.toDataURL('image/png');
        const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);
        
        // Calculate scaled dimensions to FIT within slide area
        const imgAspect = pngImage.width / pngImage.height;
        const slideAspect = slideWidth / slideHeight;
        
        let drawWidth, drawHeight;
        if (imgAspect > slideAspect) {
          drawWidth = slideWidth * 0.98;
          drawHeight = drawWidth / imgAspect;
        } else {
          drawHeight = slideHeight * 0.98;
          drawWidth = drawHeight * imgAspect;
        }
        
        // Create new page if needed
        if (slideCount === 0) {
          outputPage = pdfDoc.addPage([pageWidth, pageHeight]);
        }
        
        // Calculate position - NO MARGINS, full width
        const col = slideCount % cols;
        const row = Math.floor(slideCount / cols);
        
        const x = (col * slideWidth) + (slideWidth - drawWidth) / 2;
        const y = pageHeight - ((row + 1) * slideHeight) + (slideHeight - drawHeight) / 2;
        
        outputPage.drawImage(pngImage, {
          x: x,
          y: y,
          width: drawWidth,
          height: drawHeight,
        });
        
        slideCount++;
        
        // Create new page if grid is full
        if (slideCount >= layout) {
          slideCount = 0;
        }
        
        // Cleanup canvas
        canvas.width = 0;
        canvas.height = 0;
        
        setProgress(((i + 1) / totalPages) * 90);
      }
      
      setProgressStatus('Finalizing PDF...');
      setProgress(95);
      
      const pdfBytesOutput = await pdfDoc.save();
      const blob = new Blob([pdfBytesOutput], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimized-notes-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setProgressStatus('Download complete!');
      setProgress(100);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF: ' + error.message);
      setProgressStatus('Error occurred');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProgress(0);
        setProgressStatus('');
      }, 2000);
    }
  }, [selectedPages, allPages, layout, orientation, filters, applyFiltersToCanvas]);

  const removePdfFile = useCallback((index) => {
    const pdfIndex = index + 1;
    const pagesToRemove = allPages
      .map((page, i) => page.pdfIndex === pdfIndex ? i : -1)
      .filter(i => i !== -1);
    
    // Clean up stored images
    pagesToRemove.forEach(i => {
      delete pageImagesRef.current[i];
    });
    
    setAllPages(prev => prev.filter((_, i) => !pagesToRemove.includes(i)));
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
    setSelectedPages(prev => {
      const next = new Set();
      prev.forEach(i => {
        if (!pagesToRemove.includes(i)) {
          next.add(i);
        }
      });
      return next;
    });
  }, [allPages]);

  const clearAll = useCallback(() => {
    pageImagesRef.current = {};
    
    setPdfFiles([]);
    setAllPages([]);
    setSelectedPages(new Set());
    setFilters({ invert: false, threshold: false, grayscale: false });
    setLayout(1);
    setOrientation('portrait');
    setMargin(0);
  }, []);

  if (!isLibsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading NoteCypher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} clearAll={clearAll} hasFiles={pdfFiles.length > 0} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-20">
        <HowItWorks />
        
        <UploadSection 
          onFilesSelected={handleFilesSelected}
          pdfFiles={pdfFiles}
          removePdfFile={removePdfFile}
        />
        
        {allPages.length > 0 && (
          <>
            <OptionsSection
              filters={filters}
              updateFilters={updateFilters}
              layout={layout}
              setLayout={setLayout}
              orientation={orientation}
              setOrientation={setOrientation}
              margin={margin}
              setMargin={setMargin}
            />
            
            <ThumbnailsSection
              pages={allPages}
              selectedPages={selectedPages}
              togglePageSelection={togglePageSelection}
              selectAllPages={selectAllPages}
              deselectAllPages={deselectAllPages}
              selectByPdf={selectByPdf}
              pdfFiles={pdfFiles}
            />
            
            <ExportSection
              selectedCount={selectedPages.size}
              onExport={exportPDF}
              isProcessing={isProcessing}
            />
          </>
        )}
        
        {(isProcessing || progress > 0) && (
          <ProgressSection progress={progress} status={progressStatus} />
        )}
      </main>
      
      <footer className="py-6 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>NoteCypher - Free, local PDF optimization for students. No login required.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer
        ${dragOver
          ? 'border-accent bg-accent/5 scale-[1.01]'
          : 'border-border hover:border-accent/50 hover:bg-muted/50'
        }
        ${isProcessing ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {fileName ? (
        <div className="flex items-center justify-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-accent" />
          <div className="text-left">
            <p className="font-semibold text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              {isProcessing ? 'Processing...' : 'File loaded successfully'}
            </p>
          </div>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={(e) => { e.stopPropagation(); setFileName(null); }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">Drop your Excel file here</p>
          <p className="text-sm text-muted-foreground">or click to browse (.xlsx, .xls, .csv)</p>
        </>
      )}
    </div>
  );
};

export default FileUpload;

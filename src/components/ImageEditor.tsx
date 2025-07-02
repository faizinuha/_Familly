import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Crop, Download, X } from 'lucide-react';

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onSave: (editedFile: File) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  open,
  onOpenChange,
  imageFile,
  onSave
}) => {
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (imageFile && open) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        drawImage(img);
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile, open]);

  React.useEffect(() => {
    if (originalImage) {
      drawImage(originalImage);
    }
  }, [brightness, contrast, rotation, originalImage]);

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    
    // Move to center for rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply filters
    ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
    
    // Draw image
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageFile) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now(),
        });
        onSave(editedFile);
        onOpenChange(false);
      }
    }, imageFile.type);
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Foto</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 h-full">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[400px] object-contain"
              style={{ display: imageUrl ? 'block' : 'none' }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Brightness */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kecerahan</label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{brightness[0]}%</span>
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kontras</label>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{contrast[0]}%</span>
            </div>

            {/* Rotation */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Rotasi</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="flex items-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                {rotation}°
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave}>
                <Download className="h-4 w-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
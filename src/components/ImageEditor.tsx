
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
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
    } catch (error) {
      console.error('Error drawing image:', error);
      toast({
        title: "Error",
        description: "Gagal memproses gambar",
        variant: "destructive"
      });
    }
  }, [brightness, contrast, rotation, toast]);

  React.useEffect(() => {
    if (imageFile && open) {
      console.log('Loading image file:', imageFile.name);
      setLoading(true);
      
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully');
        setOriginalImage(img);
        drawImage(img);
        setLoading(false);
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        toast({
          title: "Error",
          description: "Gagal memuat gambar",
          variant: "destructive"
        });
        setLoading(false);
      };
      img.src = url;

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile, open, drawImage, toast]);

  React.useEffect(() => {
    if (originalImage && !loading) {
      drawImage(originalImage);
    }
  }, [brightness, contrast, rotation, originalImage, loading, drawImage]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageFile) return;

    setLoading(true);
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const editedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now(),
          });
          onSave(editedFile);
          onOpenChange(false);
          handleReset();
        } else {
          toast({
            title: "Error",
            description: "Gagal menyimpan gambar",
            variant: "destructive"
          });
        }
        setLoading(false);
      }, imageFile.type);
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan gambar",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setRotation(0);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Foto</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 h-full">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Memuat gambar...</span>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[400px] object-contain"
                style={{ display: imageUrl ? 'block' : 'none' }}
              />
            )}
          </div>

          {!loading && originalImage && (
            <>
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
                  <Button variant="outline" onClick={handleClose}>
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;

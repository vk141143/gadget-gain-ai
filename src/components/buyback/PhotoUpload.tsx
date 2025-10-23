import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PhotoUploadProps = {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
};

export const PhotoUpload = ({ photos, onPhotosChange }: PhotoUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 6) {
      toast({
        title: "Too many photos",
        description: "You can upload a maximum of 6 photos",
        variant: "destructive",
      });
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotosChange([...photos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Device Photos</h2>
        <p className="text-muted-foreground">
          Upload up to 6 clear photos of your device (front, back, sides, screen)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {photos.length === 0 ? (
        <Card
          className="p-12 border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Click to upload photos</p>
            <p className="text-sm text-muted-foreground">
              JPG or PNG • Maximum 6 photos
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <img
                  src={photo}
                  alt={`Device photo ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}

            {photos.length < 6 && (
              <Card
                className="h-40 border-2 border-dashed cursor-pointer hover:border-primary transition-colors flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Add more</p>
                </div>
              </Card>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="text-sm">
              <p className="font-medium">{photos.length} of 6 photos uploaded</p>
              <p className="text-muted-foreground">
                {photos.length < 3 && "Upload at least 3 photos for accurate pricing"}
                {photos.length >= 3 && photos.length < 6 && "Good! You can add more photos"}
                {photos.length === 6 && "Maximum photos reached"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

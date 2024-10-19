import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ImageGallery = ({ images, initialIndex, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="relative">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          <X />
        </IconButton>
        <div className="flex items-center justify-center h-[80vh]">
          <IconButton onClick={handlePrevious} className="absolute left-4">
            <ChevronLeft className="w-8 h-8" />
          </IconButton>
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          <IconButton onClick={handleNext} className="absolute right-4">
            <ChevronRight className="w-8 h-8" />
          </IconButton>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2">
          {currentIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;


import React from 'react';
import { FileWithPreview } from '../types';

interface ImagePreviewCardProps {
  image: FileWithPreview;
  onRemove: (imageId: string) => void;
  disabled?: boolean;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({ image, onRemove, disabled }) => {
  return (
    <div className="relative group aspect-square bg-slate-700 rounded-lg overflow-hidden shadow-lg">
      <img src={image.preview} alt={image.file.name} className="w-full h-full object-cover" />
      {!disabled && (
        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
          aria-label="画像を削除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

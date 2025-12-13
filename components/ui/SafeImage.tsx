import React, { useState } from 'react';
import { ImageOff, Loader } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
}

const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc, 
  fallbackIcon,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 overflow-hidden ${className}`}>
        {fallbackSrc ? (
          <img src={fallbackSrc} alt={alt} className="w-full h-full object-cover" />
        ) : (
            fallbackIcon || <ImageOff size={24} className="opacity-50" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
        {loading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 animate-pulse">
                <Loader size={20} className="text-gray-300 animate-spin" />
            </div>
        )}
        <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            {...props}
        />
    </div>
  );
};

export default SafeImage;
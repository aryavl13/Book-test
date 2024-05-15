import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  imageUrl?: string; // Make imageUrl optional
  altText?: string;
  firstName?: string; // Add firstName prop
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, altText = 'Avatar', firstName }) => {
  if (!imageUrl) {
    return (
      <div className="relative inline-block h-8 w-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-100">
        {firstName ? firstName[0].toUpperCase() : ''}
      </div>
    );
  }

  return (
    <div className="relative inline-block h-8 w-8 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={altText}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default Avatar;

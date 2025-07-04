import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-2 border-purple-200 dark:border-purple-800 mb-6">
      {/* Sponsored Badge */}
      {product.isSponsored && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-center">
          <span className="text-sm font-medium">✨ SPONSORED</span>
        </div>
      )}

      <div className="p-4">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl mb-4">
          {!imageLoaded && (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          )}
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`w-full h-48 object-cover transition-all duration-300 hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.0 (127 reviews)</span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {product.price}
            </span>
            
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 group shadow-lg">
              <span className="font-medium">Shop Now</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
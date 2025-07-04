import { Product } from '../types';

// Mock product data (keeping only products, removing memes)
export const mockProducts: Product[] = [
  {
    id: 'p1',
    imageUrl: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Funny Meme T-Shirt Collection',
    description: 'Express yourself with our hilarious meme-inspired designs',
    price: '$19.99',
    isSponsored: true
  },
  {
    id: 'p2',
    imageUrl: 'https://images.pexels.com/photos/1598300/pexels-photo-1598300.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Meme Coffee Mug - Start Your Day Right',
    description: 'Perfect for your morning coffee and daily dose of humor',
    price: '$12.99',
    isSponsored: false
  },
  {
    id: 'p3',
    imageUrl: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Gaming Chair - Level Up Your Setup',
    description: 'Comfortable gaming chair for those long meme browsing sessions',
    price: '$299.99',
    isSponsored: true
  }
];
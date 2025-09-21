import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/features/cartSlice';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover_image: string;
  rating?: number;
  stock: number;
  description?: string;
}

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
}

export const BookCard = ({ book, showAddToCart = true }: BookCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.stock > 0) {
      dispatch(addToCart(book));
      toast.success(`"${book.title}" added to cart`);
    } else {
      toast.error('Book is out of stock');
    }
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
          <img
            src={book.cover_image || '/placeholder-book.png'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-book.png';
            }}
          />
          {book.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {showAddToCart && book.stock > 0 && (
            <Button
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-xs mb-2">
            {book.author}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">
                {book.rating?.toFixed(1) || '4.5'}
              </span>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {book.category}
            </Badge>
          </div>
          
          {book.stock > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Stock: {book.stock}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
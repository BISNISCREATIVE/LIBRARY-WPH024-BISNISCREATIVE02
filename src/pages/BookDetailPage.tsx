import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { CartSidebar } from '../components/CartSidebar';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/features/cartSlice';
import { toast } from 'sonner';
import api from '../api/api';
import dayjs from 'dayjs';

// Mock book data
const mockBook = {
  id: '1',
  title: '21 Resep Bakso Pak Bowo',
  author: 'Tufik',
  category: 'Cooking',
  cover_image: '/placeholder-book.png',
  rating: 4.9,
  stock: 5,
  description: 'A comprehensive cookbook featuring 21 delicious bakso recipes from Pak Bowo, a renowned street food vendor. Learn the secrets of making perfect meatballs with traditional Indonesian flavors.',
  pages: 120,
  language: 'Indonesian',
  publisher: 'Kuliner Nusantara',
  published_date: '2023-05-15',
  isbn: '978-602-123-456-7',
};

const mockReviews = [
  {
    id: '1',
    user_name: 'John Doe',
    rating: 5,
    comment: 'Excellent book! The recipes are easy to follow and the results are amazing.',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    user_name: 'Jane Smith',
    rating: 4,
    comment: 'Great collection of recipes. Some ingredients are hard to find but worth it.',
    created_at: '2024-01-10',
  },
];

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: book = mockBook, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        return response.data.data || mockBook;
      } catch (error) {
        return mockBook;
      }
    },
  });

  const { data: reviews = mockReviews } = useQuery({
    queryKey: ['book-reviews', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/books/${id}/reviews`);
        return response.data.data || mockReviews;
      } catch (error) {
        return mockReviews;
      }
    },
  });

  const borrowMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/loans', { book_id: id });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Book borrowed successfully!');
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
    onError: () => {
      toast.error('Failed to borrow book. Please try again.');
    },
  });

  const handleAddToCart = () => {
    if (book.stock > 0) {
      dispatch(addToCart(book));
      toast.success(`"${book.title}" added to cart`);
    } else {
      toast.error('Book is out of stock');
    }
  };

  const handleBorrowNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login');
      return;
    }
    borrowMutation.mutate();
  };

  if (isLoading) {
    return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-lg"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
              <img
                src={book.cover_image || '/placeholder-book.png'}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-book.png';
                }}
              />
              {book.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={handleBorrowNow}
                disabled={book.stock === 0 || borrowMutation.isPending}
              >
                {borrowMutation.isPending ? 'Borrowing...' : 'Borrow Now'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.rating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
                <Badge>{book.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Stock: {book.stock}
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {book.description}
              </p>
            </div>

            {/* Book Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Book Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="ml-2">{book.pages}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="ml-2">{book.language}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Publisher:</span>
                    <span className="ml-2">{book.publisher}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Published:</span>
                    <span className="ml-2">{dayjs(book.published_date).format('MMM DD, YYYY')}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="ml-2">{book.isbn}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.user_name}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {dayjs(review.created_at).format('MMM DD, YYYY')}
                      </p>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookCard } from '../components/BookCard';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';

// Mock data for profile
const mockUserProfile = {
  id: '1',
  name: 'Johndoe',
  email: 'johndoe@email.com',
  phone: '081234567890',
  avatar: '/placeholder-avatar.png',
  joined_date: '2024-01-01',
  total_borrowed: 15,
  current_borrowed: 3,
  reviews_count: 8,
};

const mockBorrowedBooks = [
  {
    id: '1',
    book: {
      id: '1',
      title: '21 Resep Bakso Pak Bowo',
      author: 'Tufik',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-15',
    due_date: '2024-02-15',
    status: 'BORROWED',
  },
  {
    id: '2',
    book: {
      id: '2',
      title: 'Irresistible',
      author: 'Lisa Kleypas',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-10',
    due_date: '2024-02-10',
    status: 'BORROWED',
  },
  {
    id: '3',
    book: {
      id: '3',
      title: 'Oliver Twist',
      author: 'Charles Dickens',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-05',
    due_date: '2024-02-05',
    status: 'RETURNED',
  },
];

const mockUserReviews = [
  {
    id: '1',
    book: {
      id: '1',
      title: '21 Resep Bakso Pak Bowo',
      author: 'Tufik',
      cover_image: '/placeholder-book.png',
    },
    rating: 5,
    comment: 'Amazing cookbook with easy-to-follow recipes!',
    created_at: '2024-01-20',
  },
  {
    id: '2',
    book: {
      id: '2',
      title: 'Irresistible',
      author: 'Lisa Kleypas',
      cover_image: '/placeholder-book.png',
    },
    rating: 4,
    comment: 'Great romance novel, couldn\'t put it down!',
    created_at: '2024-01-18',
  },
];

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch user profile
  const { data: profile = mockUserProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/users/profile');
        return response.data.data || mockUserProfile;
      } catch (error) {
        return mockUserProfile;
      }
    },
    enabled: isAuthenticated,
  });

  // Fetch borrowed books
  const { data: borrowedBooksData = mockBorrowedBooks } = useQuery({
    queryKey: ['user-borrowed-books'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/loans/my');
        const data = response.data.data || response.data || mockBorrowedBooks;
        return Array.isArray(data) ? data : mockBorrowedBooks;
      } catch (error) {
        return mockBorrowedBooks;
      }
    },
    enabled: isAuthenticated,
  });

  // Ensure borrowedBooks is always an array
  const borrowedBooks = Array.isArray(borrowedBooksData) ? borrowedBooksData : mockBorrowedBooks;

  // Fetch user reviews
  const { data: userReviews = mockUserReviews } = useQuery({
    queryKey: ['user-reviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/reviews/my');
        return response.data.data || mockUserReviews;
      } catch (error) {
        return mockUserReviews;
      }
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed List</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="flex flex-col items-center md:items-start space-y-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg font-medium">{user?.name || profile.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{user?.email || profile.email}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Nomor Handphone</label>
                        <p className="text-lg">{profile.phone}</p>
                      </div>
                    </div>
                    
                    <Button className="w-full md:w-auto">Update Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrowed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Borrowed List</CardTitle>
              </CardHeader>
              <CardContent>
                {borrowedBooks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No borrowed books found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {borrowedBooks.map((loan) => (
                      <div key={loan.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={loan.book.cover_image}
                          alt={loan.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{loan.book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {typeof loan.book.author === 'string' ? loan.book.author : loan.book.author?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Borrowed: {new Date(loan.borrowed_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(loan.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={loan.status === 'RETURNED' ? 'secondary' : 'default'}>
                          {loan.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {userReviews.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userReviews.map((review) => (
                      <div key={review.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <img
                          src={review.book.cover_image}
                          alt={review.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{review.book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {review.book.author}</p>
                          <div className="flex items-center space-x-1 my-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};
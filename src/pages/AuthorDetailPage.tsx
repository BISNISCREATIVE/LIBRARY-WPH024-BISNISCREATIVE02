import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { BookCard } from '../components/BookCard';
import { generateDummyBooks, generateDummyAuthors } from '../api/api';

const AuthorDetailPage = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const navigate = useNavigate();
  const [loadedBooks, setLoadedBooks] = useState(10);

  // Generate dummy data
  const dummyAuthors = generateDummyAuthors(50);
  const dummyAuthor = dummyAuthors.find(author => author.id === authorId) || dummyAuthors[0];
  const allAuthorBooks = generateDummyBooks(30).filter(() => Math.random() > 0.3); // Random subset

  const { data: authorResponse, isLoading: authorLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: async () => {
      try {
        if (!authorId) throw new Error('No author ID provided');
        const response = await fetch(`https://belibraryformentee-production.up.railway.app/api/authors/${authorId}`);
        if (!response.ok) throw new Error('Author not found');
        return response.json();
      } catch (error) {
        return { data: dummyAuthor };
      }
    },
    enabled: !!authorId,
  });

  const { data: booksResponse, isLoading: booksLoading } = useQuery({
    queryKey: ['author-books', authorId, loadedBooks],
    queryFn: async () => {
      try {
        if (!authorId) throw new Error('No author ID provided');
        const response = await fetch(`https://belibraryformentee-production.up.railway.app/api/authors/${authorId}/books`);
        if (!response.ok) throw new Error('Books not found');
        return response.json();
      } catch (error) {
        return { data: allAuthorBooks.slice(0, loadedBooks) };
      }
    },
    enabled: !!authorId,
  });

  const author = authorResponse?.data || dummyAuthor;
  const books = booksResponse?.data || allAuthorBooks.slice(0, loadedBooks);

  const handleLoadMore = () => {
    setLoadedBooks(prev => prev + 10);
  };

  const authorStats = {
    totalBooks: author.books || books.length,
    avgRating: 4.5,
    totalReviews: 1250,
    followers: 8900
  };

  if (authorLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 bg-muted rounded-full"></div>
              <div className="space-y-4 flex-1">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Author Profile */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Author Avatar */}
              <div className="flex justify-center md:justify-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback className="text-2xl">
                    {author.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Author Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{author.name}</h1>
                  <p className="text-muted-foreground mb-4">
                    {author.bio || 'A passionate author dedicated to creating compelling stories that resonate with readers around the world.'}
                  </p>
                  <Badge variant="secondary">{author.nationality || 'International Author'}</Badge>
                </div>

                {/* Author Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-primary mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{authorStats.totalBooks}</div>
                    <div className="text-sm text-muted-foreground">Books</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{authorStats.avgRating}</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{authorStats.totalReviews.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-green-500 mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{authorStats.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author's Books */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Books by {author.name}</CardTitle>
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                disabled={booksLoading || loadedBooks >= allAuthorBooks.length}
              >
                {booksLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {booksLoading && books.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No books found for this author.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                {books.map((book: any, index: number) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <BookCard book={{ ...book, author: author.name }} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {loadedBooks < allAuthorBooks.length && !booksLoading && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} variant="outline">
                  Load More Books
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthorDetailPage;
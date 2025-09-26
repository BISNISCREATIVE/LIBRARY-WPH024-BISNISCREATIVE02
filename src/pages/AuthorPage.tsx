import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { api } from '../api/api';
import { generateDummyBooks } from '../api/api';

export const AuthorPage = () => {
  const { authorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [allBooks] = useState(() => generateDummyBooks(15));

  // Fetch author details
  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/authors/${authorId}`);
        return response.data.data;
      } catch (error) {
        return { 
          id: authorId, 
          name: 'Author Name', 
          bio: 'Discover books by this talented author.',
          image: '/placeholder-avatar.png'
        };
      }
    },
    enabled: !!authorId,
  });

  // Fetch books by author
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ['author-books', authorId, searchQuery],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/authors/${authorId}/books?search=${searchQuery}`);
        return response.data;
      } catch (error) {
        return { success: false };
      }
    },
    enabled: !!authorId,
  });

  // Use dummy data if API fails
  const books = booksResponse?.success ? booksResponse.data.books : allBooks;
  
  // Filter books by search query if using dummy data
  const filteredBooks = books.filter((book: any) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img 
                src={author?.image || '/placeholder-avatar.png'} 
                alt={author?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-2xl font-bold text-primary">${author?.name?.charAt(0) || 'A'}</span>`;
                  }
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{author?.name || 'Author Name'}</h1>
              <p className="text-muted-foreground">{author?.bio}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search books by this author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found by this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filteredBooks.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
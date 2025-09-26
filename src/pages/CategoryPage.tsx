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

export const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [allBooks] = useState(() => generateDummyBooks(20));

  // Fetch category details
  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/categories/${categoryId}`);
        return response.data.data;
      } catch (error) {
        return { id: categoryId, name: 'Category', description: 'Browse books in this category' };
      }
    },
    enabled: !!categoryId,
  });

  // Fetch books in category
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ['category-books', categoryId, searchQuery],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/books?category=${categoryId}&search=${searchQuery}`);
        return response.data;
      } catch (error) {
        return { success: false };
      }
    },
    enabled: !!categoryId,
  });

  // Use dummy data if API fails
  const books = booksResponse?.success ? booksResponse.data.books : allBooks;
  
  // Filter books by search query if using dummy data
  const filteredBooks = books.filter((book: any) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof book.author === 'string' ? book.author : book.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
          <div>
            <h1 className="text-3xl font-bold">{category?.name || 'Category'}</h1>
            <p className="text-muted-foreground">{category?.description}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search books in this category..."
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
            <p className="text-muted-foreground">No books found in this category.</p>
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
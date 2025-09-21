import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// Mock data for development
const mockBooks = [
  {
    id: '1',
    title: '21 Resep Bakso Pak Bowo',
    author: 'Tufik',
    category: 'Cooking',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 5,
  },
  {
    id: '2',
    title: 'Irresistible',
    author: 'Lisa Kleypas',
    category: 'Romance',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '3',
    title: 'Oliver Twist',
    author: 'Charles Dickens',
    category: 'Classic',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 7,
  },
  {
    id: '4',
    title: 'White Fang',
    author: 'Jack London',
    category: 'Adventure',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 2,
  },
  {
    id: '5',
    title: 'The Scarred Woman',
    author: 'Jussi Adler-Olsen',
    category: 'Thriller',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 4,
  },
];

const mockAuthors = [
  { id: '1', name: 'Author name', books: 5, avatar: '/placeholder-avatar.png' },
  { id: '2', name: 'Author name', books: 5, avatar: '/placeholder-avatar.png' },
  { id: '3', name: 'Author name', books: 5, avatar: '/placeholder-avatar.png' },
  { id: '4', name: 'Author name', books: 5, avatar: '/placeholder-avatar.png' },
];

const Index = () => {
  const navigate = useNavigate();

  // In a real app, this would fetch from the API
  const { data: books = mockBooks, isLoading } = useQuery({
    queryKey: ['recommended-books'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/books?limit=10');
        return response.data.data || mockBooks;
      } catch (error) {
        // Fallback to mock data if API is not available
        return mockBooks;
      }
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        <CategoryGrid />

        {/* Recommendations Section */}
        <section className="px-4 md:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommendation</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/books')}
              className="text-primary hover:text-primary/80"
            >
              Load More
            </Button>
          </div>

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
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {books.slice(0, 10).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </motion.div>
          )}
        </section>

        {/* Popular Authors Section */}
        <section className="px-4 md:px-8 mt-12 mb-16">
          <h2 className="text-2xl font-bold mb-6">Popular Authors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockAuthors.map((author) => (
              <div key={author.id} className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm text-muted-foreground">📚 {author.books} books</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center">
                <span className="font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl">Booky</span>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.
            </p>
            <p className="text-xs opacity-75">Follow on Social Media</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;

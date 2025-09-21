import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CartSidebar } from '../components/CartSidebar';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSearchQuery, setSelectedCategory } from '../store/features/uiSlice';
import api from '../api/api';

// Extended mock data for books page
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
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 7,
  },
  {
    id: '4',
    title: 'White Fang',
    author: 'Jack London',
    category: 'Fiction',
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
  {
    id: '6',
    title: 'Kapan Pindah Luwaw',
    author: 'Author name',
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 6,
  },
  {
    id: '7',
    title: 'Yeti Dan Kurcaci Yang Abadi',
    author: 'Author name',
    category: 'Fantasy',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 8,
  },
  {
    id: '8',
    title: 'Rumah Yang Menelan Penghuninya',
    author: 'Kenken Layla',
    category: 'Horror',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '9',
    title: 'Other Half of Me',
    author: 'Elsa Puspita',
    category: 'Romance',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 5,
  },
];

const categories = [
  'All Categories',
  'Fiction',
  'Non-Fiction',
  'Self-Improvement',
  'Finance',
  'Science',
  'Education',
  'Romance',
  'Thriller',
  'Fantasy',
  'Horror',
  'Cooking'
];

export const BooksPage = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state: RootState) => state.ui);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data: books = mockBooks, isLoading } = useQuery({
    queryKey: ['books', searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'All Categories') {
          params.append('category', selectedCategory);
        }
        
        const response = await api.get(`/api/books?${params.toString()}`);
        return response.data.data || mockBooks;
      } catch (error) {
        // Fallback to filtered mock data
        return mockBooks.filter(book => {
          const matchesSearch = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesCategory = !selectedCategory || 
            selectedCategory === 'All Categories' ||
            book.category === selectedCategory;
            
          return matchesSearch && matchesCategory;
        });
      }
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category === 'All Categories' ? '' : category));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Discover thousands of books available for borrowing
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search books by title or author..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <Select value={selectedCategory || 'All Categories'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-64">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${books.length} books found`}
          </p>
          
          {(searchQuery || selectedCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setSearchQuery(''));
                dispatch(setSelectedCategory(''));
                setLocalSearch('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
};
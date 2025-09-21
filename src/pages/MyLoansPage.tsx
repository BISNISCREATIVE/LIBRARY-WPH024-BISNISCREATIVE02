import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import api from '../api/api';
import dayjs from 'dayjs';

// Mock loans data
const mockLoans = [
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
    returned_at: null,
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
    borrowed_at: '2024-01-01',
    due_date: '2024-02-01',
    returned_at: '2024-01-28',
    status: 'RETURNED',
  },
  {
    id: '3',
    book: {
      id: '3',
      title: 'Oliver Twist',
      author: 'Charles Dickens',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-20',
    due_date: '2024-02-20',
    returned_at: null,
    status: 'OVERDUE',
  },
];

export const MyLoansPage = () => {
  const { isAuthenticated } = useAuth();

  const { data: loans = mockLoans, isLoading } = useQuery({
    queryKey: ['my-loans'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/loans/my');
        return response.data.data || mockLoans;
      } catch (error) {
        return mockLoans;
      }
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = dayjs().isAfter(dayjs(dueDate)) && status === 'BORROWED';
    
    if (isOverdue || status === 'OVERDUE') {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (status) {
      case 'BORROWED':
        return <Badge variant="default">Borrowed</Badge>;
      case 'RETURNED':
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    const isOverdue = dayjs().isAfter(dayjs(dueDate)) && status === 'BORROWED';
    
    if (isOverdue || status === 'OVERDUE') {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
    
    switch (status) {
      case 'BORROWED':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'RETURNED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const currentLoans = loans.filter(loan => loan.status === 'BORROWED' || loan.status === 'OVERDUE');
  const pastLoans = loans.filter(loan => loan.status === 'RETURNED');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Loans</h1>
          <p className="text-muted-foreground">
            Track your borrowed books and return dates
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="w-16 h-20 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Loans */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Current Loans ({currentLoans.length})
              </h2>
              
              {currentLoans.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No books currently borrowed</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/books'}>
                      Browse Books
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {currentLoans.map((loan) => (
                    <Card key={loan.id}>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={loan.book.cover_image || '/placeholder-book.png'}
                            alt={loan.book.title}
                            className="w-16 h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-book.png';
                            }}
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{loan.book.title}</h3>
                                <p className="text-muted-foreground">{loan.book.author}</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(loan.status, loan.due_date)}
                                {getStatusBadge(loan.status, loan.due_date)}
                              </div>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                Borrowed: {dayjs(loan.borrowed_at).format('MMM DD, YYYY')}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4" />
                                Due: {dayjs(loan.due_date).format('MMM DD, YYYY')}
                              </div>
                            </div>
                            
                            {dayjs().isAfter(dayjs(loan.due_date)) && loan.status === 'BORROWED' && (
                              <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-destructive text-sm font-medium">
                                  This book is overdue! Please return it as soon as possible.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Loans */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Loan History ({pastLoans.length})
              </h2>
              
              {pastLoans.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No loan history available</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastLoans.map((loan) => (
                    <Card key={loan.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={loan.book.cover_image || '/placeholder-book.png'}
                            alt={loan.book.title}
                            className="w-16 h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-book.png';
                            }}
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{loan.book.title}</h3>
                                <p className="text-muted-foreground">{loan.book.author}</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(loan.status, loan.due_date)}
                                {getStatusBadge(loan.status, loan.due_date)}
                              </div>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div>
                                Borrowed: {dayjs(loan.borrowed_at).format('MMM DD')}
                              </div>
                              <div>
                                Due: {dayjs(loan.due_date).format('MMM DD')}
                              </div>
                              <div>
                                Returned: {loan.returned_at ? dayjs(loan.returned_at).format('MMM DD') : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
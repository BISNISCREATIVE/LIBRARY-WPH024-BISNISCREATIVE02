import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksAPI } from '../api/api';
import { toast } from '../hooks/use-toast';

export const useAdminBooks = (params?: { 
  page?: number; 
  limit?: number; 
  category?: string; 
  author?: string; 
  search?: string; 
}) => {
  return useQuery({
    queryKey: ['admin-books', params],
    queryFn: () => booksAPI.getBooks(params),
    staleTime: 1 * 60 * 1000, // 1 minute for admin
  });
};

export const useAdminCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksAPI.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success!",
        description: "Book has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to add book',
        variant: "destructive",
      });
    },
  });
};

export const useAdminUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      booksAPI.updateBook(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
      toast({
        title: "Success!",
        description: "Book has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to update book',
        variant: "destructive",
      });
    },
  });
};

export const useAdminDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksAPI.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success!",
        description: "Book has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to delete book',
        variant: "destructive",
      });
    },
  });
};
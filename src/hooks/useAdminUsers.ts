import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { toast } from '../hooks/use-toast';

const adminUsersAPI = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },
  getUserLoans: async (id: string) => {
    const response = await api.get(`/api/admin/users/${id}/loans`);
    return response.data;
  },
};

export const useAdminUsers = (params?: { 
  page?: number; 
  limit?: number; 
  search?: string; 
}) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminUsersAPI.getUsers(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminUsersAPI.getUserById(id),
    enabled: !!id,
  });
};

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminUsersAPI.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast({
        title: "Success!",
        description: "User has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to update user',
        variant: "destructive",
      });
    },
  });
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminUsersAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Success!",
        description: "User has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to delete user',
        variant: "destructive",
      });
    },
  });
};

export const useAdminUserLoans = (id: string) => {
  return useQuery({
    queryKey: ['admin-user-loans', id],
    queryFn: () => adminUsersAPI.getUserLoans(id),
    enabled: !!id,
  });
};
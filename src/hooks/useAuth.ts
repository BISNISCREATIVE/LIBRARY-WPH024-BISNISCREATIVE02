import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setCredentials, logout, setLoading } from '../store/features/authSlice';
import { RootState } from '../store/store';
import api from '../api/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({
        token: data.token,
        user: data.user
      }));
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({
        token: data.token,
        user: data.user
      }));
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutUser,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
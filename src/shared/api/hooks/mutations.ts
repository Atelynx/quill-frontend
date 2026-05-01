/**
 * Custom React Query hooks for mutations (POST, PUT, DELETE operations)
 * Encapsulates mutation logic, cache invalidation, and error handling
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, ordersService } from '../api-service';
import type { LoginInput, RegisterInput } from '../validators';
import type { CreateOrderInput } from '../validators/orders';

/**
 * Hook for user login mutation
 * No automatic cache invalidation (handled by auth context)
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: authService.login,
    onError: (error) => {
      console.error('[Mutation] Login failed:', error);
    },
  });
}

/**
 * Hook for user registration mutation
 * No automatic cache invalidation
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      console.error('[Mutation] Registration failed:', error);
    },
  });
}

/**
 * Hook for creating a new order
 * Invalidates related cache keys on success to refresh data
 */
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.create,
    onSuccess: () => {
      console.log('[Mutation] Order created successfully');
      // Invalidate cache for related queries so they refetch
      void queryClient.invalidateQueries({ queryKey: ['portfolio', 'summary'] });
      void queryClient.invalidateQueries({ queryKey: ['orders', 'pending'] });
      void queryClient.invalidateQueries({ queryKey: ['trades', 'recent'] });
    },
    onError: (error) => {
      console.error('[Mutation] Order creation failed:', error);
    },
  });
}

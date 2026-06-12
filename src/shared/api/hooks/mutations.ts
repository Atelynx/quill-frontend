/**
 * Custom React Query hooks for mutations (POST, PUT, DELETE operations)
 * Encapsulates mutation logic, cache invalidation, and error handling
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, ordersService, usersService, adminConfigService } from '../api-service';
import type { UpdateConfigInput, CreateSnapshotInput } from '../validators';

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
/**
 * Hook for updating user profile
 * Invalidates profile cache on success
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      console.log('[Mutation] Profile updated successfully');
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('[Mutation] Profile update failed:', error);
    },
  });
}

/**
 * Hook for changing email
 * No cache invalidation — forces re-login
 */
export function useChangeEmailMutation() {
  return useMutation({
    mutationFn: usersService.changeEmail,
    onError: (error) => {
      console.error('[Mutation] Email change failed:', error);
    },
  });
}

/**
 * Hook for changing password
 * No cache invalidation — forces re-login
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: usersService.changePassword,
    onError: (error) => {
      console.error('[Mutation] Password change failed:', error);
    },
  });
}

/**
 * Hook for adding symbols to watchlist
 */
export function useAddToWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.addToWatchlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('[Mutation] Add to watchlist failed:', error);
    },
  });
}

/**
 * Hook for removing symbol from watchlist
 */
export function useRemoveFromWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.removeFromWatchlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('[Mutation] Remove from watchlist failed:', error);
    },
  });
}

/**
 * Hook for sending a friend request
 */
export function useSendFriendRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.sendFriendRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      console.error('[Mutation] Send friend request failed:', error);
    },
  });
}

/**
 * Hook for responding to a friend request (accept)
 */
export function useRespondToFriendRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { status: 'accepted' } }) =>
      usersService.respondToFriendRequest(userId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['friends'] });
      void queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] });
    },
    onError: (error) => {
      console.error('[Mutation] Respond to friend request failed:', error);
    },
  });
}

/**
 * Hook for removing a friend
 */
export function useRemoveFriendMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.removeFriend,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      console.error('[Mutation] Remove friend failed:', error);
    },
  });
}

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

/**
 * Hook for creating a new admin config
 */
export function useCreateAdminConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminConfigService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
    },
    onError: (error) => {
      console.error('[Mutation] Admin config create failed:', error);
    },
  });
}

/**
 * Hook for updating an admin config
 */
export function useUpdateAdminConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateConfigInput }) =>
      adminConfigService.update(key, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
    },
    onError: (error) => {
      console.error('[Mutation] Admin config update failed:', error);
    },
  });
}

/**
 * Hook for deleting an admin config
 */
export function useDeleteAdminConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminConfigService.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
    },
    onError: (error) => {
      console.error('[Mutation] Admin config delete failed:', error);
    },
  });
}

/**
 * Hook for creating an admin snapshot
 */
export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateSnapshotInput) =>
      adminConfigService.createSnapshot(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'snapshots'] });
    },
    onError: (error) => {
      console.error('[Mutation] Snapshot create failed:', error);
    },
  });
}

/**
 * Hook for restoring an admin snapshot
 */
export function useRestoreSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminConfigService.restoreSnapshot,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'snapshots'] });
    },
    onError: (error) => {
      console.error('[Mutation] Snapshot restore failed:', error);
    },
  });
}

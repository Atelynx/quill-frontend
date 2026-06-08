import { useState } from 'react';
import { useFriends, useFriendRequests } from '../../../shared/api/hooks';
import {
  useSendFriendRequestMutation,
  useRespondToFriendRequestMutation,
  useRemoveFriendMutation,
} from '../../../shared/api/hooks';
import { labels, friends as friendsContent } from '../../../shared/content/strings';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { loadingScreen, formGrid, fieldGroup } from '../../../shared/design-system/layout';
import { surface } from '../../../shared/design-system/surfaces';
import { fieldLabel } from '../../../shared/design-system/typography';
import { errorMessage as errorMsgClass, inputBase } from '../../../shared/design-system/forms';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import type { Friend, FriendRequest } from '../../../shared/api/validators';

export function FriendsPage() {
  const { data: friends, isLoading: friendsLoading } = useFriends();
  const { data: friendRequests, isLoading: requestsLoading } = useFriendRequests();
  const sendRequestMutation = useSendFriendRequestMutation();
  const respondMutation = useRespondToFriendRequestMutation();
  const removeMutation = useRemoveFriendMutation();

  const [userIdInput, setUserIdInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);

  const friendsList = (friends ?? []) as Friend[];
  const requestsList = (friendRequests ?? []) as FriendRequest[];

  const handleSendRequest = async () => {
    if (!userIdInput.trim()) return;
    try {
      setSearchError(null);
      setSearchSuccess(null);
      await sendRequestMutation.mutateAsync(userIdInput.trim());
      setSearchSuccess(friendsContent.search.success);
      setUserIdInput('');
    } catch (error) {
      setSearchError(
        getApiErrorMessage(error, friendsContent.search.error),
      );
    }
  };

  const handleAccept = async (userId: string) => {
    try {
      await respondMutation.mutateAsync({ userId, data: { status: 'accepted' } });
    } catch (error) {
      console.error('[FriendsPage] Accept failed:', error);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMutation.mutateAsync(userId);
    } catch (error) {
      console.error('[FriendsPage] Remove failed:', error);
    }
  };

  if (friendsLoading || requestsLoading) {
    return (
      <AppShell title={friendsContent.title} subtitle={friendsContent.subtitleShort}>
        <div className={loadingScreen}>{friendsContent.loading}</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={friendsContent.title}
      subtitle={friendsContent.subtitle}
    >
      <SectionCard
        title={friendsContent.search.title}
        description={friendsContent.search.description}
      >
        <div className={formGrid}>
          {searchError ? <p className={errorMsgClass}>{searchError}</p> : null}
          {searchSuccess ? <p className="rounded-[var(--main-page-radius-md)] px-4 py-3.5 text-[var(--main-page-accent-strong)] bg-[var(--main-page-accent-soft)] border border-[color-mix(in_srgb,_var(--color-accent)_22%,_transparent)]">{searchSuccess}</p> : null}
          <div className="flex gap-3 items-end">
            <label className={fieldGroup + ' flex-1'}>
              <span className={fieldLabel}>{labels.field.userId}</span>
              <input
                className={inputBase}
                type="text"
                placeholder={labels.field.usernamePlaceholder}
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
              />
            </label>
            <Button
              onClick={handleSendRequest}
              disabled={sendRequestMutation.isPending || !userIdInput.trim()}
            >
              {sendRequestMutation.isPending ? labels.action.sending : labels.action.send}
            </Button>
          </div>
        </div>
      </SectionCard>

      {requestsList.length > 0 ? (
        <SectionCard
          title={friendsContent.requests.title}
          description={friendsContent.requests.count(requestsList.length)}
        >
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[500px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.name}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.user}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {requestsList.map((req) => (
                  <tr key={req._id} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.name}>
                      {req.from.fullName}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] text-[var(--main-page-text-soft)]" data-label={labels.table.user}>
                      {req.from.username ?? '—'}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAccept(req.from._id)}
                        disabled={respondMutation.isPending}
                      >
                        {labels.action.accept}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title={friendsContent.list.title}
        description={friendsList.length === 0 ? friendsContent.list.empty : friendsContent.list.count(friendsList.length)}
      >
        {friendsList.length === 0 ? (
          <EmptyState
            title={friendsContent.list.emptyTitle}
            description={friendsContent.list.emptyDescription}
          />
        ) : (
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[500px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.name}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.email}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.user}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {friendsList.map((friend) => (
                  <tr key={friend._id} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.name}>
                      {friend.fullName}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] text-[var(--main-page-text-soft)]" data-label={labels.table.email}>
                      {friend.email}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] text-[var(--main-page-text-soft)]" data-label={labels.table.user}>
                      {friend.username ?? '—'}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(friend._id)}
                        disabled={removeMutation.isPending}
                      >
                        {labels.action.delete}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}

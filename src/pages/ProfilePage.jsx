import React from 'react';
import UserBio from '../features/profile/components/UserBio';
import TicketList from '../features/profile/components/TicketList';
import SettingsForm from '../features/profile/components/SettingsForm';
import { useUserProfile } from '../features/profile/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, tickets, isLoading, updateSettings } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Section: User Info & Gamification */}
      <UserBio user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Tickets */}
        <div>
          <TicketList tickets={tickets} />
        </div>

        {/* Right Column: Settings */}
        <div>
          <SettingsForm settings={user?.settings} onUpdate={updateSettings} />
        </div>
      </div>
    </div>
  );
}
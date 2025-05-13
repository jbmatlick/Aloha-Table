import { useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

const UsersTable = dynamic(() => import('./UsersTable'), {
  loading: () => <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading users...</div>
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  last_login?: string;
}

export default function UsersTab() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [showedEmail, setShowedEmail] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: usersData, error: usersError, mutate: mutateUsers } = useSWR<{ users: Auth0User[] }>(
    '/api/admin/users',
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus(null);
    setShowedEmail(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteStatus({ 
          type: "error", 
          message: (data.error || "Failed to invite user") + (data.details ? `: ${JSON.stringify(data.details)}` : "") 
        });
        console.error("Invite error:", data);
      } else {
        setInviteStatus({ type: "success", message: `User invited: ${inviteEmail}` });
        setShowedEmail(inviteEmail);
        setInviteEmail("");
        mutateUsers(); // Refresh users list
      }
    } catch (err) {
      setInviteStatus({ 
        type: "error", 
        message: "Network error: " + (err instanceof Error ? err.message : String(err)) 
      });
      console.error("Invite error:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    setIsDeletingUser(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteStatus({ 
          type: "error", 
          message: (data.error || "Failed to delete user") + (data.details ? `: ${JSON.stringify(data.details)}` : "") 
        });
        console.error("Delete error:", data);
      } else {
        setSuccessMessage("User deleted successfully!");
        mutateUsers(); // Refresh users list
      }
    } catch (err) {
      setInviteStatus({ 
        type: "error", 
        message: "Network error: " + (err instanceof Error ? err.message : String(err)) 
      });
      console.error("Delete error:", err);
    } finally {
      setIsDeletingUser(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">User Management</h2>
        
        {/* Invite Form */}
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite user by email"
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-auto"
            aria-label="Email address for new user"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Invite
          </button>
        </form>

        {showedEmail && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded text-emerald-900">
            <div className="mb-2 font-semibold">User invited!</div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono">Email:</span>
              <span className="font-mono">{showedEmail}</span>
            </div>
            <div className="text-sm text-emerald-700">A password reset link has been sent to their email.</div>
          </div>
        )}

        {inviteStatus && (
          <div 
            className={`mb-4 text-sm ${inviteStatus.type === "success" ? "text-emerald-600" : "text-red-600"}`}
            role="alert"
          >
            {inviteStatus.message}
          </div>
        )}

        {usersError && (
          <div className="mb-4 text-sm text-red-600" role="alert">
            {usersError.message}
          </div>
        )}

        {/* Users Table */}
        <UsersTable 
          users={usersData?.users || []} 
          isLoading={!usersData && !usersError}
          isDeletingUser={isDeletingUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </motion.div>
  );
} 
'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

console.log('🔍 AdminClient: Starting to load');

interface ContactRecord {
  id: string;
  fields: {
    "Full Name": string;
    Email: string;
    Phone: string;
    "Preferred Date": string;
    "Contact Method": string;
    "Additional Details": string;
    Status: string;
    "Created At": string;
  };
}

interface ReferrerRecord {
  id: string;
  fields: {
    "Full Name": string;
    Email: string;
    "Referrals Count": number;
  };
}

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  last_login?: string;
}

function formatLastLogin(lastLogin: string | undefined): string {
  if (!lastLogin) return 'Never';
  const date = new Date(lastLogin);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }) + ' UTC';
}

const DashboardTab = dynamic(() => import('./components/DashboardTab').then(mod => {
  console.log('📦 DashboardTab: Module loaded');
  return mod;
}), {
  loading: () => {
    console.log('⏳ DashboardTab: Loading state');
    return <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading dashboard...</div>;
  }
});

const UsersTab = dynamic(() => import('./components/UsersTab'), {
  loading: () => <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading users...</div>
});

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <pre className="text-sm text-red-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = useState<"dashboard" | "users">(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'users') return 'users';
    return 'dashboard';
  });
  const [records, setRecords] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [referrers, setReferrers] = useState<ReferrerRecord[]>([]);
  const [isLoadingReferrers, setIsLoadingReferrers] = useState(true);
  const [users, setUsers] = useState<Auth0User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [showedPassword, setShowedPassword] = useState<string | null>(null);
  const [showedEmail, setShowedEmail] = useState<string | null>(null);
  const [invitePassword, setInvitePassword] = useState("");
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { user, error, isLoading: isLoadingUser } = useUser();

  // Auth protection
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login?returnTo=/admin");
    }
  }, [user, isLoadingUser, router]);

  // When tab changes, update the URL
  useEffect(() => {
    const url = `/admin?tab=${tab}`;
    router.replace(url);
  }, [tab, router]);

  // Prefetch data for both tabs
  useEffect(() => {
    if (!isLoadingUser && user) {
      // Prefetch both records and referrers data
      const prefetchData = async () => {
        try {
          const [recordsRes, referrersRes] = await Promise.all([
            fetch(`/api/admin/records?page=${currentPage}`),
            fetch("/api/admin/referrers")
          ]);

          if (recordsRes.ok) {
            const data = await recordsRes.json();
            setRecords(data.records);
            setTotalPages(Math.ceil(data.total / 50));
          }

          if (referrersRes.ok) {
            const data = await referrersRes.json();
            setReferrers(data.referrers);
          }
        } catch (error) {
          console.error("Error prefetching data:", error);
        } finally {
          setIsLoading(false);
          setIsLoadingReferrers(false);
        }
      };

      prefetchData();
    }
  }, [user, isLoadingUser, currentPage]);

  // Fetch Auth0 users only when users tab is active
  useEffect(() => {
    if (tab === "users" && user && !users.length) {
      setIsLoadingUsers(true);
      setUsersError(null);
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setUsersError(data.error + (data.details ? `: ${JSON.stringify(data.details)}` : ""));
            setUsers([]);
          } else {
            setUsers(data.users || []);
          }
        })
        .catch((err) => {
          setUsersError("Network error: " + err.message);
          setUsers([]);
        })
        .finally(() => setIsLoadingUsers(false));
    }
  }, [tab, user, users.length]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
  };

  // Invite user
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus(null);
    setShowedPassword(null);
    setShowedEmail(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteStatus({ type: "error", message: (data.error || "Failed to invite user") + (data.details ? `: ${JSON.stringify(data.details)}` : "") });
        console.error("Invite error:", data);
      } else {
        setInviteStatus({ type: "success", message: `User invited: ${inviteEmail}` });
        setShowedEmail(inviteEmail);
        setInviteEmail("");
      }
    } catch (err) {
      setInviteStatus({ type: "error", message: "Network error: " + (err instanceof Error ? err.message : String(err)) });
      console.error("Invite error:", err);
    }
  };

  // Delete user
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
        setInviteStatus({ type: "error", message: (data.error || "Failed to delete user") + (data.details ? `: ${JSON.stringify(data.details)}` : "") });
        console.error("Delete error:", data);
      } else {
        setSuccessMessage("User deleted successfully!");
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      }
    } catch (err) {
      setInviteStatus({ type: "error", message: "Network error: " + (err instanceof Error ? err.message : String(err)) });
      console.error("Delete error:", err);
    } finally {
      setIsDeletingUser(null);
    }
  };

  if (isLoadingUser || isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {successMessage && (
        <div className="fixed top-0 left-0 w-full bg-emerald-600 text-white text-center py-2 z-50">
          {successMessage}
          <button
            className="ml-4 px-2 py-1 bg-white text-emerald-600 rounded text-xs"
            onClick={() => setSuccessMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-8 text-gray-900"
          >
            Admin Center
          </motion.h1>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <nav className="flex space-x-4 bg-white rounded-lg shadow p-1" aria-label="Tabs">
              <button
                className={`px-6 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${tab === "dashboard" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setTab("dashboard")}
                aria-current={tab === "dashboard" ? "page" : undefined}
              >
                Dashboard
              </button>
              <button
                className={`px-6 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${tab === "users" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setTab("users")}
                aria-current={tab === "users" ? "page" : undefined}
              >
                User Management
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {tab === "dashboard" && (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <DashboardTab />
            </ErrorBoundary>
          )}

          {tab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-xl rounded-2xl overflow-hidden">
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
                  <div className={`mb-4 text-sm ${inviteStatus.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{inviteStatus.message}</div>
                )}
                {usersError && (
                  <div className="mb-4 text-sm text-red-600">{usersError}</div>
                )}
                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-lg text-gray-400 font-serif">Loading users...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-lg text-gray-400 font-serif">No users found.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.email}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.name || "-"}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.email_verified ? "Yes" : "No"}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatLastLogin(u.last_login)}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.user_id}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                              <button
                                onClick={() => handleDeleteUser(u.user_id)}
                                disabled={isDeletingUser === u.user_id}
                                className={`text-red-600 hover:text-red-800 ${isDeletingUser === u.user_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isDeletingUser === u.user_id ? 'Deleting...' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

export default Admin; 
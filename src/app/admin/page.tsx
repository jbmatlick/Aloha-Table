"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";

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
}

export default function Admin() {
  const [tab, setTab] = useState<"dashboard" | "users">("dashboard");
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
  const router = useRouter();
  const { user, error, isLoading: isLoadingUser } = useUser();

  // Auth protection
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/api/auth/login?returnTo=/admin");
    }
  }, [user, isLoadingUser, router]);

  // Fetch leads and referrers
  useEffect(() => {
    if (!isLoadingUser && user) {
      // Leads
      const fetchRecords = async () => {
        try {
          const response = await fetch(`/api/admin/records?page=${currentPage}`);
          if (!response.ok) throw new Error("Failed to fetch records");
          const data = await response.json();
          setRecords(data.records);
          setTotalPages(Math.ceil(data.total / 50));
        } catch (error) {
          console.error("Error fetching records:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecords();
      // Referrers
      const fetchReferrers = async () => {
        try {
          const response = await fetch("/api/admin/referrers");
          if (!response.ok) throw new Error("Failed to fetch referrers");
          const data = await response.json();
          setReferrers(data.referrers);
        } catch (error) {
          console.error("Error fetching referrers:", error);
        } finally {
          setIsLoadingReferrers(false);
        }
      };
      fetchReferrers();
    }
  }, [router, currentPage, user, isLoadingUser]);

  // Fetch Auth0 users
  useEffect(() => {
    if (tab === "users" && user) {
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
  }, [tab, user]);

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
        body: JSON.stringify({ email: inviteEmail, password: invitePassword || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteStatus({ type: "error", message: (data.error || "Failed to invite user") + (data.details ? `: ${JSON.stringify(data.details)}` : "") });
        console.error("Invite error:", data);
      } else {
        setInviteStatus({ type: "success", message: `User invited: ${inviteEmail}` });
        setShowedPassword(data.password);
        setShowedEmail(inviteEmail);
        setInviteEmail("");
        setInvitePassword("");
        // Refresh users
        fetch("/api/admin/users")
          .then((res) => res.json())
          .then((data) => setUsers(data.users || []));
      }
    } catch (err) {
      setInviteStatus({ type: "error", message: "Network error: " + (err instanceof Error ? err.message : String(err)) });
      console.error("Invite error:", err);
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
            <>
              {/* Leads Table */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-serif text-gray-900 mb-4">Leads</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Dates</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Method</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {records.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-16 text-center text-lg text-gray-400 font-serif">
                              🍍 No leads yet — they'll be here soon!
                            </td>
                          </tr>
                        ) : (
                          records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{record.fields["Full Name"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{record.fields["Email"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{record.fields["Preferred Date"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{record.fields["Contact Method"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{new Date(record.fields["Created At"]).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              {/* Referrers Table */}
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-serif text-gray-900 mb-4">Referrers</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Link</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals Count</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoadingReferrers ? (
                          <tr>
                            <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">Loading referrers...</td>
                          </tr>
                        ) : referrers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">🍍 No referrers yet. The more, the merrier!</td>
                          </tr>
                        ) : (
                          referrers.map((ref) => (
                            <tr key={ref.id} className="hover:bg-gray-50">
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{ref.fields["Full Name"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{ref.fields["Email"]}</td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-blue-600 underline">
                                <a href={`/contact?ref=${ref.id}`} target="_blank" rel="noopener noreferrer">
                                  {typeof window !== "undefined" ? `${window.location.origin}/contact?ref=${ref.id}` : `/contact?ref=${ref.id}`}
                                </a>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{ref.fields["Referrals Count"] ?? "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
            </>
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
                  <input
                    type="text"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Temporary password (optional)"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-auto"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Invite
                  </button>
                </form>
                {showedPassword && showedEmail && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-900">
                    <div className="mb-2 font-semibold">User created!</div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono">Email:</span>
                      <span className="font-mono">{showedEmail}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono">Password:</span>
                      <span className="font-mono">{showedPassword}</span>
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                        onClick={() => navigator.clipboard.writeText(showedPassword)}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="text-xs text-yellow-700">This password will not be shown again. Please share it securely.</div>
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">Loading users...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">No users found.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.email}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.name || "-"}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.email_verified ? "Yes" : "No"}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{u.user_id}</td>
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
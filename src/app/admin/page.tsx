'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface ContactRecord {
  id: string;
  fields: {
    'Full Name': string;
    'Email': string;
    'Preferred Date': string;
    'Contact Method': string;
    'Created At': string;
  };
}

interface ReferrerRecord {
  id: string;
  fields: {
    'Full Name': string;
    'Email': string;
    'Referrals Count'?: number;
  };
}

export default function Admin() {
  const [records, setRecords] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [referrers, setReferrers] = useState<ReferrerRecord[]>([]);
  const [isLoadingReferrers, setIsLoadingReferrers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Check authentication
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch records from Airtable
      const fetchRecords = async () => {
        try {
          const response = await fetch(`/api/admin/records?page=${currentPage}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch records');
          }
          const data = await response.json();
          setRecords(data.records);
          setTotalPages(Math.ceil(data.total / 50));
        } catch (error) {
          console.error('Error fetching records:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecords();

      // Fetch referrers
      const fetchReferrers = async () => {
        try {
          const response = await fetch('/api/admin/referrers', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch referrers');
          const data = await response.json();
          setReferrers(data.referrers);
        } catch (error) {
          console.error('Error fetching referrers:', error);
        } finally {
          setIsLoadingReferrers(false);
        }
      };
      fetchReferrers();
    }
  }, [router, currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-600">Loading records...</p>
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
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-serif text-gray-900"
            >
              Leads
            </motion.h1>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preferred Dates
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Method
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-lg text-gray-400 font-serif">
                        🌴 Still quiet out there. Let's get some guests to the party!
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          {record.fields['Full Name']}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          {record.fields['Email']}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          {record.fields['Preferred Date']}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          {record.fields['Contact Method']}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          {new Date(record.fields['Created At']).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Referrers Table Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Referrers</h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referral Link
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrals Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingReferrers ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">
                          Loading referrers...
                        </td>
                      </tr>
                    ) : referrers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-lg text-gray-400 font-serif">
                          🌴 No referrers yet. The more, the merrier!
                        </td>
                      </tr>
                    ) : (
                      referrers.map((ref) => (
                        <tr key={ref.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                            {ref.fields['Full Name']}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                            {ref.fields['Email']}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-blue-600 underline">
                            <a href={`/contact?ref=${ref.id}`} target="_blank" rel="noopener noreferrer">
                              {`${window.location.origin}/contact?ref=${ref.id}`}
                            </a>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                            {ref.fields['Referrals Count'] ?? '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
} 
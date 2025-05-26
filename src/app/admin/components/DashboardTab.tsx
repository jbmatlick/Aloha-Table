import { useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

console.log('🤖 RENDERING DashboardTab');

// Force a new module load by using a unique import path
const LeadsTable = dynamic(() => import(`./LeadsTable`), {
  loading: () => {
    console.log('⏳ LeadsTable: Loading state');
    return <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading leads...</div>;
  }
}) as any;

const ReferrersTable = dynamic(() => import('./ReferrersTable'), {
  loading: () => <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading referrers...</div>
});

const EventsTable = dynamic(() => import('./EventsTable'), {
  loading: () => <div className="py-16 text-center text-lg text-gray-400 font-serif">Loading events...</div>
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ContactRecord {
  id: string;
  fields: {
    "Full Name": string;
    "Email": string;
    "Phone": string;
    "Preferred Date": string;
    "Contact Method": string;
    "Additional Details": string;
    "Status": string;
    "Created At": string;
  };
}

interface ReferrerRecord {
  id: string;
  fields: {
    "Full Name": string;
    "Email": string;
    "Referrals Count": number;
  };
}

interface EventRecord {
  id: string;
  fields: {
    "Type of Event": string;
    "Event Date": string;
    "# of Adults": number;
    "# of Children": number;
    "Status": string;
    "Notes": string;
    "Lead": string[];
    "Created At"?: string;
  };
}

export default function DashboardTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<'leads' | 'referrers' | 'events'>('leads');

  const { data: recordsData, error: recordsError } = useSWR<{ records: ContactRecord[]; totalPages: number }>(
    `/api/admin/records?page=${currentPage}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: referrersData, error: referrersError } = useSWR<{ referrers: ReferrerRecord[] }>(
    '/api/admin/referrers',
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: eventsData, error: eventsError } = useSWR<{ events: EventRecord[] }>(
    '/api/admin/events',
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-gray-900">
            {activeView === 'leads' && 'Leads'}
            {activeView === 'referrers' && 'Referrers'}
            {activeView === 'events' && 'Events'}
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('leads')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeView === 'leads'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveView('referrers')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeView === 'referrers'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Referrers
            </button>
            <button
              onClick={() => setActiveView('events')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeView === 'events'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {activeView === 'leads' ? (
          <>
            {recordsError && (
              <div className="mb-4 text-sm text-red-600" role="alert">
                {recordsError.message}
              </div>
            )}
            <LeadsTable
              records={recordsData?.records || []}
              isLoading={!recordsData && !recordsError}
              currentPage={currentPage}
              totalPages={recordsData?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        ) : activeView === 'referrers' ? (
          <>
            {referrersError && (
              <div className="mb-4 text-sm text-red-600" role="alert">
                {referrersError.message}
              </div>
            )}
            <ReferrersTable
              referrers={referrersData?.referrers || []}
              isLoading={!referrersData && !referrersError}
            />
          </>
        ) : (
          <>
            {eventsError && (
              <div className="mb-4 text-sm text-red-600" role="alert">
                {eventsError.message}
              </div>
            )}
            <EventsTable
              events={eventsData?.events || []}
              isLoading={!eventsData && !eventsError}
            />
          </>
        )}
      </div>
    </motion.div>
  );
} 
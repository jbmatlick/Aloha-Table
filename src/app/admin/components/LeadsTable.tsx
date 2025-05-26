// This is the new version of LeadsTable with all features
// Including event creation and management capabilities
import { memo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateEventModal from './CreateEventModal';
import LeadEvents from './LeadEvents';

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

interface LeadsTableProps {
  records: ContactRecord[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const LeadsTable = memo(function LeadsTable({
  records,
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}: LeadsTableProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        Loading leads...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        No leads found
      </div>
    );
  }

  return (
    <>
      <h1 style={{ color: 'red', fontWeight: 'bold', fontSize: 24, textAlign: 'center' }}>🔥 THIS IS THE NEW VERSION 🔥</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preferred Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.fields["Full Name"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{record.fields["Email"]}</div>
                  <div>{record.fields["Phone"]}</div>
                  <div className="text-xs text-gray-400">{record.fields["Contact Method"]}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.fields["Preferred Date"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.fields["Status"] === "New" ? 'bg-blue-100 text-blue-800' :
                    record.fields["Status"] === "Contacted" ? 'bg-yellow-100 text-yellow-800' :
                    record.fields["Status"] === "Booked" ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.fields["Status"]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(record.fields["Created At"]).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedLeadId(record.id);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Event
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {selectedLeadId && (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLeadId(null);
          }}
          leadId={selectedLeadId}
          onSuccess={() => {
            // The LeadEvents component will automatically refresh due to SWR
          }}
        />
      )}

      {/* Display Events */}
      {records.map((record) => (
        <LeadEvents key={record.id} leadId={record.id} />
      ))}
    </>
  );
});

export default LeadsTable; 
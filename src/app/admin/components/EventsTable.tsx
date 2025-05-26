import React, { useState } from 'react';
import EditEventModal from './EditEventModal';

interface EventRecord {
  id: string;
  fields: {
    "Title": string;
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

interface EventsTableProps {
  events: EventRecord[];
  isLoading: boolean;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, isLoading }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideArchived, setHideArchived] = useState(true);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        Loading events...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        No events found
      </div>
    );
  }

  // Filter events based on hideArchived
  const filteredEvents = hideArchived
    ? events.filter(e => e.fields["Status"] !== "Archived" && e.fields["Status"] !== "Complete")
    : events;

  // Sort events by Created At descending
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.fields["Created At"] || '').getTime();
    const dateB = new Date(b.fields["Created At"] || '').getTime();
    return dateB - dateA;
  });

  return (
    <>
      {/* Hide Archived/Complete Checkbox */}
      <div className="flex items-center mb-2">
        <input
          id="hide-archived"
          type="checkbox"
          checked={hideArchived}
          onChange={e => setHideArchived(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="hide-archived" className="text-sm text-gray-700 select-none">
          Hide archived and complete events
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Adults</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Children</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{event.fields["Title"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["Type of Event"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["Event Date"] ? new Date(event.fields["Event Date"]).toLocaleString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["# of Adults"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["# of Children"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${event.fields["Status"] === "New" ? 'bg-blue-100 text-blue-800' :
                      event.fields["Status"] === "Scheduled" ? 'bg-green-100 text-green-800' :
                      event.fields["Status"] === "Complete" ? 'bg-gray-200 text-gray-700' :
                      event.fields["Status"] === "Archived" ? 'bg-gray-700 text-gray-100' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {event.fields["Status"]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["Notes"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button 
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSuccess={() => {
            // The events will automatically refresh due to SWR
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
};

export default EventsTable; 
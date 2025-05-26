import React from 'react';

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

  // Sort events by Event Date descending
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.fields["Event Date"] || a.fields["Created At"] || '').getTime();
    const dateB = new Date(b.fields["Event Date"] || b.fields["Created At"] || '').getTime();
    return dateB - dateA;
  });

  return (
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["Status"]}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fields["Notes"]}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <button className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable; 
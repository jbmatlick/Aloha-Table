import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';

interface LeadEventsProps {
  leadId: string;
}

interface Event {
  id: string;
  fields: {
    'Type of Event': string;
    'Number of Adults': number;
    'Number of Children': number;
    'Date of Event': string;
    'Status': string;
    'Notes': string;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LeadEvents({ leadId }: LeadEventsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, error, mutate } = useSWR<{ events: Event[] }>(
    `/api/admin/events?leadId=${leadId}`,
    fetcher
  );

  if (error) {
    return (
      <div className="text-sm text-red-600" role="alert">
        Failed to load events
      </div>
    );
  }

  if (!data || !data.events || data.events.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 mr-1" />
        )}
        {data.events.length} Event{data.events.length === 1 ? '' : 's'}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-4">
              {data.events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {event.fields['Type of Event']}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.fields['Date of Event']).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.fields['Status'] === 'New' ? 'bg-blue-100 text-blue-800' :
                      event.fields['Status'] === 'Scheduled' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.fields['Status']}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      {event.fields['Number of Adults']} Adult{event.fields['Number of Adults'] === 1 ? '' : 's'}
                      {event.fields['Number of Children'] > 0 && (
                        <> • {event.fields['Number of Children']} Child{event.fields['Number of Children'] === 1 ? '' : 'ren'}</>
                      )}
                    </p>
                    {event.fields['Notes'] && (
                      <p className="mt-1 text-gray-600">{event.fields['Notes']}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
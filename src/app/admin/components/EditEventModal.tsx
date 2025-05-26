import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const EVENT_TYPES = [
  "Drinks and Appetizers",
  "Dinner",
  "Catered",
  "Meal Plan",
  "Custom"
] as const;

const EVENT_STATUSES = ["New", "Scheduled"] as const;

type EventType = typeof EVENT_TYPES[number];
type EventStatus = typeof EVENT_STATUSES[number];

interface FormData {
  typeOfEvent: EventType;
  numberOfAdults: string;
  numberOfChildren: string;
  dateOfEvent: string;
  status: EventStatus;
  notes: string;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; // EventRecord
  onSuccess: () => void;
}

export default function EditEventModal({ isOpen, onClose, event, onSuccess }: EditEventModalProps) {
  const [formData, setFormData] = useState<FormData>({
    typeOfEvent: EVENT_TYPES[0],
    numberOfAdults: '',
    numberOfChildren: '',
    dateOfEvent: '',
    status: EVENT_STATUSES[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        typeOfEvent: (event.fields["Type of Event"] as EventType) || EVENT_TYPES[0],
        numberOfAdults: event.fields["# of Adults"]?.toString() || '',
        numberOfChildren: event.fields["# of Children"]?.toString() || '',
        dateOfEvent: event.fields["Event Date"] ? event.fields["Event Date"].slice(0, 10) : '',
        status: (event.fields["Status"] as EventStatus) || EVENT_STATUSES[0],
        notes: event.fields["Notes"] || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const submitData = {
      'Type of Event': formData.typeOfEvent,
      '# of Adults': parseInt(formData.numberOfAdults) || 0,
      '# of Children': parseInt(formData.numberOfChildren) || 0,
      'Event Date': new Date(formData.dateOfEvent).toISOString(),
      'Status': formData.status,
      'Notes': formData.notes
    };

    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to update event');
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 font-inter">
                  Edit Event
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type of Event */}
                <div>
                  <Listbox value={formData.typeOfEvent} onChange={(value: EventType) => setFormData(prev => ({ ...prev, typeOfEvent: value }))}>
                    <div className="relative">
                      <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Type of Event
                      </Listbox.Label>
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <span className="block truncate">{formData.typeOfEvent}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {EVENT_TYPES.map((type) => (
                          <Listbox.Option
                            key={type}
                            value={type}
                            className={({ active }: { active: boolean }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected, active }: { selected: boolean; active: boolean }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {type}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Number of Guests */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="numberOfAdults" className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-gray-500" />
                        <span>Number of Adults</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="numberOfAdults"
                      min="0"
                      value={formData.numberOfAdults}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfAdults: e.target.value }))}
                      className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-gray-500" />
                        <span>Number of Children</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="numberOfChildren"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfChildren: e.target.value }))}
                      className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    />
                  </div>
                </div>

                {/* Date of Event */}
                <div>
                  <label htmlFor="dateOfEvent" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>Date of Event</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    id="dateOfEvent"
                    value={formData.dateOfEvent}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfEvent: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <Listbox value={formData.status} onChange={(value: EventStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                    <div className="relative">
                      <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                      </Listbox.Label>
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <span className="block truncate">{formData.status}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {EVENT_STATUSES.map((status) => (
                          <Listbox.Option
                            key={status}
                            value={status}
                            className={({ active }: { active: boolean }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected, active }: { selected: boolean; active: boolean }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {status}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <span>Notes</span>
                    </div>
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base resize-none"
                    placeholder="Menu details and additional information..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                    role="alert"
                  >
                    <XMarkIcon className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
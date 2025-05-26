import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess: () => void;
}

const EVENT_TYPES = [
  "Drinks and Appetizers",
  "Dinner",
  "Catered",
  "Meal Plan",
  "Custom"
];

const EVENT_STATUSES = ["New", "Scheduled"];

export default function CreateEventModal({ isOpen, onClose, leadId, onSuccess }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    typeOfEvent: EVENT_TYPES[0],
    numberOfAdults: 0,
    numberOfChildren: 0,
    dateOfEvent: '',
    status: EVENT_STATUSES[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('📝 Submitting event form:', {
      formData,
      leadId
    });

    try {
      if (!leadId) {
        console.log('❌ Form submission failed: Missing leadId');
        throw new Error('Lead ID is required');
      }

      console.log('📤 Sending request to /api/admin/events...');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadId
        }),
      });

      const data = await response.json();
      console.log('📥 Received response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        console.log('❌ Request failed:', data);
        throw new Error(data.error || data.details || 'Failed to create event');
      }

      console.log('✅ Event created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Error in form submission:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the event');
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
              className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">
                  Create New Event
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
                  <label htmlFor="typeOfEvent" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Type of Event
                  </label>
                  <select
                    id="typeOfEvent"
                    value={formData.typeOfEvent}
                    onChange={(e) => setFormData(prev => ({ ...prev, typeOfEvent: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                    required
                  >
                    {EVENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="numberOfAdults" className="block text-sm font-medium text-gray-600 mb-1.5">
                      Number of Adults
                    </label>
                    <input
                      type="number"
                      id="numberOfAdults"
                      min="0"
                      value={formData.numberOfAdults}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfAdults: parseInt(e.target.value) || 0 }))}
                      className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-600 mb-1.5">
                      Number of Children
                    </label>
                    <input
                      type="number"
                      id="numberOfChildren"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfChildren: parseInt(e.target.value) || 0 }))}
                      className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                    />
                  </div>
                </div>

                {/* Date of Event */}
                <div>
                  <label htmlFor="dateOfEvent" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Date of Event
                  </label>
                  <input
                    type="date"
                    id="dateOfEvent"
                    value={formData.dateOfEvent}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfEvent: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                  >
                    {EVENT_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1.5">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-base"
                    placeholder="Menu details and additional information..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                    role="alert"
                  >
                    {error}
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
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
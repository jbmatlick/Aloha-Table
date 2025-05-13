import { memo } from 'react';

interface ReferrerRecord {
  id: string;
  fields: {
    "Full Name": string;
    "Email": string;
    "Referrals Count": number;
  };
}

interface ReferrersTableProps {
  referrers: ReferrerRecord[];
  isLoading: boolean;
}

const ReferrersTable = memo(function ReferrersTable({ referrers, isLoading }: ReferrersTableProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        Loading referrers...
      </div>
    );
  }

  if (referrers.length === 0) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        No referrers found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" role="grid">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Referrals
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {referrers.map((referrer) => (
            <tr key={referrer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {referrer.fields["Full Name"]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {referrer.fields["Email"]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {referrer.fields["Referrals Count"]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ReferrersTable; 
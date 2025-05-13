import { memo } from 'react';

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  last_login?: string;
}

interface UsersTableProps {
  users: Auth0User[];
  isLoading: boolean;
  isDeletingUser: string | null;
  onDeleteUser: (userId: string) => Promise<void>;
}

const UsersTable = memo(function UsersTable({ 
  users, 
  isLoading, 
  isDeletingUser,
  onDeleteUser 
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-16 text-center text-lg text-gray-400 font-serif">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" role="grid">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.email_verified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDeleteUser(user.user_id)}
                  disabled={isDeletingUser === user.user_id}
                  className={`text-red-600 hover:text-red-900 ${
                    isDeletingUser === user.user_id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={`Delete user ${user.email}`}
                >
                  {isDeletingUser === user.user_id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default UsersTable; 
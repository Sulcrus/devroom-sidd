import { UserIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export function LoadingProfile() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {user.first_name?.[0] || '?'}{user.last_name?.[0] || '?'}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
      </div>
      <div>
        <h2 className="font-medium text-gray-900 dark:text-white">
          {user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`
            : 'Unknown User'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user.email || 'No email available'}
        </p>
      </div>
    </div>
  );
}

interface ErrorProfileProps {
  onRetry: () => void;
}

export function ErrorProfile({ onRetry }: ErrorProfileProps) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <p>Failed to load user data</p>
      <button 
        onClick={onRetry}
        className="text-sm text-amber-600 hover:text-amber-500 mt-2"
      >
        Retry
      </button>
    </div>
  );
} 
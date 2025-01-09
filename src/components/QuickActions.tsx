import React from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

export function QuickActions() {
  const usersPermission = usePermissions('Mükellefler');

  const actions = [
    {
      path: '/users',
      icon: Users,
      label: 'Mükellefler',
      permission: usersPermission.canView,
    }
  ].filter((action) => action.permission);

  if (actions.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="btn-secondary justify-start hover:bg-gray-50"
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
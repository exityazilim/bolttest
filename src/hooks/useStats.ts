import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { pageApi } from '../services/pageApi';
import { roleApi } from '../services/roleApi';
import { usePermissions } from './usePermissions';

interface Stats {
  users: number;
  pages: number;
  roles: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    pages: 0,
    roles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get permissions for each section
  const pagesPermission = usePermissions('Sayfalar');
  const rolesPermission = usePermissions('Roller');
  const usersPermission = usePermissions('Mükellefler');

  // Check if user has permission to view any stats
  const canViewStats =
    pagesPermission.canView ||
    rolesPermission.canView ||
    usersPermission.canView;

  useEffect(() => {
    const fetchStats = async () => {
      // Don't fetch if user has no permissions
      if (!canViewStats) {
        setIsLoading(false);
        return;
      }

      try {
        const promises = [];

        // Only fetch data for sections user has permission to view
        if (usersPermission.canView) {
          promises.push(userApi.getAll());
        } else {
          promises.push(Promise.resolve([]));
        }

        if (pagesPermission.canView) {
          promises.push(pageApi.getAll());
        } else {
          promises.push(Promise.resolve([]));
        }

        if (rolesPermission.canView) {
          promises.push(roleApi.getAll());
        } else {
          promises.push(Promise.resolve([]));
        }

        const [users, pages, roles] = await Promise.all(promises);

        setStats({
          users: users.length,
          pages: pages.length,
          roles: roles.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [
    canViewStats,
    pagesPermission.canView,
    rolesPermission.canView,
    usersPermission.canView,
  ]);

  return { stats, isLoading };
}

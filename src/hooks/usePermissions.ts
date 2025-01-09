import { useMemo } from 'react';

interface PagePermission {
  pageId: string;
  pageName: string;
  view: boolean;
  update: boolean;
  insert: boolean;
  delete: boolean;
}

interface Permissions {
  canView: boolean;
  canInsert: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function usePermissions(pageName: string): Permissions {
  const permissions = useMemo(() => {
    try {
      const rolesData = localStorage.getItem('roles');
      console.log('Roles data:', rolesData); // Debug log

      if (!rolesData) {
        return { canView: false, canInsert: false, canUpdate: false, canDelete: false };
      }

      const roles = JSON.parse(rolesData);
      console.log('Parsed roles:', roles); // Debug log
      
      // If user is superadmin, grant all permissions
      if (roles.isSuperAdmin === true) {
        return { canView: true, canInsert: true, canUpdate: true, canDelete: true };
      }

      // Find the page in the pageList
      const page = roles.pageList?.find((p: PagePermission) => {
        console.log('Comparing:', p.pageName, pageName); // Debug log
        return p.pageName.toLowerCase() === pageName.toLowerCase();
      });
      
      console.log('Found page:', page); // Debug log

      if (!page) {
        return { canView: false, canInsert: false, canUpdate: false, canDelete: false };
      }

      return {
        canView: page.view,
        canInsert: page.insert,
        canUpdate: page.update,
        canDelete: page.delete,
      };
    } catch (error) {
      console.error('Error parsing permissions:', error);
      return { canView: false, canInsert: false, canUpdate: false, canDelete: false };
    }
  }, [pageName]);

  return permissions;
}
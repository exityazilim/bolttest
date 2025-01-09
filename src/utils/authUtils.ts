export function isSuperAdmin(): boolean {
  try {
    const rolesData = localStorage.getItem('roles');
    if (rolesData) {
      const roles = JSON.parse(rolesData);
      return roles.isSuperAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error parsing roles:', error);
    return false;
  }
}
import React, { useState } from 'react';
import {
  LogOut,
  User,
  FileText,
  Shield,
  Users,
  Lock,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  FileSpreadsheet,
  Upload,
  Search,
  Package,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ChangePasswordModal } from './ChangePasswordModal';
import { isSuperAdmin } from '../utils/authUtils';
import { Button } from './ui/Button';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get roles from localStorage
  const roles = JSON.parse(localStorage.getItem('roles') || '{}');
  const isAdmin = roles.isSuperAdmin === true;

  const menuItems = {
    modules: {
      label: 'Modüller',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        // Only show Reservation menu if user is admin
        ...(isAdmin ? [{ path: '/reservations', icon: Calendar, label: 'Rezervasyon' }] : [])
      ],
    },
    ...(isSuperAdmin()
      ? {
          management: {
            label: 'Yönetim',
            items: [
              { path: '/users', icon: Users, label: 'Müşteriler' },
              { path: '/products', icon: Package, label: 'Ürünler' }
            ],
          },
        }
      : {}),
  };

  const handleDropdownClick = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Star Supla
              </h1>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {Object.entries(menuItems).map(([key, category]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => handleDropdownClick(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2
                      ${
                        activeDropdown === key
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {category.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 
                      ${activeDropdown === key ? 'transform rotate-180' : ''}`}
                    />
                  </button>

                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200
                              ${
                                location.pathname === item.path
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>

              <Button
                onClick={() => setIsChangePasswordOpen(true)}
                variant="secondary"
              >
                <Lock className="h-4 w-4" />
                Şifre Değiştir
              </Button>

              <Button onClick={logout} variant="danger">
                <LogOut className="h-4 w-4" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-4 py-3 space-y-4">
              {Object.entries(menuItems).map(([key, category]) => (
                <div key={key} className="space-y-2">
                  <div className="font-medium text-gray-900">
                    {category.label}
                  </div>
                  <div className="pl-4 space-y-2">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200
                            ${
                              location.pathname === item.path
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Button
                  onClick={() => setIsChangePasswordOpen(true)}
                  variant="secondary"
                  className="w-full"
                >
                  <Lock className="h-4 w-4" />
                  Şifre Değiştir
                </Button>

                <Button onClick={logout} variant="danger" className="w-full">
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
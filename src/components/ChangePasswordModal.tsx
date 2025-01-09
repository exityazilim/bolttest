import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../config/constants';
import { getHeaders } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../utils/cn';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const getPasswordStrength = (password: string): {
    score: number;
    feedback: string;
    color: string;
  } => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    switch (score) {
      case 0:
        feedback = 'Çok Zayıf';
        return { score, feedback, color: 'bg-red-500' };
      case 1:
        feedback = 'Zayıf';
        return { score, feedback, color: 'bg-orange-500' };
      case 2:
        feedback = 'Orta';
        return { score, feedback, color: 'bg-yellow-500' };
      case 3:
        feedback = 'İyi';
        return { score, feedback, color: 'bg-blue-500' };
      case 4:
        feedback = 'Güçlü';
        return { score, feedback, color: 'bg-green-500' };
      default:
        return { score: 0, feedback: '', color: '' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Lütfen daha güçlü bir şifre seçin');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}Me/ChangePassword`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ password: formData.password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Şifre değiştirme başarısız');
      }

      onClose();
      setFormData({ password: '', confirmPassword: '' });
      alert('Şifreniz başarıyla değiştirildi');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre değiştirme başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = [
    { text: 'En az 8 karakter', met: formData.password.length >= 8 },
    { text: 'En az 1 büyük harf', met: /[A-Z]/.test(formData.password) },
    { text: 'En az 1 rakam', met: /[0-9]/.test(formData.password) },
    { text: 'En az 1 özel karakter', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Şifre Değiştir</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeni Şifre
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                required
                minLength={8}
              />
            </div>

            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Şifre Gücü:</span>
                  <span className={cn(
                    'font-medium',
                    passwordStrength.score >= 3 ? 'text-green-600' : 'text-gray-600'
                  )}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all', passwordStrength.color)}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <ul className="space-y-1">
                  {requirements.map((req, index) => (
                    <li
                      key={index}
                      className={cn(
                        'text-sm flex items-center gap-2',
                        req.met ? 'text-green-600' : 'text-gray-500'
                      )}
                    >
                      {req.met ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 border border-current rounded-full" />
                      )}
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeni Şifre Tekrar
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'Şifreler eşleşmiyor'
                    : undefined
                }
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={
                isLoading ||
                !formData.password ||
                !formData.confirmPassword ||
                formData.password !== formData.confirmPassword ||
                passwordStrength.score < 3
              }
            >
              Şifreyi Değiştir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, setLoginError } = useAuth();

  useEffect(() => {
    setLoginError(null);
  }, [setLoginError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
        <div className="w-full max-w-md">
          <Card variant="interactive" className="backdrop-blur-sm bg-white/95">
            <Card.Header className="space-y-8">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4 ring-8 ring-indigo-50">
                  <LogIn className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Star Supla</h2>
                <p className="text-gray-500 mt-2">Lütfen Giriş Yapınız</p>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Müşteri Adı
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={<User className="h-5 w-5" />}
                    placeholder="Müşteri Adı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Müşteri Şifresi
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-5 w-5" />}
                    placeholder="Şifrenizi Giriniz"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <LogIn className="h-5 w-5" />
                  Giriş Yap
                </Button>
              </form>
            </Card.Header>
          </Card>
        </div>
      </div>
    </div>
  );
}

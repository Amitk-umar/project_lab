import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Microscope } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="p-4 bg-blue-600 rounded-2xl">
                <Microscope className="w-12 h-12 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">LabTracker Pro</h1>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Efficient Lab Equipment Management
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Streamline your laboratory operations with our comprehensive equipment tracking, 
              maintenance scheduling, and inventory management system.
            </p>
          </div>
        </div>
    

        {/* Right Side - Auth Forms */}
        <div className="w-full">
          {currentView === 'login' && (
            <LoginForm
              onForgotPassword={() => setCurrentView('forgot-password')}
              onSignUp={() => setCurrentView('signup')}
            />
          )}
          {currentView === 'signup' && (
            <SignUpForm onLogin={() => setCurrentView('login')} />
          )}
          {currentView === 'forgot-password' && (
            <ForgotPasswordForm onBack={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};
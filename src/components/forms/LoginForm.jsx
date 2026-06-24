import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LoginForm = ({ onSubmitSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await onSubmitSuccess(data.email, data.password, data.rememberMe);
    } catch (err) {
      setApiError(err.message || 'Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google authentication is pending OAuth client configuration.');
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Alert type="error" message={apiError} />

        <Input
          id="email"
          label="Email Address"
          type="email"
          variant="light"
          placeholder="admin@lexa.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="light"
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              id="rememberMe"
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              {...register('rememberMe')}
            />
            <span className="text-xs text-slate-500 font-semibold">Remember Me</span>
          </label>

          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert('Forgot Password feature is currently pending backend integration.');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-slate-200" />
        <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Or</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Google Log In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.788-6.228-6.228 0-3.44 2.788-6.229 6.228-6.229 1.5 0 2.87.53 3.96 1.485l3.07-3.07C18.96 2.03 15.82 1 12.24 1 6.048 1 1 6.048 1 12.24s5.048 11.24 11.24 11.24c5.89 0 10.74-4.26 10.74-10.74 0-.648-.06-1.285-.18-1.914h-10.56z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Register Redirect Prompt */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-slate-500">
          Don't have an account?{' '}
          <a
            href="#contact-admin"
            onClick={(e) => {
              e.preventDefault();
              alert('Please contact your administrator at IT@lexa.com to request an account.');
            }}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
          >
            Contact Administrator
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

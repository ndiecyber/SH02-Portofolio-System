import { useState } from 'react';
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

        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              id="rememberMe"
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              {...register('rememberMe')}
            />
            <span className="text-xs text-slate-500 font-semibold">Remember Me</span>
          </label>
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

      {/* Register Redirect Prompt */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-slate-500">
          Don't have an account?{' '}
          <a
            href="mailto:IT@lexa.com"
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

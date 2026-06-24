import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Alert = ({ type = 'info', message, className }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={clsx(
        'flex items-start p-3 border rounded-lg text-sm space-x-2.5 animate-fade-in',
        styles[type],
        className
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Alert;

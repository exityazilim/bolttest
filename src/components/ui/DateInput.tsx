import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import 'react-datepicker/dist/react-datepicker.css';

// Register Turkish locale
registerLocale('tr', tr);

interface DateInputProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DateInput({
  label,
  error,
  value,
  onChange,
  required,
  disabled,
  className
}: DateInputProps) {
  const handleChange = (date: Date | null) => {
    if (date) {
      // Tarihi yerel saat dilimine göre ayarla
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      onChange({
        target: {
          value: localDate.toISOString().split('T')[0]
        }
      });
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Calendar className="w-5 h-5" />
        </div>
        <ReactDatePicker
          selected={value ? new Date(value) : null}
          onChange={handleChange}
          dateFormat="dd MMMM yyyy"
          locale="tr"
          disabled={disabled}
          className={cn(
            "block w-full pl-12 pr-4 py-3 text-base rounded-lg border",
            "bg-white text-gray-900 placeholder:text-gray-500",
            "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300",
            className
          )}
          placeholderText="Tarih seçin"
          required={required}
          showPopperArrow={false}
          customInput={
            <input
              type="text"
              autoComplete="off"
            />
          }
          popperClassName="react-datepicker-enhanced"
          calendarClassName="border-0 shadow-xl !rounded-lg"
          wrapperClassName="w-full"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
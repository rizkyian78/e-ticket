import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  onSubmit: (formData: { name: string; email: string; phone: string }) => void;
  disabled: boolean;
  isLoading: boolean;
}

export function CheckoutForm({ onSubmit, disabled, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.phone.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Checkout Button */}
        <button
          type="submit"
          disabled={disabled || isLoading || !isFormValid}
          className={`w-full py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center ${
            disabled || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Checkout'
          )}
        </button>

        {disabled && !isLoading && (
          <p className="text-sm text-gray-500 text-center">Please select at least one ticket</p>
        )}
      </div>
    </form>
  );
}

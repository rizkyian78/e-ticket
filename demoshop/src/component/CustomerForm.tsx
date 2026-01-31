import { Customer } from '@/types';

export const CustomerForm = ({
  value,
  onChange,
}: {
  value: Customer;
  onChange: (v: Customer) => void;
}) => (
  <div className="space-y-4 rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold">Customer Information</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <input
        data-testid="name-input"
        className="input"
        placeholder="Full Name"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <input
        data-testid="email-input"
        className="input"
        placeholder="Email Address"
        value={value.email}
        onChange={(e) => onChange({ ...value, email: e.target.value })}
      />
      <input
        data-testid="phone-input"
        className="input"
        placeholder="Phone (Optional)"
        value={value.phone || ''}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
      />
    </div>
  </div>
);

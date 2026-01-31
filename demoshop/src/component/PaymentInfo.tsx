export const PaymentInfo = ({
  token,
  onChange,
}: {
  token: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-3 rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold">Payment Information</h2>
    <input
      data-testid="card-token"
      className="input"
      value={token}
      onChange={(e) => onChange(e.target.value)}
      placeholder="tok_visa_123456"
    />
  </div>
);

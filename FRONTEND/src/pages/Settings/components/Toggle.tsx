export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const track = size === 'sm'
    ? 'w-9 h-5 after:h-4 after:w-4 after:top-[2px] after:left-[2px]'
    : 'w-11 h-6 after:h-5 after:w-5 after:top-[2px] after:left-[2px]';
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div
        className={`relative ${track} bg-slate-200 rounded-full peer
          peer-checked:after:translate-x-full
          after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all
          peer-checked:bg-[var(--color-primary)] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
      />
    </label>
  );
};
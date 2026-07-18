export function Avatar({ src, alt, fallback, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-[#F6F8FA] border border-[#D0D7DE] shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-[#57606A] uppercase">{fallback?.substring(0, 2) || '?'}</span>
      )}
    </div>
  );
}

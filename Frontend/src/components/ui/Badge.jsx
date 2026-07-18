export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#F6F8FA] text-[#57606A] border-[#D0D7DE]',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-[#E5F6EB] text-[#1A7F37] border-[#2DA44E]/20',
    warning: 'bg-[#FFF8C5] text-[#9A6700] border-[#D4A72C]/40',
    danger: 'bg-[#FFEBE9] text-[#CF222E] border-[#CF222E]/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function DifficultyBadge({ level }) {
  let variant = 'default';
  if (level === 'beginner') variant = 'success';
  if (level === 'intermediate') variant = 'warning';
  if (level === 'advanced') variant = 'danger';

  return <Badge variant={variant} className="uppercase">{level}</Badge>;
}

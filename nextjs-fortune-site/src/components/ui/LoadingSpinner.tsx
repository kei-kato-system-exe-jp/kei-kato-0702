interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  return (
    <div 
      className={`${sizeClasses[size]} border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin ${className}`}
    />
  );
}
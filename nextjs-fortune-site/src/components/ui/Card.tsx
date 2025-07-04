interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  onClick, 
  hover = true 
}: CardProps) {
  const baseClasses = 'bg-white/10 backdrop-blur-md border-2 border-gold-400/30 rounded-2xl p-6 transition-all duration-300';
  const hoverClasses = hover ? 'hover:transform hover:-translate-y-2 hover:border-gold-400 hover:shadow-2xl hover:shadow-gold-400/30 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#9B8EC7] text-white shadow-[0_2px_12px_rgba(155,142,199,0.25)] hover:shadow-[0_4px_20px_rgba(155,142,199,0.35)]',
  secondary: 'bg-[#F2EAE0] text-[#1E1E24] shadow-[0_1px_4px_rgba(155,142,199,0.1)]',
  danger: 'bg-[#E07A5F] text-white',
  ghost: 'bg-transparent text-[#6B6875] hover:bg-[#F2EAE0]',
};

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className,
  type = 'button',
  ariaLabel,
  fullWidth = false,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] font-semibold text-[15px] select-none',
        'h-12 px-5 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </motion.button>
  );
}

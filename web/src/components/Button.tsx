import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    icon,
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
    };
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm h-8',
        md: 'px-4 py-2 text-sm h-10',
        lg: 'px-6 py-3 text-base h-12'
    };
    
    const iconSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };
    
    // Se className customizada for fornecida, usa apenas ela + baseClasses essenciais
    // Caso contrário, usa as classes padrão
    const classes = className 
        ? `inline-flex items-center justify-center ${className}`
        : `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
    
    // Se não há children, renderiza apenas o ícone centralizado
    if (!children || (typeof children === 'string' && children.trim() === '')) {
        return (
            <button
                type={type}
                className={classes}
                onClick={onClick}
                disabled={disabled}
            >
                <span className={iconSizeClasses[size]}>
                    {icon}
                </span>
            </button>
        );
    }

    // Se há children, renderiza com ícone e texto centralizados
    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

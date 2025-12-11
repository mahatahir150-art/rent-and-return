const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    icon: Icon
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ opacity: disabled ? 0.7 : 1, width: '100%' }}
        >
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
};

export default Button;

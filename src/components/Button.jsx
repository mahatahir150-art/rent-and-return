const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    icon: Icon,
    fullWidth = false,
    style = {}
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: fullWidth ? '100%' : 'auto',
                ...style
            }}
        >
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
};

export default Button;

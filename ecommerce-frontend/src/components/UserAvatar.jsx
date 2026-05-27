const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl',
  };

  const baseClass = `${sizeClasses[size] || sizeClasses.md} rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-primary text-white font-semibold ${className}`;

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username || 'Avatar'}
        className={`${baseClass} object-cover`}
      />
    );
  }

  return (
    <div className={baseClass}>
      {user?.username?.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

export default UserAvatar;

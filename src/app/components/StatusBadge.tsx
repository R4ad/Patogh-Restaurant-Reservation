interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'در انتظار تایید',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    approved: {
      label: 'تایید شده',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    rejected: {
      label: 'رد شده',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${config.className}`}>
      {config.label}
    </span>
  );
}

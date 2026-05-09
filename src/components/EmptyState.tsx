import { FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">
        {icon || <FileText size={48} className="text-[#BDA6CE]" style={{ opacity: 0.5 }} />}
      </div>
      <p className="text-[15px] text-[#6B6875] text-center">{title}</p>
      <p className="text-[12px] text-[#6B6875] text-center mt-1">{subtitle}</p>
    </div>
  );
}

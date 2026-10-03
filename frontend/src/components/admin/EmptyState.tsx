import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-sky flex items-center justify-center mb-4">
        <Icon size={26} className="text-navy-deep" />
      </div>
      <p className="font-serif text-xl text-navy-deep">{title}</p>
      {description && <p className="text-sm text-ink-soft mt-2 max-w-md mx-auto">{description}</p>}
    </div>
  );
}
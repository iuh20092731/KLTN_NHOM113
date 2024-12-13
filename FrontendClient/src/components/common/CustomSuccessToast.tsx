import { Check } from "lucide-react";

interface CustomSuccessToastProps {
  title?: string;
  description: string;
}

export function CustomSuccessToast({ title, description }: CustomSuccessToastProps) {
  return (
    <div className="relative transform transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 border-l-4 border-green-500">
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1">
          {title && <div className="font-semibold text-green-800">{title}</div>}
          <div className="text-green-700">{description}</div>
        </div>
      </div>
    </div>
  );
} 
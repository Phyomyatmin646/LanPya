import { AlertCircle, RotateCcw } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="gh-box p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
      {Icon && <Icon className="w-10 h-10 text-[#8C959F] mb-4" />}
      <h3 className="font-semibold text-lg text-[#24292F]">{title}</h3>
      {description && <p className="text-[#57606A] mt-2 mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="gh-box p-8 border-[#CF222E] bg-[#FFEBE9] text-center">
      <AlertCircle className="w-10 h-10 text-[#CF222E] mx-auto mb-4" />
      <h3 className="font-semibold text-[#CF222E] mb-2">{message}</h3>
      <p className="text-[#A40E26] text-sm mb-5">
        There was a problem communicating with the server. Please check your connection or try again.
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-default gap-2">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

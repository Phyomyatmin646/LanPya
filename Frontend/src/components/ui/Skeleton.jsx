import { motion } from 'framer-motion';

export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-[#E5E7EB] animate-pulse rounded-md ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="gh-box overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F6F8FA] border-b border-[#D0D7DE]">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3"><Skeleton className="h-4 w-24" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-[#D0D7DE] last:border-0">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-3"><Skeleton className="h-4 w-full max-w-[80%]" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F6F8FA]">
      <motion.div
        className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"
      />
    </div>
  );
}

export function CardSkeletons({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gh-box p-6 flex flex-col h-full">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <div className="mt-auto flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

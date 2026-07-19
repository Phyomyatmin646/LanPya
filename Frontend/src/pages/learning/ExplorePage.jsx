import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { BookOpen, Star, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data: roadmapsResponse, isLoading } = useQuery({
    queryKey: ['roadmaps', { page, limit, search: searchTerm }],
    queryFn: () => roadmapService.getAll({ page, limit, search: searchTerm }),
  });

  const roadmaps = roadmapsResponse?.data?.data || [];
  const pagination = roadmapsResponse?.data?.pagination;

  return (
    <div className="container-gh py-6">
      
      <div className="flex flex-col md:flex-row gap-6">
        


        {/* Main Content - Repository List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 border-b border-[#D0D7DE] pb-2">
            <h2 className="text-xl font-semibold text-[#24292F]">
              {isLoading ? 'Loading...' : `${pagination?.total || 0} results`}
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="py-4 border-b border-[#D0D7DE]">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-[#D0D7DE]">
              {roadmaps.map(roadmap => (
                <li key={roadmap._id} className="py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-[#57606A]" />
                        <Link to={`/roadmaps/${roadmap._id}`} className="text-xl font-semibold text-accent hover:underline break-words">
                          {roadmap.title}
                        </Link>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#D0D7DE] text-[#57606A]">
                          Public
                        </span>
                      </div>
                      <p className="text-[#57606A] text-sm mb-3 max-w-3xl">
                        {roadmap.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#57606A]">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-[#E3B341]"></span>
                          {roadmap.category?.name || 'Uncategorized'}
                        </span>
                        <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                          <Star className="w-4 h-4" />
                          {roadmap.ratings?.average || 0}
                        </span>
                        <span>Updated {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 shrink-0 hidden sm:block">
                      <Link to={`/roadmaps/${roadmap._id}`} className="btn btn-default text-xs py-1">
                        View
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pagination && (
            <Pagination 
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

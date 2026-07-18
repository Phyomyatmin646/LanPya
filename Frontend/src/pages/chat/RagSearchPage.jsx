import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, FileText, Loader, Sparkles } from 'lucide-react';
import { ragService } from '@/services/ragService';
import { getErrorMessage } from '@/utils/helpers';

export default function RagSearchPage() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);

  const searchMutation = useMutation({
    mutationFn: (q) => ragService.query(q),
    onSuccess: (res) => setResults(res.data.data || []),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchMutation.mutate(query.trim());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">RAG Search</h1>
          <p className="page-subtitle">Semantically search across knowledge documents using AI.</p>
        </div>
      </div>

      {/* Search form */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask a question or enter a topic…"
              className="input pl-9"
            />
          </div>
          <button type="submit" disabled={!query.trim() || searchMutation.isPending}
            className="btn btn-primary btn-md gap-2">
            {searchMutation.isPending ? (
              <><Loader className="w-4 h-4 animate-spin" /> Searching…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Search</>
            )}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {['Machine Learning', 'React Hooks', 'API Design', 'Data Structures'].map(hint => (
            <button key={hint} onClick={() => setQuery(hint)}
              className="px-3 py-1.5 rounded-lg text-xs bg-gray-50 text-gray-600 hover:bg-primary/8 hover:text-primary transition-colors border border-gray-100">
              {hint}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div className="space-y-3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-gray-500 font-medium">{results.length} result(s) found</p>
            {results.map((chunk, i) => (
              <motion.div key={chunk._id || i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    {chunk.document_id?.title && (
                      <p className="text-xs font-semibold text-secondary mb-1">{chunk.document_id.title}</p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">{chunk.text || chunk.content}</p>
                    {chunk.similarity_score !== undefined && (
                      <p className="text-xs text-gray-400 mt-2">
                        Relevance: <span className="font-medium text-primary">{Math.round(chunk.similarity_score * 100)}%</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!searchMutation.isPending && results.length === 0 && searchMutation.isSuccess && (
        <div className="card p-8 text-center">
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No relevant results found. Try a different query.</p>
        </div>
      )}
    </div>
  );
}

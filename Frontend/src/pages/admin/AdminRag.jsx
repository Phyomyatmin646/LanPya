import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileText, Upload, Trash2, Search, Loader, CheckCircle } from 'lucide-react';
import { ragService } from '@/services/ragService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ConfirmDialog } from '@/components/ui/Modal';
import { getErrorMessage, formatDate, truncate } from '@/utils/helpers';

export default function AdminRag() {
  const qc = useQueryClient();
  const fileRef = useRef();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dragOver,     setDragOver]     = useState(false);

  const { data: docs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['rag-documents'],
    queryFn: () => ragService.getDocuments().then(r => r.data.data),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return ragService.uploadDocument(fd);
    },
    onSuccess: () => {
      toast.success('Document uploaded and indexed!');
      qc.invalidateQueries(['rag-documents']);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ragService.deleteDocument(id),
    onSuccess: () => {
      toast.success('Document deleted');
      qc.invalidateQueries(['rag-documents']);
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleFile = (file) => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">RAG Documents</h1>
          <p className="page-subtitle">Upload knowledge documents for AI-powered semantic search.</p>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`card p-10 border-2 border-dashed transition-all duration-200 text-center cursor-pointer
          ${dragOver ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-primary/40 hover:bg-primary/[0.02]'}
          ${uploadMutation.isPending ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.docx,.md"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-10 h-10 text-secondary animate-spin" />
            <p className="text-sm font-medium text-gray-600">Uploading & indexing document…</p>
          </div>
        ) : uploadMutation.isSuccess ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-600">Uploaded successfully!</p>
            <p className="text-xs text-gray-400">Click or drop to upload another</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">Drop a file or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, TXT, DOCX, Markdown</p>
            </div>
          </div>
        )}
      </div>

      {/* Documents list */}
      <div>
        <h2 className="font-display font-semibold text-base text-dark mb-3">
          Indexed Documents ({docs.length})
        </h2>

        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : docs.length === 0 ? (
          <EmptyState icon={FileText} title="No documents indexed"
            description="Upload a document above to enable RAG search." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Chunks</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, i) => (
                  <motion.tr key={doc._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-dark text-sm">{doc.title || doc.filename}</p>
                          {doc.description && (
                            <p className="text-xs text-gray-400">{truncate(doc.description, 50)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral uppercase text-[10px]">
                        {doc.file_type || '—'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">{doc.chunk_count || '—'}</td>
                    <td className="text-sm text-gray-500">{formatDate(doc.created_at)}</td>
                    <td>
                      <button
                        onClick={() => setDeleteTarget(doc._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Document?"
        description="This will remove the document and all its indexed chunks from the RAG store."
      />
    </div>
  );
}

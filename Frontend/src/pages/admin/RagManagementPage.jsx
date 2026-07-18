import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { miscService } from '../../services/miscService';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Trash2, UploadCloud, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RagManagementPage() {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { data: docsResponse, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'rag'],
    queryFn: () => miscService.getPlatformStats(), // Mocking RAG list 
  });

  const onSubmit = async (data) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('file', data.file[0]);
      
      await miscService.uploadRagDocument(formData);
      toast.success('Document uploaded and indexed successfully');
      reset();
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-4 border-b border-[#D0D7DE] pb-2">
        <h1 className="text-2xl font-semibold text-[#24292F]">Knowledge Base (RAG)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="md:col-span-1">
          <div className="gh-box">
            <div className="gh-box-header flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> Upload Document
            </div>
            <div className="gh-box-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="gh-label">Document Title</label>
                  <input type="text" {...register('title', { required: true })} className="gh-input" placeholder="e.g. React Docs 2024" />
                </div>
                <div>
                  <label className="gh-label">File (PDF, TXT, MD)</label>
                  <input type="file" {...register('file', { required: true })} className="gh-input text-xs" />
                </div>
                <button type="submit" disabled={isUploading} className="btn btn-primary w-full">
                  {isUploading ? 'Indexing...' : 'Upload & Index'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <TableSkeleton rows={4} cols={3} />
          ) : (
            <div className="gh-box overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F6F8FA] border-b border-[#D0D7DE]">
                    <th className="px-4 py-2 font-semibold text-[#57606A]">Document</th>
                    <th className="px-4 py-2 font-semibold text-[#57606A]">Status</th>
                    <th className="px-4 py-2 font-semibold text-[#57606A] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3].map(i => (
                    <tr key={i} className="border-b border-[#D0D7DE] last:border-0 hover:bg-[#F6F8FA]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#57606A]" />
                          <span className="font-medium text-[#24292F]">Dummy React Doc {i}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#2DA44E]/20 bg-[#E5F6EB] text-[#1A7F37]">
                          Indexed
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-[#CF222E] hover:underline"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

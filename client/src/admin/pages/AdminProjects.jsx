import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Eye, Trash2, FolderKanban, Loader2, Info } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Fetch projects failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleArchiveOrDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to archive/hide the project "${title}"?`)) return;

    try {
      const res = await api.delete(`/admin/projects/${id}`);
      if (res.data.success) {
        alert(`"${title}" has been archived successfully.`);
        fetchProjects();
      } else {
        alert(res.data.error || 'Failed to delete project.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.error || 'Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <SEO title="Projects Gallery List | Elisa Decor Admin" noIndex={true} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Projects Gallery</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Publish custom installation showcases of your plywood panels (modular kitchens, wardrobes, lobbies).
          </p>
        </div>
        <div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusCircle size={16} />
            Add Project
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading projects list...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Info className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-medium text-white font-serif">No projects found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
            Showcase your plywood boards. Click the Add Project button above to get started.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Cover</th>
                  <th className="px-6 py-4">Project Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-16 rounded bg-zinc-850 border border-zinc-700 overflow-hidden flex items-center justify-center">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage.url}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FolderKanban size={20} className="text-zinc-650" />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-white font-serif">
                      {project.title}
                    </td>

                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs uppercase">
                      {project.category || 'GENERAL'}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {project.location || '—'}
                    </td>

                    <td className="px-6 py-4 text-zinc-450 font-mono">
                      {project.sortOrder || 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          project.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : project.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 font-sans">
                        {project.status === 'PUBLISHED' && (
                          <Link
                            to="/projects"
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="View Public Gallery"
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <Link
                          to={`/admin/projects/edit/${project._id}`}
                          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={16} />
                        </Link>
                        {project.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleArchiveOrDelete(project._id, project.title)}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Archive Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

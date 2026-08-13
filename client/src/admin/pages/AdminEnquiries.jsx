import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  Download,
  Info,
  Calendar,
  X,
  User,
  Phone,
  MapPin,
  Building,
  Box,
  FileText,
  Loader2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/enquiries?page=${page}&limit=15&search=${encodeURIComponent(
          search
        )}&status=${statusFilter}`
      );
      setEnquiries(res.data.enquiries || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Fetch enquiries failed:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSelectEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setNoteText('');
  };

  const handleUpdateEnquiry = async (statusVal, textVal) => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const payload = {};
      if (statusVal) payload.status = statusVal;
      if (textVal) payload.noteText = textVal;

      const res = await api.patch(`/admin/enquiries/${selectedEnquiry._id}`, payload);
      if (res.data.success) {
        setEnquiries(enquiries.map((e) => (e._id === selectedEnquiry._id ? res.data.enquiry : e)));
        setSelectedEnquiry(res.data.enquiry);
        setNoteText('');
        fetchEnquiries();
      } else {
        alert(res.data.error || 'Failed to update enquiry status.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.error || 'Failed to update lead status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!selectedEnquiry) return;
    if (!confirm(`Are you sure you want to permanently delete the enquiry from "${selectedEnquiry.name}"?`)) return;

    setUpdating(true);
    try {
      const res = await api.delete(`/admin/enquiries/${selectedEnquiry._id}`);
      if (res.data.success) {
        setSelectedEnquiry(null);
        fetchEnquiries();
      } else {
        alert(res.data.error || 'Failed to delete enquiry.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.error || 'Failed to delete enquiry.');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await api.get(`/admin/enquiries?limit=5000&status=${statusFilter}`);
      if (res.data.success && res.data.enquiries) {
        const headers = [
          'Date',
          'Name',
          'Phone',
          'Email',
          'City',
          'State',
          'Company',
          'Product',
          'Message',
          'Status',
        ];
        
        const rows = res.data.enquiries.map((e) => [
          new Date(e.createdAt).toLocaleDateString(),
          `"${e.name.replace(/"/g, '""')}"`,
          `"${e.phone}"`,
          `"${e.email}"`,
          `"${(e.city || '').replace(/"/g, '""')}"`,
          `"${(e.state || '').replace(/"/g, '""')}"`,
          `"${(e.company || '').replace(/"/g, '""')}"`,
          `"${(e.productNameSnapshot || 'General').replace(/"/g, '""')}"`,
          `"${(e.message || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
          e.status,
        ]);

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `elisa_decor_enquiries_${statusFilter || 'all'}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export enquiries.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <SEO title="Admin Enquiries | Elisa Decor" noIndex={true} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Enquiries</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Review and follow up on customer enquiries from product forms.
          </p>
        </div>
        <div>
          <button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search enquiries by name, email..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-805 w-full md:w-auto overflow-x-auto">
          {[
            { label: 'All', value: '' },
            { label: 'New', value: 'NEW' },
            { label: 'Contacted', value: 'CONTACTED' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Qualified', value: 'QUALIFIED' },
            { label: 'Closed', value: 'CLOSED' },
            { label: 'Spam', value: 'SPAM' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleStatusFilterChange(item.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                statusFilter === item.value
                  ? 'bg-emerald-605 text-white bg-emerald-600'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading enquiries list...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Info className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-medium text-white font-serif">No enquiries found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
            All submitted product requests and general enquiries will show up here.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Received</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Product Context</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {enquiries.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => handleSelectEnquiry(item)}
                    className="hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-zinc-450 font-mono text-xs whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-zinc-200">
                        {item.productNameSnapshot || 'General / Contact'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                      {item.city ? `${item.city}, ${item.state || ''}` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          item.status === 'NEW'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : item.status === 'CLOSED'
                            ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                            : item.status === 'SPAM'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="text-emerald-400 text-xs font-semibold hover:underline">
                        Open →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-6 text-sm text-zinc-400">
          <div>
            Page <span className="font-medium text-white">{page}</span> of{' '}
            <span className="font-medium text-white">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {selectedEnquiry && (
        <>
          <div
            onClick={() => setSelectedEnquiry(null)}
            className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between text-zinc-200">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-805 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Enquiry Log Details</h3>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono mt-1">
                    <Calendar size={10} />
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-zinc-850 p-4 border border-zinc-800 rounded-lg space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-300">Update Lead Status</label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateEnquiry(e.target.value, '')}
                    disabled={updating}
                    className="rounded bg-zinc-800 border border-zinc-705 text-xs px-2.5 py-1.5 text-white font-medium focus:ring-emerald-500"
                  >
                    <option value="NEW">New Lead</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CLOSED">Closed (Success)</option>
                    <option value="SPAM">Spam</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 text-sm bg-zinc-950 p-4 border border-zinc-850 rounded-lg mb-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <User size={10} /> Customer Name
                    </span>
                    <p className="font-semibold text-white">{selectedEnquiry.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <Phone size={10} /> Phone Number
                    </span>
                    <p className="font-mono text-zinc-300">{selectedEnquiry.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-3">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <Mail size={10} /> Email Address
                    </span>
                    <p className="font-mono text-zinc-350 truncate">{selectedEnquiry.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <MapPin size={10} /> Location
                    </span>
                    <p className="text-zinc-350">
                      {selectedEnquiry.city ? `${selectedEnquiry.city}, ${selectedEnquiry.state || ''}` : '—'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-3">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <Building size={10} /> Organization
                    </span>
                    <p className="text-zinc-350">{selectedEnquiry.company || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <Box size={10} /> Product Context
                    </span>
                    <span className="font-medium text-emerald-450">
                      {selectedEnquiry.productNameSnapshot || 'General Page Enquiry'}
                    </span>
                  </div>
                </div>

                {selectedEnquiry.sourcePage && (
                  <div className="border-t border-zinc-900 pt-3 space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      Source Page URL
                    </span>
                    <span className="text-xs font-mono text-zinc-450 block break-all">
                      {selectedEnquiry.sourcePage}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-zinc-850 p-4 border border-zinc-800 rounded-lg space-y-2 mb-5">
                <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <FileText size={10} /> Requirement / Message
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message || 'No additional requirement message provided.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Internal Follow-Up Notes</h4>
                
                {selectedEnquiry.notes?.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No notes logged yet.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedEnquiry.notes.map((n, idx) => (
                      <div key={idx} className="bg-zinc-950 p-2.5 rounded border border-zinc-900 text-xs">
                        <div className="flex justify-between text-[10px] text-zinc-500 font-medium mb-1">
                          <span>{n.author}</span>
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Append internal comment (e.g. Called client, requested specifications)..."
                    className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs text-white resize-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateEnquiry(null, noteText)}
                    disabled={updating || !noteText.trim()}
                    className="px-3 py-1.5 bg-emerald-605 hover:bg-emerald-700 text-white rounded text-xs font-semibold disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-805 pt-4 mt-6 flex gap-3">
              {selectedEnquiry.status !== 'SPAM' && (
                <button
                  type="button"
                  onClick={() => handleUpdateEnquiry('SPAM', '')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 py-2 rounded text-xs font-semibold transition-colors"
                >
                  <AlertTriangle size={14} /> Mark Spam
                </button>
              )}
              <button
                type="button"
                onClick={handleDeleteEnquiry}
                disabled={updating}
                className="flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors"
                title="Delete Enquiry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

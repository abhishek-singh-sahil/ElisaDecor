import { X } from 'lucide-react';
import AdminMedia from '../pages/AdminMedia';

export default function MediaPickerModal({ isOpen, onClose, onSelect, title = 'Select Media' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 transition-opacity"
      />

      <div className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-lg font-bold text-white font-serif">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-900">
          <AdminMedia selectMode={true} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}

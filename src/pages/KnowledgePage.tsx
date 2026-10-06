import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import { knowledgeSources as initialSources } from '@/data/mockData';
import { knowledgeStatusConfig, cn } from '@/lib/utils';
import type { KnowledgeType } from '@/types';
import {
  Upload, Globe, Plus, FileText, BookOpen, HelpCircle,
  Shield, Package, MoreVertical, Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const typeIcons: Record<KnowledgeType, LucideIcon> = {
  document: FileText,
  website: Globe,
  faq: HelpCircle,
  policy: Shield,
  product: Package,
};

const typeLabels: Record<KnowledgeType, string> = {
  document: 'PDF',
  website: 'Website',
  faq: 'FAQ',
  policy: 'Policy',
  product: 'Product',
};

export function KnowledgePage() {
  const [sources, setSources] = useState(initialSources);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [websiteOpen, setWebsiteOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addWebsite = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    setSources([...sources, {
      id: `knw-${Date.now()}`,
      name: newName,
      type: 'website',
      status: 'indexing',
      lastUpdated: 'Just now',
      size: '—',
      items: 0,
    }]);
    showToast('success', 'Website added', 'Indexing will begin shortly.');
    setWebsiteOpen(false);
    setNewName('');
    setNewUrl('');
  };

  const addKnowledge = () => {
    if (!newName.trim()) return;
    setSources([...sources, {
      id: `knw-${Date.now()}`,
      name: newName,
      type: 'document',
      status: 'indexing',
      lastUpdated: 'Just now',
      size: '—',
      items: 0,
    }]);
    showToast('success', 'Knowledge added', 'Indexing will begin shortly.');
    setKnowledgeOpen(false);
    setNewName('');
  };

  const filtered = sources.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Knowledge"
        subtitle="Give your AI employees the information they need to work effectively."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<Globe className="w-4 h-4" />} onClick={() => setWebsiteOpen(true)}>Add Website</Button>
            <Button variant="primary" size="md" icon={<Upload className="w-4 h-4" />} onClick={() => setUploadOpen(true)}>Upload</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2"><BookOpen className="w-4 h-4" /><span className="text-xs">Total sources</span></div>
          <p className="text-2xl font-bold text-slate-900">{sources.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2"><FileText className="w-4 h-4" /><span className="text-xs">Indexed items</span></div>
          <p className="text-2xl font-bold text-slate-900">{sources.reduce((sum, s) => sum + s.items, 0)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2"><Package className="w-4 h-4" /><span className="text-xs">Indexed</span></div>
          <p className="text-2xl font-bold text-emerald-600">{sources.filter((s) => s.status === 'indexed').length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2"><Globe className="w-4 h-4" /><span className="text-xs">Indexing</span></div>
          <p className="text-2xl font-bold text-blue-600">{sources.filter((s) => s.status === 'indexing').length}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search knowledge sources..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>

      {/* Sources table */}
      <Card className="overflow-hidden">
        <div className="hidden md:flex items-center px-4 py-2.5 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          <div className="flex-1">Name</div>
          <div className="w-24">Type</div>
          <div className="w-28">Status</div>
          <div className="w-24">Size</div>
          <div className="w-20">Items</div>
          <div className="w-28">Updated</div>
          <div className="w-8"></div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map((source) => {
            const Icon = typeIcons[source.type];
            const status = knowledgeStatusConfig[source.status];
            return (
              <div key={source.id} className="flex flex-col md:flex-row md:items-center px-4 py-3.5 hover:bg-slate-50 transition-colors gap-2 md:gap-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{source.name}</p>
                    <p className="text-xs text-slate-400 md:hidden">{typeLabels[source.type]} · {source.lastUpdated}</p>
                  </div>
                </div>
                <div className="hidden md:block w-24 text-xs text-slate-600">{typeLabels[source.type]}</div>
                <div className="hidden md:block w-28">
                  <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md', status.bg, status.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                    {status.label}
                  </span>
                </div>
                <div className="hidden md:block w-24 text-xs text-slate-500">{source.size}</div>
                <div className="hidden md:block w-20 text-xs text-slate-500">{source.items || '—'}</div>
                <div className="hidden md:block w-28 text-xs text-slate-400">{source.lastUpdated}</div>
                <button className="hidden md:flex w-8 text-slate-400 hover:text-slate-600" onClick={() => showToast('info', 'Source menu would open here')}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upload Modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" subtitle="Upload a file to add to your company knowledge base.">
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer">
            <Upload className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium text-slate-600">Drop file here or click to browse</p>
            <p className="text-xs mt-1">PDF, DOCX, TXT, MD up to 50MB</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={() => { setUploadOpen(false); addKnowledge(); }}>Upload & Index</Button>
          </div>
        </div>
      </Modal>

      {/* Add Website Modal */}
      <Modal
        open={websiteOpen}
        onClose={() => setWebsiteOpen(false)}
        title="Add Website"
        subtitle="Index a website so your AI employees can reference its content."
        footer={<><Button variant="ghost" onClick={() => setWebsiteOpen(false)}>Cancel</Button><Button onClick={addWebsite} disabled={!newName.trim() || !newUrl.trim()}>Add & Index</Button></>}
      >
        <div className="p-6 space-y-4">
          <Input label="Name" placeholder="Product Documentation" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input label="URL" placeholder="https://docs.example.com" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Flame,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  Target,
  FileText,
  Loader2,
} from 'lucide-react';
import {
  LEAD_STATUSES,
  PLATFORMS,
  AD_SPEND_RANGES,
  isHighValue,
} from '@/lib/validations/audit-lead';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  platforms: string;
  adSpend: string;
  currentRoas: string | null;
  challenge: string;
  industry: string | null;
  businessType: string;
  source: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  New: 'bg-violet-500/15 border-violet-400/40 text-violet-200',
  Contacted: 'bg-blue-500/15 border-blue-400/40 text-blue-200',
  'Audit Sent': 'bg-amber-400/15 border-amber-400/40 text-amber-200',
  Converted: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200',
  'Not Interested': 'bg-zinc-500/15 border-zinc-500/40 text-zinc-400',
};

export function AdminLeadsDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [adSpendFilter, setAdSpendFilter] = useState<string>('all');

  const [expanded, setExpanded] = useState<string | null>(null);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (platformFilter !== 'all') params.set('platform', platformFilter);
    if (adSpendFilter !== 'all') params.set('adSpend', adSpendFilter);
    params.set('page', String(page));

    try {
      const res = await fetch(`/api/audit-leads?${params.toString()}`);
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, platformFilter, adSpendFilter, page, router]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, platformFilter, adSpendFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/audit-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
      }
    } catch {
      // silent
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.refresh();
  };

  const exportCsv = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Company',
      'Phone',
      'Platforms',
      'Ad Spend',
      'Current ROAS',
      'Challenge',
      'Business Type',
      'Industry',
      'Source',
      'Status',
      'Notes',
      'Created At',
    ];
    const rows = leads.map((l) => [
      l.id,
      l.name,
      l.email,
      l.company || '',
      l.phone || '',
      l.platforms,
      l.adSpend,
      l.currentRoas || '',
      l.challenge,
      l.businessType,
      l.industry || '',
      l.source || '',
      l.status,
      (l.notes || '').replace(/\n/g, ' '),
      new Date(l.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((c) => {
            const s = String(c);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpl-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(
    () => ({
      total,
      highValue: leads.filter((l) => isHighValue(l.adSpend)).length,
      newLeads: leads.filter((l) => l.status === 'New').length,
    }),
    [leads, total]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-[rgba(10,6,16,0.7)] backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400">
              · Digital Point LLC · Admin ·
            </div>
            <h1 className="font-display text-xl font-bold text-white mt-0.5">
              Lead Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Leads" value={stats.total} />
          <StatCard
            label="New (page)"
            value={stats.newLeads}
            accent="violet"
          />
          <StatCard
            label="High Value (page)"
            value={stats.highValue}
            accent="amber"
            icon={<Flame className="w-4 h-4" />}
          />
          <StatCard label="Page Size" value={pageSize} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-400 transition-colors text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-400"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-400"
          >
            <option value="all">All platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={adSpendFilter}
            onChange={(e) => {
              setAdSpendFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-400"
          >
            <option value="all">All budgets</option>
            {AD_SPEND_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchLeads()}
            className="px-3 py-2.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2 text-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportCsv}
            disabled={leads.length === 0}
            className="px-3 py-2.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-colors flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-[rgba(10,6,16,0.6)] backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/10">
                <tr>
                  <th className="w-8"></th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Company
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Platforms
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Ad Spend
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Challenge
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && leads.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
                    </td>
                  </tr>
                )}
                {!loading && leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-16 text-center text-zinc-500 text-sm"
                    >
                      <FileText className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
                      No leads found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => {
                  const highValue = isHighValue(lead.adSpend);
                  const isExpanded = expanded === lead.id;
                  const platformList = lead.platforms.split(',').filter(Boolean);
                  return (
                    <Fragment key={lead.id}>
                      <tr
                        onClick={() =>
                          setExpanded(isExpanded ? null : lead.id)
                        }
                        className={`border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          highValue ? 'bg-amber-400/[0.02]' : ''
                        } ${
                          highValue
                            ? 'border-l-2 border-l-amber-400'
                            : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <td className="px-2 py-3 text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-zinc-500 mx-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-zinc-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {highValue && (
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span className="text-white font-medium text-sm">
                              {lead.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-violet-300 text-sm hover:text-violet-200 font-mono"
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-sm">
                          {lead.company || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {platformList.slice(0, 2).map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300"
                              >
                                {p}
                              </span>
                            ))}
                            {platformList.length > 2 && (
                              <span className="text-[10px] text-zinc-500">
                                +{platformList.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-mono font-semibold ${
                              highValue ? 'text-amber-400' : 'text-zinc-300'
                            }`}
                          >
                            {lead.adSpend}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs max-w-[180px] truncate">
                          {lead.challenge}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs font-mono whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value)
                            }
                            className={`px-2 py-1 rounded border text-[11px] font-medium focus:outline-none cursor-pointer ${
                              statusStyles[lead.status] ||
                              'bg-white/[0.02] border-white/10 text-zinc-400'
                            }`}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-zinc-900 text-white"
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-white/[0.01] border-b border-white/[0.06]">
                          <td colSpan={9} className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <DetailBlock
                                icon={<Mail className="w-3.5 h-3.5" />}
                                label="Contact"
                              >
                                <div className="text-white text-sm font-medium">
                                  {lead.name}
                                </div>
                                <div className="text-zinc-400 text-xs mt-1 font-mono">
                                  {lead.email}
                                </div>
                                {lead.phone && (
                                  <div className="text-zinc-400 text-xs mt-1 font-mono flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </div>
                                )}
                              </DetailBlock>

                              <DetailBlock
                                icon={<Building className="w-3.5 h-3.5" />}
                                label="Business"
                              >
                                <div className="text-white text-sm">
                                  {lead.businessType}
                                </div>
                                {lead.industry && (
                                  <div className="text-zinc-400 text-xs mt-1">
                                    Industry: {lead.industry}
                                  </div>
                                )}
                                {lead.source && (
                                  <div className="text-zinc-500 text-[11px] mt-1">
                                    Source: {lead.source}
                                  </div>
                                )}
                              </DetailBlock>

                              <DetailBlock
                                icon={<Target className="w-3.5 h-3.5" />}
                                label="Campaign"
                              >
                                <div className="text-white text-sm">
                                  {lead.challenge}
                                </div>
                                {lead.currentRoas && (
                                  <div className="text-zinc-400 text-xs mt-1">
                                    Current ROAS:{' '}
                                    <span className="text-amber-400 font-mono">
                                      {lead.currentRoas}
                                    </span>
                                  </div>
                                )}
                                <div className="text-zinc-500 text-[11px] mt-1 font-mono">
                                  Platforms: {lead.platforms}
                                </div>
                              </DetailBlock>

                              {lead.notes && (
                                <div className="md:col-span-3 mt-2 pt-4 border-t border-white/[0.06]">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                                    <FileText className="w-3 h-3" />
                                    Notes
                                  </div>
                                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {lead.notes}
                                  </div>
                                </div>
                              )}

                              <div className="md:col-span-3 text-[10px] font-mono text-zinc-600 flex items-center gap-4 pt-3 border-t border-white/[0.06]">
                                <span>ID: {lead.id}</span>
                                <span>
                                  Created:{' '}
                                  {new Date(lead.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs font-mono text-zinc-500">
              Page {page} of {totalPages} · {total} total
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number | string;
  accent?: 'violet' | 'amber';
  icon?: React.ReactNode;
}) {
  const accentColor =
    accent === 'violet'
      ? 'text-violet-300'
      : accent === 'amber'
      ? 'text-amber-400'
      : 'text-white';

  return (
    <div className="p-5 rounded-xl bg-[rgba(10,6,16,0.6)] border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          {label}
        </div>
        {icon && <div className="text-amber-400">{icon}</div>}
      </div>
      <div className={`font-display text-3xl font-bold ${accentColor} tabular-nums`}>
        {value}
      </div>
    </div>
  );
}

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

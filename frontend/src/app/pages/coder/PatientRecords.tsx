import React, { useState, useMemo } from 'react';
import { useData, PatientRecord } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Upload, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const PatientRecords = () => {
  const { records, loading, error, refreshRecords } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusColor = (status: PatientRecord['status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400';
      case 'PENDING': return 'bg-amber-500/20 text-amber-400';
      case 'IN_REVIEW': return 'bg-blue-500/20 text-blue-400';
      case 'FLAGGED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    
    const query = searchQuery.toLowerCase();
    return records.filter(record => 
      record.patientName.toLowerCase().includes(query) ||
      record.mrn.toLowerCase().includes(query) ||
      record.department.toLowerCase().includes(query) ||
      record.provider.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRecords();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 overflow-hidden">
      {/* Header with Search and Actions */}
      <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by Patient Name or MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white hover:bg-teal-500 rounded-lg text-sm font-medium shadow-lg shadow-teal-900/20 transition-colors">
            <Upload size={16} />
            Upload Records
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/30 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">Failed to load patient records</p>
            <p className="text-xs text-red-500/70">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-500 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-teal-500 mb-4" size={40} />
          <p className="text-sm text-slate-400">Loading patient records from database...</p>
        </div>
      )}

      {/* Table Content */}
      {!loading && !error && (
        <>
          {/* Results Count */}
          <div className="px-6 py-3 bg-slate-700/30 border-b border-slate-700/50">
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{filteredRecords.length}</span> of{' '}
              <span className="font-semibold text-white">{records.length}</span> records
              {searchQuery && (
                <span className="ml-2 text-slate-500">
                  (filtered by "{searchQuery}")
                </span>
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-700/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">MRN (AN)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Date of Service</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Provider</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Codes</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Search size={48} className="mb-3 text-slate-600" />
                        <p className="text-sm font-medium text-slate-400">No records found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {searchQuery ? 'Try adjusting your search query' : 'No patient records available'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{record.patientName}</div>
                        <div className="text-xs text-slate-500">{record.department}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">{record.mrn}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {format(new Date(record.dateOfService), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{record.provider}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                            {record.codes.length} codes
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/coder/coding/${record.id}`)}
                          className="flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          Open
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

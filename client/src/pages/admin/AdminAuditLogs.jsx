import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../api/adminApi';
import { ClipboardList } from 'lucide-react';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const data = await getAuditLogs(page);
                setLogs(data.logs);
                setTotalPages(data.pages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching audit logs", error);
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Timestamp</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Admin</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Action</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Entity</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{log.admin?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{log.admin?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {log.entityType} <br /> <span className="text-xs text-slate-400 font-mono">{log.entityId}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                                    {JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No logs found.</div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-slate-600">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminAuditLogs;

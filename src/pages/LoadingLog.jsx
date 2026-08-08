import LoadingLogRow from "../components/LoadingLogRow";

const LoadingLog = ({ loadingLogs }) => {
    console.log(loadingLogs);
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4">
            {/* Header Module */}
            <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg shadow-2xs">
                <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>📊</span> Loading Efficiency
                    </h2>
                    {/* <p className="text-xs text-slate-400 mt-0.5">
                        Historical workflow table tracking truck assignments and
                        precise timestamp benchmarks.
                    </p> */}
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-xs font-mono font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        Total Rows:{" "}
                        <span className="text-slate-900">
                            {loadingLogs.length}
                        </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-100 bg-emerald-600 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        {/* <button onClick={handleExportToExcel}>
                            Export as Excel
                        </button> */}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-100 bg-red-600 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        {/* <button onClick={hanldleReset}>Reset</button> */}
                    </div>
                </div>
            </div>

            {/* Excel Grid Frame Wrapper */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-thin">
                    <table className="w-full table-auto border-collapse text-left">
                        {/* Spreadsheet Header Track */}
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 divide-x divide-slate-200 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wide select-none">
                                <th className="py-2.5 px-3 w-14 text-center bg-slate-100/80">
                                    No.
                                </th>
                                <th className="py-2.5 px-4 min-w-[140px]">
                                    Truck Number
                                </th>
                                <th className="py-2.5 px-4 min-w-[110px]">
                                    Truck Type
                                </th>
                                <th className="py-2.5 px-4 min-w-[180px]">
                                    Distributor
                                </th>
                                <th className="py-2.5 px-4 min-w-[180px]">
                                    Destination
                                </th>
                                <th className="py-2.5 px-4 min-w-[140px]">
                                    Start Time
                                </th>
                                <th className="py-2.5 px-4 min-w-[140px]">
                                    Finish Time
                                </th>
                                <th className="py-2.5 px-4 min-w-[120px]">
                                    Duration
                                </th>
                                <th className="py-2.5 px-4 min-w-[120px] ">
                                    Loading Bay
                                </th>
                            </tr>
                        </thead>

                        {/* Spreadsheet Body Rows */}
                        <tbody className="divide-y divide-slate-200 text-xs font-mono text-slate-700">
                            {loadingLogs.length > 0 ? (
                                loadingLogs.map((log, index) => {
                                    return (
                                        <LoadingLogRow
                                            key={log.id}
                                            log={log}
                                            index={index + 1}
                                        />
                                    );
                                })
                            ) : (
                                /* Clean Table Empty Response State Triggers */
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-slate-400 italic font-sans font-medium">
                                        No logistics dataset records found in
                                        current matrix registry.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoadingLog;

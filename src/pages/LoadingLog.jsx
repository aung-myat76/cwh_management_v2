import LoadingLogRow from "../components/LoadingLogRow";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import calculateDuration from "../lib/calculateDuration";
import { useEffect, useRef, useState } from "react";
// import { supabase } from "../superbaseClient";
import getByDate from "../lib/getByDate";
import { databases } from "../lib/appwriteClient";
import { Query } from "appwrite";

const LoadingLog = ({ logs, trucks }) => {
    const [loadingLogs, setLoadingLogs] = useState(logs);
    // console.log(logs);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoadingLogs(logs);
    }, [logs]);

    const dateRef = useRef();

    const fetchByDate = async (date) => {
        // console.log(date);
        try {
            setLoading(true);
            const res = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DB_ID,
                "loading-logs",
                [
                    Query.greaterThanEqual(
                        "$createdAt",
                        getByDate(new Date(date)).startOfDay
                    ),
                    Query.lessThanEqual(
                        "$createdAt",
                        getByDate(new Date(date)).endOfDay
                    ),
                    Query.limit(100)
                ]
            );
            // const res = await supabase
            //     .from("loading-log")
            //     .select("*")
            //     .gte("created_at", getByDate(date).startOfDay)
            //     .lt("created_at", getByDate(date).endOfDay);
            // setLoadingLogs(res.data);
            // console.log(res);
            setLoadingLogs(res.documents);
            // console.log("get by date");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const updateLog = (id, updatedLog) => {
        setLoadingLogs((preLogs) => {
            const updatedLogs = [...preLogs];

            const logIndex = updatedLogs.findIndex((l) => l.$id === id);
            const selectedLog = updatedLogs[logIndex];
            // console.log(updatedLog, selectedLog, updatedLogs);
            selectedLog.truck_no = updatedLog.truck_no;
            selectedLog.type = updatedLog.type;
            selectedLog.distributor = updatedLog.distributor;
            selectedLog.wh_or_sale = updatedLog.wh_or_sale;
            selectedLog.remark = updatedLog.remark;

            return updatedLogs;
        });
    };

    const deleteLog = (id) => {
        setLoadingLogs((preLogs) => {
            const updatedLogs = [...preLogs];
            return updatedLogs.filter((l) => l.$id !== id);
        });
    };

    // console.log(loadingLogs);

    const handleExportToExcel = async () => {
        if (!confirm("Are you sure to export as an Excel file?")) return;
        if (loadingLogs.length === 0)
            return alert("No dataset records available to export.");

        // 1. Map dataset cleanly
        const spreadsheetRows = loadingLogs.map((log, index) => ({
            "No.": index + 1,
            "Truck Number": log.truck_no?.toUpperCase() || "—",
            "Truck Type": log.type ? `${log.type}` : "N/A",
            Distributor: log.distributor || "—",
            "Start Time": log.start_time
                ? new Date(log.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                  })
                : null,
            "Finish Time": log.finish_time
                ? new Date(log.finish_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                  })
                : "Pending",
            Duration: calculateDuration(log.start_time, log.finish_time),
            "Loading Bay": log.loading_bay
        }));

        // 2. Create Workbook & Worksheet
        const workbook = new ExcelJS.Workbook();
        const date = dateRef.current.value;
        const now = new Date(date);
        const worksheet = workbook.addWorksheet(`${now.getDate()}`);

        // ----------------------------------------------------
        // ADD MAIN HEADER (Row 1 & Row 2 for extra spacing/height)
        // ----------------------------------------------------
        const headers = Object.keys(spreadsheetRows[0]);
        const totalColumns = headers.length; // 8 columns (A to H)

        // Merge cells across all columns (A1 to H1)
        worksheet.mergeCells(1, 1, 1, totalColumns);

        const mainHeaderCell = worksheet.getCell("A1");
        mainHeaderCell.value = `Loading Efficiency Report - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

        // Style the Main Title
        mainHeaderCell.font = {
            name: "Arial",
            size: 14,
            bold: true,
            color: { argb: "000000" } // White text
        };
        mainHeaderCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" } // Darker Navy Blue (Tailwind blue-900)
        };
        mainHeaderCell.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        // Set height for Title Row
        worksheet.getRow(1).height = 35;

        // 3. Define Table Columns & Add Column Headers at Row 2
        worksheet.getRow(2).values = headers;
        worksheet.getRow(2).height = 24;

        // Configure column keys & widths
        worksheet.columns = headers.map((header) => ({
            key: header,
            width: 20
        }));

        // 4. Add Data Rows (Starts from Row 3 automatically)
        spreadsheetRows.forEach((rowData) => {
            worksheet.addRow(rowData);
        });

        // 5. Apply Formatting based on Row Numbers
        worksheet.eachRow((row, rowNumber) => {
            // Skip Title Row formatting loop (already styled above)
            if (rowNumber === 1) return;

            row.eachCell((cell) => {
                // Center text across every single cell
                cell.alignment = { horizontal: "center", vertical: "middle" };

                // Column Header Row Styling (Row 2)
                if (rowNumber === 2) {
                    cell.font = {
                        name: "Arial",
                        bold: true,
                        color: { argb: "FFFFFF" }, // White Text
                        size: 11
                    };
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "1E40AF" } // Industrial Blue (Tailwind blue-800)
                    };
                    cell.border = {
                        top: { style: "thin", color: { argb: "000000" } },
                        bottom: { style: "medium", color: { argb: "000000" } },
                        left: { style: "thin", color: { argb: "000000" } },
                        right: { style: "thin", color: { argb: "000000" } }
                    };
                }
                // Data Rows Styling (Row 3+)
                else {
                    cell.font = { name: "Arial", size: 10 };
                    cell.border = {
                        top: { style: "thin", color: { argb: "E5E7EB" } },
                        bottom: { style: "thin", color: { argb: "E5E7EB" } },
                        left: { style: "thin", color: { argb: "E5E7EB" } },
                        right: { style: "thin", color: { argb: "E5E7EB" } }
                    };
                }
            });
        });

        // 6. Generate Buffer & Download File

        const timestamp = new Date(date).toISOString().split("T")[0];
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(blob, `${timestamp}_Loading_Efficiency.xlsx`);
    };
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4">
            {/* Header Module */}
            <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg shadow-2xs">
                <div className="flex gap-2 items-center mb-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>📊</span> Loading Efficiency
                    </h2>
                    <div className="text-xs font-mono font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        <input
                            ref={dateRef}
                            onChange={(e) => fetchByDate(e.target.value)}
                            type="date"
                            defaultValue={
                                new Date().toISOString().split("T")[0]
                            }
                        />
                    </div>
                    {/* <p className="text-xs text-slate-400 mt-0.5">
                        Historical workflow table tracking truck assignments and
                        precise timestamp benchmarks.
                    </p> */}
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-xs font-mono font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        Total Rows:{" "}
                        <span className="text-slate-900">
                            {!loading && loadingLogs && loadingLogs.length}
                        </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-100 bg-emerald-600 border border-slate-200 rounded px-2.5 py-1.5 self-start sm:self-auto shrink-0">
                        <button onClick={handleExportToExcel}>
                            Export as Excel
                        </button>
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
                                <th className="py-2.5 px-4 min-w-[120px] ">
                                    Remark
                                </th>
                                <th className="py-2.5 px-4 min-w-[120px] ">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Spreadsheet Body Rows */}
                        <tbody className="divide-y divide-slate-200 text-xs font-mono text-slate-700">
                            {!loading &&
                            loadingLogs &&
                            loadingLogs.length > 0 ? (
                                loadingLogs.map((log, index) => {
                                    return (
                                        <LoadingLogRow
                                            trucks={trucks}
                                            date={
                                                dateRef.current
                                                    ? dateRef.current.value
                                                    : new Date()
                                                          .toISOString()
                                                          .split("T")[0]
                                            }
                                            key={log.$id}
                                            id={log.$id}
                                            log={log}
                                            index={index}
                                            updateLog={updateLog}
                                            deleteLog={deleteLog}
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

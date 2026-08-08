import { useRef, useState } from "react";

const LoadingLogRow = ({ log, index }) => {
    // const { loadingLogs } = useAppState();
    // const dispatch = useAppDispatch();
    // const [isEditLoading, setIsEditLoading] = useState(false);
    // const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    // const isComplete = !!log.finishTime;

    const truckNoRef = useRef();
    const truckTypeRef = useRef();
    const distributorRef = useRef();
    const destinationRef = useRef();
    const startTimeRef = useRef();
    const finishTimeRef = useRef();

    // const hanldeEditLog = (log: LoadingLogType): void => {
    //     const updatedLog = loadingLogs.find((l) => l._id === log._id);
    //     updatedLog.truckNo = truckNoRef.current?.value || updatedLog.truckNo;
    //     updatedLog!.truckType =
    //         truckTypeRef.current?.value || updatedLog!.truckType;
    //     updatedLog!.distributor =
    //         distributorRef.current?.value || updatedLog!.distributor;
    //     updatedLog!.startTime =
    //         new Date().setHours(
    //             +startTimeRef.current!.value.split(":")[0],
    //             +startTimeRef.current!.value.split(":")[1]
    //         ) || updatedLog!.startTime;
    //     updatedLog!.finishTime =
    //         new Date().setHours(
    //             +finishTimeRef.current!.value.split(":")[0],
    //             +finishTimeRef.current!.value.split(":")[1]
    //         ) || updatedLog!.finishTime;
    //     if (!updatedLog) return;
    //     setIsEditLoading(true);
    //     socket.emit("c:log:updated", updatedLog, (res) => {
    //         if (res.success && res.data) {
    //             dispatch({
    //                 type: "UPDATE_LOADINGLOG",
    //                 payload: {
    //                     updatedLoadingLog: res.data
    //                 }
    //             });
    //         }
    //         setIsEditLoading(false);
    //     });
    // };

    // const handleDeleteLog = (logId: string) => {
    //     setIsDeleteLoading(true);
    //     socket.emit("c:log:deleted", logId, (res) => {
    //         if (res.success && res.data) {
    //             dispatch({
    //                 type: "DELETE_LOADINGLOG",
    //                 payload: { loadingLogId: res.data }
    //             });
    //             dispatch({
    //                 type: "DELETE_TRUCKCONDITION",
    //                 payload: {
    //                     logId: res.data
    //                 }
    //             });
    //         } else if (!res.success) {
    //             console.log(res.error);
    //         }
    //         setIsDeleteLoading(false);
    //     });
    // };

    return (
        <tr
            key={log.id}
            className="divide-x divide-slate-200 hover:bg-slate-50/70 transition-colors">
            {/* Row Index Indicator Counter */}
            <td className="py-2 px-3 font-bold text-center text-slate-400 bg-slate-50/50 select-none">
                {index}
            </td>

            {/* Truck Number Data */}
            <td className="py-2 px-4 font-bold text-slate-900 tracking-wide uppercase">
                <input
                    ref={truckNoRef}
                    onChange={(e) =>
                        (truckNoRef.current.value = e.target.value)
                    }
                    defaultValue={log.truck_no || "-"}
                    type="text"
                />
            </td>

            {/* Truck Type Classification */}
            <td className="py-2 px-4 text-slate-600">
                <input
                    ref={truckTypeRef}
                    onChange={(e) =>
                        (truckTypeRef.current.value = e.target.value)
                    }
                    defaultValue={log.type ? `${log.type}` : "N/A"}
                    type="text"
                />
            </td>

            {/* Distributor / Cargo Handler Info */}
            <td className="py-2 px-4 text-slate-600 truncate max-w-[220px] font-sans font-medium">
                <input
                    ref={distributorRef}
                    onChange={(e) =>
                        (distributorRef.current.value = e.target.value)
                    }
                    defaultValue={log.distributor || "—"}
                    type="text"
                />
            </td>
            <td className="py-2 px-4 text-slate-600 truncate max-w-[220px] font-sans font-medium">
                <input
                    ref={destinationRef}
                    onChange={(e) =>
                        (destinationRef.current.value = e.target.value)
                    }
                    defaultValue={log.wh_or_sale || "—"}
                    type="text"
                />
            </td>

            {/* Clock-In Log Timestamp */}
            <td className="py-2 px-4 text-slate-500 whitespace-nowrap">
                <input
                    ref={startTimeRef}
                    onChange={(e) =>
                        (startTimeRef.current.value = e.target.value)
                    }
                    defaultValue={new Date(log.start_time)
                        .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        })
                        .toString()}
                    type="time"
                />
            </td>

            {/* Clock-Out Log Timestamp */}
            <td className="py-2 px-4 text-slate-500 whitespace-nowrap">
                <input
                    ref={finishTimeRef}
                    onChange={(e) =>
                        (finishTimeRef.current.value = e.target?.value)
                    }
                    defaultValue={
                        log.finish_time
                            ? new Date(log.finish_time)
                                  .toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false
                                  })
                                  .toString()
                            : "Pending..."
                    }
                    type="time"
                />
            </td>
            <td className="py-2 px-3 font-bold text-center text-slate-400 bg-slate-50/50 select-none">
                {log.loading_bay}
            </td>

            {/* Calculated Total Operational Running Duration */}
            {/* <td
                className={`py-2 px-4 font-bold tracking-tight whitespace-nowrap ${isComplete ? "text-slate-800" : "text-red-500 animate-pulse"}`}>
                {calculateDuration(log.start_time, log.finish_time)}
            </td> */}
            {/* <td
                className={`flex gap-2 items-center py-2 px-4 font-bold tracking-tight whitespace-nowrap `}>
                <button
                    disabled={isEditLoading}
                    className="px-2 py-1 rounded-sm bg-blue-800 text-white"
                    onClick={() => hanldeEditLog(log)}>
                    {isEditLoading ? "Update..." : "Update"}
                </button>
                <button
                    disabled={isDeleteLoading}
                    className="px-2 py-1 rounded-sm bg-red-800 text-white"
                    onClick={() => handleDeleteLog(log._id)}>
                    {isDeleteLoading ? "Delete..." : "Delete"}
                </button>
            </td> */}

            {/* Compact Excel Status Pill Box */}
        </tr>
    );
};

export default LoadingLogRow;

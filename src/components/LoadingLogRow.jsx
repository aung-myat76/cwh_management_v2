import { useRef, useState } from "react";
import calculateDuration from "../lib/calculateDuration";
import { supabase } from "../superbaseClient";

const LoadingLogRow = ({ log, index, updateLog, deleteLog }) => {
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
    const remarkRef = useRef();

    const [isEditLoading, setIsEditLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const hanldeEditLog = async () => {
        // const updatedLog = loadingLogs.find((l) => l._id === log._id);
        const updatedLog = { ...log };
        updatedLog.truck_no = truckNoRef.current?.value || updatedLog.truck_no;
        updatedLog.type = truckTypeRef.current?.value || updatedLog.type;
        updatedLog.distributor =
            distributorRef.current?.value || updatedLog.distributor;
        updatedLog.wh_or_sale =
            destinationRef.current?.value || updatedLog.wh_or_sale;
        updatedLog.start_time =
            new Date().setHours(
                +startTimeRef.current.value.split(":")[0],
                +startTimeRef.current.value.split(":")[1]
            ) || updatedLog.start_time;
        updatedLog.finish_time =
            new Date().setHours(
                +finishTimeRef.current.value.split(":")[0],
                +finishTimeRef.current.value.split(":")[1]
            ) || updatedLog.finish_time;
        updatedLog.remark = remarkRef.current?.value || updatedLog.remark;
        updateLog(updatedLog.id, updatedLog);
        setIsEditLoading(true);
        console.log(updatedLog);
        const res = await supabase
            .from("loading-log")
            .update({ ...updatedLog })
            .eq("id", updatedLog.id);
        setIsEditLoading(false);
    };

    const handleDeleteLog = async () => {
        if (confirm(`Are you sure to delete truck no - ${log.truck_no} ?`)) {
            setIsDeleteLoading(true);
            deleteLog(log.id);
            const res = await supabase
                .from("loading-log")
                .delete()
                .eq("id", log.id);
            setIsDeleteLoading(false);
        }
    };

    return (
        <tr
            key={log.id}
            className="divide-x divide-slate-200 hover:bg-slate-50/70 transition-colors">
            {/* Row Index Indicator Counter */}
            <td className="py-2 px-3 font-bold text-center text-slate-400 bg-slate-50/50 select-none">
                {index + 1}
            </td>

            {/* Truck Number Data */}
            <td className="py-2 px-4 font-bold text-slate-900 tracking-wide uppercase">
                <input
                    ref={truckNoRef}
                    onChange={(e) =>
                        (truckNoRef.current.value =
                            e.target.value.toUpperCase())
                    }
                    defaultValue={log.truck_no.toUpperCase() || "-"}
                    type="text"
                />
            </td>

            {/* Truck Type Classification */}
            <td className="py-2 px-4 text-slate-600">
                {/* <input
                    ref={truckTypeRef}
                    onChange={(e) =>
                        (truckTypeRef.current.value = e.target.value)
                    }
                    defaultValue={log.type ? `${log.type}` : "N/A"}
                    type="text"
                /> */}
                <select
                    name="types"
                    ref={truckTypeRef}
                    defaultValue={log.type}
                    onChange={(e) =>
                        (truckTypeRef.current.value = e.target.value)
                    }
                    placeholder={!log.type ? "N/A" : log.type}
                    // className="p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                >
                    <option value={""}>Type</option>
                    <option value={"6"}>6</option>
                    <option value={"10"}>10</option>
                    <option value={"12"}>12</option>
                    <option value={"20"}>20</option>
                    <option value={"22"}>22</option>
                </select>
            </td>

            {/* Distributor / Cargo Handler Info */}
            <td className="py-2 px-4 text-slate-600 truncate max-w-[220px] font-sans font-medium">
                {/* <input
                    ref={distributorRef}
                    onChange={(e) =>
                        (distributorRef.current.value = e.target.value)
                    }
                    defaultValue={log.distributor || "—"}
                    type="text"
                /> */}
                <select
                    name="distributors"
                    ref={distributorRef}
                    onChange={(e) =>
                        (distributorRef.current.value = e.target.value)
                    }
                    defaultValue={log.distributor}
                    placeholder={!log.distributor ? "-" : log.distributor}
                    // className="w-1/2 p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                >
                    <option value={""}>Distributor</option>
                    <option value={"MBL"}>MBL</option>
                    <option value={"Nehru"}>Nehru</option>
                    <option value={"TPN"}>TPN</option>
                    <option value={"STC"}>STC</option>
                    <option value={"KG"}>KG</option>
                    <option value={"KKA"}>KKA</option>
                    <option value={"BDL"}>BDL</option>
                    <option value={"YCO"}>YCO</option>
                    <option value={"K-Kan"}>K-Kan</option>
                    <option value={"NMMK"}>NMMK</option>
                    <option value={"T-Party"}>T-Party</option>
                    <option value={"N-Star"}>N-Star</option>
                    <option value={"Other"}>Other</option>
                </select>
            </td>
            <td className="py-2 px-4 text-slate-600 truncate max-w-[220px] font-sans font-medium">
                {/* <input
                    ref={destinationRef}
                    onChange={(e) =>
                        (destinationRef.current.value = e.target.value)
                    }
                    defaultValue={log.wh_or_sale || "—"}
                    type="text"
                /> */}
                <select
                    name="wh_or_sale"
                    ref={destinationRef}
                    onChange={(e) =>
                        (destinationRef.current.value = e.target.value)
                    }
                    defaultValue={log.wh_or_sale}
                    placeholder={!log.wh_or_sale ? "-" : log.wh_or_sale}
                    // className="w-1/2 p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                >
                    <option value={""}>WH/Sale</option>
                    <option value={"WH-WH"}>WH-WH</option>
                    <option value={"Sale"}>Sale</option>
                </select>
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
                {/* {log.loading_bay} */}
                {calculateDuration(log.start_time, log.finish_time)}
            </td>
            <td className="py-2 px-3 font-bold text-center text-slate-400 bg-slate-50/50 select-none">
                {log.loading_bay}
            </td>
            <td className="py-2 px-3 font-bold text-center text-slate-400 bg-slate-50/50 select-none">
                <input
                    ref={remarkRef}
                    onChange={(e) =>
                        (remarkRef.current.value = e.target.value.toUpperCase())
                    }
                    defaultValue={log.remark || ""}
                    type="text"
                />
            </td>

            {/* Calculated Total Operational Running Duration */}
            {/* <td
                className={`py-2 px-4 font-bold tracking-tight whitespace-nowrap ${isComplete ? "text-slate-800" : "text-red-500 animate-pulse"}`}>
                {calculateDuration(log.start_time, log.finish_time)}
            </td> */}
            <td
                className={`flex gap-2 items-center py-2 px-4 font-bold tracking-tight whitespace-nowrap `}>
                <button
                    disabled={isEditLoading}
                    className="px-2 py-1 rounded-sm bg-blue-800 text-white"
                    onClick={() => hanldeEditLog()}>
                    {isEditLoading ? "Updating..." : "Update"}
                </button>
                <button
                    disabled={isDeleteLoading}
                    className="px-2 py-1 rounded-sm bg-red-800 text-white"
                    onClick={() => handleDeleteLog()}>
                    {isDeleteLoading ? "Deleting..." : "Delete"}
                </button>
            </td>

            {/* Compact Excel Status Pill Box */}
        </tr>
    );
};

export default LoadingLogRow;

import { useCallback, useEffect, useState } from "react";
// import { collectionId, databases, client, dbId } from "./lib/appwrite";
import "./App.css";
// import TruckList from "./components/TruckList";
// import cn from "./lib/cn";
// import ConfirmModal from "./components/ConfirmModal";
import { supabase } from "./superbaseClient";
import Packaging from "./pages/Packaging";
import MainLayout from "./layout/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";
import LoadingLog from "./pages/LoadingLog";

// const getShift = () => {
//     const time = now.getHours();

//     if (time >= 6 && time <= 18) {
//         return "Morning Shift";
//     } else {
//         return "Night Shift";
//     }
// };

const App = () => {
    const [trucks, setTrucks] = useState([]);
    const [lines, setLines] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // const [isOpen, setIsOpen] = useState(false);

    // const onOpen = () => setIsOpen(true);
    // const onClose = () => setIsOpen(false);

    const updateCondition = useCallback(async (id, newState) => {
        // check log id
        console.log(newState);
        // if it doesn't have log id create log
        // if it has update truck with that log id
        if (!newState.logId && newState.condition === "Start") {
            console.log("not exist");
            const newLog = await supabase
                .from("loading-log")
                .insert([
                    {
                        truck_no: newState.truck_no,
                        type: newState.type,
                        loading_bay: newState.loading_bay,
                        distributor: newState.distributor,
                        wh_or_sale: newState.wh_or_sale,
                        start_time: new Date().getTime(),
                        finish_time: null,
                        remark: null
                    }
                ])
                .select();
            if (newLog.error) {
                return;
            }

            console.log(newLog.data);
            setTrucks((preTrucks) => {
                const updatedTrucks = [...preTrucks];
                const updateTruckIndex = updatedTrucks.findIndex(
                    (t) => t.id === id
                );
                const updatedTruck = updatedTrucks[updateTruckIndex];
                updatedTruck.condition = newState.condition;
                updatedTruck["truck_no"] = newState["truck_no"];
                updatedTruck["type"] = newState["type"];
                updatedTruck["wh_or_sale"] = newState["wh_or_sale"];
                updatedTruck["distributor"] = newState["distributor"];
                updatedTruck["logId"] = newLog.data[0].id;
                return updatedTrucks;
            });
            setLogs((preLogs) => {
                const updatedLogs = preLogs.length > 0 ? [...preLogs] : [];
                console.log(newLog.data);
                updatedLogs.push(newLog.data[0]);
                return updatedLogs;
            });

            return await supabase
                .from("trucks")
                .update({ ...newState, logId: newLog.data[0].id })
                .eq("id", id);
        } else if (
            newState.logId &&
            (newState.condition === "Free" || newState.condition === "Blocked")
        ) {
            console.log("exist");
            const { data } = await supabase
                .from("loading-log")
                .select()
                .eq("id", newState.logId);
            const updatedLog = await supabase
                .from("loading-log")
                .update({
                    ...data[0],
                    finish_time: new Date().getTime()
                })
                .eq("id", newState.logId);

            const resetTruck = {
                condition: "Free",
                truck_no: null,
                wh_or_sale: null,
                type: null,
                distributor: null,
                logId: null
            };

            setTrucks((preTrucks) => {
                const updatedTrucks = [...preTrucks];
                const updateTruckIndex = updatedTrucks.findIndex(
                    (t) => t.id === id
                );
                const updatedTruck = updatedTrucks[updateTruckIndex];
                updatedTruck.condition = "Free";
                updatedTruck["truck_no"] = null;
                updatedTruck["type"] = null;
                updatedTruck["wh_or_sale"] = null;
                updatedTruck["distributor"] = null;
                updatedTruck["logId"] = null;
                return updatedTrucks;
            });

            setLogs((preLogs) => {
                const updatedLogs = preLogs.length > 0 ? [...preLogs] : [];
                const selectedLog = updatedLogs.find(
                    (l) => l.id === newState.logId
                );
                console.log(selectedLog);
                if (selectedLog) {
                    selectedLog.finish_time = updatedLog.finish_time;
                }
                return updatedLogs;
            });
            return await supabase
                .from("trucks")
                .update({ ...resetTruck })
                .eq("id", id);
        }

        // update the truck

        // add loading log
        // console.log(newState);

        // return await databases.updateDocument(dbId, collectionId, id, newState);
    }, []);

    const updateLine = useCallback(async (id, newState) => {
        setLines((preLines) => {
            const updatedLine = [...preLines];
            const updateLineIndex = updatedLine.findIndex((l) => l.id === id);
            updatedLine[updateLineIndex].item = newState.item;
            updatedLine[updateLineIndex].status = newState.status;
            updatedLine[updateLineIndex].remark = newState.remark;

            return updatedLine;
        });
        // return await databases.updateDocument(dbId, collectionId, id, newState);
        return await supabase.from("packaging").update(newState).eq("id", id);
    }, []);

    const getLastUpdatedTime = () => {
        const TTimes = trucks.map((t) => new Date(t.updated_at).getTime());
        const LTimes = lines.map((l) => new Date(l.updated_at).getTime());
        const lastTime = Math.max(...TTimes, ...LTimes);

        const date = new Date(lastTime);
        const dateString = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",

            hour12: false
        });

        return dateString;
    };

    // useEffect(() => {
    //     const getData = async () => {
    //         // const data = await databases.listDocuments(dbId, collectionId);
    //         const { data } = await supabase
    //             .from("trucks")
    //             .select("*")
    //             .order("id", { ascending: true });
    //         // console.log(data);
    //         setTrucks(data);
    //         // setFilterTrucks(data.documents);
    //     };
    //     getData();

    //     // const unsubscribe = client.subscribe(
    //     //     `databases.${dbId}.collections.${collectionId}.documents`,
    //     //     (response) => {
    //     //         if (
    //     //             response.events.includes(
    //     //                 "databases.*.collections.*.documents.*.update"
    //     //             )
    //     //         ) {
    //     //             setTrucks((prev) =>
    //     //                 prev.map((t) =>
    //     //                     t.$id === response.payload.$id
    //     //                         ? response.payload
    //     //                         : t
    //     //                 )
    //     //             );
    //     //         }
    //     //     }
    //     // );
    //     const unsubscribe = supabase
    //         .channel("loading-channel")
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "*",
    //                 schema: "public",
    //                 table: "trucks"
    //             },
    //             (payload) => {
    //                 if (payload.eventType === "UPDATE") {
    //                     setTrucks((currentTrucks) =>
    //                         currentTrucks.map((t) =>
    //                             t.id === payload.new.id ? payload.new : t
    //                         )
    //                     );
    //                 }
    //             }
    //         )
    //         .subscribe();

    //     return () => supabase.removeChannel(unsubscribe);
    // }, []);
    useEffect(() => {
        const getData = async () => {
            // const data = await databases.listDocuments(dbId, collectionId);

            const [truckRes, PackagingRes, LogRes] = await Promise.all([
                supabase
                    .from("trucks")
                    .select("*")
                    .order("id", { ascending: true }),
                supabase
                    .from("packaging")
                    .select("*")
                    .order("id", { ascending: true }),
                supabase
                    .from("loading-log")
                    .select("*")
                    .order("id", { ascending: true })
            ]);
            if (truckRes.data) setTrucks(truckRes.data);
            if (PackagingRes.data) setLines(PackagingRes.data);
            if (LogRes.data) setLogs(LogRes.data);
            // setFilterTrucks(data.documents);
        };
        getData();

        // const unsubscribe = client.subscribe(
        //     `databases.${dbId}.collections.${collectionId}.documents`,
        //     (response) => {
        //         if (
        //             response.events.includes(
        //                 "databases.*.collections.*.documents.*.update"
        //             )
        //         ) {
        //             setTrucks((prev) =>
        //                 prev.map((t) =>
        //                     t.$id === response.payload.$id
        //                         ? response.payload
        //                         : t
        //                 )
        //             );
        //         }
        //     }
        // );
        const unsubscribe = supabase
            .channel("all-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "trucks"
                },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setTrucks((currentTrucks) =>
                            currentTrucks.map((t) =>
                                t.id === payload.new.id ? payload.new : t
                            )
                        );
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "packaging" },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setLines((current) =>
                            current.map((p) =>
                                p.id === payload.new.id ? payload.new : p
                            )
                        );
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "loading-log" },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setLogs((current) => [...current, payload.new]);
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "loading-log" },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setLogs((current) =>
                            current.map((l) =>
                                l.id === payload.new.id ? payload.new : l
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(unsubscribe);
    }, []);

    const updateLog = (id, updatedLog) => {
        setLogs((preLogs) => {
            const updatedLogs = [...preLogs];
            const logIndex = updatedLogs.findIndex((l) => l.id === id);
            const selectedLog = updatedLogs[logIndex];
            console.log(updatedLog, selectedLog);
            selectedLog.truck_no = updatedLog.truck_no;
            selectedLog.type = updatedLog.type;
            selectedLog.distributor = updatedLog.distributor;
            selectedLog.wh_or_sale = updatedLog.wh_or_sale;
            return updatedLogs;
        });
    };

    const handleReset = async () => {
        setLoading(true);

        const { data } = await supabase
            .from("trucks")
            .update({
                condition: "Free",
                truck_no: null,
                wh_or_sale: null,
                type: null,
                logId: null,
                distributor: null
            })
            .not("id", "is", null);
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            updatedTrucks.map((t) => {
                (t.condition = "Free"),
                    (t.truck_no = "-"),
                    (t.type = null),
                    (t.wh_or_sale = null),
                    (t.distributor = null);
            });
            return updatedTrucks;
        });
        setLoading(false);
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout
                        handleReset={handleReset}
                        getLastUpdatedTime={getLastUpdatedTime}
                    />
                }>
                <Route
                    index
                    element={
                        <Loading
                            trucks={trucks}
                            loading={loading}
                            updateLog={updateLog}
                            updateCondition={updateCondition}
                        />
                    }
                />
                <Route
                    path="/loading-log"
                    element={<LoadingLog loadingLogs={logs} />}
                />
                <Route
                    path="/packaging"
                    element={
                        <Packaging lines={lines} updateLine={updateLine} />
                    }
                />
                <Route path="*" element={<Navigate to={"/"} />} />
                {/* {trucks.length > 0 && <Packaging />} */}
            </Route>
        </Routes>
    );
};

export default App;

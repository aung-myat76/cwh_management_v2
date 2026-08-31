import { useCallback, useEffect, useState } from "react";
// import { collectionId, databases, client, dbId } from "./lib/appwrite";
import "./App.css";
// import TruckList from "./components/TruckList";
// import cn from "./lib/cn";
// import ConfirmModal from "./components/ConfirmModal";
// import { supabase } from "./superbaseClient";
import Packaging from "./pages/Packaging";
import MainLayout from "./layout/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";
import LoadingLog from "./pages/LoadingLog";
// import getByDate from "./lib/getByDate";
import { databases, realtime } from "./lib/appwriteClient";
import { ID } from "appwrite";
// import { cleanDocument } from "./lib/cleanDocument";

// const getShift = () => {
//     const time = now.getHours();

//     if (time >= 6 && time <= 18) {
//         return "Morning Shift";
//     } else {
//         return "Night Shift";
//     }
// };
const dbId = "6a950c240032e2dede18";
const collections = {
    loading: "loading",
    packaging: "packaging",
    loadingLogs: "loading-logs"
};
const App = () => {
    const [trucks, setTrucks] = useState([]);
    const [lines, setLines] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [date, setDate] = useState(new Date());

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
            // const newLog = await supabase
            //     .from("loading-log")
            //     .insert([

            //     ])
            //     .select();
            const newLogData = {
                truck_no: newState.truck_no,
                type: newState.type,
                loading_bay: newState.loading_bay,
                distributor: newState.distributor,
                wh_or_sale: newState.wh_or_sale,
                start_time: new Date(),
                finish_time: null,
                remark: null
            };
            const newLog = await databases.createDocument(
                dbId,
                collections.loadingLogs,
                ID.unique(),
                newLogData
            );

            console.log(newLog);
            setTrucks((preTrucks) => {
                const updatedTrucks = [...preTrucks];
                const updateTruckIndex = updatedTrucks.findIndex(
                    (t) => t.$id === id
                );
                const updatedTruck = updatedTrucks[updateTruckIndex];
                updatedTruck.condition = newState.condition;
                updatedTruck["truck_no"] = newState["truck_no"];
                updatedTruck["type"] = newState["type"];
                updatedTruck["wh_or_sale"] = newState["wh_or_sale"];
                updatedTruck["distributor"] = newState["distributor"];
                updatedTruck["logId"] = newLog.$id;
                return updatedTrucks;
            });

            setLogs((preLogs) => {
                const updatedLogs = [...preLogs];

                if (!newLog.$id) {
                    updatedLogs.push(newLog);
                }
                return updatedLogs;
            });

            // return await supabase
            //     .from("trucks")
            //     .update({ ...newState, logId: newLog.data[0].id })
            //     .eq("id", id);
            console.log(newLog);
            return await databases.updateDocument(
                dbId,
                collections.loading,
                id,
                { logId: newLog.$id }
            );
        } else if (newState.logId) {
            console.log("exist");
            const updatedLog = await databases.updateDocument(
                dbId,
                collections.loadingLogs,
                newState.logId,
                {
                    finish_time: new Date()
                }
            );
            console.log(updatedLog);
            // const { data } = await supabase
            //     .from("loading-log")
            //     .select()
            //     .eq("id", newState.logId);
            // const updatedLog = await supabase
            //     .from("loading-log")
            //     .update({
            //         ...data[0],
            //         finish_time: new Date()
            //     })
            //     .eq("id", newState.logId)
            //     .select();
            let truck = { ...newState };

            if (
                newState.condition === "Free" ||
                newState.condition === "Blocked"
            ) {
                truck = {
                    ...newState,
                    condition: newState.condition,
                    truck_no: null,
                    wh_or_sale: null,
                    type: null,
                    distributor: null,
                    logId: null
                };
            }

            setTrucks((preTrucks) => {
                const updatedTrucks = [...preTrucks];
                const updateTruckIndex = updatedTrucks.findIndex(
                    (t) => t.$id === id
                );
                const updatedTruck = updatedTrucks[updateTruckIndex];
                updatedTruck.condition = newState.condition;
                updatedTruck["truck_no"] = truck.truck_no;
                updatedTruck["type"] = truck.type;
                updatedTruck["wh_or_sale"] = truck.wh_or_sale;
                updatedTruck["distributor"] = truck.distributor;
                updatedTruck["logId"] =
                    truck.condition === "Loaded" ? truck.logId : null;
                return updatedTrucks;
            });

            setLogs((preLogs) => {
                const updatedLogs = [...preLogs];
                const selectedLog = updatedLogs.find(
                    (l) => l.$id === newState.logId
                );
                console.log(selectedLog, updatedLog);
                if (selectedLog) {
                    selectedLog.finish_time = updatedLog.finish_time;
                }
                return updatedLogs;
            });

            return await databases.updateDocument(
                dbId,
                collections.loading,
                id,
                { ...truck }
            );
            // return await supabase
            //     .from("trucks")
            //     .update({ ...truck })
            //     .eq("id", id);
        }

        // update the truck

        // add loading log
        // console.log(newState);

        // return await databases.updateDocument(dbId, collectionId, id, newState);
    }, []);

    const updateLine = useCallback(async (id, newState) => {
        setLines((preLines) => {
            const updatedLine = [...preLines];
            const updateLineIndex = updatedLine.findIndex((l) => l.$id === id);
            updatedLine[updateLineIndex].item = newState.item;
            updatedLine[updateLineIndex].status = newState.status;
            updatedLine[updateLineIndex].remark = newState.remark;

            return updatedLine;
        });
        return await databases.updateDocument(
            dbId,
            collections.packaging,
            id,
            newState
        );
        // return await supabase.from("packaging").update(newState).eq("id", id);
    }, []);

    const getLastUpdatedTime = () => {
        const TTimes = trucks.map((t) => new Date(t.$updatedAt).getTime());
        const LTimes = lines.map((l) => new Date(l.$updatedAt).getTime());
        const lastTime = Math.max(...TTimes, ...LTimes);

        const date = new Date(lastTime);
        console.log(lastTime, date);
        const dateString = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",

            hour12: false
        });

        return dateString;
    };

    // const updateDate = (date) => {
    //     setDate(date);
    // };

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
    //     //                     t.id === response.payload.id
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
    // useEffect(() => {
    //     const date = new Date();
    //     const start = getByDate(date).startOfDay;
    //     const end = getByDate(date).endOfDay;
    //     console.log(start, end);
    //     const getData = async () => {
    //         // const data = await databases.listDocuments(dbId, collectionId);

    //         const [truckRes, PackagingRes, LogRes] = await Promise.all([
    //             supabase
    //                 .from("trucks")
    //                 .select("*")
    //                 .order("id", { ascending: true }),
    //             supabase
    //                 .from("packaging")
    //                 .select("*")

    //                 .order("id", { ascending: true }),
    //             supabase
    //                 .from("loading-log")
    //                 .select("*")
    //                 .gte("created_at", start)
    //                 .lt("created_at", end)
    //                 .order("id", { ascending: true })
    //         ]);
    //         if (truckRes.data) setTrucks(truckRes.data);
    //         if (PackagingRes.data) setLines(PackagingRes.data);
    //         if (LogRes.data) setLogs(LogRes.data);
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
    //     //                     t.id === response.payload.$id
    //     //                         ? response.payload
    //     //                         : t
    //     //                 )
    //     //             );
    //     //         }
    //     //     }
    //     // );
    //     const unsubscribe = supabase
    //         .channel("all-channel")
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
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "packaging" },
    //             (payload) => {
    //                 if (payload.eventType === "UPDATE") {
    //                     setLines((current) =>
    //                         current.map((p) =>
    //                             p.id === payload.new.id ? payload.new : p
    //                         )
    //                     );
    //                 }
    //             }
    //         )
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "loading-log" },
    //             (payload) => {
    //                 if (payload.eventType === "INSERT") {
    //                     setLogs((current) => [...current, payload.new]);
    //                 }
    //             }
    //         )
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "loading-log" },
    //             (payload) => {
    //                 if (payload.eventType === "UPDATE") {
    //                     setLogs((current) =>
    //                         current.map((l) =>
    //                             l.id === payload.new.id ? payload.new : l
    //                         )
    //                     );
    //                 }
    //             }
    //         )
    //         .subscribe();

    //     return () => supabase.removeChannel(unsubscribe);
    // }, []);

    // const channel = `databases.${dbId}.collections.*.documents`;
    const updateCollectionState = (list, events, payload) => {
        // 1. CREATE
        if (events.some((e) => e.endsWith(".create"))) {
            // Avoid duplicates if the item was already added locally
            if (list.some((item) => item.$id === payload.$id)) return list;
            return [...list, payload];
        }

        // 2. UPDATE
        if (events.some((e) => e.endsWith(".update"))) {
            console.log(payload);
            return list.map((item) =>
                item.$id === payload.$id ? payload : item
            );
        }

        // 3. DELETE
        if (events.some((e) => e.endsWith(".delete"))) {
            return list.filter((item) => item.$id !== payload.$id);
        }

        return list;
    };
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const prom = [
                    databases.listDocuments(dbId, "loading"),
                    databases.listDocuments(dbId, "packaging"),
                    databases.listDocuments(dbId, "loading-logs")
                ];
                const [trucks, packaging, logs] = await Promise.all(prom);
                console.log(trucks);
                setTrucks(trucks.documents.reverse());
                setLines(packaging.documents);
                setLogs(logs.documents);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();

        const channels = [
            `databases.${dbId}.collections.${"loading"}.documents`,
            `databases.${dbId}.collections.${"packaging"}.documents`,
            `databases.${dbId}.collections.${"loading-logs"}.documents`
        ];

        const unsubscribe = realtime.subscribe(channels, (res) => {
            const { events, payload, channels: eventChannels } = res;
            if (eventChannels.includes(channels[0])) {
                setTrucks((prev) =>
                    updateCollectionState(prev, events, payload)
                );
            } else if (eventChannels.includes(channels[1])) {
                setLines((prev) =>
                    updateCollectionState(prev, events, payload)
                );
            } else if (eventChannels.includes(channels[2])) {
                setLogs((prev) => updateCollectionState(prev, events, payload));
            }
        });

        return () => unsubscribe();
    }, []);

    const updateLog = (id, updatedLog) => {
        setLogs((preLogs) => {
            const updatedLogs = [...preLogs];
            const logIndex = updatedLogs.findIndex((l) => l.$id === id);
            const selectedLog = updatedLogs[logIndex];
            console.log(updatedLog, selectedLog);
            selectedLog.truck_no = updatedLog.truck_no;
            selectedLog.type = updatedLog.type;
            selectedLog.distributor = updatedLog.distributor;
            selectedLog.wh_or_sale = updatedLog.wh_or_sale;
            selectedLog.remark = updatedLog.remark;

            return updatedLogs;
        });
    };

    const deleteLog = (id) => {
        setLogs((preLogs) => {
            const updatedLogs = [...preLogs];
            return updatedLogs.filter((l) => l.$id !== id);
        });
    };
    const updateTruck = (id, updatedTruck) => {
        console.log(updatedTruck);
        setTrucks((preTrucks) => {
            const updatedTrucks = [...preTrucks];
            const logIndex = updatedTrucks.findIndex((l) => l.$id === id);
            const selectedTruck = updatedTrucks[logIndex];
            console.log(selectedTruck);
            selectedTruck.truck_no = updatedTruck.truck_no;
            selectedTruck.type = updatedTruck.type;
            selectedTruck.distributor = updatedTruck.distributor;
            selectedTruck.wh_or_sale = updatedTruck.wh_or_sale;
            return updatedTrucks;
        });
    };

    const handleReset = async () => {
        // setLoading(true);

        // const [loading, log] = await Promise.all([
        //     supabase
        //         .from("trucks")
        //         .update({
        //             condition: "Free",
        //             truck_no: null,
        //             wh_or_sale: null,
        //             type: null,
        //             logId: null,
        //             distributor: null
        //         })
        //         .not("id", "is", null),
        //     supabase.from("loading-log").delete().gt("id", 0)
        // ]);
        // console.log(loading, log);
        // setTrucks((preTrucks) => {
        //     const updatedTrucks = [...preTrucks];
        //     updatedTrucks.map((t) => {
        //         (t.condition = "Free"),
        //             (t.truck_no = "-"),
        //             (t.type = null),
        //             (t.wh_or_sale = null),
        //             (t.distributor = null);
        //     });
        //     return updatedTrucks;
        // });
        // setLogs([]);
        // setLoading(false);
        console.log("reset");
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
                            updateTruck={updateTruck}
                            updateCondition={updateCondition}
                        />
                    }
                />
                <Route
                    path="/loading-log"
                    element={
                        <LoadingLog
                            logs={logs}
                            updateLog={updateLog}
                            deleteLog={deleteLog}
                        />
                    }
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

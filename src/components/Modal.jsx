import ReactDom from "react-dom";
import { useRef } from "react";
import { supabase } from "../superbaseClient";

const Modal = ({
    id,
    truckNo,
    type,
    distributor,
    wh_or_sale,
    loadingBay,
    logId,
    isOpen,
    onClose,
    cb,
    updateLog,
    updateTruck
}) => {
    const truckRef = useRef(null);
    const typeRef = useRef(null);
    const distributorRef = useRef(null);
    const whOrSaleRef = useRef(null);
    if (!isOpen) return null;

    const handleSelect = async (state) => {
        await cb({
            condition: state,
            truck_no: truckRef.current.value || null,
            type: typeRef.current.value || null,
            wh_or_sale: whOrSaleRef.current.value || null,
            distributor: distributorRef.current.value || null,
            loading_bay: loadingBay,
            logId: logId
        });
        onClose();
    };

    const handleUpdateTruck = async () => {
        // await databases.updateDocument(dbId, collectionId, id, {
        //     truck_no: truckRef.current.value || '-'
        // });
        const { data } = await supabase.from("trucks").select().eq("id", id);
        const updatedTruck = await supabase
            .from("trucks")
            .update({
                ...data[0],
                truck_no: truckRef.current.value || null,
                type: typeRef.current.value || null,
                wh_or_sale: whOrSaleRef.current.value || null,
                distributor: distributorRef.current.value || null,
                logId: logId
            })
            .eq("id", id)
            .select();
        if (updatedTruck.data[0]) {
            updateTruck(id, { ...updatedTruck.data[0] });
        }
        console.log(data, updatedTruck);

        if (logId) {
            const { data } = await supabase
                .from("loading-log")
                .select()
                .eq("id", logId);
            console.log(data);
            const updatedLog = await supabase
                .from("loading-log")
                .update({
                    ...data[0],
                    truck_no: truckRef.current.value || null,
                    type: typeRef.current.value || null,
                    wh_or_sale: whOrSaleRef.current.value || null,
                    loading_bay: loadingBay,
                    distributor: distributorRef.current.value || null
                })
                .eq("id", logId)
                .select();
            console.log(updatedLog.data);
            updateLog(logId, { ...updatedLog.data[0] });
        }

        onClose();
    };

    return ReactDom.createPortal(
        <div
            className="fixed flex items-center justify-center inset-0 bg-stone-100/50 size-screen z-50"
            onClick={() => {
                onClose();
            }}>
            <div
                className="bg-stone-900 w-75 rounded-md p-5 text-white"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-xl ">{loadingBay}</h1>
                    <button
                        onClick={onClose}
                        className=" bg-stone-600 px-3 py-1 text-lg text-white rounded-sm">
                        &#10006;
                    </button>
                </div>
                <ul className="my-2">
                    <li className="flex flex-col gap-1">
                        <div className="flex gap-2">
                            <input
                                ref={truckRef}
                                defaultValue={truckNo}
                                placeholder={
                                    !truckNo
                                        ? "Truck no"
                                        : truckNo.toUpperCase()
                                }
                                className="p-1 w-full text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                            />

                            <select
                                name="types"
                                ref={typeRef}
                                defaultValue={type}
                                placeholder={!type ? "Type" : type}
                                className="p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none">
                                <option value={""}>Type</option>
                                <option value={"6"}>6</option>
                                <option value={"10"}>10</option>
                                <option value={"12"}>12</option>
                                <option value={"20"}>20</option>
                                <option value={"22"}>22</option>
                            </select>
                        </div>
                        {/* <div className="mt-2 flex gap-7"> */}
                        <div className="flex gap-2">
                            <select
                                name="distributors"
                                ref={distributorRef}
                                defaultValue={distributor}
                                placeholder={
                                    !distributor ? "Distributor" : distributor
                                }
                                className="w-1/2 p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none">
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
                                <option value={"N-Star"}>N-Star</option>
                                <option value={"T-Party"}>T-Party</option>
                                <option value={"Other"}>Other</option>
                            </select>
                            <select
                                name="wh_or_sale"
                                ref={whOrSaleRef}
                                defaultValue={wh_or_sale}
                                placeholder={
                                    !wh_or_sale ? "WH/Sale" : wh_or_sale
                                }
                                className="w-1/2 p-1 text-center text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none">
                                <option value={""}>WH/Sale</option>
                                <option value={"WH-WH"}>WH-WH</option>
                                <option value={"Sale"}>Sale</option>
                            </select>
                        </div>
                        <button
                            className="p-2 font-bold bg-blue-600  rounded-sm"
                            onClick={handleUpdateTruck}>
                            Update
                        </button>
                        {/* </div> */}
                    </li>
                    <li className="mt-5">
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-emerald-600"
                            onClick={() => handleSelect("Free")}>
                            Free Loading
                        </button>
                    </li>
                    {/* <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-yellow-600"
                            onClick={() => handleSelect("Almost")}>
                            Almost
                        </button>
                    </li> */}
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-yellow-400"
                            onClick={() => handleSelect("Start")}>
                            Start Loading
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-orange-500"
                            onClick={() => handleSelect("Half")}>
                            Half Loaded
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-red-700"
                            onClick={() => handleSelect("Loaded")}>
                            Fully Loaded
                        </button>
                    </li>
                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-stone-600"
                            onClick={() => handleSelect("Blocked")}>
                            Blocked Loading
                        </button>
                    </li>
                </ul>
            </div>
        </div>,
        document.querySelector("#modal-root")
    );
};

export default Modal;

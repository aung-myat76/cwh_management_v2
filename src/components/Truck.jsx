import { useState } from "react";
import cn from "../lib/cn";
import Modal from "./Modal";
import { supabase } from "../superbaseClient";

const Truck = ({
    id,
    loadingBay,
    truckNo,
    type,
    wh_or_sale,
    distributor,
    condition,
    logId,
    updateLog,
    updateCondition
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            if (state.condition === "Free" || state.condition === "Blocked") {
                await updateCondition(id, {
                    truck_no: null,
                    type: null,
                    wh_or_sale: null,
                    distributor: null,
                    logId: state.logId,
                    condition: state.condition
                });
            } else {
                console.log(state);
                const { data } = await supabase
                    .from("loading-log")
                    .update({
                        truck_no: state.truck_no,
                        type: +state.type,
                        distributor: state.distributor,
                        wh_or_sale: state.wh_or_sale,
                        loading_bay: state.loading_bay
                    })
                    .eq("id", state.logId)
                    .select();
                // updateLog({ ...data[0] });
                await updateCondition(id, { ...state });
            }
        }
    };

    const onClose = () => {
        setIsOpen(false);
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    const liCls = cn(
        "flex flex-col   px-1 rounded-md w-27 min-h-23 cursor-pointer",
        condition === "Free"
            ? "free"
            : condition === "Start"
              ? "start"
              : condition === "Half"
                ? "half"
                : condition === "Loaded"
                  ? "loaded"
                  : condition === "Blocked"
                    ? "blocked"
                    : ""
    );

    return (
        <>
            <Modal
                loadingBay={loadingBay}
                id={id}
                isOpen={isOpen}
                onClose={onClose}
                cb={handleUpdateState}
                updateLog={updateLog}
                truckNo={truckNo}
                type={type}
                logId={logId}
                wh_or_sale={wh_or_sale}
                distributor={distributor}
            />
            <li className={liCls} onClick={onOpen}>
                <h2 className="text-xl font-bold">{loadingBay}</h2>
                <div className="flex flex-col   font-bold items-center justify-center ">
                    <p className=" my-1 bg-stone-600/25 p-1 rounded-sm gap-1 flex text-[11px]   items-center justify-center">
                        <span className="font-bold">
                            {truckNo ? String(truckNo).toUpperCase() : "-"}
                        </span>
                        {type && <span className="">{`(${type}W)`}</span>}
                    </p>
                    <div className="flex gap-1 text-[10px]">
                        <span>{distributor}</span>
                        {wh_or_sale && <span>({wh_or_sale})</span>}
                    </div>
                </div>
            </li>
        </>
    );
};

export default Truck;

import ReactDom from "react-dom";
import { useRef } from "react";
import { supabase } from "../superbaseClient";

const PackagingModal = ({ id, name, item, remark, isOpen, onClose, cb }) => {
    const itemRef = useRef(null);
    const remarkRef = useRef(null);
    if (!isOpen) return null;

    const handleSelect = async (state) => {
        await cb({
            status: state,
            item: itemRef.current.value || null,
            remark: remarkRef.current.value || null
        });
        onClose();
    };

    const handleUpdateLine = async () => {
        // await databases.updateDocument(dbId, collectionId, id, {
        //     truck_no: truckRef.current.value || '-'
        // });
        await supabase
            .from("packaging")
            .update({
                item: itemRef.current.value || null,
                remark: remarkRef.current.value || null
            })
            .eq("id", id);
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
                    <h1 className="font-bold text-xl ">{name}</h1>
                    <button
                        onClick={onClose}
                        className=" bg-stone-600 px-3 py-1 text-lg text-white rounded-sm">
                        &#10006;
                    </button>
                </div>
                <ul className="my-2">
                    <li className="flex flex-col gap-1">
                        <div className="flex flex-col gap-2">
                            <input
                                ref={itemRef}
                                defaultValue={item}
                                placeholder={!item ? "Item" : item.trim()}
                                className="p-1 w-full  text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                            />
                            <textarea
                                ref={remarkRef}
                                className="p-1 w-full  text-lg font-bold bg-stone-100 text-stone-900 rounded-sm focus:outline-none"
                                defaultValue={remark}
                                placeholder={
                                    !remark ? "Remark" : remark.trim()
                                }></textarea>

                            <button
                                className="p-2 font-bold bg-blue-600  rounded-sm"
                                onClick={handleUpdateLine}>
                                Update
                            </button>
                        </div>

                        {/* </div> */}
                    </li>

                    <li className="mt-5">
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-stone-600"
                            onClick={() => handleSelect("Unknown")}>
                            Unknown
                        </button>
                    </li>
                    <li className="">
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-emerald-600"
                            onClick={() => handleSelect("Running")}>
                            Running
                        </button>
                    </li>

                    <li>
                        <button
                            className="p-2 my-2 rounded-sm w-full block font-bold bg-red-600"
                            onClick={() => handleSelect("No Production")}>
                            No Production
                        </button>
                    </li>
                </ul>
            </div>
        </div>,
        document.querySelector("#modal-root")
    );
};

export default PackagingModal;

import React, { useRef, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

const Setting = ({ resetLoadingBay, resetLoadingLogsByDate }) => {
    const [isOpenLoading, setIsOpenLoading] = useState(false);
    const [isOpenLog, setIsOpenLog] = useState(false);
    const dateRef = useRef();

    const onOpenLoading = () => setIsOpenLoading(true);
    const onCloseLoading = () => setIsOpenLoading(false);

    const onOpenLog = () => setIsOpenLog(true);
    const onCloseLog = () => setIsOpenLog(false);
    return (
        <div className="m-2 p-3 bg-stone-100 shadow-stone-900 rounded-md">
            <ConfirmModal
                isOpen={isOpenLoading}
                onClose={onCloseLoading}
                cb={resetLoadingBay}
            />
            <ConfirmModal
                isOpen={isOpenLog}
                onClose={onCloseLog}
                cb={() => resetLoadingLogsByDate(dateRef.current.value)}
            />
            <div>
                <div className=" font-bold text-lg p-4 border-b-2 border-b-stone-200 mb-4">
                    Resetting
                </div>
                <div className="flex flex-col gap-2">
                    <div className="bg-stone-200 rounded-sm p-2">
                        <p>Reset today&apos;s loading bay data</p>
                        <button
                            className="p-1 mt-2 font-bold bg-red-600 text-white rounded-sm"
                            onClick={onOpenLoading}>
                            Reset
                        </button>
                    </div>
                    <div className="bg-stone-200 rounded-sm p-2">
                        <p>Reset loading logs by date</p>
                        <button
                            className="p-1 mt-2 mr-2 font-bold bg-red-600 text-white rounded-sm"
                            onClick={onOpenLog}>
                            Reset
                        </button>
                        <input
                            ref={dateRef}
                            defaultValue={
                                new Date().toISOString().split("T")[0]
                            }
                            type="date"
                            onChange={(e) =>
                                (dateRef.current.value = e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;

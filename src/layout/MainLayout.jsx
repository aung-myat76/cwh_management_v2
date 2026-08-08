import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import cn from "../lib/cn";

const now = new Date();

const nowDate = now.toLocaleDateString("en-GB");

const MainLayout = ({ handleReset, getLastUpdatedTime }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    return (
        <div>
            <ConfirmModal isOpen={isOpen} onClose={onClose} cb={handleReset} />
            <header className="flex items-center justify-between py-3 px-1 bg-emerald-800 text-white ">
                <h1 className="text-md font-bold">
                    CWH ( YARD Management System )
                </h1>

                <div>
                    <button
                        onClick={onOpen}
                        className="bg-red-600 p-2 rounded-md text-white">
                        Reset
                    </button>
                </div>
            </header>
            <nav className="bg-emerald-900 p-3 mb-5">
                <NavLink
                    className={({ isActive }) =>
                        cn(
                            " px-1 mx-2 font-bold",
                            isActive
                                ? "text-emerald-500 border-b-2 border-emerald-500 pb-1"
                                : ""
                        )
                    }
                    to={"/"}>
                    Loading
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        cn(
                            " px-1 mx-2 font-bold",
                            isActive
                                ? "text-emerald-500 border-b-2 border-emerald-500 pb-1"
                                : ""
                        )
                    }
                    to={"/loading-log"}>
                    Loading Log
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        cn(
                            " px-1 mx-2 font-bold",
                            isActive
                                ? "text-emerald-500 border-b-2 border-emerald-500 pb-1"
                                : ""
                        )
                    }
                    to={"/packaging"}>
                    Packaging
                </NavLink>
            </nav>
            <div className="flex gap-2 items-center justify-around">
                {/* <p className=" font-bold mx-3">{getShift()}</p> */}
                <p className=" font-bold">{nowDate}</p>
                <p className="">
                    last updated at -{" "}
                    <span className="font-bold">{getLastUpdatedTime()}</span>
                </p>
                {/* <div className="flex flex-col justify-center items-center text-center bg-red-200 p-2 rounded-md">
                    <h2 className="font-bold">Warning</h2>
                    <p>
                        Please don't use the app now. <br />
                        we're currently upgrading our app.
                    </p>
                </div> */}
            </div>

            <Outlet />
        </div>
    );
};

export default MainLayout;

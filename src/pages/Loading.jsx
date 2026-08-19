import React, { useState } from "react";
import TruckList from "../components/TruckList";
import cn from "../lib/cn";

const Loading = ({
    trucks,
    loading,
    updateCondition,
    updateLog,
    updateTruck
}) => {
    const [state, setState] = useState("All");
    const stateChangeCls = cn(
        "p-2 min-h-full rounded-md text-[.6rem] font-bold"
    );

    return (
        <div>
            <ul className="flex justify-center gap-1  my-3 text-white ">
                <li>
                    <button
                        onClick={() => setState("All")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "All"
                                ? "bg-blue-600 "
                                : "bg-blue-600/50")
                        }>
                        Total Loading Bay [{trucks.length}]
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setState("Free")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "Free" ? "free " : "free-not-active")
                        }>
                        Free Spaces [
                        {trucks.filter((t) => t.condition == "Free").length}]
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setState("Start")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "Start" ? "start" : "start-not-active")
                        }>
                        Loading Started [
                        {trucks.filter((t) => t.condition == "Start").length}]
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setState("Half")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "Half" ? "half " : "half-not-active")
                        }>
                        Half Loaded [
                        {trucks.filter((t) => t.condition == "Half").length}]
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setState("Loaded")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "Loaded"
                                ? "loaded"
                                : "loaded-not-active")
                        }>
                        Fully Loaded [
                        {trucks.filter((t) => t.condition == "Loaded").length}]
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setState("Blocked")}
                        className={
                            stateChangeCls +
                            " " +
                            (state === "Blocked"
                                ? "blocked "
                                : "blocked-not-active")
                        }>
                        Blocked Loading [
                        {trucks.filter((t) => t.condition == "Blocked").length}]
                    </button>
                </li>
            </ul>

            {loading && (
                <p className="text-xl text-center my-10 font-bold">
                    Loading...
                </p>
            )}
            {!loading && trucks.length > 0 && (
                <TruckList
                    trucks={trucks}
                    state={state}
                    updateLog={updateLog}
                    updateTruck={updateTruck}
                    updateCondition={updateCondition}
                />
            )}
        </div>
    );
};

export default Loading;

import Truck from "./Truck";

const TruckList = ({ trucks, state, updateCondition }) => {
    console.log(trucks);
    const filterTrucks =
        state === "All" ? trucks : trucks.filter((t) => t.condition === state);

    return (
        <ul className="flex items-center justify-center gap-3 flex-wrap md:w-2/4 mx-auto">
            {filterTrucks.length <= 0 && state !== "All" && (
                <p className=" text-xl my-5">
                    There is no{" "}
                    <span className="font-bold">{state.toLowerCase()}</span>{" "}
                    state yet!
                </p>
            )}
            {filterTrucks.length > 0 &&
                filterTrucks.map((truck) => {
                    return (
                        <Truck
                            key={truck.id}
                            id={truck.id}
                            loadingBay={truck["loading_bay"]}
                            condition={truck["condition"]}
                            truckNo={truck["truck_no"]}
                            type={truck["type"]}
                            wh_or_sale={truck["wh_or_sale"]}
                            distributor={truck["distributor"]}
                            logId={truck["logId"]}
                            updateCondition={updateCondition}
                        />
                    );
                })}
        </ul>
    );
};

export default TruckList;

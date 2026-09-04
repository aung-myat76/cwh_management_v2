import React from "react";
import Line from "./Line";

const LineList = ({ lines, updateLine }) => {
    return (
        <ul className="flex gap-2 items-center justify-center my-2 flex-wrap md:w-2/4 mx-auto">
            {lines.length > 0 &&
                lines.map((line) => (
                    <Line
                        key={line.$id}
                        id={line.$id}
                        name={line.name}
                        item={line.item}
                        status={line.status}
                        remark={line.remark}
                        updateLine={updateLine}
                    />
                ))}
        </ul>
    );
};

export default LineList;

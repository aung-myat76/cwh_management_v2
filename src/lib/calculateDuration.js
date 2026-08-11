const calculateDuration = (start, finish) => {
    if (!finish) return "In Progress...";
    const diffMs = new Date(finish).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} mins`;
};

export default calculateDuration;

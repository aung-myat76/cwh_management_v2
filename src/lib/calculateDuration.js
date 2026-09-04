const calculateDuration = (start, finish) => {
    if (!finish) return "...";
    const diffMs = new Date(finish).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min`;
};

export default calculateDuration;

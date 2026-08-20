const getByDate = (date) => {
    const d =
        date.toString().length > 15 ? date.toISOString().split("T")[0] : date;
    const [year, month, day] = d.split("-");
    console.log(year, month, day);
    const startOfDay = new Date(
        `${year}-${month}-${day}T00:00:00Z`
    ).toISOString();

    const nextDay = new Date(`${year}-${month}-${day}T00:00:00Z`);
    nextDay.setDate(nextDay.getDate() + 1);
    const endOfDay = nextDay.toISOString();

    return { startOfDay, endOfDay };
};

export default getByDate;

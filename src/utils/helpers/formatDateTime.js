/**
 * Format Date Helper Function
 * @param {string} dateTime - datetime string in the format "2025-12-25T16:35:17.734Z"
 * @returns {string, string} {date, timeWithExtension} - date in the format "25th December, 2025" and time in the format "4:35pm"
 */

export const formatDateTime = (dateTime) => {
    const month = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    };
    let date = dateTime.split("T")[0];
    const time = dateTime.split("T")[1];

    function getDayExtension(dayIndex) {
        dayIndex = dayIndex.split("")[1];
        switch(dayIndex) {
            case "1":
                return "st";
            case "2": 
                return "nd";
            case "3": 
                return "rd";
            default: 
                return "th";
        }
    };

    // format date
    const [ year, monthIndex, day ] = date.split("-");
    date = `${Number(day) < 10 ? day.split("")[1]: day}${getDayExtension(day)} ${month[monthIndex]}, ${year}`;

    // format time
    const timeParts = time.split(":");
    const timeWithExtension = Number(timeParts[0]) > 12
        ? `${Number(timeParts[0]) - 12}:${timeParts[1]}pm`
        : `${Number(timeParts[0])}:${timeParts[1]}am`;

    return { date, timeWithExtension }
}

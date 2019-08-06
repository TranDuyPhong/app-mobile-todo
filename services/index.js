export function formatDate (date) {
    date = new Date(date);
    let dateFormat = null;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month.toString().length == 2 ? month : `0${month.toString()}`;
    let day = date.getDate();
    day = day.toString().length == 2 ? day : `0${day.toString()}`;
    let hour = date.getHours();
    hour = hour.toString().length == 2 ? hour : `0${hour.toString()}`;
    let minute = date.getMinutes();
    minute = minute.toString().length == 2 ? minute : `0${minute.toString()}`;
    dateFormat = `${year}-${month}-${day} ${hour}:${minute}`;
    return dateFormat;
}
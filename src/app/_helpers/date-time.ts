export class DateTime {
    public static utcToLocalMmDdYyyy(utcDate): string {
        var date = new Date(utcDate);

        return `${('0' + date.getMonth()).substr(-2)}-${('0' + date.getDate()).substr(-2)}-${date.getFullYear()}`;
    }

    public static utcToLocalHhMm(utcDate): string {
        var date = new Date(utcDate);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 

        return `${('0' + hours).substr(-2)}:${('0' + minutes).substr(-2)} ${ampm}`;
    }
}
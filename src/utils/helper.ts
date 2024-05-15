export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate: string = date.toLocaleDateString("en-US", options);
    return formattedDate;
}

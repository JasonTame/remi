export function getWeekRange(weekStartDate: string) {
	const weekStart = new Date(weekStartDate);
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 6);

	return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
}

const formatDate = (date: Date) => {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

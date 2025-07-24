{ // status time
	const el = document.querySelector("#status > div > div.last-updated");
	const attr = el.querySelector("time").getAttribute("datetime");
	const lastUpdated = new Date(attr);
	const date = `${lastUpdated.getMonth()}/${lastUpdated.getDay()}/${lastUpdated.getFullYear()}`;
	el.querySelector("span.date").innerText += date;

	const day = 86400,
		month = day * 30,
		year = day * 365;
	const distance = Math.round((+new Date() - lastUpdated) / 1000);

	var fuzzy = "";
	const { days, months, years } = {};

	if (distance < day) fuzzy = "TODAY!";
	else if (distance < month) { // DAYS
		days.value = Math.floor(distance / day);
		days.plural = (days.value !== 1) ? "S" : "";
		days.string = days.value + " DAY" + days.plural;

		fuzzy = days.string + " AGO";
	} else if (distance < year) { // MONTHS
		months.value = Math.floor(distance / month);
		months.plural = (months.value !== 1) ? "S" : "";
		months.string = months.value + " MONTH" + months.plural;

		days.value = Math.floor(distance / day) - (months.value * 30);
		days.plural = (days.value !== 1) ? "S" : "";
		if (days.value !== 0) days.string = ", " + days.value + " DAY" + days.plural;
		else days.string = "";

		fuzzy = months.string + days.string + " AGO";
	} else if (distance > year) { // YEARS
		years.value = Math.floor(distance / year);
		years.plural = (years.value !== 1) ? "S" : "";
		years.string = years.value + " YEAR" + years.plural;

		months.value = Math.floor(distance / month) - (years.value * 12);
		months.plural = (months.value !== 1) ? "S" : "";
		if (months.value !== 0) months.string = ", " + months.value + " MONTH" + months.plural;
		else months.string = "";

		days.value = Math.floor(distance / day) - (months.value * 30) - (years.value * 360);
		days.plural = (days.value !== 1) ? "S" : "";
		if (days.value !== 0) days.string = ", " + days.value + " DAY" + days.plural;
		else days.string = "";

		fuzzy = years.string + months.string + days.string + " AGO";
	}

	el.querySelector("span.fuzzy").innerText += fuzzy;
}

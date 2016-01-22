var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;
    
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function randomDate() {
	var start = new Date("2011.10.01 00:00");
	var end = new Date("2011.10.01 13:59");
	var date = new Date(+start + Math.random() * (end - start));
	date.setHours(getRandomInt(0, 23));
	return date;
}

function getData(length){
	var data = [];
	for (var i = 0; i < length; i++) {
		var startDate = randomDate();
		var endDate = new Date(startDate);
		var endDate = new Date(endDate.setMinutes(endDate.getMinutes() + getRandomInt(0, 60)));
		data.push({
			start: startDate,
			end: endDate,
			value: getRandomInt(0, 15),
			type: getRandomInt(0,2)
		});
	};
	return data.sort(function (a, b) { return (a.start.valueOf() < b.end.valueOf()) ? -1 : (a.start.valueOf() > b.end.valueOf()) ? 1 : 0; });
}
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
	date.setMinutes(getRandomInt(0, 35));
	return date;
}

function getData(length){
	var data = [];
	do{
		var type = getRandomInt(0, 3);
		var segmentLen = getRandomInt(40, 70);
		for (var j = 0; j < segmentLen; j++) {
			if(data.length == length){
				break;
			}
			var startDate = randomDate();
			var endDate = new Date(startDate);
			var endDate = new Date(endDate.setMinutes(endDate.getMinutes() + getRandomInt(5, 20)));
			var val = getRandomInt(0, 50); //data.length % 2; 
			data.push({
				start: startDate,
				end: endDate,
				value: val,
				type: type
			});
		};
	} while (data.length < length);


	
	// for (var i = 0; i < length; i++) {
	// 	var startDate = randomDate();
	// 	var endDate = new Date(startDate);
	// 	var endDate = new Date(endDate.setMinutes(endDate.getMinutes() + getRandomInt(5, 20)));
	// 	data.push({
	// 		start: startDate,
	// 		end: endDate,
	// 		value: getRandomInt(0, 50),
	// 		type: getRandomInt(0,3)
	// 	});
	// };
	return data;	
}

function getSquareData(count){
    var data = [];
    var i = 1;
    var sum = 0;
    while (sum < 100  && i < count) {
        var a = getRandomInt(10, 30);
        data.push(a * 10);
        i++;        
        sum += a;
    } 
    if(100 != sum){
        data.push((100 - sum) * 10);
    }
    return sortData2(data);
}

function sortData(data){
	return data.sort(function (a, b) { return (a.start.valueOf() < b.end.valueOf()) ? -1 : (a.start.valueOf() > b.end.valueOf()) ? 1 : 0; });
};

function sortData2(data){
	return data.sort(function (a, b) { return (a < b) ? 1 : (a > b) ? -1 : 0; });
};

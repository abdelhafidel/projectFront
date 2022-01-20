$(document).ready(function() {
const ctx = document.getElementById('myChart').getContext('2d');
	var labelsPhone = [];
	var dataPhone = [];
	$.ajax({
		url: "api/smartphone/getAll",
		method: "POST",
		success: function(data) {
			console.log(data);
			data.forEach(d => {
				labelsPhone.push(d.imei);
				dataPhone.push(d.positions.length);

			})
			
			const myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labelsPhone,
			datasets: [{
				data: dataPhone,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});

		}
	});

	
	

	var map = L.map('map').setView([31.63, -8.008889], 13);

	const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	var markerGroup = L.layerGroup().addTo(map);

	L.marker([31.63, -8.008889]).addTo(markerGroup);

	function onMapClick(e) {
		markerGroup.clearLayers();
		L.marker(e.latlng).addTo(markerGroup);

		$('#lat').val(e.latlng.lat);
		$('#longi').val(e.latlng.lng);
		let dt = (new Date()).toISOString();
		$('#datee').val(dt.split('-')[0] + '-' + dt.split('-')[1] + '-' + dt.split('-')[2].substring(0, 2));
	}

	map.on('click', onMapClick);

	$("#find").click(function(e) {
		e.preventDefault();
		var imei = $('#imeiTele').val();
		$.ajax({
			url: "api/smartphone/get",
			data: imei,
			method: "POST",
			success: function(data) {
				remplir(data);
				addPositionsToMap(data)
				console.log(data);
			}
		});
	});



	$("#findUser").click(function(e) {
		e.preventDefault();
		var nom = $('#userId').val();
		$.ajax({
			url: "api/smartphone/getPhones",
			data: nom,
			method: "POST",
			success: function(data) {
				console.log(data);
				remplirPhones(data);
			}
		});
	});

	function addPositionsToMap(datas) {
		markerGroup.clearLayers();
		datas.positions.forEach(data => {
			L.marker([data.latitude, data.longitude]).addTo(markerGroup);
		});

	}

	function remplirPhones(data) {
		htmlPhones = '';
		data.forEach(x => {
			htmlPhones += '<tr><td>' + x[1] + '</td></tr>';
		})
		$('#userPhones').html(htmlPhones);
	}


	function remplir(data) {
		$('#idtele').val(data.id);
		$('#imei').val(data.imei);
		$('#nom').val(data.user.nom);
		$('#prenom').val(data.user.prenom);
		$('#telephone').val(data.user.telephone);
		$('#email').val(data.user.email);
		let dtt = data.user.dateNaiss;
		let date1 = new Date(dtt);
		let dt = date1.toISOString();
		$('#datedenaissance').val(dt.split('-')[0] + '-' + dt.split('-')[1] + '-' + dt.split('-')[2].substring(0, 2));

		remplirPosition(data.positions);

	}

	function remplirPosition(dataPos) {
		let htmlData = '';
		dataPos.forEach(x => {
			htmlData += '<tr><td>' + x.latitude + '</td><td>' + x.longitude + '</td><td>' + (new Date(x.date)).toDateString() + '</td></tr>';
		});
		$('#dataHTML').html(htmlData);
	}

	$("#addPos").click(function() {
		var idtele = $('#idtele').val();
		var lat = $('#lat').val();
		var longi = $('#longi').val();
		var datee = $('#datee').val();

		let obj = { "id": idtele, "latitude": lat, "longitude": longi, "date": datee }

		$.ajax({
			url: "api/smartphone/savePosition",
			data: JSON.stringify(obj),
			method: "POST",
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				remplir(data)
			}
		});
	});

});
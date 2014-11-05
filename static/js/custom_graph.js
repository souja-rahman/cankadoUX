function dateFormat(date) {
	return ("0" + date.getDate()).slice(-2) + '-' + ("0" + parseInt(date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
}
//#combGraph
function combinationGraph(dates, intake, doct, startDate, patdocgraph) {

	var g = $('#combGraph');

	var series = [{
			type: 'area',
			name: JS_LOCALE.getTrans('Einnahmetreue'),
			color: '#f7a35c',
			data: intake,
			fillColor: {
				linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
				stops: [
					[0, Highcharts.getOptions().colors[3]],
					[1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
				]
			}
		}, {
			type: 'area',
			name: JS_LOCALE.getTrans('Dokumentation'),
			color: '#7cb5ec',
			data: doct,
			
		}]
	if (patdocgraph == true)
	{
		series = [{
				type: 'area',
				name: JS_LOCALE.getTrans('Einnahmetreue'),
				color: '#f7a35c',
				data: intake,
				fillColor: {
					linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[3]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
					]
				}
			}]
		g = $('#patDocGraph')
	}
	$(g).find('.gLoading').remove();
	// create the detail chart
	function createDetail(masterChart) {

		// prepare the detail chart
		var detailData = [],
			detailStart = Date.UTC(startDate['year'], startDate['month'] + 10, startDate['day']);

		var seriesLength = masterChart.series.length;
		var seriesData = [];
		var newdetailData = [];

		for (i = 0; i < seriesLength; i++)
		{
			seriesData[i] = [];
			$.each(masterChart.series[i].data, function() {
				if (this.x >= detailStart) {

					seriesData[i].push({
						y: this.y
					})
				}
			});
		}

		for (i = 0; i < seriesLength; i++)
		{
			newdetailData.push({
				name: masterChart.series[i].name,
				type: masterChart.series[i].type,
				color: masterChart.series[i].color,
				fillColor: masterChart.series[i].fillColor,
				data: seriesData[i]
			})
		}
		// create a detail chart referenced by a global variable
		detailChart = $(g).find('.detail-container').highcharts({
			chart: {
//					marginBottom: 120,
				marginLeft: 50,
				marginRight: 20,
//					style: {
//						position: 'absolute'
//					}
			},
			credits: {
				enabled: false
			},
			title: {
				text: JS_LOCALE.getTrans('Benutzerdokumentation'),
				align: 'left'
			},
			subtitle: {
				text: '',
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats:
					{
						day: '%e.%m',
						week: '%e.%m',
						month: '%m \'%y',
					}
			},
			yAxis: {
				title: {
					text: null
				},
				maxZoom: 0.1,
				min: 0
			

			},
			tooltip: {
				formatter: function() {
					var txt = '';
					for (p = 0; p < this.points.length && p < 4; p++)
					{
						var point = this.points[p];
						if (point.y)
							txt += point.series.name + ': <b>' + Highcharts.numberFormat(point.y, 0) + '</b><br/>'
					}
					txt = '<b>' + Highcharts.dateFormat('%A %e.%m.%Y', this.x) + '</b><br/>' + txt;
					return txt;
				},
				shared: true
			},
			legend: {
				enabled: true
			},
			plotOptions: {
				series: {
					fillColor: {
						linearGradient: [0, 0, 0, 70],
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(255,255,255,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 3
							}
						}
					},
					pointStart: detailStart,
					pointInterval: 24 * 3600 * 1000
				},
				area: {
					fillColor: {
						linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						]
					}
				}
			},
			series: newdetailData,
			exporting: {
				enabled: false
			}

		}).highcharts(); // return chart
	}

	// create the master chart
	function createMaster() {
		$(g).find('.master-container').highcharts({
			chart: {
//					reflow: true,
				borderWidth: 0,
				backgroundColor: null,
				marginLeft: 50,
				marginRight: 20,
				zoomType: 'x',
				type: 'line',
				events: {
					// listen to the selection event on the master chart to update the
					// extremes of the detail chart
					selection: function(event) {
						var extremesObject = event.xAxis[0],
							min = extremesObject.min,
							max = extremesObject.max,
							detailData = [],
							xAxis = this.xAxis[0],
							newdetailData = [];
						// reverse engineer the last part of the data



						var seriesLength = this.series.length;
						var seriesData = [];


						for (i = 0; i < seriesLength; i++)
						{
							seriesData[i] = [];
							$.each(this.series[i].data, function() {
								if (this.x > min && this.x < max) {

									seriesData[i].push({
										x: this.x,
										y: this.y
									})

								}
							});
						}




						$.each(this.series[0].data, function() {
							if (this.x > min && this.x < max) {
								detailData.push({
									x: this.x,
									y: this.y
								});
							}
						});

						// move the plot bands to reflect the new detail span
						xAxis.removePlotBand('mask-before');
						xAxis.addPlotBand({
							id: 'mask-before',
							from: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
							to: min,
							color: 'rgba(0, 0, 0, 0.2)'
						});

						xAxis.removePlotBand('mask-after');
						xAxis.addPlotBand({
							id: 'mask-after',
							from: max,
							to: Date.UTC(startDate['year'], startDate['month'] + 11, startDate['day']),
							color: 'rgba(0, 0, 0, 0.2)'
						});



						for (i = 0; i < seriesLength; i++)
						{
							detailChart.series[i].setData(seriesData[i]);
//							newdetailData.push({
//								name: this.series[i].name,
//								data: seriesData[i]
//							})
						}
//						console.log(newdsetailData)
//						console.log(detailChart.series)
//							detailChart.series = newdetailData;
//							detailChart.redraw();
//						detailChart.series[0].setData(detailData);

						return false;
					}
				}
			},
			title: {
				text: null
			},
			xAxis: {
				type: 'datetime',
				showLastTickLabel: true,
				maxZoom: 14 * 24 * 3600000, // fourteen days
				plotBands: [{
						id: 'mask-before',
						from: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
						to: Date.UTC(startDate['year'], startDate['month'] + 10, startDate['day']),
						color: 'rgba(0, 0, 0, 0.2)'
					}],
				title: {
					text: null
				},
				dateTimeLabelFormats:
					{
						day: '%e.%m',
						week: '%e.%m',
						month: '%m \'%y',
					}
			},
			yAxis: {
				gridLineWidth: 1,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				showFirstLabel: true,
				max: 4,
				min: 0
			},
			tooltip: {
				formatter: function() {
					return false;
				}
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					fillColor: {
						linearGradient: [0, 0, 0, 70],
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(255,255,255,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					pointInterval: 24 * 3600 * 1000,
					pointStart: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
					enableMouseTracking: false
				}
			},
			series: series,
			exporting: {
				enabled: false
			}

		}, function(masterChart) {
			createDetail(masterChart);
		})
			.highcharts(); // return chart instance

	}

	// make the container smaller and add a second container for the master chart
	var $container = $(g)
		.css({position: 'relative', height: 400, width: '100%'})

	$('<div class="detail-container">')
		.css({position: 'relative', height: 330, width: '100%'})
		.appendTo($container);

	$('<div class="master-container">')
		.css({position: 'relative', background: '#fff', height: 70, width: '100%'})
		.appendTo($container);

	// create master and in its callback, create the detail chart
	createMaster();

}
//#nWgraph
function sideEffectGraph(dates, seData, startDate, g, title) {
	if (typeof (g) === 'undefined')
		g = '#nWgraph';
	if (typeof (title) === 'undefined')
		title = JS_LOCALE.getTrans('Nebenwirkungen');
	var subtitle = ""
	if (!seData.length)
		subtitle = JS_LOCALE.getTrans('Keine Nebenwirkungen !')

	var data = seData,
		detailChart;
	$(g).find('.gLoading').remove();
	// create the detail chart
	function createDetail(masterChart) {

		// prepare the detail chart
		var detailData = [],
			detailStart = Date.UTC(startDate['year'], startDate['month'] + 10, startDate['day']);

//		$.each(masterChart.series[0].data, function() {
//			if (this.x >= detailStart) {
//				detailData.push(this.y);
//			}
//		});

		var seriesLength = masterChart.series.length;
		var seriesData = [];
		var newdetailData = [];

		for (i = 0; i < seriesLength; i++)
		{
			seriesData[i] = [];
			$.each(masterChart.series[i].data, function() {
				if (this.x >= detailStart) {

					seriesData[i].push({
						y: this.y
					})
				}
			});
		}

		for (i = 0; i < seriesLength; i++)
		{
			newdetailData.push({
				name: masterChart.series[i].name,
				data: seriesData[i]
			})
		}
		// create a detail chart referenced by a global variable
		detailChart = $(g).find('.detail-container').highcharts({
			chart: {
//					marginBottom: 120,
				marginLeft: 50,
				marginRight: 20,
//					style: {
//						position: 'absolute'
//					}
			},
			credits: {
				enabled: false
			},
			title: {
				text: title,
				align: 'left'
			},
			subtitle: {
				text: subtitle,
				style: {'color': '#49708A', fontWeight: 'bold'},
//			align: 'left',
				y: 200

			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats:
					{
						day: '%e.%m',
						week: '%e.%m',
						month: '%m \'%y',
					}
			},
			yAxis: {
				title: {
					text: null
				},
				maxZoom: 0.1,
				max: 4,
				min: 0

			},
			tooltip: {
				formatter: function() {
					var txt = '';
					for (p = 0; p < this.points.length && p < 4; p++)
					{
						var point = this.points[p];
						if (point.y)
							txt += point.series.name + ': <b>' + Highcharts.numberFormat(point.y, 0) + '</b><br/>'
					}
					txt = '<b>' + Highcharts.dateFormat('%A %e.%m.%Y', this.x) + '</b><br/>' + txt;
					return txt;
				},
				shared: true
			},
			legend: {
				enabled: true
			},
			plotOptions: {
				series: {
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 3
							}
						}
					},
					pointStart: detailStart,
					pointInterval: 24 * 3600 * 1000
				}
			},
			series: newdetailData,
			exporting: {
				enabled: false
			}

		}).highcharts(); // return chart
	}

	// create the master chart
	function createMaster() {
		$(g).find('.master-container').highcharts({
			chart: {
//					reflow: true,
				borderWidth: 0,
				backgroundColor: null,
				marginLeft: 50,
				marginRight: 20,
				zoomType: 'x',
				type: 'line',
				events: {
					// listen to the selection event on the master chart to update the
					// extremes of the detail chart
					selection: function(event) {
						var extremesObject = event.xAxis[0],
							min = extremesObject.min,
							max = extremesObject.max,
							detailData = [],
							xAxis = this.xAxis[0],
							newdetailData = [];
						// reverse engineer the last part of the data



						var seriesLength = this.series.length;
						var seriesData = [];


						for (i = 0; i < seriesLength; i++)
						{
							seriesData[i] = [];
							$.each(this.series[i].data, function() {
								if (this.x > min && this.x < max) {

									seriesData[i].push({
										x: this.x,
										y: this.y
									})

								}
							});
						}




						$.each(this.series[0].data, function() {
							if (this.x > min && this.x < max) {
								detailData.push({
									x: this.x,
									y: this.y
								});
							}
						});

						// move the plot bands to reflect the new detail span
						xAxis.removePlotBand('mask-before');
						xAxis.addPlotBand({
							id: 'mask-before',
							from: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
							to: min,
							color: 'rgba(0, 0, 0, 0.2)'
						});

						xAxis.removePlotBand('mask-after');
						xAxis.addPlotBand({
							id: 'mask-after',
							from: max,
							to: Date.UTC(startDate['year'], startDate['month'] + 11, startDate['day']),
							color: 'rgba(0, 0, 0, 0.2)'
						});



						for (i = 0; i < seriesLength; i++)
						{
							detailChart.series[i].setData(seriesData[i]);
//							newdetailData.push({
//								name: this.series[i].name,
//								data: seriesData[i]
//							})
						}
//						console.log(newdsetailData)
//						console.log(detailChart.series)
//							detailChart.series = newdetailData;
//							detailChart.redraw();
//						detailChart.series[0].setData(detailData);

						return false;
					}
				}
			},
			title: {
				text: null
			},
			xAxis: {
				type: 'datetime',
				showLastTickLabel: true,
				maxZoom: 14 * 24 * 3600000, // fourteen days
				plotBands: [{
						id: 'mask-before',
						from: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
						to: Date.UTC(startDate['year'], startDate['month'] + 10, startDate['day']),
						color: 'rgba(0, 0, 0, 0.2)'
					}],
				title: {
					text: null
				},
				dateTimeLabelFormats:
					{
						day: '%e.%m',
						week: '%e.%m',
						month: '%m \'%y',
					}
			},
			yAxis: {
				gridLineWidth: 1,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				showFirstLabel: true,
				max: 4,
				min: 0
			},
			tooltip: {
				formatter: function() {
					return false;
				}
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					fillColor: {
						linearGradient: [0, 0, 0, 70],
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(255,255,255,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					pointInterval: 24 * 3600 * 1000,
					pointStart: Date.UTC(startDate['year'], startDate['month'] - 1, startDate['day']),
					enableMouseTracking: false
				}
			},
			series: data,
			exporting: {
				enabled: false
			}

		}, function(masterChart) {
			createDetail(masterChart);
		})
			.highcharts(); // return chart instance

	}

	// make the container smaller and add a second container for the master chart
	var $container = $(g)
		.css({position: 'relative', height: 400, width: '100%'})

	$('<div class="detail-container">')
		.css({position: 'relative', height: 330, width: '100%'})
		.appendTo($container);

	$('<div class="master-container">')
		.css({position: 'relative', background: '#fff', height: 70, width: '100%'})
		.appendTo($container);

	// create master and in its callback, create the detail chart
	createMaster();
}
//#patIntakeTimeDiff
function patIntakeTimeDiff(val, label) {


	$('#patIntakeTimeDiff').highcharts({
		chart: {
			type: 'bar'
		},
		title: {
			text: JS_LOCALE.getTrans('Dokumentationstreue (Abstand zwischen Einnahme und Dokumentation)'),
			align: 'left'
		},
		subtitle: {
			text: label,
			style: {'color': '#49708A', fontWeight: 'bold'},
		},
		xAxis: {
			categories: [''],
			title: {
				text: null
			},
		},
		yAxis: {
			min: -val - 20,
			max: val + 20,
			title: {
				text: JS_LOCALE.getTrans('Population (millions)'),
				align: 'high',
				enabled: false
			},
			labels: {
				overflow: 'justify',
				enabled: false
			}
		},
		tooltip: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: false
				},
				fillColor: {
					linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[3]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
					]
				},
			},
			enableMouseTracking: false
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
				name: 'Year 1800',
				data: [val]
			}]
	});

}
//#patIntakeQtyMean
function patIntakeQtyMean(val) {

	var max = (200 > val) ? 200 : (val + 20);

	$('#patIntakeQtyMean').highcharts({
		chart: {
			type: 'bar'
		},
		title: {
			text: JS_LOCALE.getTrans('Einnahmemenge im VerhÃ¤ltnis zur Vorgabe'),
			align: 'left'
		},
		xAxis: {
			categories: [''],
			title: {
				text: null
			},
		},
		yAxis: {
			min: -val - 20,
			max: max,
			title: {
				text: JS_LOCALE.getTrans('Population (millions)'),
				align: 'high',
				enabled: false
			},
			labels: {
				overflow: 'justify',
//				enabled: false
			}
		},
		tooltip: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: false
				},
				fillColor: {
					linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[3]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
					]
				},
			},
			enableMouseTracking: false
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
				name: 'Year 1800',
				data: [val]
			}]
	});

}




var start = dateFormat(Date.create().addDays(-30));
var end = dateFormat(Date.create());
var patient = $('#patient').val();



if ($('#combGraph').length)
{
	$.ajax({
		url: '/doctor/combinedGraph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var dates = data['days']
		var intake = data['values'][1]
		var Docume = data['values'][0]
		var startDate = data['startDate']
		combinationGraph(dates, intake, Docume, startDate);
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});
}

if ($('#nWgraph').length)
{
	$.ajax({
		url: '/doctor/seGraph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var dates = data['days']
		var sedata = data['sedata']
		var startDate = data['startDate']
		sideEffectGraph(dates, sedata, startDate);
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});
}

if ($('#uxGraph').length)
{
	$.ajax({
		url: '/doctor/unexpectedGraph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var dates = data['days']
		var sedata = data['sedata']
		var startDate = data['startDate']
		sideEffectGraph(dates, sedata, startDate, '#uxGraph', 'Unerwartet Nebenwirkungen');
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});
}

if ($('#patDocGraph').length)
{
	$.ajax({
		url: '/doctor/combinedGraph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var dates = data['days']
		var intake = data['values'][1]
		var Docume = data['values'][0]
		var startDate = data['startDate']
		combinationGraph(dates, intake, Docume, startDate, true);
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});
}

if ($('#patIntakeTimeDiff').length)
{
	$.ajax({
		url: '/patient/docdistance/graph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var value = data['value']
		var label = data['label']
		patIntakeTimeDiff(value, label);
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});
}
if ($('#patIntakeQtyMean').length)
{
	$.ajax({
		url: '/patient/intakeamount/graph/',
		type: 'GET',
		data: {start: start, end: end, patient: patient},
	}).done(function(data) {

		var value = data['value']

		patIntakeQtyMean(value);
	}).fail(function() {
		bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten beim Abrufen der Benutzerdokumentation Diagrammdaten!'));
	});

}




























'use strict';

System.register(['app/plugins/sdk', './css/multistat-panel.css!', 'lodash', 'jquery', 'jquery.flot', './external/d3', 'angular', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2', 'moment'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, $, d3, angular, kbn, config, TimeSeries, moment, _createClass, MultistatPanelCtrl;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	return {
		setters: [function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_cssMultistatPanelCss) {}, function (_lodash) {
			_ = _lodash.default;
		}, function (_jquery) {
			$ = _jquery.default;
		}, function (_jqueryFlot) {}, function (_externalD) {
			d3 = _externalD.default;
		}, function (_angular) {
			angular = _angular.default;
		}, function (_appCoreUtilsKbn) {
			kbn = _appCoreUtilsKbn.default;
		}, function (_appCoreConfig) {
			config = _appCoreConfig.default;
		}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
		}, function (_moment) {
			moment = _moment.default;
		}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			_export('PanelCtrl', MultistatPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(MultistatPanelCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function MultistatPanelCtrl($scope, $injector, alertSrv) {
					_classCallCheck(this, MultistatPanelCtrl);

					var _this = _possibleConstructorReturn(this, (MultistatPanelCtrl.__proto__ || Object.getPrototypeOf(MultistatPanelCtrl)).call(this, $scope, $injector));

					_this.alertSrv = alertSrv;

					var panelDefaults = {
						"BarPadding": 10,
						"BaseLineColor": "red",
						"BaseLineValue": 0,
						"DateTimeColName": "date",
						"DateFormat": "YYYY-MM-DD HH:mm:ss",
						"FlashHighLimitBar": true,
						"FlashLowLimitBar": true,
						"HighAxisColor": "white",
						"HighBarColor": "rgb(120, 128, 0)",
						"HighLimitBarColor": "red",
						"HighLimitBarFlashColor": "orange",
						"HighLimitBarFlashTimeout": 1000,
						"HighLimitLineColor": "red",
						"HighLimitValue": 0.33,
						"HighSideMargin": 20,
						"Horizontal": false,
						"LabelColName": "sensor",
						"LabelColor": "white",
						"LabelFontSize": "100%",
						"LabelMargin": null,
						"LowAxisColor": "white",
						"LowBarColor": "teal",
						"LowLimitBarColor": "red",
						"LowLimitBarFlashColor": "orange",
						"LowLimitBarFlashTimeout": 200,
						"LowLimitLineColor": "red",
						"LowLimitValue": null,
						"LowSideMargin": 20,
						"MaxLineColor": "rgb(74, 232, 12)",
						"MaxLineValue": 1,
						"MinLineValue": 0,
						"RecolorHighLimitBar": true,
						"RecolorLowLimitBar": false,
						"ShowBaseLine": true,
						"ShowDate": false,
						"ShowHighLimitLine": true,
						"ShowLabels": true,
						"ShowLeftAxis": true,
						"ShowLowLimitLine": false,
						"ShowMaxLine": false,
						"ShowMinLine": true,
						"ShowRightAxis": true,
						"ShowTooltips": true,
						"ShowValues": true,
						"SortColName": "value",
						"SortDirection": "ascending",
						"ValueColName": "value",
						"ValueDecimals": "2",
						"ValueColor": "white",
						"ValueFontSize": "100%",
						"OddRowColor": "rgba(33, 33, 34, 0.92)",
						"EvenRowColor": "rgba(61, 61, 64, 0.78)"
					};

					var panel = {};
					var elem = {};
					var ctrl = {};

					_.defaults(_this.panel, panelDefaults);

					_this.events.on('render', _this.onRender.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('data-error', _this.onDataError.bind(_this));
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					return _this;
				}

				_createClass(MultistatPanelCtrl, [{
					key: 'onDataError',
					value: function onDataError(err) {
						this.alertSrv.set('Multistat Data Error', err, 'error', 5000);
						this.seriesList = [];
						this.render([]);
					}
				}, {
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.metricNames = ['min', 'max', 'avg', 'current', 'total', 'name', 'first', 'delta', 'diff', 'range'];
						this.sortDirections = ['none', 'ascending', 'decending'];
						this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
						this.addEditorTab('Columns', 'public/plugins/michaeldmoore-multistat-panel/columns.html', 2);
						this.addEditorTab('Layout', 'public/plugins/michaeldmoore-multistat-panel/layout.html', 3);
						this.addEditorTab('Lines & Limits', 'public/plugins/michaeldmoore-multistat-panel/linesandlimits.html', 4);
					}
				}, {
					key: 'buildDateHtml',
					value: function buildDateHtml(dateTimeCol) {
						var $title = this.elem.closest('.panel-container').find('.panel-title');
						var $maxDate = $title.find('span.michaeldmoore-multistat-panel-maxDate');

						if ($maxDate.length == 0) $maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

						if (this.panel.ShowDate) {
							var maxDate = this.rows[0][dateTimeCol];

							for (var i = 1; i < this.rows.length; i++) {
								if (maxDate < this.rows[i][dateTimeCol]) maxDate = this.rows[i][dateTimeCol];
							}

							if (this.panel.DateFormat.toUpperCase() == 'ELAPSED') $maxDate.text(moment(maxDate).fromNow()).show();else $maxDate.text(moment(maxDate).format(this.panel.DateFormat)).show();
						} else $maxDate.hide();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						if (this.rows != null) {
							var pulse = function pulse() {
								var highFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash");
								(function highRepeat() {
									highFlashRects.transition().duration(HighLimitBarFlashTimeout).attr("fill", HighLimitBarColor).transition().duration(HighLimitBarFlashTimeout).attr("fill", HighLimitBarFlashColor).on("end", highRepeat);
								})();

								var lowFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash");
								(function lowRepeat() {
									lowFlashRects.transition().duration(LowLimitBarFlashTimeout).attr("fill", LowLimitBarColor).transition().duration(LowLimitBarFlashTimeout).attr("fill", LowLimitBarFlashColor).on("end", lowRepeat);
								})();
							};

							var cols = this.cols;
							var dateTimeCol = 0;
							var labelCol = 0;
							var valueCol = 0;
							var sortCol = 0;
							var groupCol = -1;
							for (var i = 0; i < cols.length; i++) {
								if (cols[i] == this.panel.DateTimeColName) dateTimeCol = i;
								if (cols[i] == this.panel.LabelColName) labelCol = i;
								if (cols[i] == this.panel.ValueColName) valueCol = i;
								if (cols[i] == this.panel.SortColName) sortCol = i;
								if (cols[i] == this.panel.GroupColName) groupCol = i;
							}

							var className = 'michaeldmoore-multistat-panel-' + this.panel.id;
							this.elem.html("<svg class='" + className + "'  style='height:" + this.ctrl.height + "px; width:100%'></svg>");
							var $container = this.elem.find('.' + className);

							var h = $container.height();
							var w = $container.width() - 15;

							if (this.panel.SortDirection != "none") {
								var ascending = this.panel.SortDirection == "ascending";
								this.rows.sort(function (x, y) {
									var comp = x[sortCol] == y[sortCol] ? 0 : x[sortCol] > y[sortCol] ? 1 : -1;
									return ascending ? comp : -comp;
								});
							}

							this.buildDateHtml(dateTimeCol);

							var horizontal = this.panel.Horizontal;

							var labelMargin = $.isNumeric(this.panel.LabelMargin) && this.panel.LabelMargin >= 0 ? this.panel.LabelMargin : horizontal ? 100 : 20;
							var lowSideMargin = this.panel.LowSideMargin >= 0 ? this.panel.LowSideMargin : 0;
							var highSideMargin = this.panel.HighSideMargin >= 0 ? this.panel.HighSideMargin : 0;

							var svg = d3.select('.' + className).append('svg');

							var barPadding = this.panel.BarPadding;
							var baseLineValue = this.panel.BaseLineValue;
							var minLineValue = this.panel.MinLineValue;
							var maxLineValue = this.panel.MaxLineValue;
							var highBarColor = this.panel.HighBarColor;
							var lowBarColor = this.panel.LowBarColor;
							var highLimitValue = this.panel.HighLimitValue;
							var HighLimitBarColor = this.panel.HighLimitBarColor;
							var HighLimitBarFlashColor = this.panel.HighLimitBarFlashColor;
							var HighLimitBarFlashTimeout = this.panel.HighLimitBarFlashTimeout;
							var recolorHighLimitBar = this.panel.RecolorHighLimitBar;
							var lowLimitValue = this.panel.LowLimitValue;
							var LowLimitBarColor = this.panel.LowLimitBarColor;
							var LowLimitBarFlashColor = this.panel.LowLimitBarFlashColor;
							var LowLimitBarFlashTimeout = this.panel.LowLimitBarFlashTimeout;
							var recolorLowLimitBar = this.panel.RecolorLowLimitBar;
							var flashHighLimitBar = this.panel.FlashHighLimitBar;
							var flashLowLimitBar = this.panel.FlashLowLimitBar;
							var showTooltips = this.panel.ShowTooltips;
							var DateTimeColName = this.panel.DateTimeColName;
							var DateFormat = this.panel.DateFormat;
							var ValueColName = this.panel.ValueColName;
							var ValueDecimals = this.panel.ValueDecimals;
							var OddRowColor = this.panel.OddRowColor;
							var EvenRowColor = this.panel.EvenRowColor;

							if ($.isNumeric(HighLimitBarFlashTimeout) == false) HighLimitBarFlashTimeout = 200;

							if ($.isNumeric(LowLimitBarFlashTimeout) == false) LowLimitBarFlashTimeout = 200;

							var minValue = d3.min(this.rows, function (d) {
								return Number(d[valueCol]);
							});
							if ($.isNumeric(minLineValue) == false || minLineValue > minValue) minLineValue = minValue;

							var maxValue = d3.max(this.rows, function (d) {
								return Number(d[valueCol]);
							});
							if ($.isNumeric(maxLineValue) == false || maxLineValue < maxValue) maxLineValue = maxValue;

							if ($.isNumeric(baseLineValue) == false) baseLineValue = 0;

							if (minLineValue > baseLineValue) minLineValue = baseLineValue;

							if ($.isNumeric(lowLimitValue) && minLineValue > lowLimitValue) minLineValue = lowLimitValue;

							if (maxLineValue < baseLineValue) maxLineValue = baseLineValue;

							if ($.isNumeric(highLimitValue) && maxLineValue < highLimitValue) maxLineValue = highLimitValue;

							var formatDecimal = d3.format(".2f");

							var cc1 = d3.select("body");
							var cc2 = cc1.selectAll(".michaeldmoore-multistat-panel-tooltip-" + this.panel.id);
							cc2.remove();

							var tooltipDiv = d3.select("body").append("div").attr("class", "michaeldmoore-multistat-panel-tooltip michaeldmoore-multistat-panel-tooltip-" + this.panel.id).style("opacity", 0);

							var tooltipShow = function tooltipShow(d, c) {
								tooltipDiv.transition().duration(200).style("opacity", .9);
								var html = "<table>";
								for (i = 0; i < d.length; i++) {
									var cc = c[i];
									var dd = d[i];

									if (cc == DateTimeColName) dd = moment(dd).format(DateFormat);
									//else if (cc == ValueColName && $.isNumeric(dd))
									//dd = dd.toFixed(ValueDecimals);

									html += "<tr><td>" + cc + "</td><td>" + dd + "</td></tr>";
								}
								html += "</table>";
								tooltipDiv.html(html).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
							};

							var tooltipHide = function tooltipHide() {
								tooltipDiv.transition().duration(500).style("opacity", 0);
							};

							if (horizontal) {
								var plotGroupHorizontal = function plotGroupHorizontal(panel, data, numRows, groupName, left, w) {
									var groupNameOffset = groupName != '' ? 15 : 0;
									lowSideMargin += groupNameOffset;

									var valueScale = d3.scaleLinear().domain([minLineValue, maxLineValue]).range([left + labelMargin, w]).nice();

									var labels = data.map(function (d) {
										return d[labelCol];
									});
									while (labels.length < numRows) {
										labels = labels.concat('_' + Math.random().toString(36).substr(2, 9));
									}var labelScale = d3.scaleBand().domain(labels).rangeRound([lowSideMargin, h - highSideMargin]).padding(barPadding / 100);

									// Draw background of alternating stripes 
									var oddeven = false;
									svg.append("g").selectAll("rect").data(data).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-row").attr("width", w).attr("height", labelScale.bandwidth()).attr("x", left).attr("y", function (d, i) {
										return labelScale(d[labelCol]);
									}).attr("fill", function (d) {
										oddeven = !oddeven;
										return oddeven ? OddRowColor : EvenRowColor;
									});

									function vLine(value, color) {
										svg.append("line").style("stroke", color).attr("y1", lowSideMargin).attr("x1", valueScale(value)).attr("y2", h - highSideMargin).attr("x2", valueScale(value));
									}

									if (panel.ShowBaseLine) vLine(baseLineValue, panel.BaseLineColor);

									if (panel.ShowMaxLine) vLine(maxLineValue, panel.MaxLineColor);

									if (panel.ShowMinLine) vLine(minLineValue, panel.MinLineColor);

									if (panel.ShowHighLimitLine) vLine(highLimitValue, panel.HighLimitLineColor);

									if (panel.ShowLowLimitLine) vLine(lowLimitValue, panel.LowLimitLineColor);

									svg.append("g").selectAll("rect").data(data).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-bar").attr("width", function (d) {
										var ww = valueScale(d[valueCol]) - valueScale(baseLineValue);
										if (ww < 0) ww = -ww;
										return ww;
									}).attr("height", labelScale.bandwidth()).attr("x", function (d) {
										return d3.min([valueScale(d[valueCol]), valueScale(baseLineValue)]);
									}).attr("y", function (d, i) {
										return labelScale(d[labelCol]);
									}).attr("fill", function (d) {
										if (recolorHighLimitBar && d[valueCol] > highLimitValue) return HighLimitBarColor;
										if (recolorLowLimitBar && d[valueCol] < lowLimitValue) return LowLimitBarColor;
										return d[valueCol] > baseLineValue ? highBarColor : lowBarColor;
									}).classed("highflash", function (d) {
										return recolorHighLimitBar && flashHighLimitBar && d[valueCol] > highLimitValue;
									}).classed("lowflash", function (d) {
										return recolorLowLimitBar && flashLowLimitBar && d[valueCol] < lowLimitValue;
									}).on("mouseover", function (d) {
										if (showTooltips) tooltipShow(d, cols);
									}).on("mouseout", function () {
										tooltipHide();
									});

									var g = svg.append("g").selectAll("text").data(data).enter().append("g");

									if (panel.ShowValues) {
										g.append("text").text(function (d) {
											return formatDecimal(d[valueCol]);
										}).attr("x", function (d) {
											return valueScale(d[valueCol]) + (d[valueCol] > baseLineValue ? -5 : +5);
										}).attr("y", function (d, i) {
											return labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
										}).attr("font-family", "sans-serif").attr("font-size", panel.ValueFontSize).attr("fill", panel.ValueColor).attr("text-anchor", function (d) {
											return d[valueCol] > baseLineValue ? "end" : "start";
										}).attr("dominant-baseline", "central");
									}

									if (panel.ShowLabels) {
										g.append("text").text(function (d) {
											return d[labelCol];
										}).attr("x", left + labelMargin - 5).attr("y", function (d, i) {
											return labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
										}).attr("font-family", "sans-serif").attr("font-size", panel.LabelFontSize).attr("fill", panel.LabelColor).attr("text-anchor", "end").attr("dominant-baseline", "central");
									}

									// Add Low Side Group Names
									if (groupName != '') {
										svg.append("text").text(groupName).attr("x", left + (labelMargin + w - left) / 2 - 5).attr("y", 5).attr("font-family", "sans-serif").attr("font-size", panel.LabelFontSize).attr("fill", panel.LabelColor).attr("text-anchor", "middle").attr("dominant-baseline", "central");
									}

									//Add Low Side Value Axis (X)
									if (lowSideMargin > groupNameOffset) {
										var gg = svg.append("g").attr("transform", 'translate(0,' + lowSideMargin + ')').attr("class", "michaeldmoore-multistat-panel-valueaxis").call(d3.axisTop(valueScale));
										gg.selectAll('.tick text').attr('fill', panel.LowAxisColor);
										gg.selectAll('.tick line').attr('stroke', panel.LowAxisColor);
										gg.selectAll('path.domain').attr('stroke', panel.LowAxisColor);
									}

									//Add High Side Value Axis (X)
									if (highSideMargin > 0) {
										var gg = svg.append("g").attr("transform", 'translate(0,' + (h - highSideMargin) + ')').attr("class", "michaeldmoore-multistat-panel-valueaxis").call(d3.axisBottom(valueScale));
										gg.selectAll('.tick text').attr('fill', panel.HighAxisColor);
										gg.selectAll('.tick line').attr('stroke', panel.HighAxisColor);
										gg.selectAll('path.domain').attr('stroke', panel.HighAxisColor);
									}

									lowSideMargin -= groupNameOffset;
								};

								if (groupCol >= 0) {
									this.groupedRows = d3.nest().key(function (d) {
										return d[groupCol];
									}).entries(this.rows);

									var gap = 5;
									var dw = (w + gap) / this.groupedRows.length;
									var numRows = d3.max(this.groupedRows, function (d) {
										return d.values.length;
									});

									for (var i = 0; i < this.groupedRows.length; i++) {
										plotGroupHorizontal(this.panel, this.groupedRows[i].values, numRows, this.groupedRows[i].key, i * dw, i * dw + dw - gap);
									}
								} else {
									this.groupedRows = null;

									plotGroupHorizontal(this.panel, this.rows, this.rows.length, '', 0, w);
								}
							} else {
								var hLine = function hLine(value, color) {
									svg.append("line").style("stroke", color).attr("x1", lowSideMargin).attr("y1", valueScale(value)).attr("x2", w - highSideMargin).attr("y2", valueScale(value));
								};

								var valueScale = d3.scaleLinear().domain([maxLineValue, minLineValue]).range([10, h - labelMargin]).nice();

								var labelScale = d3.scaleBand().domain(this.rows.map(function (d) {
									return d[labelCol];
								})).range([lowSideMargin, w - highSideMargin]).padding(barPadding / 100);

								// Draw background of alternating stripes 
								var oddeven = false;
								svg //.append("g")
								.selectAll("rect").data(this.rows).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-row").attr("width", labelScale.bandwidth()).attr("height", h).attr("x", function (d, i) {
									return labelScale(d[labelCol]);
								}).attr("y", 0).attr("fill", function (d) {
									oddeven = !oddeven;
									return oddeven ? OddRowColor : EvenRowColor;
								});

								if (this.panel.ShowBaseLine) hLine(baseLineValue, this.panel.BaseLineColor);

								if (this.panel.ShowMaxLine) hLine(maxLineValue, this.panel.MaxLineColor);

								if (this.panel.ShowMinLine) hLine(minLineValue, this.panel.MinLineColor);

								if (this.panel.ShowHighLimitLine) hLine(highLimitValue, this.panel.HighLimitLineColor);

								if (this.panel.ShowLowLimitLine) hLine(lowLimitValue, this.panel.LowLimitLineColor);

								svg.append("g").selectAll("rect").data(this.rows).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-bar").attr("height", function (d) {
									var hh = valueScale(d[valueCol]) - valueScale(baseLineValue);
									if (hh < 0) hh = -hh;
									return hh;
								}).attr("width", labelScale.bandwidth()).attr("y", function (d) {
									return d3.min([valueScale(d[valueCol]), valueScale(baseLineValue)]);
								}).attr("x", function (d, i) {
									return labelScale(d[labelCol]);
								}).attr("fill", function (d) {
									if (recolorHighLimitBar && d[valueCol] > highLimitValue) return HighLimitBarColor;
									if (recolorLowLimitBar && d[valueCol] < lowLimitValue) return LowLimitBarColor;
									return d[valueCol] > baseLineValue ? highBarColor : lowBarColor;
								}).classed("highflash", function (d) {
									return recolorHighLimitBar && flashHighLimitBar && d[valueCol] > highLimitValue;
								}).classed("lowflash", function (d) {
									return recolorLowLimitBar && flashLowLimitBar && d[valueCol] < lowLimitValue;
								}).on("mouseover", function (d) {
									if (showTooltips) tooltipShow(d, cols);
								}).on("mouseout", function () {
									tooltipHide();
								});

								var g = svg.selectAll("text").data(this.rows).enter().append("g");

								if (this.panel.ShowValues) {
									g.append("text").text(function (d) {
										return formatDecimal(d[valueCol]);
									}).attr("x", function (d, i) {
										return labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
									}).attr("y", function (d) {
										return valueScale(d[valueCol]) + (d[valueCol] > baseLineValue ? 5 : -5);
									}).attr("font-family", "sans-serif").attr("font-size", this.panel.ValueFontSize).attr("fill", this.panel.ValueColor).attr("text-anchor", "middle").attr("dominant-baseline", function (d) {
										return d[valueCol] > baseLineValue ? "text-before-edge" : "text-after-edge";
									});
								}

								if (this.panel.ShowLabels) {
									g.append("text").text(function (d) {
										return d[labelCol];
									}).attr("x", function (d, i) {
										return labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
									}).attr("y", function (d) {
										return h - labelMargin + 14;
									}).attr("font-family", "sans-serif").attr("font-size", this.panel.LabelFontSize).attr("fill", this.panel.LabelColor).attr("text-anchor", "middle");
								}

								if (lowSideMargin > 0) {
									var gg = svg.append("g").attr('transform', 'translate(' + lowSideMargin + ', 0)').classed('michaeldmoore-multistat-panel-valueaxis', true).call(d3.axisLeft(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
									gg.selectAll('.tick text').attr('fill', this.panel.LowAxisColor);
									gg.selectAll('.tick line').attr('stroke', this.panel.LowAxisColor);
									gg.selectAll('path.domain').attr('stroke', this.panel.LowAxisColor);
								}

								if (highSideMargin > 0) {
									var gg = svg.append("g").attr('transform', 'translate(' + (w - highSideMargin) + ', 0)').classed('michaeldmoore-multistat-panel-valueaxis', true).call(d3.axisRight(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
									gg.selectAll('.tick text').attr('fill', this.panel.HighAxisColor);
									gg.selectAll('.tick line').attr('stroke', this.panel.HighAxisColor);
									gg.selectAll('path.domain').attr('stroke', this.panel.HighAxisColor);
								}
							}

							pulse();
						}

						//var tooltipDiv = svg.append("div")
						//		.attr("class", "michaeldmoore-multistat-panel-tooltip")
						//		//.style("height", "100px")
						//		//.style("width", "100px")
						//		//.style("left", "100px")
						//		//.style("top", "100px")
						//		.style("opacity", 0);

						this.ctrl.renderingCompleted();
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (dataList.length == 0) {
							this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show</div>");
							this.rows = null;
							this.cols = [];
						} else if (dataList[0].type == "table") {
							var data = dataList[0];
							this.rows = data.rows;
							this.cols = [];
							for (var i = 0; i < data.columns.length; i++) {
								this.cols[i] = data.columns[i].text;
							}

							this.cols0 = [''].concat(this.cols);
							this.render();
						} else {
							this.alertSrv.set('Multistat Data Error', 'Query type "' + dataList[0].Type + '", not supported', 'error', 5000);
						}
					}
				}, {
					key: 'onConfigChanged',
					value: function onConfigChanged() {
						this.refresh();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						this.ctrl = ctrl;
						this.elem = elem.find('.panel-content');
					}
				}]);

				return MultistatPanelCtrl;
			}(MetricsPanelCtrl));

			MultistatPanelCtrl.templateUrl = 'module.html';

			_export('PanelCtrl', MultistatPanelCtrl);
		}
	};
});
//# sourceMappingURL=module.js.map

'use strict';

System.register(['app/plugins/sdk', './css/multistat-panel.css!', 'lodash', 'jquery', 'jquery.flot', 'angular', './external/d3', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, $, angular, d3, kbn, config, TimeSeries, _createClass, MultistatPanelCtrl;

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
		}, function (_jqueryFlot) {}, function (_angular) {
			angular = _angular.default;
		}, function (_externalD) {
			d3 = _externalD;
		}, function (_appCoreUtilsKbn) {
			kbn = _appCoreUtilsKbn.default;
		}, function (_appCoreConfig) {
			config = _appCoreConfig.default;
		}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
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
						"ShowValues": true,
						"ValueFontSize": "100%",
						"ValueColor": "white",
						"ShowLabels": true,
						"LabelFontSize": "100%",
						"LabelColor": "white",
						"ShowDate": true,
						"ShowLeftAxis": true,
						"ShowRightAxis": true,
						"ShowBaseLine": true,
						"BaseLineValue": "",
						"BaseLineColor": "red",
						"HighBarColor": "teal",
						"LowBarColor": "teal",
						"MinLineValue": "",
						"MaxLineValue": "",
						"SortDirection": "none"
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
						this.addEditorTab('Options', 'public/plugins/michaeldmoore-multistat-panel/options.html', 2);
					}
				}, {
					key: 'buildDateHtml',
					value: function buildDateHtml(dateTimeCol) {
						var $title = this.elem.closest('.panel-container').find('.panel-title.drag-handle.pointer');
						var $maxDate = $title.find('span.michaeldmoore-multistat-panel-maxDate');

						if ($maxDate.length == 0) $maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

						if (this.panel.ShowDate) {
							var maxDate = this.rows[0][dateTimeCol];

							for (var i = 1; i < this.rows.length; i++) {
								if (maxDate < this.rows[i][dateTimeCol]) maxDate = this.rows[i][dateTimeCol];
							}

							$maxDate.text(maxDate).show();
							//			$maxDate.text(d3.max(function(d) { return d[dateTimeCol]; })).show();
						} else $maxDate.hide();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						if (this.rows != null) {
							var hLine = function hLine(y, color) {
								svg.append("line").style("stroke", color).attr("x1", leftMargin).attr("y1", yScale(y)).attr("x2", w + leftMargin).attr("y2", yScale(y));
							};

							var dateTimeCol = 0;
							var labelCol = 0;
							var valueCol = 0;
							var sortCol = 0;
							for (var i = 0; i < this.cols.length; i++) {
								if (this.cols[i] == this.panel.DateTimeColName) dateTimeCol = i;
								if (this.cols[i] == this.panel.LabelColName) labelCol = i;
								if (this.cols[i] == this.panel.ValueColName) valueCol = i;
								if (this.cols[i] == this.panel.SortColName) sortCol = i;
							}

							if (this.panel.SortDirection != "none") {
								var ascending = this.panel.SortDirection == "ascending";
								this.rows.sort(function (x, y) {
									var comp = x[sortCol] == y[sortCol] ? 0 : x[sortCol] > y[sortCol] ? 1 : -1;
									return ascending ? comp : -comp;
								});
							}

							this.buildDateHtml(dateTimeCol);

							var className = 'michaeldmoore-multistat-panel';
							this.elem.html("<svg class='" + className + "'  style='height:" + this.ctrl.height + "px; width:100%'></svg>");
							var $container = this.elem.find('.' + className);
							var leftMargin = this.panel.LeftMargin >= 0 ? this.panel.LeftMargin : 0;
							var rightMargin = this.panel.RightMargin >= 0 ? this.panel.RightMargin : 0;
							var bottomMargin = 20;
							var h = $container.height() - bottomMargin;
							var w = $container.width() - leftMargin - rightMargin;
							var dw = w / this.rows.length;
							var barPadding = this.panel.BarPadding;
							var baseLineValue = this.panel.BaseLineValue;
							var minLineValue = this.panel.MinLineValue;
							var maxLineValue = this.panel.MaxLineValue;
							var highBarColor = this.panel.HighBarColor;
							var lowBarColor = this.panel.LowBarColor;

							if ($.isNumeric(barPadding) == false) barPadding = dw * 0.10;

							if ($.isNumeric(minLineValue) == false) minLineValue = d3.min(this.rows, function (d) {
								return d[valueCol];
							});

							if ($.isNumeric(maxLineValue) == false) maxLineValue = d3.max(this.rows, function (d) {
								return d[valueCol];
							});

							if ($.isNumeric(baseLineValue) == false) baseLineValue = 0;

							if (minLineValue > baseLineValue) minLineValue = baseLineValue;

							if (maxLineValue < baseLineValue) maxLineValue = baseLineValue;

							//			if (baseLineValue < minLineValue)
							//				baseLineValue = minLineValue;
							//			
							//			if (baseLineValue > maxLineValue)
							//				baseLineValue = maxLineValue;			

							var formatDecimal = d3.format(".2f");

							var yScale = d3.scaleLinear().domain([maxLineValue, minLineValue]).range([10, h]).nice();

							var svg = d3.select('.' + className);

							//			// DEBUG
							//			svg.append("rect")
							//				.attr("x", 0)
							//				.attr("y", 0) 
							//				.attr("width", $container.width())
							//				.attr("height", $container.height())
							//				.attr("fill", "yellow");


							if (this.panel.ShowBaseLine) hLine(baseLineValue, this.panel.BaseLineColor);

							if (this.panel.ShowMaxLine) hLine(maxLineValue, this.panel.MaxLineColor);

							if (this.panel.ShowMinLine) hLine(minLineValue, this.panel.MinLineColor);

							svg.selectAll("rect").data(this.rows).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-bar").attr("x", function (d, i) {
								return leftMargin + barPadding / 2 + i * dw;
							}).attr("y", function (d) {
								return d3.min([yScale(d[valueCol]), yScale(baseLineValue)]);
							}).attr("width", dw - barPadding).attr("height", function (d) {
								var hh = yScale(baseLineValue) - yScale(d[valueCol]);
								if (hh < 0) hh = -hh;
								return hh;
							}).attr("fill", function (d) {
								return yScale(d[valueCol]) < yScale(baseLineValue) ? highBarColor : lowBarColor;
							});

							var g = svg.selectAll("text").data(this.rows).enter().append("g");

							if (this.panel.ShowValues) {
								g.append("text").text(function (d) {
									return formatDecimal(d[valueCol]);
								}).attr("x", function (d, i) {
									return leftMargin + dw / 2 + i * dw;
								}).attr("y", function (d) {
									return yScale(d[valueCol]) + 14;
								}).attr("font-family", "sans-serif").attr("font-size", this.panel.ValueFontSize).attr("fill", this.panel.ValueColor).attr("text-anchor", "middle");
							}

							if (this.panel.ShowLabels) {
								g.append("text").text(function (d) {
									return d[labelCol];
								}).attr("x", function (d, i) {
									return leftMargin + dw / 2 + i * dw;
								}).attr("y", function (d) {
									return h + 14;
								}).attr("font-family", "sans-serif").attr("font-size", this.panel.LabelFontSize).attr("fill", this.panel.LabelColor).attr("text-anchor", "middle");
							}

							if (leftMargin > 0) {
								svg.append("g").attr('transform', 'translate(' + leftMargin + ', 0)').classed('michaeldmoore-multistat-panel-yaxis', true).call(d3.axisLeft(yScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
							}

							if (rightMargin > 0) {
								svg.append("g").attr('transform', 'translate(' + (leftMargin + w) + ', 0)').classed('michaeldmoore-multistat-panel-yaxis', true).call(d3.axisRight(yScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
							}

							//			// DEBUG
							//			var xScale = d3.scaleLinear()
							//				.domain([0, 100])
							//				.range([0, $container.width()]);
							//
							//			svg.append("g")
							//				.attr('transform', 'translate(0, 50)')
							//				.classed('michaeldmoore-multistat-panel-yaxis', true)
							//				.call(d3.axisBottom(xScale).tickSizeInner(10).tickSizeOuter(40).ticks(50));

						}

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
							this.rows = dataList[0].rows;
							this.parseCols(dataList[0].columns);
							this.render();
						} else {
							this.alertSrv.set('Multistat Data Error', 'Query type "' + dataList[0].Type + '", not supported', 'error', 5000);
						}
					}
				}, {
					key: 'parseCols',
					value: function parseCols(cols) {
						this.cols = [];
						for (var i = 0; i < cols.length; i++) {
							this.cols[i] = cols[i].text;
							//			if (cols[i].text == this.panel.DateTimeColName)
							//				this.DateTimeCol = i;
							//			if (cols[i].text == this.panel.LabelColName)
							//				this.LabelCol = i;
							//			if (cols[i].text == this.panel.ValueColName)
							//				this.ValueCol = i;
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

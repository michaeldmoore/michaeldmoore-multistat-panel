'use strict';

System.register(['app/plugins/sdk', './css/multistat-panel.css!', 'lodash', 'jquery', 'jquery.flot', 'angular', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, $, angular, kbn, config, TimeSeries, _createClass, MultistatPanelCtrl;

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
						"ShowDate": true,
						"ShowTopScale": false,
						"ShowBottomScale": true,
						"MinValue": "",
						"MaxValue": "",
						"Metric": {
							"Name": "current",
							"Format": "percent",
							"Color": "rgb(2, 247, 2)",
							"Decimals": "4",
							"FontSize": "100%"
						},
						"Prefix": {
							"Text": "",
							"FontSize": "hide"
						},
						"Postfix": {
							"Text": "",
							"FontSize": "hide"
						}
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
						this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
						this.fontSizes0 = ['hide'].concat(this.fontSizes);
						this.displayStates = ['disabled', 'static', 'flash'];
						this.unitFormats = kbn.getUnitFormats();
						this.addEditorTab('Options', 'public/plugins/michaeldmoore-multistat-panel/options.html', 2);
					}
				}, {
					key: 'setUnitFormat',
					value: function setUnitFormat(subItem) {
						this.panel.Metric.Format = subItem.value;
						this.render();
					}
				}, {
					key: 'buildFrameHtml',
					value: function buildFrameHtml() {
						var html = "<div class='michaeldmoore-multistat-panel-container' style='height:" + this.ctrl.height + "px;'>";
						this.buildDateHtml();
						//        if (this.data != null && this.data.value != null) {
						//            if ($.isNumeric(this.data.value)) {
						//                html += this.buildValueHtml();
						//            } else
						//                this.alertSrv.set('Multistat Data Warning', 'Last data point is non-numeric', 'warning', 5000);
						//        } else
						//            this.alertSrv.set('Multistat Data Warning', 'Last data point is null', 'info', 1000);
						//

						html += this.buildFrameRowsHtml();

						html += "</div>";

						this.elem.html(html);
					}
				}, {
					key: 'buildDateHtml',
					value: function buildDateHtml() {
						var $title = this.elem.closest('.panel-container').find('.panel-title.drag-handle.pointer');
						var $maxDate = $title.find('span.michaeldmoore-multistat-maxDate');

						if ($maxDate.length == 0) $maxDate = $title.append('<span class="michaeldmoore-multistat-maxDate"/>').children().last();

						if (this.panel.ShowDate) {
							var maxDate = this.rows[0][this.time_col];

							for (var i = 1; i < this.rows.length; i++) {
								if (maxDate < this.rows[0][this.time_col]) maxDate = this.rows[0][this.time_col];
							}

							$maxDate.text(maxDate).show();
						} else $maxDate.hide();
					}
				}, {
					key: 'buildFrameRowsHtml',
					value: function buildFrameRowsHtml() {
						var minValue = this.rows[0][this.value_col];
						var maxValue = minValue;
						for (var i = 1; i < this.rows.length; i++) {
							var value = this.rows[i][this.value_col];
							if (minValue > value) minValue = value;
							if (maxValue < value) maxValue = value;
						}

						if ($.isNumeric(this.panel.MinValue)) minValue = this.panel.MinValue;

						if ($.isNumeric(this.panel.MaxValue)) maxValue = this.panel.MaxValue;

						//		var range = maxValue - minValue;

						var html = '<table width="100%" height="100%"><tbody>';
						if (this.panel.ShowTopScale) {
							html += '<tr><td class="michaeldmoore-multistat-rows-topleft"/>';
							html += '<td class="michaeldmoore-multistat-rows-topright">bbb</td></tr>';
						}

						html += '<tr height="100%"><td class="michaeldmoore-multistat-rows-middleleft"/>';
						html += '<td class="michaeldmoore-multistat-rows-middleright"/></tr>';

						if (this.panel.ShowBottomScale) {
							html += '<tr><td class="michaeldmoore-multistat-rows-bottomleft"/>';
							html += '<td class="michaeldmoore-multistat-rows-bottomright">fff</td></tr>';
						}

						html += '</tbody></table>';
						return html;
					}
				}, {
					key: 'buildRowsHtml',
					value: function buildRowsHtml() {
						var minValue = this.rows[0][this.value_col];
						var maxValue = minValue;
						for (var i = 1; i < this.rows.length; i++) {
							var value = this.rows[i][this.value_col];
							if (minValue > value) minValue = value;
							if (maxValue < value) maxValue = value;
						}

						if ($.isNumeric(this.panel.MinValue)) minValue = this.panel.MinValue;

						if ($.isNumeric(this.panel.MaxValue)) maxValue = this.panel.MaxValue;

						var $middleLeft = this.elem.find('.michaeldmoore-multistat-rows-middleleft');
						var dy = $middleLeft.height() / this.rows.length;
						var html = '';
						for (var i = 0; i < this.rows.length; i++) {
							html += '<div style="line-height:' + dy + 'px;">' + this.rows[i][this.metric_col] + '</div>';
						}
						$middleLeft.html(html);

						var $middleRight = this.elem.find('.michaeldmoore-multistat-rows-middleright');
						html = '';
						//var gap = 0;
						//var barTop = gap;
						//var barHeight = dy - 2 * gap;
						for (var i = 0; i < this.rows.length; i++) {
							var value = this.rows[i][this.value_col];
							var percent = (value - minValue) / (maxValue - minValue);
							var barWidth = percent * $middleRight.width();
							//html += '<div style="position:relative;left:0px;top:0px;background-color:black;height:' + dy + 'px;width:' + barWidth + 'px;"/>';
							//html += '<div style="position:relative;left:10px;top:0px;">' + value + '</div>';
							html += '<div style="line-height:' + dy + 'px;">' + value + '</div>';
							//barTop += gap * 2;
						}
						$middleRight.html(html);
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						this.buildFrameHtml();
						this.buildRowsHtml();
						this.ctrl.renderingCompleted();
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (dataList.length == 0) {
							this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show</div>");
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
						for (var i = 0; i < cols.length; i++) {
							switch (cols[i].text) {
								case 'time_sec':
									{
										this.time_col = i;
										break;
									}
								case 'metric':
									this.metric_col = i;break;
								case 'value':
									this.value_col = i;break;
							}
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

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
                    key: 'buildValueHtml',
                    value: function buildValueHtml() {
                        var html = '';

                        html += "<div class='michaeldmoore-multistat-panel-value-container'>";
                        //        if (this.panel.Prefix.Text != '' && this.panel.Prefix.FontSize != 'hide')
                        //            html += this.getTextSpan('michaeldmoore-multistat-panel-prefix', this.panel.Prefix.FontSize, '', this.panel.Prefix.Text, false);
                        //
                        //        html += this.getValueSpan('michaeldmoore-multistat-panel-value', this.panel.Metric.FontSize, this.panel.Metric.Decimals, this.data.value, "Value");
                        //
                        //        if (this.panel.Postfix.Text != '' && this.panel.Postfix.FontSize != 'hide')
                        //            html += this.getTextSpan('michaeldmoore-multistat-panel-postfix', this.panel.Postfix.FontSize, '', this.panel.Postfix.Text, false);
                        //
                        html += "</div>";

                        return html;
                    }
                }, {
                    key: 'buildHtml',
                    value: function buildHtml() {
                        var html = "<div class='michaeldmoore-multistat-panel-container' style='height:" + this.ctrl.height + "px;'>";

                        if (this.data != null && this.data.value != null) {
                            if ($.isNumeric(this.data.value)) {
                                html += this.buildValueHtml();
                            } else this.alertSrv.set('Multistat Data Warning', 'Last data point is non-numeric', 'warning', 5000);
                        } else this.alertSrv.set('Multistat Data Warning', 'Last data point is null', 'info', 1000);

                        html += "</div>";

                        this.elem.html(html);
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        this.buildHtml();
                        this.ctrl.renderingCompleted();
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        var data = {};
                        if (dataList.length > 0) {
                            var dataPoints = dataList[0].datapoints;
                            if (dataPoints.length < 2) {
                                this.alertSrv.set('Multistat Data Error', 'No data', 'error', 5000);
                            } else {
                                this.series = dataList.map(this.seriesHandler.bind(this));
                                this.setValues(data);
                            }
                        }
                        this.data = data;
                        this.render();
                    }
                }, {
                    key: 'seriesHandler',
                    value: function seriesHandler(seriesData) {
                        var series = new TimeSeries({
                            datapoints: seriesData.datapoints,
                            alias: seriesData.target
                        });

                        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                        return series;
                    }
                }, {
                    key: 'getDecimalsForValue',
                    value: function getDecimalsForValue(value, decimals) {
                        if (_.isNumber(decimals)) {
                            return {
                                decimals: decimals,
                                scaledDecimals: null
                            };
                        }

                        var delta = value / 2;
                        var dec = -Math.floor(Math.log(delta) / Math.LN10);

                        var magn = Math.pow(10, -dec),
                            norm = delta / magn,
                            // norm is between 1.0 and 10.0
                        size;

                        if (norm < 1.5) {
                            size = 1;
                        } else if (norm < 3) {
                            size = 2;
                            // special case for 2.5, requires an extra decimal
                            if (norm > 2.25) {
                                size = 2.5;
                                ++dec;
                            }
                        } else if (norm < 7.5) {
                            size = 5;
                        } else {
                            size = 10;
                        }

                        size *= magn;

                        // reduce starting decimals if not needed
                        if (Math.floor(value) === value) {
                            dec = 0;
                        }

                        var result = {};
                        result.decimals = Math.max(0, dec);
                        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

                        return result;
                    }
                }, {
                    key: 'formatValue',
                    value: function formatValue(value, decimals) {
                        // crude work-around for kbn formatting function error - preserve decimal places even for whole numbers
                        if (value == 0 && decimals > 0) value += 0.000000000000001;
                        var decimalInfo = this.getDecimalsForValue(value, decimals);
                        var formatFunc = kbn.valueFormats[this.panel.Metric.Format];
                        return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                    }
                }, {
                    key: 'setValues',
                    value: function setValues(data) {
                        data.flotpairs = [];

                        if (this.series.length > 1) {
                            //            this.alertSrv.set('Multistat Multiple Series Error',
                            //                'Metric query returns ' + this.series.length + ' series. Multistat Panel expects a single series.\n\nResponse:\n' + JSON.stringify(this.series), 'error', 10000);
                        }

                        if (this.series && this.series.length > 0) {
                            var lastPoint = _.last(this.series[0].datapoints);
                            var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;

                            if (this.panel.Metric.Name === 'name') {
                                data.value = 0;
                                data.valueRounded = 0;
                                data.valueFormatted = this.series[0].alias;
                            } else if (_.isString(lastValue)) {
                                data.value = 0;
                                data.valueFormatted = _.escape(lastValue);
                                data.valueRounded = 0;
                            } else {
                                data.value = this.series[0].stats[this.panel.Metric.Name];
                                data.flotpairs = this.series[0].flotpairs;

                                if (data == null || data.value == null) {
                                    data.value = 0.0;
                                }

                                var decimalInfo = this.getDecimalsForValue(data.value, this.panel.Metric.Decimals);
                                var formatFunc = kbn.valueFormats[this.panel.Metric.Format];
                                data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                                data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
                            }

                            if (data == null || data.value == null) {
                                data.value = 0.0;
                            }

                            // Add $__name variable for using in prefix or postfix
                            data.scopedVars = _.extend({}, this.panel.scopedVars);
                            data.scopedVars["__name"] = {
                                value: this.series[0].label
                            };
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

"use strict";

System.register(["app/plugins/sdk", "jquery", "jquery.flot", "lodash", "moment", "./css/multistat-panel.css!", "./external/d3.min"], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, $, _, moment, d3, _createClass, MultistatPanelCtrl;

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
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_cssMultistatPanelCss) {}, function (_externalD3Min) {
      d3 = _externalD3Min.default;
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

      _export("PanelCtrl", MultistatPanelCtrl = function (_MetricsPanelCtrl) {
        _inherits(MultistatPanelCtrl, _MetricsPanelCtrl);

        /** @ngInject */
        function MultistatPanelCtrl($scope, $injector, variableSrv) {
          _classCallCheck(this, MultistatPanelCtrl);

          var _this = _possibleConstructorReturn(this, (MultistatPanelCtrl.__proto__ || Object.getPrototypeOf(MultistatPanelCtrl)).call(this, $scope, $injector, variableSrv));

          var panelDefaults = {
            timeFrom: null,
            timeShift: null,
            BarPadding: 10,
            MultiBarPadding: 10,
            BaseLineColor: "#ff0000",
            BaseLineWidth: 1,
            BaseLineValue: null,
            DateTimeColName: "date",
            DateFormat: "YYYY-MM-DD HH:mm:ss",
            TooltipDateFormat: "YYYY-MM-DD HH:mm:ss",
            FlashHighLimitBar: false,
            FlashLowLimitBar: false,
            HighAxisColor: "#ffffff",
            HighAxisWidth: 1,
            HighBarColor: "rgb(120, 128, 0)",
            RecolorColName: null,
            HighLimitBarColor: "#ff0000",
            HighLimitBarFlashColor: "#ffa500",
            HighLimitBarFlashTimeout: 1000,
            HighLimitLineColor: "#ff0000",
            HighLimitValue: null,
            HighLmitLineWidth: 1,
            HighSideMargin: 22,
            Horizontal: false,
            LabelColName: "",
            LabelNameFilter: "",
            LabelColor: "#ffffff",
            OutOfRangeLabelColor: "#ffffff",
            GroupLabelColor: "#ffffff",
            LabelFontSize: "100%",
            GroupLabelFontSize: "200%",
            GroupGap: 5,
            LabelMargin: null,
            Links: [],
            LowAxisColor: "#ffffff",
            LowAxisWidth: 1,
            LowBarColor: "teal",
            LowLimitBarColor: "#ff0000",
            LowLimitBarFlashColor: "#ffa500",
            LowLimitBarFlashTimeout: 200,
            LowLimitLineColor: "#ff0000",
            LowLimitValue: null,
            LowLmitLineWidth: 1,
            LowSideMargin: 22,
            MaxLineColor: "rgb(74, 232, 12)",
            MaxLineWidth: 1,
            MaxLineValue: null,
            MinLineColor: "#ff0000",
            MinLineWidth: 1,
            MinLineValue: null,
            RecolorHighLimitBar: false,
            RecolorLowLimitBar: false,
            RecolorRules: [],
            ShowBaseLine: false,
            ShowDate: false,
            Aggregate: "last",
            ShowHighLimitLine: false,
            ShowLabels: true,
            ShowGroupLabels: true,
            ShowLeftAxis: true,
            ShowLowLimitLine: false,
            ShowMaxLine: false,
            ShowMinLine: false,
            ShowRightAxis: true,
            ShowValues: true,
            SortColName: "value",
            SortDirection: "ascending",
            TZOffsetHours: 0,
            ToolTipType: "",
            ValueColName: "temperature",
            Values: [],
            ValueDecimals: 2,
            ValueColor: "#ffffff",
            ValueFontSize: "100%",
            OddRowColor: "rgba(33, 33, 34, 0.92)",
            EvenRowColor: "rgba(61, 61, 64, 0.78)",
            OutlineColor: "rgba(245, 255, 0, 0.1)",
            GroupSortString: "",
            GroupCols: 0,
            GroupNameFilter: "",
            ScaleFactor: 1,
            ValuePosition: "top",
            LableAngle: 0,
            ShowBars: true,
            ShowLines: false,
            LineWidth: 5,
            LineColor: "blue",
            DotSize: 10,
            DotColor: "white",
            CurveType: "Monotone"
          };

          _.defaults(_this.panel, panelDefaults);

          // Migrate old configurations from single value column to array of value columns
          if (_this.panel.Values.length === 0) {
            _this.panel.Values = [{
              Name: _this.panel.ValueColName,
              LowBarColor: _this.panel.LowBarColor,
              HighBarColor: _this.panel.HighBarColor
            }];
            delete _this.panel.ValueColName;
            delete _this.panel.LowBarColor;
            delete _this.panel.HighBarColor;
          }

          variableSrv.variables.forEach(function (v) {
            console.log("dashboard variable[" + v.name + "]=" + v.current.value);
            _this.updateNamedValue(_this.panel, v.name.split("_"), v.current.value);
          });

          _this.events.on("render", _this.onRender.bind(_this));
          _this.events.on("data-received", _this.onDataReceived.bind(_this));
          _this.events.on("data-error", _this.onDataError.bind(_this));
          _this.events.on("init-edit-mode", _this.onInitEditMode.bind(_this));
          _this.events.on("data-snapshot-load", _this.onDataSnapshotLoad.bind(_this));

          //    this.className = this.panelID;
          _this.className = "michaeldmoore-multistat-panel-" + _this.panel.id;
          return _this;
        }

        _createClass(MultistatPanelCtrl, [{
          key: "updateNamedValue",
          value: function updateNamedValue(obj, names, value) {
            var name = names.shift();
            if (obj[name]) {
              if (names.length) this.updateNamedValue(obj[name], names, value);else obj[name] = Number(value);
            }
          }
        }, {
          key: "onDataSnapshotLoad",
          value: function onDataSnapshotLoad(snapshotData) {
            this.onDataReceived(snapshotData);
          }
        }, {
          key: "onDataError",
          value: function onDataError(err) {
            this.seriesList = [];
            this.data = [];
            this.displayStatusMessage("Query failure, Status=" + err.status + ", " + err.statusText);
          }
        }, {
          key: "onInitEditMode",
          value: function onInitEditMode() {
            this.metricNames = ["min", "max", "avg", "current", "total", "name", "first", "delta", "diff", "range"];
            this.sortDirections = ["none", "ascending", "descending"];
            this.aggregations = ["all", "last", "first", "mean", "max", "min"];
            this.fontSizes = ["20%", "30%", "50%", "70%", "80%", "100%", "110%", "120%", "150%", "170%", "200%", "250%", "300%", "350%", "400%"];
            this.valuePositions = ["bar base", "bar end", "top"];
            this.curveTypes = ["Linear", "Monotone", "Cardinal", "Catmull-Rom"];
            this.matchTypes = ["exact", "subset", "list", "reg-ex"];
            this.tooltipTypes = ["light", "dark"];
            this.addEditorTab("Columns", "public/plugins/michaeldmoore-multistat-panel/columns.html", 2);
            this.addEditorTab("Layout", "public/plugins/michaeldmoore-multistat-panel/layout.html", 3);
            this.addEditorTab("Grouping", "public/plugins/michaeldmoore-multistat-panel/grouping.html", 4);
            this.addEditorTab("Options", "public/plugins/michaeldmoore-multistat-panel/options.html", 5);
            this.addEditorTab("Lines-and-Limits", "public/plugins/michaeldmoore-multistat-panel/linesandlimits.html", 6);
            this.addEditorTab("Bar links", "public/plugins/michaeldmoore-multistat-panel/barlinks.html", 7);
          }
        }, {
          key: "onDataReceived",
          value: function onDataReceived(data) {
            this.cols = [];
            // console.log('onDataReceived(' + JSON.stringify(data) + ')');
            if (data.length == 0) {
              this.displayStatusMessage("No data to show");
              this.data = data;
              this.rows = null;
              this.render();
            } else if (data[0].type == "table" || data[0].columns) {
              this.data = data[0];

              for (var i = 0; i < this.data.columns.length; i++) {
                this.cols[i] = this.data.columns[i].text;
              }this.cols0 = [""].concat(this.cols);

              this.render();
            } else {
              this.displayStatusMessage("Multistat only supports Table datasets");
              this.data = data;
              this.rows = null;
              this.render();
            }
          }
        }, {
          key: "onReorderValues",
          value: function onReorderValues(index, up) {
            var Values = this.ctrl.panel.Values;
            if (up) {
              if (index) Values[index] = Values.splice(index - 1, 1, Values[index])[0];
            } else {
              if (index + 1 < Values.length) Values[index] = Values.splice(index + 1, 1, Values[index])[0];
            }

            this.render();
          }
        }, {
          key: "onReorderRecolorRules",
          value: function onReorderRecolorRules(index, up) {
            var RecolorRules = this.ctrl.panel.RecolorRules;
            if (up) {
              if (index) RecolorRules[index] = RecolorRules.splice(index - 1, 1, RecolorRules[index])[0];
            } else {
              if (index + 1 < RecolorRules.length) RecolorRules[index] = RecolorRules.splice(index + 1, 1, RecolorRules[index])[0];
            }

            this.render();
          }
        }, {
          key: "onReorderLinks",
          value: function onReorderLinks(index, up) {
            var Links = this.ctrl.panel.Links;
            if (up) {
              if (index) Links[index] = Links.splice(index - 1, 1, Links[index])[0];
            } else {
              if (index + 1 < Links.length) Links[index] = Links.splice(index + 1, 1, Links[index])[0];
            }

            this.render();
          }
        }, {
          key: "buildDateHtml",
          value: function buildDateHtml(dateTimeCol) {
            var $title = this.elem.closest(".panel-container").find(".panel-title");
            var $maxDate = $title.find("span.michaeldmoore-multistat-panel-maxDate");

            if ($maxDate.length == 0) $maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

            if (dateTimeCol != -1 && this.panel.ShowDate) {
              var maxDate = this.rows[0][dateTimeCol];

              for (var i = 1; i < this.rows.length; i++) {
                if (maxDate < this.rows[i][dateTimeCol]) maxDate = this.rows[i][dateTimeCol];
              }

              var dd = moment(maxDate).add(this.panel.TZOffsetHours, "h");

              if (this.panel.DateFormat.toUpperCase() == "ELAPSED") $maxDate.text(dd.fromNow()).show();else $maxDate.text(dd.format(this.panel.DateFormat)).show();
            } else $maxDate.hide();
          }
        }, {
          key: "displayStatusMessage",
          value: function displayStatusMessage(msg) {
            this.elem.html("<div class='michaeldmoore-multistat-panel-statusmessage'>" + msg + "</div>");
          }
        }, {
          key: "onRender",
          value: function onRender() {
            var _this2 = this;

            if (this.data != null && this.data.rows && this.data.rows.length) {
              var cols = this.cols;
              var dateTimeCol = -1;
              var labelCol = -1;
              var sortCol = 0;
              var groupCol = -1;
              var recolorCol = -1;
              //      var valueCols = [];
              //      this.panel.Values.forEach(ValueCol => {valueCols.push(-1);});

              cols.forEach(function (colName, i) {
                if (colName == _this2.panel.DateTimeColName) dateTimeCol = i;
                if (colName == _this2.panel.LabelColName) labelCol = i;
                if (colName == _this2.panel.SortColName) sortCol = i;
                if (colName == _this2.panel.GroupColName) groupCol = i;
                if (colName == _this2.panel.RecolorColName) recolorCol = i;

                _this2.panel.Values.forEach(function (Value, j) {
                  if (colName == Value.Name) {
                    Value.Col = i;
                    //            valueCols[j] = i;
                  }
                });
              });

              var groupedLabelFunc = function groupedLabelFunc(obj) {
                if (groupCol != -1) return obj[groupCol] + ":" + obj[labelCol];else return obj[labelCol];
              };

              if (this.panel.LabelNameFilter.length > 0 && labelCol != -1) {
                var regex = new RegExp(this.panel.LabelNameFilter, "");
                this.matchingRows = [];
                for (var i = 0; i < this.data.rows.length; i++) {
                  var dd = this.data.rows[i];
                  var label = dd[labelCol];
                  if (label.match(regex) != null) this.matchingRows.push(dd);
                }

                if (this.matchingRows.length == 0) {
                  this.displayStatusMessage("No data.  Regex filter '" + this.panel.LabelNameFilter + "' eliminated all " + this.data.rows.length + " rows from current query");
                  return;
                }
              } else this.matchingRows = this.data.rows;

              if (this.panel.Aggregate != "all" && labelCol != -1) {
                var oo = [];
                this.rows = [];
                switch (this.panel.Aggregate) {
                  case "first":
                    this.rows = d3.nest().key(groupedLabelFunc).rollup(function (d) {
                      return d[0];
                    }).entries(this.matchingRows).forEach(function (x) {
                      oo.push(x.value);
                    });
                    this.rows = oo;
                    break;

                  case "last":
                    this.rows = d3.nest().key(groupedLabelFunc).rollup(function (d) {
                      return d[d.length - 1];
                    }).entries(this.matchingRows).forEach(function (x) {
                      oo.push(x.value);
                    });
                    this.rows = oo;
                    break;

                  case "mean":
                    this.rows = d3.nest().key(groupedLabelFunc).rollup(function (d) {
                      var dd = Object.values(Object.assign({}, d[d.length - 1]));
                      dd[this.panel.Values[0].Col] = d3.mean(d, function (d) {
                        return d[this.panel.Values[0].Col];
                      });
                      return dd;
                    }).entries(this.matchingRows).forEach(function (x) {
                      oo.push(x.value);
                    });
                    this.rows = Array.from(oo);
                    break;

                  case "max":
                    this.rows = d3.nest().key(groupedLabelFunc).rollup(function (d) {
                      var dd = Object.values(Object.assign({}, d[d.length - 1]));
                      dd[this.panel.Values[0].Col] = d3.max(d, function (d) {
                        return d[this.panel.Values[0].Col];
                      });
                      return dd;
                    }).entries(this.matchingRows).forEach(function (x) {
                      oo.push(x.value);
                    });
                    this.rows = Array.from(oo);
                    break;

                  case "min":
                    this.rows = d3.nest().key(groupedLabelFunc).rollup(function (d) {
                      var dd = Object.values(Object.assign({}, d[d.length - 1]));
                      dd[this.panel.Values[0].Col] = d3.min(d, function (d) {
                        return d[this.panel.Values[0].Col];
                      });
                      return dd;
                    }).entries(this.matchingRows).forEach(function (x) {
                      oo.push(x.value);
                    });
                    this.rows = Array.from(oo);
                    break;
                }
              } else {
                this.rows = this.matchingRows;
              }

              var groupNameOffset = this.panel.ShowGroupLabels ? Number(this.panel.GroupLabelFontSize.replace("%", "")) * 0.15 : 0;

              if (groupCol >= 0) {
                this.groupedRows = d3.nest().key(function (d) {
                  return d[groupCol];
                }).entries(this.rows);

                if (this.panel.GroupNameFilter.length > 0) {
                  var regexGroupRows = new RegExp(this.panel.GroupNameFilter, "");
                  var matchingGroups = [];
                  for (var _i = 0; _i < this.groupedRows.length; _i++) {
                    var groupName = this.groupedRows[_i].key;
                    if (groupName.match(regexGroupRows) != null) matchingGroups.push(this.groupedRows[_i]);
                  }

                  if (matchingGroups.length > 0) this.groupedRows = matchingGroups;else {
                    this.displayStatusMessage("No groups.  Group Regex filter '" + this.panel.GroupNameFilter + "' eliminated all " + this.groupedRows.length + " groups from current query");
                    return;
                  }
                }

                var groupSortString = this.panel.GroupSortString;

                this.groupedRows.sort(function (a, b) {
                  var aPos = groupSortString.search(a.key);
                  var bPos = groupSortString.search(b.key);

                  if (aPos == bPos) return a.key.localeCompare(b.key);else if (aPos == -1) return 1;else if (bPos == -1) return -1;else return aPos - bPos;
                });
              } else {
                this.groupedRows = null;
              }

              this.elem.html("<svg class='" + this.className + "'  style='height:100%; width:100%'></svg>");
              var $container = this.elem.find("." + this.className);

              var h = $container.height();
              var w = $container.width() - 15;
              this.buildDateHtml(dateTimeCol);

              var horizontal = this.panel.Horizontal;

              var labelMargin = $.isNumeric(this.panel.LabelMargin) && this.panel.LabelMargin >= 0 ? this.panel.LabelMargin : null;
              var lowSideMargin = this.panel.LowSideMargin >= 0 ? this.panel.LowSideMargin : 0;
              var highSideMargin = this.panel.HighSideMargin >= 0 ? this.panel.HighSideMargin : 0;

              this.svg = d3.select("." + this.className).append("svg");
              this.svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash").interrupt();
              this.svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash").interrupt();

              var id = this.panel.id;
              var barPadding = this.panel.BarPadding;
              var multiBarPadding = this.panel.MultiBarPadding;
              var baseLineValue = this.panel.BaseLineValue;
              var minLineValue = this.panel.MinLineValue;
              var maxLineValue = this.panel.MaxLineValue;
              var highLimitValue = this.panel.HighLimitValue;
              var HighLimitBarColor = this.panel.HighLimitBarColor;
              var HighLimitBarFlashColor = this.panel.HighLimitBarFlashColor;
              var HighLimitBarFlashTimeout = this.panel.HighLimitBarFlashTimeout;
              var recolorHighLimitBar = this.panel.RecolorHighLimitBar;
              var Links = this.panel.Links;
              var lowLimitValue = this.panel.LowLimitValue;
              var LowLimitBarColor = this.panel.LowLimitBarColor;
              var LowLimitBarFlashColor = this.panel.LowLimitBarFlashColor;
              var LowLimitBarFlashTimeout = this.panel.LowLimitBarFlashTimeout;
              var RecolorRules = this.panel.RecolorRules;
              var recolorLowLimitBar = this.panel.RecolorLowLimitBar;
              var flashHighLimitBar = this.panel.FlashHighLimitBar;
              var flashLowLimitBar = this.panel.FlashLowLimitBar;
              var tooltipType = this.panel.ToolTipType;
              var DateTimeColName = this.panel.DateTimeColName;
              var TooltipDateFormat = this.panel.TooltipDateFormat;
              var ValueColName = this.panel.ValueColName;
              var ValueDecimals = this.panel.ValueDecimals;
              var OddRowColor = this.panel.OddRowColor;
              var EvenRowColor = this.panel.EvenRowColor;
              var OutlineColor = this.panel.OutlineColor;
              var TZOffsetHours = this.panel.TZOffsetHours;
              var GroupCols = this.panel.GroupCols;
              var GroupGap = this.panel.GroupGap;
              var ScaleFactor = Number(this.panel.ScaleFactor);
              var LabelColor = this.panel.LabelColor;
              var ValuePosition = this.panel.ValuePosition;

              var Values = this.panel.Values.filter(function (value) {
                return value.Col >= 0;
              }); // ignore unmatched value columns

              var panelID = "michaeldmoore-multistat-panel-" + id;
              var tooltipDivID = "michaeldmoore-multistat-panel-tooltip-" + id;

              var minValue = Values.length && d3.min(this.rows, function (d) {
                var min = d[Values[0].Col];
                for (var i = 1; i < Values.length; i++) {
                  var col = Values[i].Col;
                  var val = Number(d[col]);
                  if (min > val) min = val;
                }
                return min * ScaleFactor;
              });
              if ($.isNumeric(minLineValue) == false) minLineValue = minValue;

              var maxValue = Values.length && d3.max(this.rows, function (d) {
                var max = d[Values[0].Col];
                for (var i = 1; i < Values.length; i++) {
                  var col = Values[i].Col;
                  var val = Number(d[col]);
                  if (max < val) max = val;
                }
                return max * ScaleFactor;
              });
              if ($.isNumeric(maxLineValue) == false) maxLineValue = maxValue;

              if ($.isNumeric(baseLineValue) == false) baseLineValue = 0;

              if (minLineValue > baseLineValue) minLineValue = baseLineValue;

              if ($.isNumeric(lowLimitValue) && minLineValue > lowLimitValue) minLineValue = lowLimitValue;

              if (maxLineValue < baseLineValue) maxLineValue = baseLineValue;

              if ($.isNumeric(highLimitValue) && maxLineValue < highLimitValue) maxLineValue = highLimitValue;

              $("#" + tooltipDivID).remove();

              var sortData = function sortData(data, sortDirection) {
                if (sortDirection != "none") {
                  var ascending = sortDirection == "ascending";
                  data.sort(function (x, y) {
                    var xx = x[sortCol];
                    var yy = y[sortCol];

                    if ($.isNumeric(xx) && $.isNumeric(yy)) return ascending ? xx - yy : yy - xx;else return ascending ? xx.localeCompare(yy) : yy.localeCompare(xx);
                  });
                }
              };

              var translateValues = function translateValues(s, d) {
                // lookup column index corresponding to the substitution tokens and replace with this bar's value
                var s1 = s;
                var re = /\{[^}]+\}/g;
                var g = re.exec(s);
                while (g) {
                  for (var i = 0; i < cols.length; i++) {
                    if (g == "{" + cols[i] + "}") {
                      s1 = s1.replace(g, d[i]);
                      break;
                    }
                  }
                  g = re.exec(s);
                }
                return s1;
              };

              var getTooltipContent = function getTooltipContent(d) {
                var html = "";
                if (tooltipType) {
                  html += "<table>";
                  if (labelCol != -1) html += "<thead><tr class='michaeldmoore-multistat-panel-tooltip-title'><th colspan='2' align='center'>" + d[labelCol] + "</th></tr></thead>";
                  html += "<tbody>";
                  for (var i = 0; i < d.length; i++) {
                    if (i != labelCol) {
                      var cc = cols[i];
                      var dd = d[i];

                      if (cc == DateTimeColName) dd = moment(dd).add(TZOffsetHours, "h").format(TooltipDateFormat);else if (cc == ValueColName && $.isNumeric(dd)) dd = Number(dd).toFixed(ValueDecimals);

                      html += "<tr><td>" + cc + "</td><td>" + dd + "</td></tr>";
                    }
                  }
                  html += "</tbody></table>";
                }

                if (Links.length) {
                  html += "<table><tbody>";
                  Links.forEach(function (l) {
                    html += "<tr><td align='right'><i class='fa fa-link'></i></td><td><a href='" + translateValues(l.url, d) + (l.newtab ? "' target='_blank'" : "'") + ">" + translateValues(l.name, d) + "</a></td></tr>";
                  });
                  html += "</tbody></table>";
                }
                return html;
              };

              var isInTooltip = false;
              var $panel;
              var $panelContent;
              var panelContent;
              var tooltipShow = function tooltipShow(d) {
                if (tooltipType || Links.length) {
                  if ($("#" + tooltipDivID).length == 0) {
                    $panel = $("." + panelID);
                    $panelContent = $panel.parent().parent().parent().parent();
                    panelContent = d3.selectAll($panelContent);
                    panelContent.append("div").attr("id", tooltipDivID).style("opacity", 0);
                  }

                  var tooltipDiv = d3.selectAll("#" + tooltipDivID);
                  tooltipDiv.classed("michaeldmoore-multistat-panel-" + tooltipType + "-tooltip", true).html(getTooltipContent(d)).on("mouseover", function () {
                    if (!isInTooltip) {
                      isInTooltip = true;
                      tooltipHide(true);
                    }
                  }).on("mouseleave", function () {
                    isInTooltip = false;
                    tooltipHide(false);
                  });

                  var $tooltipDiv = $("#" + tooltipDivID);
                  var tooltipWidth = $tooltipDiv.width();
                  var tooltipHeight = $tooltipDiv.height();
                  var minTop = 28;

                  var mouseCoordinates = d3.mouse(panelContent.node());
                  var Left = mouseCoordinates[0] - tooltipWidth / 2;
                  var Top = mouseCoordinates[1] + minTop - tooltipHeight / 2;

                  var panelWidth = $panel.width();
                  var panelHeight = $panel.height();

                  if (Left < 0) Left = 0;else if (Left > panelWidth - tooltipWidth) Left = panelWidth - tooltipWidth;

                  if (Top < 0) Top = 0;else if (Top > panelHeight + minTop - tooltipHeight) Top = panelHeight + minTop - tooltipHeight;

                  tooltipDiv.transition().duration(200).style("opacity", 1.0).style("left", Left + "px").style("top", Top + "px");
                }
              };

              var tooltipHide = function tooltipHide(cancel) {
                var tooltipDiv = d3.selectAll("#" + tooltipDivID);

                if (cancel) {
                  //console.log("cancelling tooltip hide");
                  tooltipDiv.transition().style("opacity", 1.0);
                } else {
                  tooltipDiv.transition().duration(2000).style("opacity", 0).on("end", function () {
                    d3.select(this).html("").classed("michaeldmoore-multistat-panel-" + tooltipType + "-tooltip", false);
                  });
                }
              };

              var scaleAndClipValue = function scaleAndClipValue(d) {
                var val = d * ScaleFactor;
                if (val > maxLineValue) val = maxLineValue;
                if (val < minLineValue) val = minLineValue;

                return val;
              };

              var getBarColor = function getBarColor(d, valueDef) {
                if (recolorCol != -1) {
                  var recolorString = d[recolorCol];

                  if (RecolorRules.length) {
                    if (recolorString) {
                      var recolorRule = RecolorRules.find(function (r) {
                        if (r.pattern) {
                          switch (r.matchType) {
                            case "reg-ex":
                              var re = RegExp(r.pattern);
                              return re.test(recolorString);

                            case "list":
                              return r.pattern.indexOf(recolorString) != -1;

                            case "subset":
                              return recolorString.indexOf(r.pattern) != -1;

                            default:
                              return r.pattern === recolorString;
                          }
                        }
                        return false;
                      });

                      if (recolorRule) return recolorRule.color;
                    }
                  }

                  // no matching rule found, check if recolorString is a valid color
                  var s = new Option().style;
                  s.color = recolorString;
                  if (s.color !== "") return recolorString;
                }

                var value = d[valueDef.Col] * ScaleFactor;
                if (recolorHighLimitBar && value > highLimitValue) return HighLimitBarColor;
                if (recolorLowLimitBar && value < lowLimitValue) return LowLimitBarColor;

                // All else fails, let's use the standard colors for this bar...
                return value > baseLineValue ? valueDef.HighBarColor : valueDef.LowBarColor;
              };

              if (horizontal) {
                var plotGroupHorizontal = function plotGroupHorizontal(panel, svg, data, numRows, groupName, groupNameOffset, left, w, hh, dh) {
                  // Draw border rectangle
                  /*svg.append("rect")
                  .attr("width", w)
                  .attr("height", dh)
                  .attr("x", left)
                  .attr("y", hh)
                  .attr("stroke", "yellow");*/

                  sortData(data, panel.SortDirection);

                  // Add Above-High Side Group Names
                  if (groupName != "" && panel.ShowGroupLabels) {
                    svg.append("text").text(groupName).attr("x", left + (labelMargin + w) / 2).attr("y", hh + groupNameOffset / 2).attr("font-family", "sans-serif").attr("font-size", panel.GroupLabelFontSize).attr("fill", panel.GroupLabelColor).attr("background", "blue").attr("text-anchor", "middle").attr("dominant-baseline", "central");
                  }

                  hh += groupNameOffset;
                  dh -= groupNameOffset;

                  // Draw border rectangle
                  /*svg.append("rect")
                  .attr("width", w)
                  .attr("height", dh)
                  .attr("x", left)
                  .attr("y", hh)
                  .attr("stroke", "#ffffff");*/

                  var labels = data.map(function (d) {
                    return d[labelCol];
                  });
                  while (labels.length < numRows) {
                    labels = labels.concat("_" + Math.random().toString(36).substr(2, 9));
                  }var labelScale = d3.scaleBand().domain(labels).rangeRound([hh + highSideMargin, hh + dh - lowSideMargin]).paddingInner(barPadding / 100).paddingOuter(barPadding / 200);

                  var stripedata = data.concat(d3.range(data.length, numRows));

                  var stripeScale = d3.scaleBand().domain(stripedata).rangeRound([hh + highSideMargin, hh + dh - lowSideMargin]);

                  // Draw background of alternating stripes
                  var oddeven = false;
                  svg.append("g").selectAll("rect").data(stripedata).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-row").attr("width", w).attr("height", stripeScale.step()).attr("x", left).attr("y", function (d) {
                    return stripeScale(d);
                  }).attr("fill", function (d) {
                    oddeven = !oddeven;
                    return oddeven ? OddRowColor : EvenRowColor;
                  });

                  var g1 = svg.append("g").selectAll("text").data(data).enter().append("g");

                  if (panel.ShowValues && panel.ValuePosition == "top") {
                    var maxValueWidth = 0;

                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var height = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;

                        g1.append("text").text(function (d) {
                          return (Number(d[valueCol]) * ScaleFactor).toFixed(ValueDecimals);
                        }).attr("x", left + w).attr("y", function (d, i) {
                          return labelScale(d[labelCol]) + height / 2 + (height + gap) * index;
                        }).attr("font-family", "sans-serif").attr("font-size", panel.ValueFontSize).attr("fill", panel.ValueColor).attr("text-anchor", "end").attr("dominant-baseline", "central").each(function (d, i) {
                          var thisWidth = this.getComputedTextLength();
                          maxValueWidth = d3.max([maxValueWidth, thisWidth]);
                        });
                      }
                    });

                    w -= maxValueWidth;
                  }

                  if (panel.ShowLabels) {
                    var maxLabelWidth = 0;
                    var labelAngle = Number(panel.LableAngle);
                    g1.append("text").text(function (d) {
                      return d[labelCol];
                    }).attr("font-family", "sans-serif").attr("font-size", panel.LabelFontSize).attr("fill", function (d, i) {
                      var value = d[panel.Values[0].Col] * ScaleFactor;
                      return value > maxLineValue || value < minLineValue ? panel.OutOfRangeLabelColor : panel.LabelColor;
                    }).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("transform", function (d, i) {
                      var bbox = this.getBBox();
                      var s = Math.sin(labelAngle * Math.PI / 180);
                      var c = Math.cos(labelAngle * Math.PI / 180);
                      var b = Math.abs(bbox.width * s) + Math.abs(bbox.height * c);
                      var a = Math.abs(bbox.width * c) + Math.abs(bbox.height * s);

                      var y = labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
                      var x = left + a / 2;
                      return "translate(" + x + "," + y + ") rotate(" + labelAngle + ")";
                    }).each(function (d, i) {
                      var bbox = this.getBBox();
                      var s = Math.sin(labelAngle * Math.PI / 180);
                      var c = Math.cos(labelAngle * Math.PI / 180);
                      var b = Math.abs(bbox.width * s) + Math.abs(bbox.height * c);
                      var a = Math.abs(bbox.width * c) + Math.abs(bbox.height * s);

                      var thisWidth = a;
                      maxLabelWidth = d3.max([maxLabelWidth, thisWidth]);
                    });

                    if ($.isNumeric(labelMargin)) {
                      left += labelMargin;
                      w -= labelMargin;
                    } else {
                      left += maxLabelWidth;
                      w -= maxLabelWidth;
                    }
                  }

                  var valueScale = d3.scaleLinear().domain([minLineValue, maxLineValue]).range([left + labelMargin, left + w]).nice();

                  function vLine(svg, value, color, strokeWidth) {
                    svg.append("line").style("stroke", color).attr("stroke-width", strokeWidth == null ? 1 : strokeWidth).attr("y1", hh + highSideMargin).attr("x1", valueScale(value)).attr("y2", hh + dh - lowSideMargin).attr("x2", valueScale(value));
                  }

                  if (panel.ShowBaseLine) vLine(svg, baseLineValue, panel.BaseLineColor, panel.BaseLineWidth);

                  if (panel.ShowMaxLine) vLine(svg, maxLineValue, panel.MaxLineColor, panel.MaxLineWidth);

                  if (panel.ShowMinLine) vLine(svg, minLineValue, panel.MinLineColor, panel.MinLineWidth);

                  if (panel.ShowHighLimitLine) vLine(svg, highLimitValue, panel.HighLimitLineColor, panel.HighLimitLineWidth);

                  if (panel.ShowLowLimitLine) vLine(svg, lowLimitValue, panel.LowLimitLineColor, panel.LowLimitLineWidth);

                  if (panel.ShowBars) {
                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var height = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;
                        g1.append("rect").attr("class", "michaeldmoore-multistat-panel-bar").attr("width", function (d) {
                          var val = scaleAndClipValue(d[valueCol]);
                          return Math.abs(valueScale(val) - valueScale(baseLineValue));
                        }).attr("height", height).attr("x", function (d) {
                          var val = scaleAndClipValue(d[valueCol]);
                          return d3.min([valueScale(val), valueScale(baseLineValue)]);
                        }).attr("y", function (d, i) {
                          return labelScale(d[labelCol]) + (height + gap) * index;
                        }).attr("fill", function (d) {
                          return getBarColor(d, valueDef);
                        }).classed("highflash", function (d) {
                          return recolorHighLimitBar && flashHighLimitBar && d[valueCol] * ScaleFactor > highLimitValue;
                        }).classed("lowflash", function (d) {
                          return recolorLowLimitBar && flashLowLimitBar && d[valueCol] * ScaleFactor < lowLimitValue;
                        });
                      }
                    });
                  }

                  if (panel.ShowLines) {
                    if (panel.LineWidth) {
                      var points = [];
                      var bw = labelScale.step();
                      for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var y = hh + highSideMargin + (i + 0.5) * bw;
                        var x = valueScale(d[this.panel.Values[0].Col] * ScaleFactor);
                        points.push({
                          x: x,
                          y: y
                        });
                      }

                      var curveFunc = d3.curveLinear;
                      switch (panel.CurveType) {
                        case "Linear":
                          curveFunc = d3.curveLinear;
                          break;
                        case "Monotone":
                          curveFunc = d3.curveMonotoneY;
                          break;
                        case "Cardinal":
                          curveFunc = d3.curveCardinal;
                          break;
                        case "Catmull-Rom":
                          curveFunc = d3.curveCatmullRom;
                          break;
                      }

                      var lineFunction = d3.line().curve(curveFunc).x(function (d) {
                        return d.x;
                      }).y(function (d) {
                        return d.y;
                      });

                      var lineGraph = svg.append("path").attr("d", lineFunction(points)).attr("stroke", panel.LineColor).attr("stroke-width", panel.LineWidth).attr("fill", "none");
                    }

                    if (panel.DotSize) {
                      g1.append("circle").attr("r", panel.DotSize / 2.0).attr("fill", panel.DotColor).attr("cy", function (d) {
                        return labelScale(d[labelCol]) + bw * (1.0 - barPadding / 100.0) / 2.0;
                      }).attr("cx", function (d) {
                        return valueScale(d[this.panel.Values[0].Col] * ScaleFactor);
                      });
                    }
                  }

                  if (panel.ShowValues && panel.ValuePosition != "top") {
                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var height = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;

                        g1.append("text").text(function (d) {
                          return (Number(d[valueCol]) * ScaleFactor).toFixed(ValueDecimals);
                        }).attr("x", function (d) {
                          if (panel.ValuePosition == "bar base") return valueScale(baseLineValue);else {
                            var val = scaleAndClipValue(d[valueCol]);
                            return valueScale(val) + (val > baseLineValue);
                          }
                        }).attr("y", function (d, i) {
                          return labelScale(d[labelCol]) + height / 2 + (height + gap) * index;
                        }).attr("font-family", "sans-serif").attr("font-size", panel.ValueFontSize).attr("fill", panel.ValueColor).attr("text-anchor", function (d) {
                          if (panel.ValuePosition == "bar base") return d[panel.Values[0].Col] * ScaleFactor > baseLineValue ? "start" : "end";else return d[panel.Values[0].Col] * ScaleFactor > baseLineValue ? "end" : "start";
                        }).attr("dominant-baseline", "central");
                      }
                    });
                  }

                  svg.append("g").selectAll("rect").data(stripedata).enter().append("rect").attr("width", w).attr("height", stripeScale.step()).attr("x", left).attr("y", function (d) {
                    return stripeScale(d);
                  }).attr("fill", "rgba(0,0,0,0)").attr("stroke", OutlineColor).on("mouseover", function (d) {
                    if (tooltipType || Links.length /* && i < data.length*/) tooltipShow(d);
                  }).on("mouseleave", function () {
                    if (!isInTooltip) {
                      tooltipHide(false);
                    }
                  });

                  // Add High Side Value Axis (X)
                  if (highSideMargin > 0) {
                    var ggHighSide = svg.append("g").attr("transform", "translate(1," + (hh + highSideMargin) + ")").attr("class", "michaeldmoore-multistat-panel-valueaxis").call(d3.axisTop(valueScale));

                    ggHighSide.selectAll(".tick text").attr("fill", panel.HighAxisColor);

                    ggHighSide.selectAll(".tick line").attr("stroke", panel.HighAxisColor).attr("stroke-width", panel.HighAxisWidth);

                    ggHighSide.selectAll("path.domain").attr("stroke", panel.HighAxisColor).attr("stroke-width", panel.HighAxisWidth);
                  }

                  // Add Low Side Value Axis (X)
                  if (lowSideMargin > 0) {
                    var ggLowSide = svg.append("g").attr("transform", "translate(0," + (hh + dh - lowSideMargin) + ")").attr("class", "michaeldmoore-multistat-panel-valueaxis").call(d3.axisBottom(valueScale));

                    ggLowSide.selectAll(".tick text").attr("fill", panel.LowAxisColor);

                    ggLowSide.selectAll(".tick line").attr("stroke", panel.LowAxisColor).attr("stroke-width", panel.LowAxisWidth);

                    ggLowSide.selectAll("path.domain").attr("stroke", panel.LowAxisColor).attr("stroke-width", panel.LowAxisWidth);
                  }
                };

                if (this.groupedRows != null) {
                  var gcols = GroupCols <= 0 || GroupCols > this.groupedRows.length ? this.groupedRows.length : GroupCols;
                  var dw = (w + GroupGap) / gcols;

                  // Figure out the max data points in each row of groups...
                  var pointsPerRow = [];
                  for (var _i2 = 0; _i2 < this.groupedRows.length / gcols; _i2++) {
                    pointsPerRow.push(0);
                  }for (var _i3 = 0; _i3 < this.groupedRows.length; _i3++) {
                    var _rr = Math.floor(_i3 / gcols);
                    var u = this.groupedRows[_i3].values.length;
                    if (pointsPerRow[_rr] < u) pointsPerRow[_rr] = u;
                  }

                  var totalPoints = 0;
                  for (var _i4 = 0; _i4 < pointsPerRow.length; _i4++) {
                    totalPoints += pointsPerRow[_i4];
                  }var rowOverheadHeight = groupNameOffset + this.panel.LowSideMargin + this.panel.HighSideMargin;
                  var rowHeight = (h - pointsPerRow.length * rowOverheadHeight) / totalPoints;

                  var numRows = Math.ceil(this.groupedRows.length / gcols);
                  var hh = 0;
                  for (var rr = 0; rr < numRows; rr++) {
                    var nn = pointsPerRow[rr];
                    var dh = rowOverheadHeight + nn * rowHeight;
                    hh += dh;
                    for (var cc = 0; cc < gcols; cc++) {
                      var ii = cc + rr * gcols;
                      if (ii < this.groupedRows.length) {
                        plotGroupHorizontal(this.panel, this.svg, this.groupedRows[ii].values, nn, this.groupedRows[ii].key, groupNameOffset, cc * dw, dw - GroupGap, hh - dh, dh);
                      }
                    }
                  }
                } else {
                  plotGroupHorizontal(this.panel, this.svg, this.rows, this.rows.length, "", 0, 0, w, 0, h);
                }
              } else {
                var plotGroupVertical = function plotGroupVertical(panel, svg, data, numRows, groupName, groupNameOffset, left, w, hh, dh) {
                  // Draw border rectangle
                  /*svg.append("rect")
                  .attr("width", w)
                  .attr("height", dh)
                  .attr("x", left)
                  .attr("y", hh)
                  .attr("stroke", "yellow");*/

                  sortData(data, panel.SortDirection);

                  // Add Above-High Side Group Names
                  if (groupName != "" && panel.ShowGroupLabels) {
                    svg.append("text").text(groupName).attr("x", left + (labelMargin + w) / 2).attr("y", hh + groupNameOffset / 2).attr("font-family", "sans-serif").attr("font-size", panel.GroupLabelFontSize).attr("fill", panel.GroupLabelColor).attr("background", "blue").attr("text-anchor", "middle").attr("dominant-baseline", "central");
                  }

                  hh += groupNameOffset;
                  dh -= groupNameOffset;

                  // Draw border rectangle
                  /*svg.append("rect")
                  .attr("width", w)
                  .attr("height", dh)
                  .attr("x", left)
                  .attr("y", hh)
                  .attr("stroke", "#ffffff");*/

                  var labels = data.map(function (d) {
                    return d[labelCol];
                  });
                  while (labels.length < numRows) {
                    labels = labels.concat("_" + Math.random().toString(36).substr(2, 9));
                  }var labelScale = d3.scaleBand().domain(labels).range([left + lowSideMargin, left + w - highSideMargin]).paddingInner(barPadding / 100).paddingOuter(barPadding / 200);

                  var stripedata = data.concat(d3.range(data.length, numRows));

                  var stripeScale = d3.scaleBand().domain(stripedata).range([left + lowSideMargin, left + w - highSideMargin]);

                  // Draw background of alternating stripes
                  var oddeven = false;
                  svg.append("g").selectAll("rect").data(stripedata).enter().append("rect").attr("class", "michaeldmoore-multistat-panel-row").attr("width", stripeScale.step()).attr("height", dh).attr("x", function (d, i) {
                    return stripeScale(d);
                  }).attr("y", hh).attr("fill", function (d) {
                    oddeven = !oddeven;
                    return oddeven ? OddRowColor : EvenRowColor;
                  });

                  var g2 = svg.append("g").selectAll("text").data(data).enter().append("g");

                  if (panel.ShowValues && panel.ValuePosition == "top") {
                    var maxValueHeight = 0;

                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var width = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;

                        g2.append("text").text(function (d) {
                          return (Number(d[valueCol]) * ScaleFactor).toFixed(ValueDecimals);
                        }).attr("x", function (d, i) {
                          return labelScale(d[labelCol]) + width / 2 + (width + gap) * index;
                        }).attr("y", hh).attr("font-family", "sans-serif").attr("font-size", panel.ValueFontSize).attr("fill", panel.ValueColor).attr("text-anchor", "middle").attr("dominant-baseline", "text-before-edge").each(function (d, i) {
                          var thisHeight = this.getBBox().height;
                          maxValueHeight = d3.max([maxValueHeight, thisHeight]);
                        });
                      }
                    });

                    hh += maxValueHeight;
                    dh -= maxValueHeight;
                  }

                  if (panel.ShowLabels) {
                    var maxLabelHeight = 0;
                    var labelAngle = Number(panel.LableAngle);
                    g2.append("text").text(function (d) {
                      return d[labelCol];
                    }).attr("font-family", "sans-serif").attr("font-size", panel.LabelFontSize).attr("fill", function (d, i) {
                      return d[panel.Values[0].Col] * ScaleFactor > maxLineValue || d[panel.Values[0].Col] * ScaleFactor < minLineValue ? panel.OutOfRangeLabelColor : LabelColor;
                    }).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("transform", function (d, i) {
                      var bbox = this.getBBox();
                      var s = Math.sin(labelAngle * Math.PI / 180);
                      var c = Math.cos(labelAngle * Math.PI / 180);
                      var b = Math.abs(bbox.width * s) + Math.abs(bbox.height * c);
                      var a = Math.abs(bbox.width * c) + Math.abs(bbox.height * s);

                      var x = labelScale(d[labelCol]) + labelScale.bandwidth() / 2;
                      var y = hh + dh - b / 2;
                      return "translate(" + x + "," + y + ") rotate(" + labelAngle + ")";
                    }).each(function (d, i) {
                      var bbox = this.getBBox();
                      var s = Math.sin(labelAngle * Math.PI / 180);
                      var c = Math.cos(labelAngle * Math.PI / 180);
                      var b = Math.abs(bbox.width * s) + Math.abs(bbox.height * c);
                      var a = Math.abs(bbox.width * c) + Math.abs(bbox.height * s);

                      var thisHeight = b;
                      maxLabelHeight = d3.max([maxLabelHeight, thisHeight]);
                    });
                    if ($.isNumeric(labelMargin)) {
                      dh -= labelMargin;
                    } else {
                      dh -= maxLabelHeight;
                    }
                  }

                  var valueScale = d3.scaleLinear().domain([maxLineValue, minLineValue]).range([hh, hh + dh]).nice();

                  function hLine(svg, value, color, strokeWidth) {
                    svg.append("line").style("stroke", color).attr("stroke-width", strokeWidth == null ? 1 : strokeWidth).attr("x1", left + lowSideMargin).attr("y1", valueScale(value)).attr("x2", left + w - highSideMargin).attr("y2", valueScale(value));
                  }

                  if (panel.ShowBaseLine) hLine(svg, baseLineValue, panel.BaseLineColor, panel.BaseLineWidth);

                  if (panel.ShowMaxLine) hLine(svg, maxLineValue, panel.MaxLineColor, panel.MaxLineWidth);

                  if (panel.ShowMinLine) hLine(svg, minLineValue, panel.MinLineColor, panel.MinLineWidth);

                  if (panel.ShowHighLimitLine) hLine(svg, highLimitValue, panel.HighLimitLineColor, panel.HighLimitLineWidth);

                  if (panel.ShowLowLimitLine) hLine(svg, lowLimitValue, panel.LowLimitLineColor, panel.LowLimitLineWidth);

                  if (panel.ShowBars) {
                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var width = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;

                        g2.append("rect").attr("class", "michaeldmoore-multistat-panel-bar").attr("height", function (d) {
                          var val = scaleAndClipValue(d[valueCol]);
                          return Math.abs(valueScale(baseLineValue) - valueScale(val));
                        }).attr("width", width).attr("y", function (d) {
                          var val = scaleAndClipValue(d[valueCol]);
                          return d3.min([valueScale(val), valueScale(baseLineValue)]);
                        }).attr("x", function (d, i) {
                          return labelScale(d[labelCol]) + (width + gap) * index;
                        }).attr("fill", function (d) {
                          return getBarColor(d, valueDef);
                        }).classed("highflash", function (d) {
                          return recolorHighLimitBar && flashHighLimitBar && d[valueCol] * ScaleFactor > highLimitValue;
                        }).classed("lowflash", function (d) {
                          return recolorLowLimitBar && flashLowLimitBar && d[valueCol] * ScaleFactor < lowLimitValue;
                        });
                      }
                    });
                  }

                  if (panel.ShowLines) {
                    if (panel.LineWidth) {
                      var points = [];
                      var bw = labelScale.step();
                      for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var x = left + lowSideMargin + (i + 0.5) * bw;
                        var y = valueScale(d[this.panel.Values[0].Col] * ScaleFactor);
                        points.push({
                          x: x,
                          y: y
                        });
                      }

                      var curveFunc = d3.curveLinear;
                      switch (panel.CurveType) {
                        case "Linear":
                          curveFunc = d3.curveLinear;
                          break;
                        case "Monotone":
                          curveFunc = d3.curveMonotoneX;
                          break;
                        case "Cardinal":
                          curveFunc = d3.curveCardinal;
                          break;
                        case "Catmull-Rom":
                          curveFunc = d3.curveCatmullRom;
                          break;
                      }

                      var lineFunction = d3.line().curve(curveFunc).x(function (d) {
                        return d.x;
                      }).y(function (d) {
                        return d.y;
                      });

                      var lineGraph = svg.append("path").attr("d", lineFunction(points)).attr("stroke", panel.LineColor).attr("stroke-width", panel.LineWidth).attr("fill", "none");
                    }

                    if (panel.DotSize) {
                      g2.append("circle").attr("r", panel.DotSize / 2.0).attr("fill", panel.DotColor).attr("cx", function (d) {
                        return labelScale(d[labelCol]) + bw * (1.0 - barPadding / 100.0) / 2.0;
                      }).attr("cy", function (d) {
                        return valueScale(d[this.panel.Values[0].Col] * ScaleFactor);
                      });
                    }
                  }

                  if (panel.ShowValues && panel.ValuePosition != "top") {
                    panel.Values.forEach(function (valueDef, index) {
                      var valueCol = valueDef.Col;
                      if (valueCol >= 0) {
                        var gap = panel.Values.length > 1 ? labelScale.bandwidth() * multiBarPadding / (panel.Values.length - 1) / 100 : 0;
                        var width = (labelScale.bandwidth() - gap * (panel.Values.length - 1)) / panel.Values.length;

                        g2.append("text").text(function (d) {
                          return (Number(d[valueCol]) * ScaleFactor).toFixed(ValueDecimals);
                        }).attr("x", function (d, i) {
                          return labelScale(d[labelCol]) + width / 2 + (width + gap) * index;
                        }).attr("y", function (d) {
                          if (ValuePosition == "bar base") return valueScale(baseLineValue);else {
                            var val = scaleAndClipValue(d[valueCol]);
                            return valueScale(val);
                          }
                        }).attr("font-family", "sans-serif").attr("font-size", panel.ValueFontSize).attr("fill", panel.ValueColor).attr("text-anchor", "middle").attr("dominant-baseline", function (d) {
                          if (ValuePosition == "bar base") return d[valueCol] * ScaleFactor > baseLineValue ? "text-after-edge" : "text-before-edge";else return d[valueCol] * ScaleFactor > baseLineValue ? "text-before-edge" : "text-after-edge";
                        });
                      }
                    });
                  }

                  svg.append("g").selectAll("rect").data(stripedata).enter().append("rect").attr("width", stripeScale.step()).attr("height", dh).attr("x", function (d) {
                    return stripeScale(d);
                  }).attr("y", hh).attr("fill", "rgba(0,0,0,0)").attr("stroke", OutlineColor).on("mouseover", function (d) {
                    if (tooltipType || Links.length) tooltipShow(d);
                  }).on("mouseleave", function () {
                    tooltipHide(false);
                  });

                  if (lowSideMargin > 0) {
                    var ggLowSide = svg.append("g").attr("transform", "translate(" + (left + lowSideMargin) + ", 0)").classed("michaeldmoore-multistat-panel-valueaxis", true).call(d3.axisLeft(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
                    ggLowSide.selectAll(".tick text").attr("fill", panel.LowAxisColor);
                    ggLowSide.selectAll(".tick line").attr("stroke", panel.LowAxisColor).attr("stroke-width", panel.LowAxisWidth);
                    ggLowSide.selectAll("path.domain").attr("stroke", panel.LowAxisColor).attr("stroke-width", panel.LowAxisWidth);
                  }

                  if (highSideMargin > 0) {
                    var ggHighSide = svg.append("g").attr("transform", "translate(" + (left + w - highSideMargin) + ", 0)").classed("michaeldmoore-multistat-panel-valueaxis", true).call(d3.axisRight(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
                    ggHighSide.selectAll(".tick text").attr("fill", panel.HighAxisColor);
                    ggHighSide.selectAll(".tick line").attr("stroke", panel.HighAxisColor).attr("stroke-width", panel.HighAxisWidth);
                    ggHighSide.selectAll("path.domain").attr("stroke", panel.HighAxisColor).attr("stroke-width", panel.HighAxisWidth);
                  }
                };

                var _groupNameOffset = this.panel.ShowGroupLabels ? Number(this.panel.GroupLabelFontSize.replace("%", "")) * 0.15 : 0;

                if (this.groupedRows != null) {
                  var _gcols = GroupCols <= 0 || GroupCols > this.groupedRows.length ? this.groupedRows.length : GroupCols;
                  var _dw = (w + GroupGap) / _gcols;

                  // Figure out the max data points in each column of groups...
                  var pointsPerCol = [];
                  for (var _i5 = 0; _i5 < _gcols; _i5++) {
                    pointsPerCol.push(0);
                  }for (var _i6 = 0; _i6 < this.groupedRows.length; _i6++) {
                    var _cc = _i6 % _gcols;
                    var _u = this.groupedRows[_i6].values.length;
                    if (pointsPerCol[_cc] < _u) pointsPerCol[_cc] = _u;
                  }

                  var _totalPoints = 0;
                  for (var _i7 = 0; _i7 < pointsPerCol.length; _i7++) {
                    _totalPoints += pointsPerCol[_i7];
                  }var colOverheadWidth = this.panel.LowSideMargin + this.panel.HighSideMargin;
                  var colWidth = (w - pointsPerCol.length * colOverheadWidth) / _totalPoints;

                  var _numRows = Math.ceil(this.groupedRows.length / _gcols);
                  var _dh = h / _numRows;
                  var _hh = _dh;
                  for (var _rr2 = 0; _rr2 < _numRows; _rr2++) {
                    var ww = 0;
                    for (var _cc2 = 0; _cc2 < _gcols; _cc2++) {
                      var _nn = pointsPerCol[_cc2];

                      var _ii = _cc2 + _rr2 * _gcols;
                      if (_ii < this.groupedRows.length) {
                        plotGroupVertical(this.panel, this.svg, this.groupedRows[_ii].values, _nn, this.groupedRows[_ii].key, _groupNameOffset, ww, _dw - GroupGap, _hh - _dh, _dh);
                        ww += _dw;
                      }
                    }
                    _hh += _dh;
                  }
                } else {
                  plotGroupVertical(this.panel, this.svg, this.rows, this.rows.length, "", 0, 0, w, 0, h);
                }
              }

              var pulseHigh = function pulseHigh(svg) {
                var highFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash");

                if ($.isNumeric(HighLimitBarFlashTimeout) && highFlashRects._groups.length > 0 && highFlashRects._groups[0].length > 0) {
                  highFlashRects.transition().on("start", function highRepeat() {
                    d3.active(this).style("fill", HighLimitBarFlashColor).duration(HighLimitBarFlashTimeout).transition().style("fill", HighLimitBarColor).duration(HighLimitBarFlashTimeout).transition().on("start", highRepeat);
                  });
                }
              };

              var pulseLow = function pulseLow(svg) {
                var lowFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash");
                if ($.isNumeric(LowLimitBarFlashTimeout) && lowFlashRects._groups.length > 0 && lowFlashRects._groups[0].length > 0) {
                  lowFlashRects.transition().on("start", function lowRepeat() {
                    d3.active(this).style("fill", LowLimitBarFlashColor).duration(LowLimitBarFlashTimeout).transition().style("fill", LowLimitBarColor).duration(LowLimitBarFlashTimeout).transition().on("start", lowRepeat);
                  });
                }
              };

              pulseHigh(this.svg);
              pulseLow(this.svg);
            }

            this.ctrl.renderingCompleted();
          }
        }, {
          key: "onConfigChanged",
          value: function onConfigChanged() {
            this.refresh();
          }
        }, {
          key: "link",
          value: function link(scope, elem, attrs, ctrl) {
            this.ctrl = ctrl;
            this.elem = elem;

            // for backward compatability (grafana 6.6.0 and earlier)
            var panelContentElem = elem.find(".panel-content");
            if (panelContentElem.length) this.elem = panelContentElem;
          }
        }]);

        return MultistatPanelCtrl;
      }(MetricsPanelCtrl));

      MultistatPanelCtrl.templateUrl = "module.html";

      _export("PanelCtrl", MultistatPanelCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map

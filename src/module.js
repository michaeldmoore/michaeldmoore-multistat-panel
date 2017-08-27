import {
    MetricsPanelCtrl
} from 'app/plugins/sdk';

import "./css/multistat-panel.css!";

import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import angular from 'angular';
import * as d3 from './external/d3';
import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';

class MultistatPanelCtrl extends MetricsPanelCtrl {

    /** @ngInject */
    constructor($scope, $injector, alertSrv) {
        super($scope, $injector);

        this.alertSrv = alertSrv;

        var panelDefaults = {
			"ShowDate": true,
			"ShowLeftAxis": true,
			"ShowRightAxis": true,
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
                "FontSize": "hide",
            },
            "Postfix": {
                "Text": "",
                "FontSize": "hide",
            }
        };

        var panel = {};
        var elem = {};
        var ctrl = {};

        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    }

    onDataError(err) {
        this.alertSrv.set('Multistat Data Error', err, 'error', 5000);
        this.seriesList = [];
        this.render([]);
    }

    onInitEditMode() {
        this.metricNames = ['min', 'max', 'avg', 'current', 'total', 'name', 'first', 'delta', 'diff', 'range'];
        this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
        this.fontSizes0 = ['hide'].concat(this.fontSizes);
        this.displayStates = ['disabled', 'static', 'flash'];
        this.unitFormats = kbn.getUnitFormats();
        this.addEditorTab('Options', 'public/plugins/michaeldmoore-multistat-panel/options.html', 2);
    }

    setUnitFormat(subItem) {
        this.panel.Metric.Format = subItem.value;
        this.render();
    }

	buildDateHtml(){
		var $title = this.elem.closest('.panel-container').find('.panel-title.drag-handle.pointer');
		var $maxDate = $title.find('span.michaeldmoore-multistat-panel-maxDate');

		if($maxDate.length == 0)
			$maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

		if (this.panel.ShowDate) {
			var maxDate = this.rows[0][this.time_col];

			for(var i = 1; i < this.rows.length; i++){
				if (maxDate < this.rows[0][this.time_col])
					maxDate = this.rows[0][this.time_col];
			}
			
			$maxDate.text(maxDate).show();
		}
		else
			$maxDate.hide();			
	}


	
    onRender() {
		this.buildDateHtml();
		var className = 'michaeldmoore-multistat-panel';
		this.elem.html("<svg class='" + className + "'  style='height:" + this.ctrl.height + "px; width:100%'></svg>");
		var $container = this.elem.find('.' + className);
		var leftMargin = this.panel.ShowLeftAxis ? 40 : 0;
		var rightMargin = this.panel.ShowRightAxis ? 40 : 0;
		var bottomMargin = 20;
		var h = $container.height() - bottomMargin;
		var w = $container.width() - leftMargin - rightMargin;
		var dw = w / this.rows.length;
		var barPadding = 10;
		var minValue = this.panel.MinValue;
		var maxValue = this.panel.MaxValue;

		if ($.isNumeric(minValue) == false)
			minValue = d3.min(this.rows, function(d) { return d[2]; });
		
		if ($.isNumeric(maxValue) == false)
			maxValue = d3.max(this.rows, function(d) { return d[2]; });
		
		var formatDecimal = d3.format(".2f");
		
		var yScale = d3.scaleLinear()
                    .domain([maxValue, minValue])
                    .range([10, h])
					.nice();
					
		var svg = d3.select('.' + className);

		function hLine(y) {	
			svg.append("line")
				.style("stroke", "yellow")
				.attr("x1", leftMargin - barPadding)
				.attr("y1", yScale(y))
				.attr("x2", w + rightMargin)
				.attr("y2", yScale(y));
		}			

		hLine(0.37);
		hLine(0.09);
		hLine(0.00);
		
		svg.selectAll("rect")
			.data(this.rows)
			.enter()
			.append("rect")
			.attr("class", "michaeldmoore-multistat-panel-bar")
			.attr("x", function(d, i) { return leftMargin + i * dw; })
			.attr("y", function(d) { return yScale(d[2]); })
			.attr("width", dw - barPadding)
			.attr("height", function(d) { return yScale(0) - yScale(d[2]); })
			.attr("fill", "teal");
			
		var g = svg.selectAll("text")
			.data(this.rows)
			.enter()
			.append("g");
			
			g.append("text")
			.text(function(d) { return formatDecimal(d[2]); })
			.attr("x", function(d, i) { return leftMargin + (i * dw) + (dw - barPadding) / 2; })
			.attr("y", function(d) { return yScale(d[2]) + 14; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			.attr("text-anchor", "middle");

			g.append("text")
			.text(function(d) { return d[1]; })
			.attr("x", function(d, i) { return leftMargin + (i * dw) + (dw - barPadding) / 2; })
			.attr("y", function(d) { return h + 14; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			.attr("text-anchor", "middle");


		if (this.panel.ShowLeftAxis) {	
			svg.append("g")
				.attr('transform', 'translate(30, 0)')
				.classed('michaeldmoore-multistat-panel-yaxis', true)
				.call(d3.axisLeft(yScale).tickSizeInner(5).tickSizeOuter(leftMargin - w).ticks(5));
		}
		
		if (this.panel.ShowRightAxis) {	
			svg.append("g")
				.attr('transform', 'translate(' + (w + rightMargin) + ', 0)')
				.classed('michaeldmoore-multistat-panel-yaxis', true)
				.call(d3.axisRight(yScale).tickSizeInner(5).tickSizeOuter(rightMargin - w).ticks(5));
		}
		
        this.ctrl.renderingCompleted();
    }


    onDataReceived(dataList) {
		if (dataList.length == 0){
			this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show</div>");
		}
		else if (dataList[0].type == "table"){
			this.rows = dataList[0].rows;
			this.parseCols(dataList[0].columns);
			this.render();
		}
		else {
          this.alertSrv.set('Multistat Data Error', 'Query type "' + dataList[0].Type + '", not supported', 'error', 5000);
		}
    }

	parseCols(cols){
		for(var i=0; i<cols.length; i++){
			switch(cols[i].text){
				case 'time_sec': {
					this.time_col = i; 
					break;
				}
				case 'metric': this.metric_col = i; break;
				case 'value': this.value_col = i; break;
			}
		}
	}
//    seriesHandler(seriesData) {
//        var series = new TimeSeries({
//            datapoints: seriesData.datapoints,
//            alias: seriesData.target,
//        });
//
//        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
//        return series;
//    }
//
//    getDecimalsForValue(value, decimals) {
//        if (_.isNumber(decimals)) {
//            return {
//                decimals: decimals,
//                scaledDecimals: null
//            };
//        }
//
//        var delta = value / 2;
//        var dec = -Math.floor(Math.log(delta) / Math.LN10);
//
//        var magn = Math.pow(10, -dec),
//            norm = delta / magn, // norm is between 1.0 and 10.0
//            size;
//
//        if (norm < 1.5) {
//            size = 1;
//        } else if (norm < 3) {
//            size = 2;
//            // special case for 2.5, requires an extra decimal
//            if (norm > 2.25) {
//                size = 2.5;
//                ++dec;
//            }
//        } else if (norm < 7.5) {
//            size = 5;
//        } else {
//            size = 10;
//        }
//
//        size *= magn;
//
//        // reduce starting decimals if not needed
//        if (Math.floor(value) === value) {
//            dec = 0;
//        }
//
//        var result = {};
//        result.decimals = Math.max(0, dec);
//        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
//
//        return result;
//    }
//
//    formatValue(value, decimals) {
//        // crude work-around for kbn formatting function error - preserve decimal places even for whole numbers
//        if (value == 0 && decimals > 0)
//            value += 0.000000000000001;
//        var decimalInfo = this.getDecimalsForValue(value, decimals);
//        var formatFunc = kbn.valueFormats[this.panel.Metric.Format];
//        return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
//    }
//
//    setValues(data) {
//        data.flotpairs = [];
//
//        if (this.series.length > 1) {
//            this.alertSrv.set('Multistat Multiple Series Error',
//                'Metric query returns ' + this.series.length + ' series. Multistat Panel expects a single series.\n\nResponse:\n' + JSON.stringify(this.series), 'error', 10000);
//        }
//
//        if (this.series && this.series.length > 0) {
//            var lastPoint = _.last(this.series[0].datapoints);
//            var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
//
//            if (this.panel.Metric.Name === 'name') {
//                data.value = 0;
//                data.valueRounded = 0;
//                data.valueFormatted = this.series[0].alias;
//            } else if (_.isString(lastValue)) {
//                data.value = 0;
//                data.valueFormatted = _.escape(lastValue);
//                data.valueRounded = 0;
//            } else {
//                data.value = this.series[0].stats[this.panel.Metric.Name];
//                data.flotpairs = this.series[0].flotpairs;
//
//                if (data == null || data.value == null) {
//                    data.value = 0.0;
//                }
//
//                var decimalInfo = this.getDecimalsForValue(data.value, this.panel.Metric.Decimals);
//                var formatFunc = kbn.valueFormats[this.panel.Metric.Format];
//                data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
//                data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
//            }
//
//            if (data == null || data.value == null) {
//                data.value = 0.0;
//            }
//
//            // Add $__name variable for using in prefix or postfix
//            data.scopedVars = _.extend({}, this.panel.scopedVars);
//            data.scopedVars["__name"] = {
//                value: this.series[0].label
//            };
//        }
//    }

    onConfigChanged() {
        this.refresh();
    }

    link(scope, elem, attrs, ctrl) {
        this.ctrl = ctrl;
        this.elem = elem.find('.panel-content');
    }
}

MultistatPanelCtrl.templateUrl = 'module.html';

export {
    MultistatPanelCtrl as PanelCtrl
};

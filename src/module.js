import {
    MetricsPanelCtrl
} from 'app/plugins/sdk';

import "./css/multistat-panel.css!";

import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import angular from 'angular';
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

    buildFrameHtml() {
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

	buildDateHtml(){
		var $title = this.elem.closest('.panel-container').find('.panel-title.drag-handle.pointer');
		var $maxDate = $title.find('span.michaeldmoore-multistat-maxDate');

		if($maxDate.length == 0)
			$maxDate = $title.append('<span class="michaeldmoore-multistat-maxDate"/>').children().last();

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

	buildFrameRowsHtml(){
		var minValue = this.rows[0][this.value_col];
		var maxValue = minValue;
		for(var i = 1; i < this.rows.length; i++){
			var value = this.rows[i][this.value_col]; 
			if (minValue > value)
				minValue = value;
			if (maxValue < value)
				maxValue = value;
		}
		
		if ($.isNumeric(this.panel.MinValue))
			minValue = this.panel.MinValue;
		
		if ($.isNumeric(this.panel.MaxValue))
			maxValue = this.panel.MaxValue;
		
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

	buildRowsHtml() {
		var minValue = this.rows[0][this.value_col];
		var maxValue = minValue;
		for(var i = 1; i < this.rows.length; i++){
			var value = this.rows[i][this.value_col]; 
			if (minValue > value)
				minValue = value;
			if (maxValue < value)
				maxValue = value;
		}
		
		if ($.isNumeric(this.panel.MinValue))
			minValue = this.panel.MinValue;
		
		if ($.isNumeric(this.panel.MaxValue))
			maxValue = this.panel.MaxValue;

		var $middleLeft = this.elem.find('.michaeldmoore-multistat-rows-middleleft');
		var dy = $middleLeft.height() / this.rows.length;
		var html = '';
		for(var i = 0; i < this.rows.length; i++){
			html += '<div style="line-height:' + dy + 'px;">' + this.rows[i][this.metric_col] + '</div>';
		}
        $middleLeft.html(html);

		var $middleRight = this.elem.find('.michaeldmoore-multistat-rows-middleright');
		html = '';
		//var gap = 0;
		//var barTop = gap;
		//var barHeight = dy - 2 * gap;
		for(var i = 0; i < this.rows.length; i++){
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
	
    onRender() {
        this.buildFrameHtml();
        this.buildRowsHtml();
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

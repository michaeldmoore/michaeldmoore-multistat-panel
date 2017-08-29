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
		this.sortDirections = ['none', 'ascending', 'decending'];
        this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
        this.addEditorTab('Options', 'public/plugins/michaeldmoore-multistat-panel/options.html', 2);
    }

	buildDateHtml(dateTimeCol){
		var $title = this.elem.closest('.panel-container').find('.panel-title.drag-handle.pointer');
		var $maxDate = $title.find('span.michaeldmoore-multistat-panel-maxDate');

		if($maxDate.length == 0)
			$maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

		if (this.panel.ShowDate) {
			var maxDate = this.rows[0][dateTimeCol];

			for(var i = 1; i < this.rows.length; i++){
				if (maxDate < this.rows[i][dateTimeCol])
					maxDate = this.rows[i][dateTimeCol];
			}
			
			$maxDate.text(maxDate).show();
//			$maxDate.text(d3.max(function(d) { return d[dateTimeCol]; })).show();
		}
		else
			$maxDate.hide();			
	}


	
    onRender() {
		if (this.rows != null) {
			var dateTimeCol = 0;
			var labelCol = 0;
			var valueCol = 0;
			var sortCol = 0;
			for(var i=0; i < this.cols.length; i++){
				if (this.cols[i] == this.panel.DateTimeColName)
					dateTimeCol = i;
				if (this.cols[i] == this.panel.LabelColName)
					labelCol = i;
				if (this.cols[i] == this.panel.ValueColName)
					valueCol = i;
				if (this.cols[i] == this.panel.SortColName)
					sortCol = i;
			}

			if (this.panel.SortDirection != "none"){
				var ascending = this.panel.SortDirection == "ascending";
				this.rows.sort(function(x, y){
					var comp = (x[sortCol] == y[sortCol]) ? 0 : ((x[sortCol] > y[sortCol]) ? 1 : -1);
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

			if ($.isNumeric(barPadding) == false)
				barPadding = dw * 0.10;
			
			if ($.isNumeric(minLineValue) == false)
				minLineValue = d3.min(this.rows, function(d) { return d[valueCol]; });
			
			if ($.isNumeric(maxLineValue) == false)
				maxLineValue = d3.max(this.rows, function(d) { return d[valueCol]; });
			
			if ($.isNumeric(baseLineValue) == false)
				baseLineValue = 0;
			
			if (minLineValue > baseLineValue)
				minLineValue = baseLineValue;
			
			if (maxLineValue < baseLineValue)
				maxLineValue = baseLineValue;
			
//			if (baseLineValue < minLineValue)
//				baseLineValue = minLineValue;
//			
//			if (baseLineValue > maxLineValue)
//				baseLineValue = maxLineValue;			
			
			var formatDecimal = d3.format(".2f");
			
			var yScale = d3.scaleLinear()
						.domain([maxLineValue, minLineValue])
						.range([10, h])
						.nice();

			var svg = d3.select('.' + className);

//			// DEBUG
//			svg.append("rect")
//				.attr("x", 0)
//				.attr("y", 0) 
//				.attr("width", $container.width())
//				.attr("height", $container.height())
//				.attr("fill", "yellow");



			
			function hLine(y, color) {	
				svg.append("line")
					.style("stroke", color)
					.attr("x1", leftMargin)
					.attr("y1", yScale(y))
					.attr("x2", w + leftMargin)
					.attr("y2", yScale(y));
			}			

			if(this.panel.ShowBaseLine)
				hLine(baseLineValue, this.panel.BaseLineColor);

			if(this.panel.ShowMaxLine)
				hLine(maxLineValue, this.panel.MaxLineColor);

			if(this.panel.ShowMinLine)
				hLine(minLineValue, this.panel.MinLineColor);

			
			svg.selectAll("rect")
				.data(this.rows)
				.enter()
				.append("rect")
				.attr("class", "michaeldmoore-multistat-panel-bar")
				.attr("x", function(d, i) { return leftMargin + (barPadding / 2) + (i * dw); })
				.attr("y", function(d) { 
						return d3.min([yScale(d[valueCol]), yScale(baseLineValue)]); 
					})
				.attr("width", dw - barPadding)
				.attr("height", function(d) { 
						var hh = yScale(baseLineValue) - yScale(d[valueCol]);
						if (hh < 0)
							hh = -hh;
						return hh; 
					})
				.attr("fill", function(d) { 
						return (yScale(d[valueCol]) < yScale(baseLineValue)) ? highBarColor : lowBarColor;
					});
				
			var g = svg.selectAll("text")
				.data(this.rows)
				.enter()
				.append("g");
				
				if (this.panel.ShowValues) {
					g.append("text")
					.text(function(d) { return formatDecimal(d[valueCol]); })
					.attr("x", function(d, i) { return leftMargin + (dw / 2) + (i * dw); })
					.attr("y", function(d) { return yScale(d[valueCol]) + 14; })
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.ValueFontSize)
					.attr("fill", this.panel.ValueColor)
					.attr("text-anchor", "middle");
				}

				if (this.panel.ShowLabels) {
					g.append("text")
					.text(function(d) { return d[labelCol]; })
					.attr("x", function(d, i) { return leftMargin + (dw / 2) + (i * dw); })
					.attr("y", function(d) { return h + 14; })
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.LabelFontSize)
					.attr("fill", this.panel.LabelColor)
					.attr("text-anchor", "middle");
				}

			if (leftMargin > 0) {	
				svg.append("g")
					.attr('transform', 'translate(' + leftMargin + ', 0)')
					.classed('michaeldmoore-multistat-panel-yaxis', true)
					.call(d3.axisLeft(yScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
			}
			
			if (rightMargin > 0) {	
				svg.append("g")
					.attr('transform', 'translate(' + (leftMargin + w) + ', 0)')
					.classed('michaeldmoore-multistat-panel-yaxis', true)
					.call(d3.axisRight(yScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
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


    onDataReceived(dataList) {
		if (dataList.length == 0){
			this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show</div>");
			this.rows = null;
			this.cols = [];
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
		this.cols = [];
		for(var i=0; i < cols.length; i++){
			this.cols[i] = cols[i].text;
//			if (cols[i].text == this.panel.DateTimeColName)
//				this.DateTimeCol = i;
//			if (cols[i].text == this.panel.LabelColName)
//				this.LabelCol = i;
//			if (cols[i].text == this.panel.ValueColName)
//				this.ValueCol = i;
		}
	}

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

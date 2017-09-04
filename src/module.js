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
			"Horizontal": false,
			"ShowValues": true,
			"ValueFontSize": "100%",
			"ValueColor": "white",
			"ShowLabels": true,
			"LabelFontSize": "100%",
			"LabelColor": "white",
			"HighLimitValue": "",
			"HighLimitLineColor": "red",
			"ShowHighLimitLine": false,
			"RecolorHighLimitBar": false,
			"HighLimitBarColor": "red",
			"HighLimitBarFlashColor": "orange",
			"HighLimitBarFlashTimeout": 200,
			"FlashHighLimitBar": true,
			"LowLimitLineColor": "red",
			"ShowLowLimitLine": false,
			"RecolorLowLimitBar": false,
			"LowLimitBarColor": "red",
			"LowLimitBarFlashColor": "orange",
			"LowLimitBarFlashTimeout": 200,
			"FlashLowLimitBar": true,
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
			"SortDirection": "none",
			"ShowTooltips": true
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
			var cols = this.cols;
			var dateTimeCol = 0;
			var labelCol = 0;
			var valueCol = 0;
			var sortCol = 0;
			for(var i=0; i < cols.length; i++){
				if (cols[i] == this.panel.DateTimeColName)
					dateTimeCol = i;
				if (cols[i] == this.panel.LabelColName)
					labelCol = i;
				if (cols[i] == this.panel.ValueColName)
					valueCol = i;
				if (cols[i] == this.panel.SortColName)
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
			
			var horizontal = this.panel.Horizontal;
			
			var className = 'michaeldmoore-multistat-panel-' + this.panel.id;
			this.elem.html("<svg class='" + className + "'  style='height:" + this.ctrl.height + "px; width:100%'></svg>");
			var $container = this.elem.find('.' + className);
			var labelMargin = ($.isNumeric(this.panel.LabelMargin) && this.panel.LabelMargin >= 0) ? this.panel.LabelMargin : (horizontal ? 100 : 20);
			var lowSideMargin = this.panel.LowSideMargin >= 0 ? this.panel.LowSideMargin : 0;
			var highSideMargin = this.panel.HighSideMargin >= 0 ? this.panel.HighSideMargin : 0;

			var svg = d3.select('.' + className).append('svg');			

			var h = $container.height();
			var w = $container.width() - 5;
			var dw = (w  - lowSideMargin - highSideMargin) / this.rows.length;
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
			
			if ($.isNumeric(barPadding) == false)
				barPadding = dw * 0.10;
			
			if ($.isNumeric(HighLimitBarFlashTimeout) == false)
				HighLimitBarFlashTimeout = 200;
			
			if ($.isNumeric(LowLimitBarFlashTimeout) == false)
				LowLimitBarFlashTimeout = 200;
			
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
			
			var formatDecimal = d3.format(".2f");

			var tooltipDiv = d3.select("body").append("div")
				.attr("class", "michaeldmoore-multistat-panel-tooltip")
				.style("opacity", 0);
				
			var tooltipShow = function(d, c){
				tooltipDiv.transition()
				.duration(200)
				.style("opacity", .9);
				var html = "<table>";
				for (i = 0; i < d.length; i++)
					html += "<tr><td>" + c[i] + "</td><td>" + d[i] + "</td></tr>";
				html += "</table>";
				tooltipDiv.html(html)
				//tooltipDiv.html(d[dateTimeCol] + "<br/>" + d[labelCol] + "<br/>" + d[valueCol])
				//tooltipDiv.html(JSON.stringify(d, undefined, 2))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			}

			var tooltipHide = function() {
				tooltipDiv.transition()		
				.duration(500)		
				.style("opacity", 0);	
			}
			
			if(horizontal) {
				var valueScale = d3.scaleLinear()
							.domain([minLineValue, maxLineValue])
							.range([labelMargin, w])
							.nice();
				
				var labelScale = d3.scaleBand()
							.domain(this.rows.map(function(d){ return d[labelCol]; }))
							.rangeRound([lowSideMargin, h - highSideMargin])
							.padding(barPadding / 100);
			
				function vLine(value, color) {	
					svg.append("line")
						.style("stroke", color)
						.attr("y1", lowSideMargin)
						.attr("x1", valueScale(value))
						.attr("y2", h - highSideMargin)
						.attr("x2", valueScale(value));
				}			

				if(this.panel.ShowBaseLine)
					vLine(baseLineValue, this.panel.BaseLineColor);

				if(this.panel.ShowMaxLine)
					vLine(maxLineValue, this.panel.MaxLineColor);

				if(this.panel.ShowMinLine)
					vLine(minLineValue, this.panel.MinLineColor);

				if(this.panel.ShowHighLimitLine)
					vLine(highLimitValue, this.panel.HighLimitLineColor);

				if(this.panel.ShowLowLimitLine)
					vLine(lowLimitValue, this.panel.LowLimitLineColor);

				svg.selectAll("rect")
					.data(this.rows)
					.enter()
					.append("rect")
					.attr("class", "michaeldmoore-multistat-panel-bar")
					.attr("width", function(d) { 
						var ww = valueScale(d[valueCol]) - valueScale(baseLineValue);
						if (ww < 0)
							ww = -ww;
						return ww; 
						})
					.attr("height", labelScale.bandwidth())
					.attr("x", function(d) { 
						return d3.min([valueScale(d[valueCol]), valueScale(baseLineValue)]); 
						})
					.attr("y", function(d,i){return labelScale(d[labelCol])})
					.attr("fill", function(d) { 
						if (recolorHighLimitBar && (d[valueCol] > highLimitValue))
							return HighLimitBarColor;
						if (recolorLowLimitBar && (d[valueCol] < lowLimitValue))
							return LowLimitBarColor;
						return (d[valueCol] > baseLineValue) ? highBarColor : lowBarColor;
						})
					.classed("highflash", function(d) { 
						return recolorHighLimitBar && flashHighLimitBar && (d[valueCol] > highLimitValue);
						})
					.classed("lowflash", function(d) { 
						return recolorLowLimitBar && flashLowLimitBar && (d[valueCol] < lowLimitValue);
						})
				    .on("mouseover", function(d) {
						if (showTooltips)
							tooltipShow(d, cols);
						})
					.on("mouseout", function() { 
						tooltipHide();
						});

				var g = svg.selectAll("text")
							.data(this.rows)
							.enter()
							.append("g");
					
				if (this.panel.ShowValues) {
					g.append("text")
					.text(function(d) {return formatDecimal(d[valueCol])})
					.attr("x", function(d){
							return valueScale(d[valueCol]) + ((d[valueCol] > baseLineValue) ? - 5 : + 5);
						})
					.attr("y", function(d,i){return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2)})
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.ValueFontSize)
					.attr("fill", this.panel.LabelColor)
					.attr("text-anchor", function(d){
							return (d[valueCol] > baseLineValue) ? "end" : "start";
						})
					.attr("dominant-baseline", "central");
				}

				if (this.panel.ShowLabels) {
					g.append("text")
					.text(function(d) { return d[labelCol]; })
					.attr("x", labelMargin / 2)
					.attr("y", function(d,i){return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2)})
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.LabelFontSize)
					.attr("fill", this.panel.LabelColor)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "central");
				}
				
				//Add Low Side Value Axis (X)
				if (lowSideMargin > 0) {	
					svg.append("g")
							.attr("transform", 'translate(0,' + lowSideMargin + ')')
							.attr("class", "michaeldmoore-multistat-panel-valueaxis")
							.call(d3.axisTop(valueScale));
				}
				
				//Add High Side Value Axis (X)
				if (highSideMargin > 0) {	
					svg.append("g")
							.attr("transform", 'translate(0,' + (h - highSideMargin) + ')')
							.attr("class", "michaeldmoore-multistat-panel-valueaxis")
							.call(d3.axisBottom(valueScale));
				}
				
			}
			else {
				var valueScale = d3.scaleLinear()
							.domain([maxLineValue, minLineValue])
							.range([0, h - labelMargin])
							.nice();
				
				var labelScale = d3.scaleBand()
							.domain(this.rows.map(function(d){ return d[labelCol]; }))
							.range([lowSideMargin, w - highSideMargin])
							.padding(barPadding / 100);
			
				function hLine(value, color) {	
					svg.append("line")
						.style("stroke", color)
						.attr("x1", lowSideMargin)
						.attr("y1", valueScale(value))
						.attr("x2", w - highSideMargin)
						.attr("y2", valueScale(value));
				}			

				if(this.panel.ShowBaseLine)
					hLine(baseLineValue, this.panel.BaseLineColor);

				if(this.panel.ShowMaxLine)
					hLine(maxLineValue, this.panel.MaxLineColor);

				if(this.panel.ShowMinLine)
					hLine(minLineValue, this.panel.MinLineColor);

				if(this.panel.ShowHighLimitLine)
					hLine(highLimitValue, this.panel.HighLimitLineColor);

				if(this.panel.ShowLowLimitLine)
					hLine(lowLimitValue, this.panel.LowLimitLineColor);

				
				svg.selectAll("rect")
					.data(this.rows)
					.enter()
					.append("rect")	
					.attr("class", "michaeldmoore-multistat-panel-bar")
					.attr("height", function(d) { 
						var hh = valueScale(d[valueCol]) - valueScale(baseLineValue);
						if (hh < 0)
							hh = -hh;
						return hh; 
						})
					.attr("width", labelScale.bandwidth())
					.attr("y", function(d) { 
						return d3.min([valueScale(d[valueCol]), valueScale(baseLineValue)]); 
						})
					.attr("x", function(d, i) { return labelScale(d[labelCol]) })
					.attr("fill", function(d) { 
						if (recolorHighLimitBar && (d[valueCol] > highLimitValue))
							return HighLimitBarColor;
						if (recolorLowLimitBar && (d[valueCol] < lowLimitValue))
							return LowLimitBarColor;
						return (d[valueCol] > baseLineValue) ? highBarColor : lowBarColor;
						})
					.classed("highflash", function(d) { 
						return recolorHighLimitBar && flashHighLimitBar && (d[valueCol] > highLimitValue);
						})
					.classed("lowflash", function(d) { 
						return recolorLowLimitBar && flashLowLimitBar && (d[valueCol] < lowLimitValue);
						})
				    .on("mouseover", function(d) {
						if (showTooltips)
							tooltipShow(d, cols);
						})
					.on("mouseout", function() { 
						tooltipHide();
						});

				
				var g = svg.selectAll("text")
					.data(this.rows)
					.enter()
					.append("g");
					
				if (this.panel.ShowValues) {
					g.append("text")
					.text(function(d) { return formatDecimal(d[valueCol]); })
					.attr("x", function(d, i) { return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2); })
					.attr("y", function(d){
						return valueScale(d[valueCol]) + ((d[valueCol] > baseLineValue) ? 5 : -5);
					})						
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.ValueFontSize)
					.attr("fill", this.panel.ValueColor)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", function(d){return (d[valueCol] > baseLineValue) ? "text-before-edge" : "text-after-edge"});
				}

				if (this.panel.ShowLabels) {
					g.append("text")
					.text(function(d) { return d[labelCol]; })
					.attr("x", function(d, i) { return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2); })
					.attr("y", function(d) { return h - labelMargin + 14; })
					.attr("font-family", "sans-serif")
					.attr("font-size", this.panel.LabelFontSize)
					.attr("fill", this.panel.LabelColor)
					.attr("text-anchor", "middle");
				}

				if (lowSideMargin > 0) {	
					svg.append("g")
						.attr('transform', 'translate(' + lowSideMargin + ', 0)')
						.classed('michaeldmoore-multistat-panel-valueaxis', true)
						.call(d3.axisLeft(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
				}
				
				if (highSideMargin > 0) {	
					svg.append("g")
						.attr('transform', 'translate(' + (w - highSideMargin) + ', 0)')
						.classed('michaeldmoore-multistat-panel-valueaxis', true)
						.call(d3.axisRight(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
				}
			}
		
			function pulse() {
				var highFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash");
				(function highRepeat() {
					highFlashRects.transition()
					.duration(HighLimitBarFlashTimeout)
					.attr("fill", HighLimitBarColor)
					.transition()
					.duration(HighLimitBarFlashTimeout)
					.attr("fill", HighLimitBarFlashColor)
					.on("end", highRepeat);
				})();

				var lowFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash");
				(function lowRepeat() {
					lowFlashRects.transition()
					.duration(LowLimitBarFlashTimeout)
					.attr("fill", LowLimitBarColor)
					.transition()
					.duration(LowLimitBarFlashTimeout)
					.attr("fill", LowLimitBarFlashColor)
					.on("end", lowRepeat);
				})();
			}

			pulse();
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

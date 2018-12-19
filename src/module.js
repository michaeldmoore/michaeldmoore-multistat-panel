import {
    MetricsPanelCtrl
} from 'app/plugins/sdk';

import "./css/multistat-panel.css!";

import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import d3 from './external/d3';
import angular from 'angular';
import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
import moment from 'moment';


class MultistatPanelCtrl extends MetricsPanelCtrl {

    /** @ngInject */
    constructor($scope, $injector, alertSrv) {
        super($scope, $injector);

        this.alertSrv = alertSrv;

        var panelDefaults = {
			"BarPadding": 10,
			"BaseLineColor": "red",
			"BaseLineValue": 0,
			"DateTimeColName": "date",
			"DateFormat": "YYYY-MM-DD HH:mm:ss",
			"TooltipDateFormat": "YYYY-MM-DD HH:mm:ss",
			"FlashHighLimitBar": false,
			"FlashLowLimitBar": false,
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
			"Aggregate": "last",
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
			"TZOffsetHours": 0,
			"ValueColName": "value",
			"ValueDecimals": 2,
			"ValueColor": "white",
			"ValueFontSize": "100%",
			"OddRowColor": "rgba(33, 33, 34, 0.92)",
			"EvenRowColor": "rgba(61, 61, 64, 0.78)",
			"GroupSortString": ""
			};

        var panel = {};
        var elem = {};
        var ctrl = {};
		
        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

		this.className = 'michaeldmoore-multistat-panel-' + this.panel.id;
		this.svg = d3.select('.' + this.className).append('svg');	
    }

    onDataError(err) {
        this.alertSrv.set('Multistat Data Error', err.data.message == 'Found no column named time' ? 'Time-Series queries not yet supported' : err.data.message, 'error', 5000);
        this.seriesList = [];
		this.data = [];
        this.render();
    }

    onInitEditMode() {
		this.metricNames = ['min', 'max', 'avg', 'current', 'total', 'name', 'first', 'delta', 'diff', 'range'];
		this.sortDirections = ['none', 'ascending', 'descending'];
		this.aggregations = ['all', 'last', 'first', 'mean', 'max', 'min'];
        this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
        this.addEditorTab('Columns', 'public/plugins/michaeldmoore-multistat-panel/columns.html', 2);
        this.addEditorTab('Layout', 'public/plugins/michaeldmoore-multistat-panel/layout.html', 3);
        this.addEditorTab('Lines-and-Limits', 'public/plugins/michaeldmoore-multistat-panel/linesandlimits.html', 4);
    }


    onDataReceived(data) {
		this.cols = [];
		if (data.length == 0){
			this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show</div>");
			this.data = data;
			this.rows = null;
			this.render();
		}
		else if (data[0].type == "table"){
			this.data = data[0];

			for(var i=0; i < this.data.columns.length; i++)
				this.cols[i] = this.data.columns[i].text;
			this.cols0 = [''].concat(this.cols);

			this.render();
		}
		else {
          this.alertSrv.set('Non-Table type data received', 'Multistat does not support Time Series data sets', 'error', 5000);
		}
    }

	buildDateHtml(dateTimeCol){
		var $title = this.elem.closest('.panel-container').find('.panel-title');
		var $maxDate = $title.find('span.michaeldmoore-multistat-panel-maxDate');

		if($maxDate.length == 0)
			$maxDate = $title.append('<span class="michaeldmoore-multistat-panel-maxDate"/>').children().last();

		if (dateTimeCol != -1 && this.panel.ShowDate) {
			var maxDate = this.rows[0][dateTimeCol];

			for(var i = 1; i < this.rows.length; i++){
				if (maxDate < this.rows[i][dateTimeCol])
					maxDate = this.rows[i][dateTimeCol];
			}
			
			var dd = moment(maxDate).add(this.panel.TZOffsetHours, 'h');
			
			if (this.panel.DateFormat.toUpperCase() == 'ELAPSED')
				$maxDate.text(dd.fromNow()).show();
			else
				$maxDate.text(dd.format(this.panel.DateFormat)).show();
		}
		else
			$maxDate.hide();			
	}


    onRender() {
		if (this.data != null && this.data.rows != null) {
			var cols = this.cols;
			var dateTimeCol = -1;
			var labelCol = -1;
			var valueCol = 0;
			var sortCol = 0;
			var groupCol = -1;
			for(var i=0; i < cols.length; i++){
				if (cols[i] == this.panel.DateTimeColName)
					dateTimeCol = i;
				if (cols[i] == this.panel.LabelColName)
					labelCol = i;
				if (cols[i] == this.panel.ValueColName)
					valueCol = i;
				if (cols[i] == this.panel.SortColName)
					sortCol = i;
				if (cols[i] == this.panel.GroupColName)
					groupCol = i;
			}

		
			if (this.panel.Aggregate != 'all' && labelCol != -1){
				var oo = [];
				this.rows = [];
				switch(this.panel.Aggregate) {
					case 'first':
						this.rows = d3.nest()
							.key(function(d){return d[labelCol]})
							.rollup(function(d){return d[0]})
							.entries(this.data.rows)
							.forEach(function(x){oo.push(x.value); });
						this.rows = oo;
					break;

					case 'last':
						this.rows = d3.nest()
							.key(function(d){return d[labelCol]})
							.rollup(function(d){return d[d.length - 1]})
							.entries(this.data.rows)
							.forEach(function(x){oo.push(x.value); });
						this.rows = oo;
					break;

					case 'mean':
						this.rows = d3.nest()
							.key(function(d){return d[labelCol]})
							.rollup(function(d){
								var dd = Object.values(Object.assign({}, d[d.length - 1]));
								dd[valueCol] = d3.mean(d, function(d) { return d[valueCol];});
								return dd;
								})
							.entries(this.data.rows)
							.forEach(function(x){oo.push(x.value); });
						this.rows = Array.from(oo);
					break;

					case 'max':
						this.rows = d3.nest()
							.key(function(d){return d[labelCol]})
							.rollup(function(d){
								var dd = Object.values(Object.assign({}, d[d.length - 1]));
								dd[valueCol] = d3.max(d, function(d) { return d[valueCol];});
								return dd;
								})
							.entries(this.data.rows)
							.forEach(function(x){oo.push(x.value); });
						this.rows = Array.from(oo);
					break;

					case 'min':
						this.rows = d3.nest()
							.key(function(d){return d[labelCol]})
							.rollup(function(d){
								var dd = Object.values(Object.assign({}, d[d.length - 1]));
								dd[valueCol] = d3.min(d, function(d) { return d[valueCol];});
								return dd;
								})
							.entries(this.data.rows)
							.forEach(function(x){oo.push(x.value); });
						this.rows = Array.from(oo);
					break;
				}
			}
			else {
				this.rows = this.data.rows;
			}		

			
			this.elem.html("<svg class='" + this.className + "'  style='height:" + this.ctrl.height + "px; width:100%'></svg>");
			var $container = this.elem.find('.' + this.className);

			var h = $container.height();
			var w = $container.width() - 15;

			if (this.panel.SortDirection != "none"){
				var ascending = this.panel.SortDirection == "ascending";
				this.rows.sort(function(x, y){
					var comp = (x[sortCol] == y[sortCol]) ? 0 : ((x[sortCol] > y[sortCol]) ? 1 : -1);
					return ascending ? comp : -comp;
				});				
			}
			
			this.buildDateHtml(dateTimeCol);
			
			var horizontal = this.panel.Horizontal;
			
			var labelMargin = ($.isNumeric(this.panel.LabelMargin) && this.panel.LabelMargin >= 0) ? this.panel.LabelMargin : (horizontal ? 100 : 20);
			var lowSideMargin = this.panel.LowSideMargin >= 0 ? this.panel.LowSideMargin : 0;
			var highSideMargin = this.panel.HighSideMargin >= 0 ? this.panel.HighSideMargin : 0;

			this.svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash").interrupt();
			this.svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash").interrupt();

			this.svg = d3.select('.' + this.className).append('svg');	
			

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
			var TooltipDateFormat = this.panel.TooltipDateFormat;
			var ValueColName = this.panel.ValueColName;
			var ValueDecimals = this.panel.ValueDecimals;
			var OddRowColor = this.panel.OddRowColor;
			var EvenRowColor = this.panel.EvenRowColor;
			var TZOffsetHours = this.panel.TZOffsetHours;
			var GroupSortString = this.panel.GroupSortString;
			
			var minValue = d3.min(this.rows, function(d) { return Number(d[valueCol]); });
			if ($.isNumeric(minLineValue) == false || minLineValue > minValue)
				minLineValue = minValue;
			
			var maxValue = d3.max(this.rows, function(d) { return Number(d[valueCol]); });
			if ($.isNumeric(maxLineValue) == false || maxLineValue < maxValue)
				maxLineValue = maxValue;				
			
			if ($.isNumeric(baseLineValue) == false)
				baseLineValue = 0;
			
			if (minLineValue > baseLineValue)
				minLineValue = baseLineValue;
			
			if ($.isNumeric(lowLimitValue) && minLineValue > lowLimitValue)
				minLineValue = lowLimitValue;
			
			if (maxLineValue < baseLineValue)
				maxLineValue = baseLineValue;
			
			if ($.isNumeric(highLimitValue) && maxLineValue < highLimitValue)
				maxLineValue = highLimitValue;

			var tooltipDiv = d3.select("body").append("div")
				.attr("class", "michaeldmoore-multistat-panel-tooltip michaeldmoore-multistat-panel-tooltip-" + this.panel.id)
				.style("opacity", 0);
			
			
			var tooltipShow = function(d, c){
				tooltipDiv.transition()
				.duration(200)
				.style("opacity", .9);
				var html = "<table>";
				for (i = 0; i < d.length; i++){
					var cc = c[i];
					var dd = d[i];
					
					if (cc == DateTimeColName)
						dd = moment(dd).add(TZOffsetHours, 'h').format(TooltipDateFormat);
					else if (cc == ValueColName && $.isNumeric(dd))
						dd = dd.toFixed(ValueDecimals);
					
					html += "<tr><td>" + cc + "</td><td>" + dd + "</td></tr>";
				}
				html += "</table>";
				tooltipDiv.html(html)
				.style("left", d3.event.pageX + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			}

			var tooltipHide = function() {
				tooltipDiv.transition()		
				.duration(500)		
				.style("opacity", 0);	
			}
			
			if(horizontal) {
				var plotGroupHorizontal = function(panel, svg, data, numRows, groupName, left, w) {
					var groupNameOffset = groupName != '' ? 15 : 0;
					lowSideMargin += groupNameOffset;

					var valueScale = d3.scaleLinear()
								.domain([minLineValue, maxLineValue])
								.range([left + labelMargin, left + w])
								.nice();
					
					var labels = data.map(function(d){ return d[labelCol]; });
					while (labels.length < numRows)
						labels = labels.concat('_' + Math.random().toString(36).substr(2, 9));
					

					var labelScale = d3.scaleBand()
								.domain(labels)
								.rangeRound([lowSideMargin, h - highSideMargin])
								.padding(barPadding / 100);
				
					// Draw background of alternating stripes 
					var oddeven = false;
					svg.append("g")
						.selectAll("rect")
						.data(data)
						.enter()
						.append("rect")
						.attr("class", "michaeldmoore-multistat-panel-row")
						.attr("width", w)
						.attr("height", labelScale.bandwidth())
						.attr("x", left)
						.attr("y", function(d,i){return labelScale(d[labelCol])})
						.attr("fill", function(d) { 
								oddeven = !oddeven;
								return oddeven ? OddRowColor : EvenRowColor;
							});

					function vLine(svg, value, color) {	
						svg.append("line")
							.style("stroke", color)
							.attr("y1", lowSideMargin)
							.attr("x1", valueScale(value))
							.attr("y2", h - highSideMargin)
							.attr("x2", valueScale(value));
					}			

					if(panel.ShowBaseLine)
						vLine(svg, baseLineValue, panel.BaseLineColor);

					if(panel.ShowMaxLine)
						vLine(svg, maxLineValue, panel.MaxLineColor);

					if(panel.ShowMinLine)
						vLine(svg, minLineValue, panel.MinLineColor);

					if(panel.ShowHighLimitLine)
						vLine(svg, highLimitValue, panel.HighLimitLineColor);

					if(panel.ShowLowLimitLine)
						vLine(svg, lowLimitValue, panel.LowLimitLineColor);

					svg
						.append("g")
						.selectAll("rect")
						.data(data)
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

					var g = svg
							.append("g")
							.selectAll("text")
							.data(data)
							.enter()
							.append("g");
					
					if (panel.ShowValues) {
						g.append("text")
						//.text(function(d) {return formatDecimal(d[valueCol])})
						.text(function(d) {return d[valueCol].toFixed(ValueDecimals)})
						.attr("x", function(d){return valueScale(d[valueCol]) + ((d[valueCol] > baseLineValue) ? - 5 : + 5)})
						.attr("y", function(d,i){return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2)})
						.attr("font-family", "sans-serif")
						.attr("font-size", panel.ValueFontSize)
						.attr("fill", panel.ValueColor)
						.attr("text-anchor", function(d){return (d[valueCol] > baseLineValue) ? "end" : "start";})
						.attr("dominant-baseline", "central");
					}

					if (panel.ShowLabels) {
						g.append("text")
						.text(function(d) { return d[labelCol]; })
						.attr("x", left + labelMargin - 5)
						.attr("y", function(d,i){return labelScale(d[labelCol]) + (labelScale.bandwidth() / 2)})
						.attr("font-family", "sans-serif")
						.attr("font-size", panel.LabelFontSize)
						.attr("fill", panel.LabelColor)
						.attr("text-anchor", "end")
						.attr("dominant-baseline", "central");
					}

					// Add Low Side Group Names
					if(groupName != '') {
						svg
							.append("text")
							.text(groupName)
							//.attr("x", left + ((labelMargin + w - left)/2) - 5)
							.attr("x", left + ((labelMargin + w)/2) - 5)
							.attr("y", 5)
							.attr("font-family", "sans-serif")
							.attr("font-size", panel.LabelFontSize)
							.attr("fill", panel.LabelColor)
							.attr("text-anchor", "middle")
							.attr("dominant-baseline", "central");
					}
					
					//Add Low Side Value Axis (X)
					if (lowSideMargin > groupNameOffset) {	
						var gg = svg
								.append("g")
								.attr("transform", 'translate(0,' + lowSideMargin + ')')
								.attr("class", "michaeldmoore-multistat-panel-valueaxis")
								.call(d3.axisTop(valueScale));
						gg.selectAll('.tick text').attr('fill', panel.LowAxisColor);
						gg.selectAll('.tick line').attr('stroke', panel.LowAxisColor);
						gg.selectAll('path.domain').attr('stroke', panel.LowAxisColor);
					}
					
					//Add High Side Value Axis (X)
					if (highSideMargin > 0) {	
						var gg = svg
								.append("g")
								.attr("transform", 'translate(0,' + (h - highSideMargin) + ')')
								.attr("class", "michaeldmoore-multistat-panel-valueaxis")
								.call(d3.axisBottom(valueScale));
						gg.selectAll('.tick text').attr('fill', panel.HighAxisColor);
						gg.selectAll('.tick line').attr('stroke', panel.HighAxisColor);
						gg.selectAll('path.domain').attr('stroke', panel.HighAxisColor);
					}
					
					lowSideMargin -= groupNameOffset;				
				}

				if (groupCol >= 0){
					this.groupedRows = d3.nest()
						.key(function(d){return d[groupCol]})
						.entries(this.rows);
						
					this.groupedRows.sort(
						function(a,b){
							var aPos = GroupSortString.search(a.key);
							var bPos = GroupSortString.search(b.key);
							
							if (aPos == bPos)
								return a.key.localeCompare(b.key);
							else
								return aPos - bPos;
						}
					);
					
					var gap = 5;	
					var dw = ((w + gap) / this.groupedRows.length);
					var numRows = d3.max(this.groupedRows, function(d) { return d.values.length;} );
					
					for(var i = 0; i < this.groupedRows.length; i++)
						plotGroupHorizontal(this.panel, this.svg, this.groupedRows[i].values, numRows, this.groupedRows[i].key, i * dw, dw - gap);
				}
				else {
					this.groupedRows = null;

					plotGroupHorizontal(this.panel, this.svg, this.rows, this.rows.length, '', 0, w);
				}
				
			}
			else {
				var valueScale = d3.scaleLinear()
							.domain([maxLineValue, minLineValue])
							.range([10, h - labelMargin])
							.nice();
				
				var labelScale = d3.scaleBand()
							.domain(this.rows.map(function(d){ return d[labelCol]; }))
							.range([lowSideMargin, w - highSideMargin])
							.padding(barPadding / 100);

				// Draw background of alternating stripes 
				var oddeven = false;
				this.svg//.append("g")
					.selectAll("rect")
					.data(this.rows)
					.enter()
					.append("rect")
					.attr("class", "michaeldmoore-multistat-panel-row")
					.attr("width", labelScale.bandwidth())
					.attr("height", h)
					.attr("x", function(d,i){return labelScale(d[labelCol])})
					.attr("y", 0)
					.attr("fill", function(d) { 
							oddeven = !oddeven;
							return oddeven ? OddRowColor : EvenRowColor;
						});
		
				function hLine(svg, value, color) {	
					svg.append("line")
						.style("stroke", color)
						.attr("x1", lowSideMargin)
						.attr("y1", valueScale(value))
						.attr("x2", w - highSideMargin)
						.attr("y2", valueScale(value));
				}			

				if(this.panel.ShowBaseLine)
					hLine(this.svg, baseLineValue, this.panel.BaseLineColor);

				if(this.panel.ShowMaxLine)
					hLine(this.svg, maxLineValue, this.panel.MaxLineColor);

				if(this.panel.ShowMinLine)
					hLine(this.svg, minLineValue, this.panel.MinLineColor);

				if(this.panel.ShowHighLimitLine)
					hLine(this.svg, highLimitValue, this.panel.HighLimitLineColor);

				if(this.panel.ShowLowLimitLine)
					hLine(this.svg, lowLimitValue, this.panel.LowLimitLineColor);

				
				this.svg
					.append("g")
					.selectAll("rect")
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

				
				var g = this.svg
					.selectAll("text")
					.data(this.rows)
					.enter()
					.append("g");
					
				if (this.panel.ShowValues) {
					g.append("text")
					.text(function(d) {return d[valueCol].toFixed(ValueDecimals)})
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
					var gg = this.svg
						.append("g")
						.attr('transform', 'translate(' + lowSideMargin + ', 0)')
						.classed('michaeldmoore-multistat-panel-valueaxis', true)
						.call(d3.axisLeft(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
					gg.selectAll('.tick text').attr('fill', this.panel.LowAxisColor);
					gg.selectAll('.tick line').attr('stroke', this.panel.LowAxisColor);
					gg.selectAll('path.domain').attr('stroke', this.panel.LowAxisColor);
				}
				
				if (highSideMargin > 0) {	
					var gg = this.svg
						.append("g")
						.attr('transform', 'translate(' + (w - highSideMargin) + ', 0)')
						.classed('michaeldmoore-multistat-panel-valueaxis', true)
						.call(d3.axisRight(valueScale).tickSizeInner(5).tickSizeOuter(10).ticks(5));
					gg.selectAll('.tick text').attr('fill', this.panel.HighAxisColor);
					gg.selectAll('.tick line').attr('stroke', this.panel.HighAxisColor);
					gg.selectAll('path.domain').attr('stroke', this.panel.HighAxisColor);
				}
			}

						
			function pulseHigh(svg) {
				var highFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.highflash");
				
				if ($.isNumeric(HighLimitBarFlashTimeout) && highFlashRects._groups.length > 0 && highFlashRects._groups[0].length > 0) {
					highFlashRects
					.transition()
					.on("start", function highRepeat() {
						d3.active(this)
							.style("fill", HighLimitBarFlashColor)
							.duration(HighLimitBarFlashTimeout)
							.transition()
							.style("fill", HighLimitBarColor)
							.duration(HighLimitBarFlashTimeout)
							.transition()
							.on("start", highRepeat);
					  });
				}
			}

			function pulseLow(svg) {
				var lowFlashRects = svg.selectAll("rect.michaeldmoore-multistat-panel-bar.lowflash");
				if ($.isNumeric(LowLimitBarFlashTimeout) && lowFlashRects._groups.length > 0 && lowFlashRects._groups[0].length > 0) {
					lowFlashRects
					.transition()
					.on("start", function lowRepeat() {
						d3.active(this)
							.style("fill", LowLimitBarFlashColor)
							.duration(LowLimitBarFlashTimeout)
							.transition()
							.style("fill", LowLimitBarColor)
							.duration(LowLimitBarFlashTimeout)
							.transition()
							.on("start", lowRepeat);
					  });
				}
			}
			

			pulseHigh(this.svg);
			pulseLow(this.svg);
		}
		else
			this.elem.html("<div style='position:absolute;top:50%;text-align:center;font-size:0.875rem;'>No data to show!!</div>");

						
        this.ctrl.renderingCompleted();
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

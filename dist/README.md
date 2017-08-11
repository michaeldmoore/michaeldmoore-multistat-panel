# michaeldmoore-multistat-panel

**Custom multistat panel for grafana, based on the built-in SingleStat panel**

>This panel was developed for as an enhancement to Singlestat providing some useful additions particularly suited to process control/monitoring dashboards.  Singlestat displays a single metric from time series data set, with optional threshold-related coloring etc.  Multistat builds on this base, adding optional upper and lower warning, as well as hard limits.  If desired, the upper and lower limits can be displayed as reference values.  Each of the 5 possible states (OK, upper or lower limits exceeded and upper or lower warning levels exceeded) can be disabled.  if enabled, these can individually be set to 'flash' (using SVG animation).

![Showcase](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Showcase.gif)

>Like SingleStat, the Multistat Panel allows you to show the one main summary stat of a SINGLE series. It reduces the series into a single number (by looking at the max, min, average, or sum of values in the series). Depending on the configuration options, the panel can also display upper and lower alarm thresholds, colored to according to the value of the metric relative to the thresholds, and optional flash etc.

**Features:**
>In addition to the basic features of SingleStat, this panel provides additional display attributes including the ability to set upper and lower warning and limit thresholds, and to set the colors appropriate to each of these states and whether or not the values should 'flash'.

>If desired, the displayed value can be set to flash when either of the limit values are exceeded.  The current values of these limits can also be displayed on the multistat.

![Options](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Options.png)

>This panel is designed to support simple time series data sets - unlike SingleStat though, Multistat does not support table-based data sets.

**Configuration details:**
>The Options tab is made of three groups, **Value**, **Thresholds** and **Spark Lines**.

The **Value group** has a setting for the Metric - that is, the scalar operation applied to the data series.  Most commonly, this will be the default 'Current' value.

![Values-MetricNames](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Values-MetricNames.png)

>The corresponding Font size setting controls the relative size of the main displayed value.

![Values-MetricFontSize](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Values-MetricFontSize.png)

>The next two rows in this group provide for an optional prefix and/or postfix string to be displayed either side of the main value.  A special font size value 'hide' can be used to suppress the display of either of these strings.

![Values-PostfixFontSize](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Values-PostfixFontSize.png)


>The final part of this group sets the units of measurement.

![Values-Units](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Values-Units.png)





The **Thresholds group** controls the various display enhancements.
>In the default configuration, both the upper and lower limits are disabled.  The color, number of decimal places and font size can be configured independently for the single metric.

![Thresholds-NoLimits](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Thresholds-NoLimits.png)

>Note the rows for both Upper and Lower limits are set to 'disabled'.

>Setting either or both of these to 'static', or 'flash' exposes more settings - the threshold value(s) for the limit(s) along with Color, number of decimal places and font size.  When limits are enabled, the corresponding warning thresholds also appear, here in the default 'disabled' state.

![Thresholds-UpperLimit](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Thresholds-UpperLimit.png)

>In this example, the main value display will be green whenever the value is &lt; 80\. and red when above 80\.  The limit itself will also appear above and to the right of the main value display.  The font size of this displayed limit indicator can be adjusted using the Font Size selection - or hidden, if desired, by using the special 'hide' font size setting.  Note too, that the number of decimal places for the limit display can be defined - or left in the default 'Auto' mode.  If the limit display option is set to 'flash', the main display value - and the corresponding limit display will both flash (once per second) whenever the threshold value is exceeded.

>Once any of the limit thresholds are enabled, the corresponding warning thresholds may also be set as 'static' or 'flash', along with the color value.  Once enabled, this color - and possible flash behavior - will appear whenever the value exceeds the warning level but not the limit level.  Note that the warning levels themselves are not displayed on the panel, hence the number of decimal places and font size settings are not provided for warning thresholds.

![Thresholds-UpperWarning](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Thresholds-UpperWarning.png)&nbsp;

>Notice how the OK Value label is updated to show the new 'OK' range - in this case anything below 75.

>With the full set of thresholds enabled, all the settings are now exposed.

![Thresholds-AllSettings](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/Thresholds-AllSettings.png)





The **Spark Lines group** is preserved unchanged from the original SingleStat panel.  See the [SingleStat documentation for 
configuration details](http://docs.grafana.org/features/panels/singlestat/#spark-lines) pertaining to this feature.

![Options](https://raw.githubusercontent.com/michaeldmoore/michaeldmoore-multistat-panel/master/src/img/SparkLines.png)

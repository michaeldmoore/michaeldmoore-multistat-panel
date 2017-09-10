# michaeldmoore-multistat-panel

**Custom multistat panel for grafana, inspired by the built-in SingleStat panel**

>This panel was developed for as a table-like panel for presenting bar charts, providing some useful additions particularly suited to process control/monitoring dashboards.  Singlestat displays a single metric from time series data set, with optional threshold-related coloring etc.  Multistat builds on this base, displaying query data in the form of a bar graph  with adding optional upper and lower hard limits.  

![showcase](https://user-images.githubusercontent.com/3724718/30005310-38debe58-9094-11e7-9209-5aeb977c7577.gif)


>Multistat takes it's data from a table query - this query must return at minimum, 2 fields (names can be anything)
* Lable
* Value
* Timestamp (optional)

Note - These queries should return a relatively small number of rows - Multistat does not use scroll bars - all bars are auto-scaled to fit the display window (scroll bars are useless in a monitoring dashboard).

Mutistat has a wealth of configurable options.  just about everything displayed can be adjusted and hidden using the extensive set of configuration options.  These will be described in detail below.
![options](https://user-images.githubusercontent.com/3724718/30005394-771279c4-9096-11e7-8908-616af1d5429d.png)


**Features:**
* Orientation - Horizontal or Vertical bars
* Sorting (Dynamic, by Name, Value (or UpdateTime), ascending or descending)
* Query result field name mapping - define which fields represent the labels and which represent values
* Last Update Time display (Optional, if Update DateTime column included in query and column mapped).  Useful to demonstrate the data source is actually updating
* Optional display of values, selectable font size and color
* Optional display of labels, selectable font size and color
* Selectable Bar color (bar coloring is a subject in itself - see below for far more details regarding this) 
* Optional Left & Right value axes display (that is, upper & lower axes when in horizontal display mode)
* Adjustable label margin size
* Overridable Min, Max and Baseline values (See below for discussion on baselines)
* Optional High and Low value alarm limits and indicator lines
* Optional setting color of bars exceeding High or Low alarm thresholds
* Optional two-color alarm flashing, with settable flash rate
 
`Note : With all these options, the author accepts no responsibility for inducing nausia, epliepsy or generally violating the bounds of good taste)`


**Configuration details:**
The Grafana-standard Metrics tab allows the user to specify a query, to be issued each time the panel is refreshed.
This area is under continued active development.  Currently, Multistat only supports **Table** data queries.  Each row returned will be displayed as a bar, auto-sized to use the available space.  The panel does nt provide scroll bars, so any query returning more rows than can comfortably fit in the alloted panel area will be unreadable. 

Table Queries
Multistat queries are expected to be something along the lines of ''Get the working pressure of all steam boilers in building 5'' or ''Get the temperature of the 10 hottest cities in the US'' etc.  Anything that can be re-queried efficiently and returns a list of results containing - at minimum - a Label (e.g. Boiler ID or City Name) and a value (e.g. the pressure or temperature).  Optionally, Multistat takes advantage of a DateTime field, if present, which can be displayed alongside the panel title as an indicator as to the last time the data was updated.  More details on this below.

If no query is defined, or the data source is unavaliable, Multistat displays a simple "No data" warning message.
![no-data](https://user-images.githubusercontent.com/3724718/30006554-7b72f5fc-90af-11e7-8b79-d331f60d0388.png)

For this discussion, a mySQL stored procedure is is used to query a hypothetical sensor array, returning 5 labeled values:
![samplequery](https://user-images.githubusercontent.com/3724718/30006627-7bede29c-90b1-11e7-9d74-4f54d0ed33e3.png)

Note, this query returns the required fields, including the DateTime field, using the Grafana-standard table field names.  Multistat does not require that the standard names be used - the actual names returned can be mapped using the top row of Values configuration options.
![mappingfields](https://user-images.githubusercontent.com/3724718/30006686-afc99e02-90b2-11e7-8daa-d45fbf7a2dac.png)



Once a valid query has been generated, the panel will create a basic bar chart of the results (shown here in both vertical and horizontal forms):
![basic-bar-charts](https://user-images.githubusercontent.com/3724718/30006743-96e67340-90b4-11e7-9568-fbda6b23c497.png)

These settings (Column mapping and Vertical/Horizontal layout) are all part of the **Values** section of the configuration Options tab.  Other settings in this group affect the basic layout and features of the bar chart(s).

Sorting & 'Show Date'
![sorting](https://user-images.githubusercontent.com/3724718/30006850-1f349360-90b7-11e7-9f5a-5f16adacbaba.png)
By default, bars are arranged in the order returned by the query.  Setting the Sorting to ascending or descending and selecting a sort column, re-arranges the columns.  Note, any column can be selected for sorting - not just the DateTime, Label or Value columns.  Once set, this option is reapplied during each data refresh, hence if sorted by (say) the value, each labeled column may jump about as the corresponding values change.

If the Show Date option is selected, the maximum value of the field identified in the DateTime col selector is displayed to the right hand side of the panel title row.  Note, this is not the **current** time, rather the maximum value of all the DateTime values in the query result set.  In the event that these values are updated in the underlying database asyncronously, this reference datetime could passed in the query to retrieve the state of the data ``at that moment in time``.  More commonly, the query window will be the current time, so this will show when the data was last updated (this can be useful in demonstrating that the data collection process has not stalled).


Next up, the display options, font size and colr for bot the values and the labels.  No mysteries here.
![label-format](https://user-images.githubusercontent.com/3724718/30007054-04cac982-90bb-11e7-9547-7814b25cb946.png)


Bar Coloring and Padding - There are so many optins affecting bar coloring, this part may take some effort to understand.
The basic color of the bars is set using the 'High Bar Color' selector (Why we have both 'High Bar Color' and 'Low Bar Color' will make sense later - for now, ignor this second setting).
Bar padding - that is, the amount of space between bars - expressed as a percentage of the bar thickness (or span).  This can be adjusted from the default (10%) according to asthetics.  Set any number from 1 to 99, or leave on 'Auto'.
![bar-color-and-padding](https://user-images.githubusercontent.com/3724718/30007066-61f3e4cc-90bb-11e7-8161-fdfe5d4a9431.png)

The last line of this group control the basic layout - setting room for the labels and optional value axes to the left and right (in vertical charts) or top and bottom (in horizontal charts).  Left in the default ('Auto') state, the axes are not shown (there is no space reserved for them).  Setting this to a suitable values (try 20) and the axes will appear.  Adjust according to the size of the value units.
![margins](https://user-images.githubusercontent.com/3724718/30007228-d2ab806e-90be-11e7-8f88-41edba6c330b.png)
``Note - currently, the value axes colors are set to red.  These can be changed by adjusting the style definition file (<grafana-install-dir>/data/plugins/michaeldmoore-multistat-panel/dist/css/multistat-panel.css)``

Moving on to the second group - **Lines and Limits**
The first (and third) row of options control the Max and Min values of the bar chart.  By default, the Min and Max are automatically set to the range of values of the returned data set (rounded to 'nice' units for readability).These can both be overridden, if desired, and marked on the chart as a perpendicular lines, each colored according to personal taste (or lack thereof).
![max-value](https://user-images.githubusercontent.com/3724718/30007300-8d75becc-90c0-11e7-9f0f-4ba13e60308e.png)

Baseline value.
Hidden between these two setting rows is a row for the Baseline - that is, a reference base for all the bars - when a zero-based option is inappropriate.  This is useful when tracking a deviation from some expected norm, such as when monitoring domestic water pressure - nominally (say) 80 psi.  Bars may be set to show the deviation from this norm, with bars to the right representing larger than expected and bars to the left representing less than expected.  This also is where the mysterious 'Low Bar Color' comes in from the first set of configuration options.  The 'Low Bar Color' is used for bars below, or to the left or the expected baseline value.  The baseline itself can be shown using whatever (possibly garish) color desired.
![baseline](https://user-images.githubusercontent.com/3724718/30007492-bd9a2300-90c4-11e7-9cba-4d8bcdb0f3ac.png)

High and Low limits.
These settings (they both work the same) allow for optional threshold values to be defined, possibly with colored marker lines for reference (the Show Line option).
![limits](https://user-images.githubusercontent.com/3724718/30007544-1868b0a2-90c6-11e7-9048-fd88d2a6ca04.png)

Just to make thing more obvious, the color of bar exceeding either of these limits can be set to something new, probably something shocking - like red (why not).  And while we're at it, why not set a low limit with under threshold bar colored blue.  Pretty, isn't it?
![limit-bar-colors](https://user-images.githubusercontent.com/3724718/30007603-3401a8cc-90c7-11e7-8873-84160d18afc8.png)

For the full glory (or gory), we can check the 'Flash' option too, overriding the default 2nd flash color and rate (mS per cycle, actually) for a truely unforgettable and un-ignorable, experience.
![lines-and-limits](https://user-images.githubusercontent.com/3724718/30007679-5849101a-90c9-11e7-9c39-5618e8404454.png)
![alarms-alarms](https://user-images.githubusercontent.com/3724718/30007648-b45bfc6a-90c8-11e7-8ea8-5f43852ad27d.gif)

(In retrospect, setting the Rate parameter to 300 or 400 works just as well, without risk of inducing epilepsy...
 ![calm-alarms](https://user-images.githubusercontent.com/3724718/30007967-6780c14a-90ce-11e7-809d-289d180ea310.gif)

 
 **Known Issues**
 This is a version 1.0.0 release, as such there are a few known issues that need to be added or fixed.
 * Adding an auto-test data set with random walk values (for demos and testing)
 * ~~Pop-up/hover info box, listing all the fields returned for this row.~~ Done
 * Support for time-series data sets, with options for setting the metric to current, average, max, min etc.
 * Configurable settings for the axes colors (without resorting to editing the CSS style sheet)
 * Formatting the decimal places of the value (currently fixed at 2)
 * Setting/displaying the units of measurement
 * Generalizing the Show Time feature to include any selected field and position

If you find this useful, and/or if you can think of additional features that you would find useful - make an entry on the project's [github/issues page](https://github.com/michaeldmoore/michaeldmoore-multistat-panel/issues)

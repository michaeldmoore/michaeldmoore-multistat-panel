# michaeldmoore-multistat-panel



**Custom multistat panel for Grafana, inspired by the built-in SingleStat panel**



This panel was developed for as a table-like panel for presenting bar charts, providing some useful additions particularly suited to process control/monitoring dashboards.  As such, Multistat displays never use scroll-bars (scroll bars are useless in monitoring dashboard).  

SingleStat displays a single metric from time series data set, with optional threshold-related coloring etc.  Multistat builds on this base, but with multi-column table data sets, displaying query data in the form of bar graphs with optional upper and lower hard limits.  Plus a lot, lot more....



![showcase](https://user-images.githubusercontent.com/3724718/30005310-38debe58-9094-11e7-9209-5aeb977c7577.gif)



Data can be displayed as vertical bars...

![image](https://user-images.githubusercontent.com/3724718/38955637-1b1bd9d6-430a-11e8-9633-4e752f12d237.png)

Horizontally...

![image](https://user-images.githubusercontent.com/3724718/38958080-07cd248c-4311-11e8-85c4-6c988b7ded08.png)



Or grouped on an attribute, again vertically
![image](https://user-images.githubusercontent.com/3724718/51725178-7b3dbb00-2026-11e9-861f-d800897d17d3.png)


... or horizontally
![image](https://user-images.githubusercontent.com/3724718/51725236-c6f06480-2026-11e9-84f0-4d2f75a69d66.png)
*(Note these last two examples are single Multistat panels.  A single set of configuration settings is automatically applied to each of the grouped sub-displays)*

And (just about) *everything* is configurable...
Max, Min, auto-scaling, base-lines, colors, rows and columns - (just about) everything...

High and Low limits too, with optional bar coloring
![image](https://user-images.githubusercontent.com/3724718/51725465-f3f14700-2027-11e9-8d61-592f644a5c20.png)

All this, and optional flashing too when bars surpass these limits.

**Data**

Multistat accepts Grafana **table** formatted data.  There is **no support for time series** formatted data - *at least not in the current version*.

As a minimum, Multistat requires table data with at least two fields per row - one, a label (string) and the other, a value (numeric).  Note though, that these fields can be called anything.  Multistat makes no assumptions regarding the names of the table data field it handles.

Each distinct label will be displayed as a bar - the length being determined by it's numerical value.

takes it's data from a table query - returning, at minimum, 2 fields (names can be anything)


A **timestamp** field can be useful too - this can be in any commonly understood format (Multistat uses the popular **Moment.js** java script library for manipulating time/date strings - see https://momentjs.com/docs/#/displaying/ for details).  

A **grouping** field can be useful too, to organize large data sets into more meaningful sections.  When grouping, the number of columns can be pre-configured, along with handy mechanisms for filtering and arranging the order each group is presented in.

Any additional fields are retained and presented in optional tool-tip balloons.  Again, (just about) everything is configurable here...
![image](https://user-images.githubusercontent.com/3724718/51726418-e8544f00-202c-11e9-89e8-2cce5c7bfb2a.png)

**Duplicate labels in table data.**
Each distinct label in the input data results in a distinct bar in Multistat.  Ideally, table data should be created by queries that return distinct data sets - that is, sets in which each label is presented in a single row.  When data sets are processed with multiple rows for a given label, Multistat needs to know which value to use (and hence, which values to ignore).  A configurable aggregation parameter tells Multistat how to handle this.  'Last' (and 'First') select the last (or first) row in the data for any given label, throwing out all the others.    The optional date/timestamp field helps too by presorting the data table before selecting the aggregation function.  The tool-tip then shows the set of fields for the selected data row, as expected.

Setting the aggregation parameter to 'Max' or 'Min' works in a similar way, selecting the row for each label with the corresponding value - and secondly using the last or latest value in the event that there is a tie in the value.
 
Setting the aggregation parameter to 'Mean' results in the arithmetic mean of all duplicate values to be used, as should be expected.  *A side effect of this though is that the fields presented in the tool-tip balloon in this case represent just one of the rows - actually the 'last' row, the value of which will not generally match the displayed 'mean' value for that label.*

**Data set size - a performance consideration**
As mentioned before, ideally the data set should contain a single row for each distinct label. This offloads the maximum amount of filtering and aggregation etc., to the database which is generally much more efficient for these tasks.
In the event that the database cannot pre-filter the data in this way, the aggregation setting can still generate the required display, but at the cost of increased CPU and network load.  Generally, this is not significant - Multistat can easily handle queries with a few hundred labels, each with a hundred or more rows.  Note though that huge data sets - data sets with multiple megabytes of data etc. - these will negatively impact performance.  Particularly as refresh rates shorten.  In extreme cases, this can even make the browser become unresponsive.  **Beware of enormous data sets.**



Multistat has a wealth of configurable options.  just about everything displayed can be adjusted and hidden using the extensive set of configuration options, described in detail below.

![image](https://user-images.githubusercontent.com/3724718/50191698-95cc9800-02f4-11e9-96cd-a0c5da672278.png)

**Features:**

* Orientation - Horizontal or Vertical bars

* Sorting (Dynamic, by Name, Value (or Update Time), ascending or descending)

* Query result field name mapping - define which fields represent the labels and which represent values

* Last Update Time display (Optional, if Update DateTime column included in query and column mapped).  Useful to demonstrate the data source is actually updating

* Optional display of values, selectable font size and color

* Optional display of labels, selectable font size and color

* Selectable Bar color (bar coloring is a subject in itself - see below for far more details regarding this) 

* Optional Left & Right value axes display (that is, upper & lower axes when in horizontal display mode)

* Adjustable label margin size override

* Min, Max and Baseline values (See below for discussion on baselines)

* Optional High and Low value alarm limits and indicator lines

* Optional setting color of bars exceeding High or Low alarm thresholds

* Optional two-color alarm flashing, with settable flash rate



`Note : With all these options, the author accepts no responsibility for`
`inducing nausea, epilepsy or generally violating the bounds of good taste)`





**Configuration details:**

The Grafana-standard Metrics tab allows the user to specify a query, to be issued each time the panel is refreshed.

This area is under continued active development.  Currently, Multistat only supports **Table** data queries.  Each row returned will be displayed as a bar, auto-sized to use the available space.  The panel does not provide scroll bars, so any query returning more rows than can comfortably fit in the allotted panel area will be unreadable. 


*Note - getting appropriately formatted data can be challenging, especially while becoming familiar with all the options offered by Multistat.  For this end - and for general purpose Grafana plugin testing - I've created a simple NodeJS data source called **CSVServer**,  working in conjunction with the standard **SimpleJSON** datasource to import simple CSV files which can be easily edited to generate any kind of table or time series data sets.  See here for details, including set up instructions : https://github.com/michaeldmoore/CSVServer* 


**Table Queries**

Multistat queries are expected to be something along the lines of ''Get the working pressure of all steam boilers in building 5'' or ''Get the temperature of the 10 hottest cities in the US'' etc.  Anything that can be re-queried efficiently and returns a list of results containing - at minimum - a Label (e.g. Boiler ID or City Name) and a value (e.g. the pressure or temperature).  Optionally, Multistat takes advantage of a DateTime field, if present, which can be displayed alongside the panel title as an indicator as to the last time the data was updated.  More details on this below.



If no query is defined, or the data source is unavailable, Multistat displays a simple "No data" warning message.

![no-data](https://user-images.githubusercontent.com/3724718/30006554-7b72f5fc-90af-11e7-8b79-d331f60d0388.png)



**Queries *should* return just one value per label**

Multistat can only display a single bar for each label.  Ideally, query results *should be written* to return a single value per label.  When this is not possible, and the query returns multiple values per label, Multistat uses an aggregation operator to select one of these (first, last, mean, min or max).  *one more - all - will eliminate the aggregator altogether,  Be careful - This can create confusing displays as multiple values appear overlying the position of such bars.  **You have been warned.**  For efficiency though, it is much better to write a query that only returns the required data.



For this discussion, I created a test data set in a CSV file (demo.csv) distributed with the **CSVServer** add-on to SinpleJSON data source.  I highly recommend installing this so you can follow along and see how the various configuration options work before worrying about live real-world data sets.  The demo CSV file contains the following data:

```
time,sensor,area,quantity
2018-12-18 00:21:05.000,AAA,West,1.100
2018-12-18 00:21:04.000,AAA,West,1.000
2018-12-18 00:21:03.000,AAA,West,0.950
2018-12-18 00:21:02.000,AAA,West,0.900
2018-12-18 00:21:01.000,AAA,West,0.850
2018-12-18 00:21:00.000,AAA,West,0.800
2018-12-18 00:21:07.000,AAA,West,1.234
2018-12-18 00:21:07.000,BBB,East,0.662
2018-12-18 00:21:07.000,CCC,East,0.344
2018-12-18 00:21:07.000,EEE,West,0.357
2018-12-18 00:21:07.000,GGG,West,0.563
2018-12-18 00:21:07.000,HHH,West,0.234
2018-12-18 00:21:07.000,III,West,0.840
2018-12-18 00:21:07.000,JJJ,East,0.193
2018-12-18 00:21:07.000,KKK,West,0.262
2018-12-18 00:21:07.000,LLL,North,0.802
2018-12-18 00:21:07.000,MMM,East,0.211
2018-12-18 00:21:07.000,PPP,North,0.300
2018-12-18 00:21:07.000,QQQ,North,0.731
2018-12-18 00:21:07.000,RRR,North,1.101
2018-12-18 00:21:07.000,SSS,East,0.811
2018-12-18 00:21:07.000,WWW,East,0.213
2018-12-18 00:21:07.000,YYY,East,0.844
2018-12-18 00:21:07.000,ZZZ,North,0.928
```

Note, sensor AAA in this data set has multiple values, each a few hours apart.  All the other sensors have a single row - this will allow the aggregation feature to be demonstrated later in this note. Each row nthis data set includes a date/time, a label and a value, plus a region field (that will be useful in grouping).   The field names can be anything; everything is defined in the configuration tabs. Additional fields, if any, will appear in the tool-tip pop-up display, if enabled.


As you can see, Multistat is configured using a number of option tabs.  Let's examine each of these in sequence.

First, the data source and query is setup using the standard **Metrics** tab

![image](https://user-images.githubusercontent.com/3724718/50192332-5b182f00-02f7-11e9-805c-2137c832d7f6.png)

Note the data set format is set to '**Table**' (Multistat does not support time series data sets)

Note: The Query Inspector built into Grafana is a terrific resource for figuring out source data problems.  Here's what we get from my demo query:

![image](https://user-images.githubusercontent.com/3724718/50192518-3e302b80-02f8-11e9-8e34-eb039eb23bce.png)
etc.



The data is mapped using the **Columns** configuration tab:

![image](https://user-images.githubusercontent.com/3724718/51728249-2ce3e880-2035-11e9-8ca6-5c51b97710c1.png)



Here, you can see how the 4 key fields in the query result set get mapped to the Multistat fields.  In this case, the **label** is associated with the query field 'sensor', **Value** as 'quantity', with 1 decimal place and no scaling (**scale factor = 1**).  Note too that the default **aggregation** parameter of 'Last' is selected.  This dataset contains multiple rows for some labels - this setting automatically selects the last (latest) value for each sensor. 

Note too, that the bars are set to be sorted in ascending 'sensor' name.

The data is set to **group** on the 'area' field - this will create 3 sub-charts, for the East, North and West areas.

The **DateTime col** (optional) is mapped here to the 'time' field.  When set, the TZ Offset Hrs setting can be used to offset the display value to account for time-zone differences between the data source and the client. *(Note - this time offset features duplicates something similar built into recent versions of Grafana.  This feature may be removed in future versions of Multistat)*

 
The '**Show as-of Date**' setting controls whether or not the last update time is to be displayed in the top right of the panel.  **Most users can ignore this setting**. When it is set, the maximum datetime value in the query record set is displayed alongside the panel title.  This can be useful in process monitoring applications to provide evidence that the data is being updated in a timely manner etc.  The format field controls how this time is displayed (see documentation for [moment.js](https://momentjs.com/guides/#/parsing/known-formats/) for formatting details), or use the reserved keyword 'ELAPSED' to display as a natural language string, relative to the current time.   Help is available, if needed.




The **Layout** tab

![image](https://user-images.githubusercontent.com/3724718/51728892-78979180-2037-11e9-8c4e-1578ca7302b5.png)

The Layouts tab defines the basic settings that control how the data is arranged on the panel. 
The Horizontal checkbox switches the bar orientation from vertical to horizontal.  As the chart(s) rotate, the axis and labels rotate with them - hence the use of neutral terms for the axis as 'High' and 'Low' rather than 'Left', 'Right', 'Top' or 'Bottom'

The area reserved for the labels can be set according to the length of the labels - or left blank, leaving the panel to calculate a reasonable value based on the actual data and orientation 
 


A group col setting can be used to define a field that displays multiple sets, or groups, of elements.  In this demo case, we're grouping on the 'region' field, which takes on 5 different values (East, West, North, South and Central).

When grouping, by default, the groups are arranged in alphabetical order.  (See here, Central->East->North->South->West)

![image](https://user-images.githubusercontent.com/3724718/39014353-f93f1894-43ce-11e8-8ad1-d10906f3ee3b.png)



This default can be overridden by setting the Group Sort Order string - a comma delimited sequence of group names, like "North,East,West,South,Central"  that make it North->East->West->South->Central

![image](https://user-images.githubusercontent.com/3724718/39014554-86a11ebc-43cf-11e8-997b-a0d3bab94f74.png)





The margin settings control how much space needs to be reserved, depending on the actual name of the labels etc.  Bar colors (plus others such as the axis labels and ticks and the odd/even bar background) are defined in this section.  Depending on the application, we can set different colors for positive and negative values and also control the bar-to-gap padding percentage.

Font size and color is selectable for the labels and values too, plus a switch to enable mouse hover tool-tips, plus (in the event that a datetime field has been set in the Columns tab), the format used to display any datetime values in the query result set.



The **Lines and Limits** tab

![image](https://user-images.githubusercontent.com/3724718/50192702-f958c480-02f8-11e9-8700-d180077d99d7.png)


On this tab, you can override the auto-defaults to control upper and lower extents (these automatically extend when the values displayed fall outside these settings), plus optionally display these values as colored reference lines.

The Base Line setting (default 0) differentiates between positive and negative values, each potentially having a different color.  This can be useful when monitoring deviations from some non-zero set point.  For example, Electrical generators (in North America, at least) operate at very close to 60Hz, with normally, only small deviations.  Setting a baseline at 60.0 and a Max/Min to (say) 60.10 and 59.90 would make an easily understood display in such an application.



**Threshold limits**

In addition, this tab allow the user to specify high and low Limit values.  Bars with values outside these limits can be colored differently, to indicate an exceedance.  As with all there settings, the user can display a reference line on the chart and set the colors to whatever makes sense in the application.   In the frequency example above, there might be high and Low Limits set at (say) 60.05 and 95.95 respectively.

Additionally, exceedances can be configured to 'flash' - toggling between two colors and some pre-defined rate.

![image](https://user-images.githubusercontent.com/3724718/38963541-547a9560-4327-11e8-912a-5fdca266fd5f.png)



Putting it all together, the displays can make a truly unforgettable and un-ignorable, experience.

![lines-and-limits](https://user-images.githubusercontent.com/3724718/30007679-5849101a-90c9-11e7-9c39-5618e8404454.png)

![alarms-alarms](https://user-images.githubusercontent.com/3724718/30007648-b45bfc6a-90c8-11e7-8ea8-5f43852ad27d.gif)


(In retrospect, setting the Rate parameter to 300 or 400 works just as well, without risk of inducing epilepsy...
 ![calm-alarms](https://user-images.githubusercontent.com/3724718/30007967-6780c14a-90ce-11e7-809d-289d180ea310.gif)





 

**Known Issues**

 This is a version 1.2.0 release, as such there may be a few known issues that need to be added or fixed.

 * Value label positioning.  position labels intelligently as opposed to slightly below the top of each bar.




If you find this useful, and/or if you can think of additional features that you would find useful - make an entry on the project's [GitHub/issues page](https://github.com/michaeldmoore/michaeldmoore-multistat-panel/issues)


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQxNDU5MDk1OSw1NzA2MDM1NzcsMzk4MT
IzMjU3LC0xMDQyMjU4NDQsMTQyMjI0MTAxMSwxODEyNDc5ODcz
LC0yNjQxMDYwNzEsODExNjE1MDg2LDE1OTc2NDAwNTcsLTEwNT
cxOTY4MzVdfQ==
-->
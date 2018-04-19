# michaeldmoore-multistat-panel



**Custom multistat panel for grafana, inspired by the built-in SingleStat panel**



This panel was developed for as a table-like panel for presenting bar charts, providing some useful additions particularly suited to process control/monitoring dashboards.  Singlestat displays a single metric from time series data set, with optional threshold-related coloring etc.  Multistat builds on this base, displaying query data in the form of a bar graph  with adding optional upper and lower hard limits.  Plus a lot, lot more....



![showcase](https://user-images.githubusercontent.com/3724718/30005310-38debe58-9094-11e7-9209-5aeb977c7577.gif)



Data can be displayed as vertical bars...

![image](https://user-images.githubusercontent.com/3724718/38955637-1b1bd9d6-430a-11e8-9633-4e752f12d237.png)

Horizontally...

![image](https://user-images.githubusercontent.com/3724718/38958080-07cd248c-4311-11e8-85c4-6c988b7ded08.png)



Or as horizontal groups (based on the data query)

![image](https://user-images.githubusercontent.com/3724718/38958223-7b5a3106-4311-11e8-9172-a4786728a236.png)



Multistat takes it's data from a table query - returning, at minimum, 2 fields (names can be anything)

* Label
* Value
* Timestamp (optional)
* Group By (optional, horizontal mode only)




These queries should return a relatively small number of rows - Multistat does not use scroll bars - all bars are auto-scaled to fit the display window (scroll bars are useless in a monitoring dashboard).



Multistat has a wealth of configurable options.  just about everything displayed can be adjusted and hidden using the extensive set of configuration options, described in detail below.

![image](https://user-images.githubusercontent.com/3724718/38972936-38b6ec76-4358-11e8-9e00-756707ef8f04.png)



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



`Note : With all these options, the author accepts no responsibility for inducing
nausea, epilepsy or generally violating the bounds of good taste)`





**Configuration details:**

The Grafana-standard Metrics tab allows the user to specify a query, to be issued each time the panel is refreshed.

This area is under continued active development.  Currently, Multistat only supports **Table** data queries.  Each row returned will be displayed as a bar, auto-sized to use the available space.  The panel does not provide scroll bars, so any query returning more rows than can comfortably fit in the allotted panel area will be unreadable. 



**Table Queries**

Multistat queries are expected to be something along the lines of ''Get the working pressure of all steam boilers in building 5'' or ''Get the temperature of the 10 hottest cities in the US'' etc.  Anything that can be re-queried efficiently and returns a list of results containing - at minimum - a Label (e.g. Boiler ID or City Name) and a value (e.g. the pressure or temperature).  Optionally, Multistat takes advantage of a DateTime field, if present, which can be displayed alongside the panel title as an indicator as to the last time the data was updated.  More details on this below.



If no query is defined, or the data source is unavaliable, Multistat displays a simple "No data" warning message.

![no-data](https://user-images.githubusercontent.com/3724718/30006554-7b72f5fc-90af-11e7-8b79-d331f60d0388.png)



**Queries should return just one value per label**

Multistat can only display a single bar for each label.  Ideally, query results *should be written* to return a single value per label.  When the query returns multiple values per label, Multistat uses the last one - assuming the query contains an date/time order by clause, this works out to be the most recent value, presumably the one users will be interested in.  For efficiency though, it is much better to write a query that only returns the required data.



For this discussion, I created some test data and a stored procedure in mySQL, returning the latest updates from a set of hypothetical sensors, returning a set of values, like this:



![image](https://user-images.githubusercontent.com/3724718/38958649-be730336-4312-11e8-8903-8a6544d0bd7f.png)

Note, this query returns the required label and values fields, plus, in this case, a DateTime field indicating when this value was last recorded, plus a region field (that will be useful in grouping).   The field names can be anything; everything is defined in the configuration tabs.



First, the data source and query is setup using the standard **Metrics** tab

![image](https://user-images.githubusercontent.com/3724718/38960019-b7e3ba92-4317-11e8-91b8-b480c367f1d7.png)



In the event that the query returns more than one value per label, set the 'Filter Multiples' check box - this tells the panel to group the return set by whatever field is defined as the 'value col', retaining only the last record for any given 'label'.  Note., this is a trade-off between the client and the server itself - sometimes it will be better to use this feature, and sometimes not.



Note: The Query Inspector built into Grafana is a terrific resource for figuring out source data problems.  Here's what we get from my demo query:

![image](https://user-images.githubusercontent.com/3724718/38960473-88d4ab42-4319-11e8-9d34-f9187731e46c.png)

etc.



The data is mapped using the **Columns** configuration tab:

![image](https://user-images.githubusercontent.com/3724718/38960879-f0edfe6c-431a-11e8-8a74-d63d229259d0.png)



Here, you can see how the 4 key fields in the query result set get mapped to the Multistat fields.  In this case, the label is associated with the query field 'sensor', Value as 'value', with 2 decimal places. Note too, that the bars are set to be sorted in ascending 'value' order.

The DateTime col (optional) is mapped here to the 'date' field.  When set, the TZ Offset Hrs setting can be used to offset the display value to account for time-zone differences between the data source and the client.

The 'Show as-of Date' setting controls whether or not the last update time is to be displayed in the top right of the panel.  When set, this displays the maximum datetime value in the query record set, which can be useful in process monitoring applications.  The format field controls how this time is displayed (see documentation for [moment.js](https://momentjs.com/guides/#/parsing/known-formats/) for formatting details), or us the reserved keyword 'ELAPSED' to display as a natural language string, relative to the current time.   Help is available, if needed.



The **Layout** tab

![image](https://user-images.githubusercontent.com/3724718/38961239-87444cd0-431c-11e8-8130-2e81ea2ed8f7.png)

This is made up of two sections - Layout and Options.



Layouts define the setting controlling how the data is arranged on the panel.  In horizontal mode only, a group col setting can be used to define a field that displays multiple sets, or groups, of elements.  In this demo case, we're grouping on the 'region' field, which takes on 5 different values (East, West, North, South and Central).

When grouping, by default, the groups are arranged in alphabetical order.  (See here, Central->East->North->South->West)

![image](https://user-images.githubusercontent.com/3724718/39014353-f93f1894-43ce-11e8-8ad1-d10906f3ee3b.png)



This default can be overridden by setting the Group Sort Order string - a comma delimited sequence of group names, like "North,East,West,South,Central"  that make it North->East->West->South->Central

![image](https://user-images.githubusercontent.com/3724718/39014554-86a11ebc-43cf-11e8-997b-a0d3bab94f74.png)





The margin settings control how much space needs to be reserved, depending on the actual name of the labels etc.  Bar colors (plus others such as the axis labels and ticks and the odd/even bar background) are defined in this section.  Depending on the application, we can set different colors for positive and negative values and also control the bar-to-gap padding percentage.

Font size and color is selectable for the labels and values too, plus a switch to enable mouse hover tool-tips, plus (in the event that a datetime field has been set in the Columns tab), the format used to display any datetime values in the query result set.



The **Lines and Limits** tab

![image](https://user-images.githubusercontent.com/3724718/38961668-6ad56d98-431e-11e8-82c1-70c70be84fcf.png)



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

 This is a version 1.1.0 release, as such there are a few known issues that need to be added or fixed.

 * Adding an auto-test data set with random walk values (for demos and testing)


 * Support for time-series data sets, with options for setting the metric to current, average, max, min etc.

 * Setting/displaying the units of measurement




If you find this useful, and/or if you can think of additional features that you would find useful - make an entry on the project's [github/issues page](https://github.com/michaeldmoore/michaeldmoore-multistat-panel/issues)


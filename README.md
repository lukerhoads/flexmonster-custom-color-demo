# Flexmonster Customization Demo

## Notes and required knowledge

With the React component, configuration is changed with objects. Specifically, the
report object:

Properties:

```javascript
dataSource – Data Source Object. Contains information about the data source.
slice – Slice Object. There you can define fields that go to rows, go to columns and go to measures, add filtering, sorting, report filtering, expands, and drills.
options – Options Object. Allows configuration of the component’s UI and functionality for customers.
conditions – Array of Conditional Format Objects.
formats – Array of Format Objects.
tableSizes – Table Sizes Object. Contains information about table sizes.
customFields – Array of objects. Allows setting custom fields for Excel export or storing some additional information. They are not shown on the grid but they will be displayed in the exported Excel table. Each object has the following properties:
name – String. The custom field’s name.
value – String. The custom field’s value. This live sample on JSFiddle illustrates how to set the customFields property.
localization – String | Object. A property to set a localization. It can be inline JSON or URL to a localization JSON file.
version – String. It contains the current version of Flexmonster.
creationDate – String. Represents the date (in ISO format) of the report creation.
```

This report object contains information regarding chart display, columns, rows, measures, etc. It can be modified with tools in the component. Most of the modification is done automatically, but intermediating the configuration could provide useful in storing data organization properties.

It does not easily include styling rules. This is where the `customizeChartElement` function comes in. This function receives all data elements in DOM formatting, making it fairly easy to parse and select what to style. Given a configuration, configuring how it parses and modifies these DOM elements would be the best approach to custom styling. Ultimately, this is where sharing that configuration would come in handy when sharing workspaces with collaborators.

Example display configuration:

```
{
    "graphType": {
        "all": {
            "labels": {
                "Amazon": {
                    "color": "#ff007f"
                },
                "Etsy": {
                    "color": "#000"
                }
            },
            "data": {}
        }
    }
}
```

`graphType` defines what graph type the styles will be applied to. If `all` is present, all other graph types will be ignored, and the styles will be applied globally.

As you can see, there are two subsections, `labels`, `data`. Labels contains options to style data labels, such as these:

<img src="https://lukerhoads-utility.s3.amazonaws.com/labels.PNG"> /

and Data contains options to style measured data, such as these:

<img src="https://lukerhoads-utility.s3.amazonaws.com/graph.PNG"> /

## Unimportant extra features include:

-   Themes (not a UI option yet)
-   Readonly sharing (not a UI option yet)

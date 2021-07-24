import React from 'react';
import Flexmonster from "flexmonster";
import * as FlexmonsterReact from "react-flexmonster";
import CustomizationForm from './components/CustomizationForm';

// JSON testdata
import testdata from "./testdata/testdata.json"

// Helper function defined just in case any manual preprocessing is needed
const getData = (): object[] | undefined => {
    return testdata
}

// Upstream customization function which will propagate to the configured pivot instance
const customizeChartElement = () => {
    
}

// For non react
// const pivot = new Flexmonster({
//     container: "pivot-container",
//     componentFolder: "https://cdn.flexmonster.com/",
//     width: "100%",
//     height: 600,
//     report: report,
//     customizeChartElement: customizeChartElement,
// });

const report: Flexmonster.Report = {
    dataSource: {
        data: getData()
    },
    options: {
        viewType: "charts",
        chart: {
            type: "column",
        },
        configuratorActive: false,
    },
    slice: {
        rows: [
            {
                uniqueName: "Order Data.Month",
            }
        ],
        columns: [
            {
                uniqueName: "City",
                filter: {
                    measure: {
                        uniqueName: "Orders",
                        aggregation: "sum",
                    },
                    query: {
                        top: 5,
                    },
                },
            },
            {
                uniqueName: "[Measures]",
            },
        ],
        measures: [
            {
                uniqueName: "Orders",
                aggregation: "sum",
            }
        ]
    }
}

const flexmonsterConfig = {
    container: "pivot-container",
    componentFolder: "https://cdn.flexmonster.com/",
    width: "100%",
    height: 600,
    report: report,
    customizeChartElement: customizeChartElement,
}

const App = () => {
    return (
        <div className="app">
            <FlexmonsterReact.Pivot {...flexmonsterConfig} />
            <CustomizationForm customizeChartElement={customizeChartElement} />
        </div>
    )
}

export default App;
import React, { useState } from 'react'
import Flexmonster from 'flexmonster'
import * as FlexmonsterReact from 'react-flexmonster'
import CustomizationForm from './components/CustomizationForm'
import { ChartTypes } from './types'
import { gridReport, columnReport } from './meta'

// For vanilla
// const pivot = new Flexmonster({
//     container: "pivot-container",
//     componentFolder: "https://cdn.flexmonster.com/",
//     width: "100%",
//     height: 600,
//     report: report,
//     customizeChartElement: customizeChartElement,
// });

const initialConfig = {
    container: 'pivot-container',
    componentFolder: 'https://cdn.flexmonster.com/',
    width: '100%',
    height: 600,
    report: gridReport,
}

const App = () => {
    // Upstream customization function which will propagate to the configured pivot instance
    const customizeChartElement = (
        element: Element,
        data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
    ) => {
        // Element can be used with querySelector for grabbing items
        // Data can be used as meta

        console.log(element, data)
    }

    const localInitialConfig = {
        ...initialConfig,
        customizeChartElement: customizeChartElement,
    }

    const [flexmonsterConfig, setFlexmonsterConfig] =
        useState(localInitialConfig)

    // Update current config, if update is within report
    // this is going to be legacy really quickly, simply not
    // enough to support super nested config updates
    const updateFlexmonsterConfig = (newConfig: any) => {
        if (
            typeof newConfig === typeof gridReport ||
            typeof newConfig === typeof columnReport
        ) {
            return setFlexmonsterConfig((prevConfig) => ({
                ...prevConfig,
                report: {
                    ...newConfig,
                },
            }))
        }

        // if report is the ONLY new state (spreading complications) legacy
        // if (
        //     Object.keys(newConfig).length === 1 &&
        //     Object.keys(newConfig).includes('report')
        // ) {
        //     return setFlexmonsterConfig((prevConfig) => ({
        //         ...prevConfig,
        //         report: {
        //             ...prevConfig.report,
        //             ...newConfig,
        //         },
        //     }))
        // }

        if (typeof newConfig === "object" && Object.keys(newConfig).some(key => Partial<typeof localInitialConfig>))) {
            return setFlexmonsterConfig((prevConfig) => ({
                ...prevConfig,
                ...newConfig,
            }))
        }
        
        return
    }

    const setNewChartType = (
        e: React.MouseEvent<HTMLButtonElement>,
        newChartType: ChartTypes,
    ) => {
        e.preventDefault()

        if (newChartType === 'grid') {
            return updateFlexmonsterConfig(gridReport)
        } else {
            return updateFlexmonsterConfig(columnReport)
        }
    }

    return (
        <div className="app">
            <button onClick={(e) => setNewChartType(e, 'grid')}>Table</button>
            <button onClick={(e) => setNewChartType(e, 'column')}>Chart</button>
            <FlexmonsterReact.Pivot {...flexmonsterConfig} />
            <CustomizationForm customizeChartElement={customizeChartElement} />
        </div>
    )
}

export default App

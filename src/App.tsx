import React, { useRef, useState } from 'react'
import Flexmonster from 'flexmonster'
import * as FlexmonsterReact from 'react-flexmonster'
import CustomizationForm from './components/CustomizationForm'
import { ChartTypes } from './types'
import { gridReport, columnReport } from './meta'

type AppProps = {}

const initialConfig = {
    componentFolder: 'https://cdn.flexmonster.com/',
    width: '100%',
    height: 600,
    report: gridReport,
}

// Upstream customization function which will propagate to the configured pivot instance
const customizeChartElement = (
    element: Element,
    data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
) => {
    // Element can be used with querySelector for grabbing items
    // Data can be used as meta
    console.log(element, data)
}

const App = ({ ...props }: AppProps) => {
    const localInitialConfig = {
        ...initialConfig,
        customizeChartElement: customizeChartElement,
    }
    const [flexmonsterConfig, setFlexmonsterConfig] =
        useState<typeof localInitialConfig>(localInitialConfig)

    // Update current config, if update is within report
    // this is going to be legacy really quickly, simply not
    // enough to support super nested config updates
    const updateFlexmonsterConfig = (newConfig: any) => {
        if (
            typeof newConfig === typeof gridReport ||
            typeof newConfig === typeof columnReport
        ) {
            console.log(newConfig)
            return setFlexmonsterConfig((prevConfig) => ({
                ...prevConfig,
                report: {
                    ...newConfig,
                },
            }))
        }

        // Checking if newConfig is an object and contains same keys as flexmonsterConfig
        if (
            typeof newConfig === 'object' &&
            Object.keys(flexmonsterConfig).some((key) =>
                Object.keys(newConfig).includes(key),
            )
        ) {
            return setFlexmonsterConfig((prevConfig) => ({
                ...prevConfig,
                ...newConfig,
            }))
        }

        return
    }

    const setNewChartType = (
        newChartType: ChartTypes,
    ) => {
        if (newChartType === 'grid') {
            return updateFlexmonsterConfig(gridReport)
        } else {
            updateFlexmonsterConfig(columnReport)
            console.log(flexmonsterConfig)
            return
        }
    }

    return (
        <div>
            <button type="button" onClick={() => setNewChartType('grid')}>Table</button>
            <button type="button" onClick={() => setNewChartType('column')}>Chart</button>
            <FlexmonsterReact.Pivot {...flexmonsterConfig} />
            <CustomizationForm customizeChartElement={customizeChartElement} />
        </div>
    )
}

export default App

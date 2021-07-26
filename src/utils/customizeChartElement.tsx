import React from 'react'
import Flexmonster from 'flexmonster'

// Upstream customization function which will propagate to the configured pivot instance
const customizeChartElement = (
    element: Element,
    data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
) => {
    // Element can be used with querySelector for grabbing items
    // Data can be used as meta
    // console.log(element, data)
}

export default customizeChartElement

import React from 'react'

export type CustomizationFormProps = {
    customizeChartElement: (element: Element, data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData) => void
}

const CustomizationForm = ({ ...props }: CustomizationFormProps) => {
    const {
        customizeChartElement
    } = props
    
    return (
        <div>
            CustomizationForm
        </div>
    )
}

export default CustomizationForm
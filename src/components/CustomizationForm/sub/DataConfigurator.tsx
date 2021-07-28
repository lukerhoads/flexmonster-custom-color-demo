import React, { useEffect, useState } from 'react'
import { useApp } from '../../../AppContext'
import { ChartTypes } from '../../../types'
import { DisplayConfiguration } from '../../../types/displayConfiguration'

// Subforms
import { FormulaForm } from './sub'

export type DataConfiguratorProps = {}

// DataConfigurator allows you to customize the source of your data
const DataConfigurator = ({ ...props }: DataConfiguratorProps) => {
    const [activeChart, setActiveChart] = useState<ChartTypes>('all')

    // Specifically display configuration which this will update on the fly
    // Flexmonster object allows for nested API calls
    const { flexmonster, displayConfiguration, saveDisplayConfiguration } =
        useApp()

    const preParsed = displayConfiguration === '' ? JSON.parse('null') : JSON.parse(displayConfiguration);
    const [parsedDisplayConfiguration, setParsedDisplayConfiguration] =
        useState<DisplayConfiguration | null>(preParsed)

    return (
        <div>
            <select
                name="active-chart"
                value={activeChart}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setActiveChart(e.currentTarget.value)
                }
            >
                <option value="all">All</option>
                <option value="grid">Grid</option>
                <option value="column">Column</option>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="scatter">Scatter</option>
                <option value="pie">Pie</option>
                <option value="stackedcolumn">Stacked Column</option>
                <option value="columnline">Column Line</option>
            </select>
            {activeChart === 'grid' ? <FormulaForm /> : ''}
            <style jsx>{``}</style>
        </div>
    )
}

export default DataConfigurator

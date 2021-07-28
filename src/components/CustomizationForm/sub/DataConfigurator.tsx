import React, { useState } from 'react'
import { useApp } from '../../../AppContext'

export type DataConfiguratorProps = {}

// DataConfigurator allows you to customize the source of your data
const DataConfigurator = ({ ...props }: DataConfiguratorProps) => {
    // Hook usage for data updates
    // Specifically display configuration which this will update on the fly
    // Flexmonster object allows for nested API calls
    const { flexmonster, displayConfiguration, saveDisplayConfiguration } =
        useApp()
    const [displayConfigurationDerived, setDisplayConfigurationDerived] =
        useState(displayConfiguration)

    return (
        <div>
            <button
                onClick={() =>
                    saveDisplayConfiguration(displayConfigurationDerived!)
                }
            >
                Save
            </button>
            <style jsx>{``}</style>
        </div>
    )
}

export default DataConfigurator

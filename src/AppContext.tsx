import React from 'react'

export const Stub = () =>
    new Error('Wrap your components in AppContext.Provider!')

export interface AppConfig {
    flexmonster?: Flexmonster.Pivot
    dataSource?: string
    displayConfiguration?: string
    report?: any
    readOnly?: boolean
    saveDataSource: (newDataSource: string) => void
    saveDisplayConfiguration: (newDisplayConfiguration: string) => void
    customizeChartElement: (
        element: Element,
        data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
    ) => void
}

const defaultContext = {
    readOnly: true,
    saveDataSource: Stub,
    saveDisplayConfiguration: Stub,
    customizeChartElement: Stub,
}

export const AppContext = React.createContext<AppConfig>(defaultContext)

export const useApp = (): AppConfig => React.useContext<AppConfig>(AppContext)

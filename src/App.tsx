import React, { useEffect, useRef, useState } from 'react'
import * as FlexmonsterReact from 'react-flexmonster'
import { CustomizationForm } from './components'
import Flexmonster from 'flexmonster'
import { customizeChartElement } from './utils'
// import { Provider, atom, useAtom } from 'jotai'
import { AppContext } from './AppContext'
import { gridReport, getData } from './meta'

// Need a way to trigger a parent function on change
// export const dataSourceAtom = atom<string>('')
// export const displayConfigurationAtom = atom<string>('')
// export const reportAtom = atom(gridReport)

type AppProps = {}

const initialConfig = {
    toolbar: true,
    componentFolder: 'https://cdn.flexmonster.com/',
    width: '100%',
    height: 600,
}

const App = ({ ...props }: AppProps) => {
    const [dataSource, setDataSource] = useState<string>('')
    const [displayConfiguration, setDisplayConfiguration] = useState<string>('')
    const [reportDerived, setReportDerived] = useState(gridReport)

    const localInitialConfig = {
        ...initialConfig,
        report: reportDerived,
        customizeChartElement: customizeChartElement,
    }

    // Report state, definitely think of using this for data filtering.
    // ATM will not because all display options can be configured seperately.
    // Plus, with the toolbar,  built in data filtering is provided.
    // const [flexmonsterReport, setFlexmonsterReport] = useState<
    //     typeof gridReport | typeof columnReport
    // >(gridReport)

    const pivotRef: React.RefObject<FlexmonsterReact.Pivot> =
        React.createRef<FlexmonsterReact.Pivot>()
    var flexmonster: Flexmonster.Pivot

    // Lifecycle
    useEffect(() => {
        flexmonster = pivotRef.current!.flexmonster
    }, [])

    // Utility
    const showGrid = () => {
        // ATM, switching is not available due to dependency on report which is 
        // in state
        return flexmonster.showGrid()
    }

    const showColumn = () => {
        return flexmonster.showCharts('column')
    }

    // Applies downstream changes to configuration
    const saveDataSource = (newDataSource: string) => {
        setDataSource(newDataSource) // questionable
        return setReportDerived((prev: any) => ({
            ...prev,
            dataSource: {
                data: getData(newDataSource),
            },
        }))
    }

    const saveDisplayConfiguration = (newDisplayConfiguration: string) => {
        return setDisplayConfiguration(newDisplayConfiguration)
    }

    const defaultState = {
        dataSource,
        displayConfiguration,
        reportDerived,
        saveDataSource,
        saveDisplayConfiguration,
        customizeChartElement,
    }

    return (
        <AppContext.Provider value={defaultState}>
            <div>
                <button type="button" onClick={() => showGrid()}>
                    Grid
                </button>
                <button type="button" onClick={() => showColumn()}>
                    Chart
                </button>
                <FlexmonsterReact.Pivot
                    ref={pivotRef}
                    {...localInitialConfig}
                />
                <CustomizationForm
                    customizeChartElement={customizeChartElement}
                />
            </div>
        </AppContext.Provider>
    )
}

export default App

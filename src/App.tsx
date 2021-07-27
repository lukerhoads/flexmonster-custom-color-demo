import React, { useEffect, useRef, useState } from 'react'
import * as FlexmonsterReact from 'react-flexmonster'
import { CustomizationForm } from './components'
import Flexmonster from 'flexmonster'
// import { customizeChartElement } from './utils'
// import { Provider, atom, useAtom } from 'jotai'
import { AppContext } from './AppContext'
import { gridReport, getData } from './meta'
import yaml from 'js-yaml'

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

const useForceUpdate = () => {
    const [value, setValue] = useState(0) // integer state
    return () => setValue((value) => value + 1) // update the state to force render
}

const App = ({ ...props }: AppProps) => {
    const [dataSource, setDataSource] = useState<string>('')
    const [displayConfiguration, setDisplayConfiguration] = useState<string>('')
    const [parsedDisplayConfiguration, setParsedDisplayConfiguration] =
        useState<any>(null)
    const [reportDerived, setReportDerived] = useState(gridReport)

    const pivotRef: React.RefObject<FlexmonsterReact.Pivot> =
        React.createRef<FlexmonsterReact.Pivot>()
    // var flexmonster: Flexmonster.Pivot
    const [flexmonster, setFlexmonster] = useState<Flexmonster.Pivot | null>(
        null,
    )

    // Lifecycle
    useEffect(() => {
        setFlexmonster(pivotRef.current!.flexmonster)
        if (displayConfiguration) {
            setParsedDisplayConfiguration(JSON.parse(displayConfiguration))
        }
    }, [])

    useEffect(() => {
        if (displayConfiguration.startsWith('{')) {
            setParsedDisplayConfiguration(JSON.parse(displayConfiguration))
        } else {
            setParsedDisplayConfiguration(yaml.load(displayConfiguration))
        }
    }, [displayConfiguration])

    // Utility
    const showGrid = () => {
        // ATM, switching is not available due to dependency on report which is
        // in state
        return flexmonster!.showGrid()
    }

    const showColumn = () => {
        return flexmonster!.showCharts('column')
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

    const customizeChartElement = (
        element: Element,
        data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
    ) => {
        // This is being ran before parsed can be set
        // Probably because it is assigned before display config is set,
        // meaning we need to reset it after config is set
        console.log(parsedDisplayConfiguration)
        if (parsedDisplayConfiguration) {
            if (parsedDisplayConfiguration.graphType.all) {
                // Configuration applies to all graphs
                const referencePoint = parsedDisplayConfiguration.graphType.all
                if (referencePoint.labels && data.label) {
                    for (const label in referencePoint.labels) {
                        if (label == data.label) {
                            const labelRef = referencePoint.labels[label]
                            // This is where you check for label fields and apply their styles
                            if (labelRef.color) {
                                const dotElement = element.querySelector(
                                    '.fm-icon-display',
                                ) as HTMLElement
                                if (dotElement) {
                                    dotElement.style.backgroundColor =
                                        labelRef.color
                                }
                            }
                        }
                    }
                }

                if (referencePoint.data) {
                }
            } else {
                // Configuration specific to graph types
                if (
                    Object.keys(parsedDisplayConfiguration.graphType).includes(
                        data.label!,
                    )
                ) {
                }
            }
        }

        // console.log("element", element)
        // console.log("data", data)
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
                    {...initialConfig}
                    report={reportDerived}
                    customizeChartElement={customizeChartElement}
                />
                <CustomizationForm
                    customizeChartElement={customizeChartElement}
                />
            </div>
        </AppContext.Provider>
    )
}

export default App

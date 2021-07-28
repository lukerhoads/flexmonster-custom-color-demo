import React, { useEffect, useRef, useState } from 'react'
import * as FlexmonsterReact from 'react-flexmonster'
import { CustomizationForm } from './components'
import Flexmonster from 'flexmonster'
// import { customizeChartElement } from './utils'
// import { Provider, atom, useAtom } from 'jotai'
import { AppContext } from './AppContext'
import { report, getData } from './meta'
import yaml from 'js-yaml'
import { DisplayConfiguration } from './types/displayConfiguration'

// Find a way to add theming
// https://www.flexmonster.com/doc/customizing-appearance/
// import 'flexmonster/theme/lightblue/flexmonster.min.css'

// Also remember that you can customize default colors
// https://jsfiddle.net/4tpruLnv/1/

// Need a way to trigger a parent function on change
// export const dataSourceAtom = atom<string>('')
// export const displayConfigurationAtom = atom<string>('')
// export const reportAtom = atom(report)

type AppProps = {}

var initialConfig = {
    toolbar: true,
    componentFolder: 'https://cdn.flexmonster.com/',
    width: '100%',
    height: 600,
}

const useForceUpdate = () => {
    const [_, setValue] = useState(0) // integer state
    return () => setValue((value) => value + 1) // update the state to force render
}

const App = ({ ...props }: AppProps) => {
    const forceUpdate = useForceUpdate()
    const [dataSource, setDataSource] = useState<string>('')
    const [displayConfiguration, setDisplayConfiguration] = useState<string>('')
    const [parsedDisplayConfiguration, setParsedDisplayConfiguration] =
        useState<DisplayConfiguration | undefined>()
    // I think the only reason I defined this was to put it in context, but if this
    // flexmonster object can actually get its report we will not need it
    const [reportDerived, setReportDerived] = useState(report)

    const pivotRef: React.RefObject<FlexmonsterReact.Pivot> =
        React.createRef<FlexmonsterReact.Pivot>()
    const [flexmonster, setFlexmonster] = useState<
        Flexmonster.Pivot | undefined
    >()

    const [readonly, setReadonly] = useState(false)

    // Lifecycle
    useEffect(() => {
        // Later add error boundary and show fallback page
        if (!pivotRef.current?.flexmonster)
            console.error('Error rendering pivot component')
        setFlexmonster(pivotRef.current?.flexmonster)
        if (displayConfiguration)
            setRightParsedDisplayConfiguration(displayConfiguration)
    }, [pivotRef])

    useEffect(() => {
        // Methods for direct intervention with Flexmonster object through display configuration
        if (parsedDisplayConfiguration?.graphType?.grid.conditions) {
            setReportDerived((prev: any) => ({
                ...prev,
                conditions:
                    parsedDisplayConfiguration?.graphType?.grid.conditions,
            }))
        }

        if (parsedDisplayConfiguration?.readOnly) {
            setReadonly(parsedDisplayConfiguration?.readOnly)
            setReportDerived((prev: any) => ({
                ...prev,
                options: {
                    ...prev.options,
                    readOnly: parsedDisplayConfiguration?.readOnly,
                },
            }))
        }
    }, [parsedDisplayConfiguration])

    // Utility
    const initializeReport = () => {
        const report = flexmonster?.getReport()
        return setReportDerived(report as Flexmonster.Report)
    }

    const changeReport = initializeReport

    const showGrid = () => {
        return flexmonster?.showGrid()
    }

    const showColumn = () => {
        return flexmonster?.showCharts('column')
    }

    // Applies downstream changes to configuration
    const saveDataSource = (newDataSource: string) => {
        // For context updates
        setDataSource(newDataSource)

        // This would set derived report, which is useless given that it is only
        // used on initial render
        setReportDerived((prev: any) => ({
            ...prev,
            dataSource: {
                data: getData(newDataSource),
            },
        }))

        // Do not think I need this
        // Directly set report, this runs after mount so this is required
        // const currentReport = flexmonster?.getReport()
        // return flexmonster?.setReport({
        //     ...currentReport as Flexmonster.Report,
        //     dataSource: {
        //         data: getData(newDataSource),
        //     },
        // })
    }

    const saveDisplayConfiguration = (newDisplayConfiguration: string) => {
        // For context updates
        setDisplayConfiguration(newDisplayConfiguration)
        return setRightParsedDisplayConfiguration(newDisplayConfiguration)
    }

    const setRightParsedDisplayConfiguration = (
        newDisplayConfiguration: string,
    ) => {
        if (newDisplayConfiguration.startsWith('{')) {
            return setParsedDisplayConfiguration(
                JSON.parse(newDisplayConfiguration),
            )
        } else {
            const parsed = yaml.load(newDisplayConfiguration)
            return setParsedDisplayConfiguration(parsed as object)
        }
    }

    // For chart only, not grid
    const customizeChartElement = (
        element: Element,
        data: Flexmonster.ChartData | Flexmonster.ChartLegendItemData,
    ) => {
        // This is being ran before parsed can be set
        // Probably because it is assigned before display config is set,
        // meaning we need to reset it after config is set
        // Maybe it has something to do with how it is being registered, I am quite sure of this

        debugger
        console.log('Local configuration: ', parsedDisplayConfiguration)

        if (parsedDisplayConfiguration) {
            if (parsedDisplayConfiguration.graphType?.all) {
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
            } else {
                // Configuration specific to graph types
            }
        }

        // Used for finding out structure to write customization functions
        // console.log("element", element)
        // console.log("data", data)
    }

    let defaultState = {
        flexmonster,
        dataSource,
        displayConfiguration,
        reportDerived,
        readonly,
        saveDataSource,
        saveDisplayConfiguration,
        customizeChartElement,
    }

    // Think of passing customizeChartElement conditionally.
    return (
        <AppContext.Provider value={defaultState}>
            <div>
                <button type="button" onClick={() => showGrid()}>
                    Grid
                </button>
                <button type="button" onClick={() => showColumn()}>
                    Chart
                </button>
                <button type="button" onClick={() => forceUpdate()}>
                    Rerender
                </button>
                <FlexmonsterReact.Pivot
                    ref={pivotRef}
                    {...initialConfig}
                    report={reportDerived}
                    reportcomplete={initializeReport}
                    reportchange={changeReport}
                    customizeChartElement={customizeChartElement}
                />
                <CustomizationForm />
            </div>
        </AppContext.Provider>
    )
}

export default App

import React, { useEffect, useState } from 'react'
import * as FlexmonsterReact from 'react-flexmonster'
import { CustomizationForm } from './components'
import Flexmonster from 'flexmonster'
import { AppContext, ThemeTypes } from './AppContext'
import { report, getData } from './meta'
import yaml from 'js-yaml'
import { DisplayConfiguration } from './types/displayConfiguration'

// https://www.flexmonster.com/doc/customizing-appearance/
// import 'flexmonster/theme'

// Also remember that you can customize default colors
// https://jsfiddle.net/4tpruLnv/1/

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
    const [displayConfiguration, setDisplayConfiguration] = useState<string>('null')
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
    const [theme, setTheme] = useState<ThemeTypes>('default')
    const [defaultColors, setDefaultColors] = useState<string[]>([])

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

        if (parsedDisplayConfiguration?.theme) {
            const theme = parsedDisplayConfiguration?.theme
            // Check if provided theme fits the union
            if (theme as ThemeTypes) {
                setTheme(theme as ThemeTypes)
            } else {
                console.error('Invalid theme type provided')
            }
        }
    }, [parsedDisplayConfiguration])

    useEffect(() => {
        // Change theme type
    }, [theme])

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

    const saveReadOnly = (newReadOnly: boolean) => {
        if (newReadOnly != readonly) {
            return setReadonly(newReadOnly)
        }
    }

    const saveTheme = (newTheme: ThemeTypes) => {
        if (newTheme != theme) {
            return setTheme(newTheme)
        }
    }

    const setRightParsedDisplayConfiguration = (
        newDisplayConfiguration: string,
    ) => {
        if (newDisplayConfiguration.startsWith('{')) {
            const parsed = JSON.parse(newDisplayConfiguration)
            return setParsedDisplayConfiguration(parsed as DisplayConfiguration)
        } else {
            const parsed = yaml.load(newDisplayConfiguration)
            return setParsedDisplayConfiguration(parsed as DisplayConfiguration)
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
        theme,
        defaultColors,
        saveDataSource,
        saveDisplayConfiguration,
        saveReadOnly,
        saveTheme,
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
                <style jsx>{`
                    ${defaultColors[0]
                        ? `
                        .fm-charts-color-1 {
                            fill: ${defaultColors[0]} !important;
                        }
                    `
                        : ''}

                    ${defaultColors[1]
                        ? `
                        .fm-charts-color-2 {
                            fill: ${defaultColors[1]} !important;
                        }
                    `
                        : ''}

                    ${defaultColors[2]
                        ? `
                        .fm-charts-color-3 {
                            fill: ${defaultColors[2]} !important;
                        }
                    `
                        : ''}
                    
                    ${defaultColors[3]
                        ? `
                        .fm-charts-color-4 {
                            fill: ${defaultColors[3]} !important;
                        }
                    `
                        : ''}

                    ${defaultColors[4]
                        ? `
                        .fm-charts-color-5 {
                            fill: ${defaultColors[4]} !important;
                        }
                    `
                        : ''}
                `}</style>
            </div>
        </AppContext.Provider>
    )
}

export default App

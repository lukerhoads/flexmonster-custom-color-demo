import testdata from '../../testdata/testdata.json'

// Helper function defined just in case any manual preprocessing is needed
const getData = (url?: string): object[] | undefined => {
    if (url) {
        var data: any
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data = data
                return
            })
            .catch((error) => {
                console.error(error)
            })
        return data
    }
    return testdata
}

export const baseReport: Flexmonster.Report = {
    dataSource: {
        data: getData(),
    },
    options: {
        configuratorActive: true,
    },
}

export type ReportType = typeof gridReport & typeof columnReport

export const gridReport = {
    ...baseReport.dataSource,
    options: {
        ...baseReport.options,
    },
    slice: {
        reportFilters: [
            {
                uniqueName: 'Order Date.Year',
            },
            {
                uniqueName: 'Order Date.Month',
            },
            {
                uniqueName: 'Order Date.Day',
            },
        ],
        rows: [
            {
                uniqueName: 'Payment Type',
            },
        ],
        columns: [
            {
                uniqueName: '[Measures]',
            },
            {
                uniqueName: 'Referring Site',
            },
        ],
        measures: [
            {
                uniqueName: 'Revenue',
                formula: 'sum("Amount") * sum("Price")',
                individual: true,
                caption: 'Revenue',
                format: 'currency',
            },
        ],
    },
    conditions: [
        {
            formula: '#value < 45000',
            measure: 'Revenue',
            format: {
                backgroundColor: '#df3800',
                color: '#fff',
                fontFamily: 'Arial',
                fontSize: '12px',
            },
        },
        {
            formula: '#value > 400000',
            measure: 'Revenue',
            format: {
                backgroundColor: '#00a45a',
                color: '#fff',
                fontFamily: 'Arial',
                fontSize: '12px',
            },
        },
    ],
}

// Unused
export const columnReport = {
    ...baseReport.dataSource,
    options: {
        ...baseReport.options,
    },
    slice: {
        rows: [
            {
                uniqueName: 'Order Data.Month',
            },
        ],
        columns: [
            {
                uniqueName: 'City',
                filter: {
                    measure: {
                        uniqueName: 'Orders',
                        aggregation: 'sum',
                    },
                    query: {
                        top: 5,
                    },
                },
            },
            {
                uniqueName: '[Measures]',
            },
        ],
        measures: [
            {
                uniqueName: 'Orders',
                aggregation: 'sum',
            },
        ],
    },
    conditions: [],
}

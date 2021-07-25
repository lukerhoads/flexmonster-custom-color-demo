// JSON testdata
import testdata from '../testdata/testdata.json'

// Helper function defined just in case any manual preprocessing is needed
const getData = (): object[] | undefined => {
    return testdata
}

export const baseReport: Flexmonster.Report = {
    dataSource: {
        data: getData(),
    },
    options: {
        configuratorActive: false,
    },
}

export const gridReport = {
    ...baseReport.dataSource,
    options: {
        ...baseReport.options,
        viewType: 'grid',
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

export const columnReport = {
    ...baseReport.dataSource,
    viewTypes: 'charts',
    options: {
        ...baseReport.options,
        chart: {
            type: 'column',
        },
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

import Flexmonster from 'flexmonster'
import testdata from '../../testdata/testdata.json'

// Helper function defined just in case any manual preprocessing is needed
export const getData = (url?: string): object[] => {
    if (url) {
        let data: any
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data = data
                return
            })
            .catch((error) => {
                throw error
            })
        return data
    }

    if (!testdata) throw new Error('testdata not available')

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

export const report: Flexmonster.Report = {
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
        // {
        //     formula: '#value < 45000',
        //     measure: 'Revenue',
        //     format: {
        //         backgroundColor: '#df3800',
        //         color: '#fff',
        //         fontFamily: 'Arial',
        //         fontSize: '12px',
        //     },
        // },
        // {
        //     formula: '#value > 400000',
        //     measure: 'Revenue',
        //     format: {
        //         backgroundColor: '#00a45a',
        //         color: '#fff',
        //         fontFamily: 'Arial',
        //         fontSize: '12px',
        //     },
        // },
    ],
}

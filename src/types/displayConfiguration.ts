export interface DisplayConfiguration {
    theme?: string
    readOnly?: boolean
    graphType: GraphTypes
}

type GraphTypes = GraphTypesWildcard & {
    grid: {
        conditions: GraphConditions[]
    }
    all?: GraphConfiguration
}

interface GraphTypesWildcard {
    [graph: string]: GraphConfiguration
}

interface GraphConfiguration {
    labels?: {
        [measure: string]: {
            color: string
        }
    }
    // Other configurable (I forgot what it was)
}

export interface GraphConditions {
    formula: string
    measure: string
    format: {
        backgroundColor?: string
        color?: string
        fontFamily?: string
        fontSize?: string
    }
}

export interface DisplayConfiguration {
    theme?: string,
    graphType?: GraphTypes
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
    conditions?: GraphConditions[]
}

interface GraphConditions {
    formula: string,
    measure?: string,
    format: {
        backgroundColor?: string,
        color?: string,
        fontFamily?: string,
        fontSize?: string,
    }
}
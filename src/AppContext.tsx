import React from 'react'
import { DisplayConfiguration } from './types/displayConfiguration'

export const Stub = () =>
    new Error('Wrap your components in AppContext.Provider!')

export type ThemeTypes =
    | 'lightblue'
    | 'softdefault'
    | 'stripedblue'
    | 'stripedteal'
    | 'brightorange'
    | 'yellow'
    | 'green'
    | 'midnight'
    | 'macos'
    | 'lightblue'
    | 'teal'
    | 'orange'
    | 'default'
    | 'blackorange'
    | 'accessible'
    | 'old'
    | 'purple'

export interface AppConfig {
    flexmonster?: Flexmonster.Pivot
    dataSource?: string
    displayConfiguration: string
    report?: any
    readOnly?: boolean
    theme?: ThemeTypes
    defaultColors?: string[]
    saveDataSource: (newDataSource: string) => void
    saveDisplayConfiguration: (newDisplayConfiguration: string) => void
    saveReadOnly: (newReadOnly: boolean) => void
    saveTheme: (newTheme: ThemeTypes) => void
}

const defaultContext = {
    displayConfiguration: 'null',
    readOnly: true,
    saveDataSource: Stub,
    saveDisplayConfiguration: Stub,
    saveReadOnly: Stub,
    saveTheme: Stub,
}

export const AppContext = React.createContext<AppConfig>(defaultContext)

export const useApp = (): AppConfig => React.useContext<AppConfig>(AppContext)

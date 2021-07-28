import React, { ChangeEvent, useState, MouseEvent, useEffect } from 'react'
import { useApp } from '../../../AppContext'

export type ConfigLoaderProps = {}

// ConfigLoader allows you to customize the source of your data
const ConfigLoader = ({ ...props }: ConfigLoaderProps) => {
    const { saveDataSource, saveDisplayConfiguration } = useApp()

    const [dataSourceDerived, setDataSourceDerived] = useState<string>('')
    const [displayConfigurationDerived, setDisplayConfigurationDerived] =
        useState<string>('')

    // Lifecycle
    useEffect(() => {
        const storedCfg = localStorage.getItem('cfg')
        if (storedCfg) {
            const parsed = JSON.parse(storedCfg)
            setDataSourceDerived(parsed.dataSource)
            setDisplayConfigurationDerived(parsed.displayConfiguration)
            saveDataSource(parsed.dataSource)
            saveDisplayConfiguration(parsed.displayConfiguration)
        }
    }, [])

    useEffect(() => {
        const cfg = {
            dataSource: dataSourceDerived,
            displayConfiguration: displayConfigurationDerived,
        }
        if (localStorage.getItem('cfg')) localStorage.removeItem('cfg')
        localStorage.setItem('cfg', JSON.stringify(cfg))
    }, [dataSourceDerived, displayConfigurationDerived])

    const setNewDataSource = (e: ChangeEvent<HTMLInputElement>) => {
        return setDataSourceDerived(e.currentTarget.value)
    }

    const setNewDisplayConfiguration = (
        e: ChangeEvent<HTMLTextAreaElement>,
    ) => {
        return setDisplayConfigurationDerived(e.currentTarget.value)
    }

    return (
        <div className="config-loader-wrapper">
            <label htmlFor="data-source">Data source (url)</label>
            <input
                type="input"
                name="data-source"
                placeholder="https://example.com/data.json"
                value={dataSourceDerived}
                onChange={setNewDataSource}
            />
            <button
                className="config-loader-button"
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    saveDataSource(dataSourceDerived)
                }
            >
                Save
            </button>
            <label htmlFor="display-configuration">
                Display Configuration (json/yaml)
            </label>
            <textarea
                className="config-loader-textarea"
                name="display-configuration"
                value={displayConfigurationDerived}
                onChange={setNewDisplayConfiguration}
            />
            <button
                className="config-loader-button"
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    saveDisplayConfiguration(displayConfigurationDerived)
                }
            >
                Save
            </button>
            <style jsx>{`
                .config-loader-wrapper {
                    height: 100%;
                }

                .config-loader-button {
                    width: 100%;
                }

                .config-loader-textarea {
                    height: 100%;
                }
            `}</style>
        </div>
    )
}

export default ConfigLoader

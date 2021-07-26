import React, { ChangeEvent, useState, MouseEvent } from 'react'
import { useApp } from '../../../AppContext'

export type ConfigLoaderProps = {}

// ConfigLoader allows you to customize the source of your data
const ConfigLoader = ({ ...props }: ConfigLoaderProps) => {
    const { saveDataSource, saveDisplayConfiguration } = useApp()

    const [dataSource, setDataSource] = useState<string>('')
    const [displayConfiguration, setDisplayConfiguration] = useState<string>('')

    const setNewDataSource = (e: ChangeEvent<HTMLInputElement>) => {
        return setDataSource(e.currentTarget.value)
    }

    const setNewDisplayConfiguration = (
        e: ChangeEvent<HTMLTextAreaElement>,
    ) => {
        return setDisplayConfiguration(e.currentTarget.value)
    }

    return (
        <div className="config-loader-wrapper">
            <label htmlFor="data-source">Data source (url)</label>
            <input
                type="input"
                name="data-source"
                placeholder="https://example.com/data.json"
                value={dataSource}
                onChange={setNewDataSource}
            />
            <button
                className="config-loader-button"
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    saveDataSource(dataSource)
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
                value={displayConfiguration}
                onChange={setNewDisplayConfiguration}
            />
            <button
                className="config-loader-button"
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    saveDisplayConfiguration(displayConfiguration)
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

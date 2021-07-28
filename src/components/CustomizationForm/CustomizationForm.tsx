import React from 'react'
import { DataConfigurator, ConfigLoader } from './sub'

export type CustomizationFormProps = {}

const CustomizationForm = ({ ...props }: CustomizationFormProps) => {
    return (
        <div className="configuration-form-wrapper">
            <div className="configuration-form-editor left">
                <h2>Customization</h2>
                <DataConfigurator />
            </div>
            <div className="configuration-form-editor right">
                <h2>Configuration</h2>
                <ConfigLoader />
            </div>
            <style jsx>{`
                input,
                textarea,
                select {
                    width: 100%;
                    box-sizing: border-box;
                }

                .button {
                    width: 100%;
                    box-sizing: border-box;
                }

                .configuration-form-wrapper {
                    display: flex;
                    align-items: stretch;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .configuration-form-editor {
                    width: 45%;
                }

                .left {
                }

                .right {
                }
            `}</style>
        </div>
    )
}

export default CustomizationForm

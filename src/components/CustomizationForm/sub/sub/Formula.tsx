import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../../../../AppContext'
import { ChartTypes } from '../../../../types'
import {
    DisplayConfiguration,
    GraphConditions,
} from '../../../../types/displayConfiguration'

export type FormulaProps = {}

// Formula allows you to customize the source of your data
const Formula = ({ ...props }: FormulaProps) => {
    // Specifically display configuration which this will update on the fly
    // Flexmonster object allows for nested API calls
    const { displayConfiguration, saveDisplayConfiguration } =
        useApp()
    const preParsed = displayConfiguration === '' ? JSON.parse('null') : JSON.parse(displayConfiguration);
    const [parsedDisplayConfiguration, setParsedDisplayConfiguration] =
        useState<DisplayConfiguration | null>(preParsed)
    const [
        partitionedDisplayConfiguration,
        setPartitionedDisplayConfiguration,
    ] = useState(parsedDisplayConfiguration?.graphType['grid'])
    const [conditions, setConditions] = useState<GraphConditions[]>([])

    // Lifecycle (this may be the cause of the cycle, as it ultimately depends on displayConfiguration)
    useEffect(() => {
        console.log("In this condition update block from partition update")
        console.log(partitionedDisplayConfiguration)
        debugger;
        const incomingConditions = partitionedDisplayConfiguration?.conditions
        if (conditions != incomingConditions && incomingConditions != undefined) {
            setConditions(incomingConditions)
            debugger;
        }
    }, [partitionedDisplayConfiguration])

    const formulaRef = useRef<HTMLInputElement>(null)
    const measureRef = useRef<HTMLInputElement>(null)
    const backgroundColorRef = useRef<HTMLInputElement>(null)
    const colorRef = useRef<HTMLInputElement>(null)
    const fontFamilyRef = useRef<HTMLInputElement>(null)
    const fontSizeRef = useRef<HTMLInputElement>(null)
    const reqRefList = [formulaRef, measureRef]
    const leniantRefList = [
        backgroundColorRef,
        colorRef,
        fontFamilyRef,
        fontSizeRef,
    ]

    const validateFields = (): boolean => {
        let nullFound = false
        reqRefList.forEach((ref, idx) => {
            if (ref.current?.value === null) nullFound = true
        })
        if (nullFound) return nullFound

        let nonNull = 0
        leniantRefList.forEach((ref, idx) => {
            if (ref.current?.value !== null) nonNull += 1
        })
        if (nonNull < 1) return false
        return true
    }

    const removeEmpty = (obj: object): any => {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
        );
    }

    const saveCondition = () => {
        if (!validateFields()) {
            console.error('Required field not provided')
            return
        }

        let newCondition: GraphConditions = {
            formula: formulaRef.current!.value,
            measure: measureRef.current!.value,
            format: {
                backgroundColor: backgroundColorRef.current?.value,
                color: colorRef.current?.value,
                fontFamily: fontFamilyRef.current?.value,
                fontSize: fontSizeRef.current?.value,
            },
        }

        const conditionsLocal = conditions
        const newArray = conditionsLocal?.splice(conditionsLocal.length, 0, newCondition)
        // Because this sets display configuration, and conditions is dependent,
        // setConditions is not necessary
        saveDisplayConfiguration(
            JSON.stringify({
                ...parsedDisplayConfiguration,
                graphType: {
                    ...parsedDisplayConfiguration?.graphType,
                    grid: {
                        ...parsedDisplayConfiguration?.graphType.grid,
                        conditions: conditionsLocal,
                    },
                },
            }),
        )
    }

    const deleteCondition = (idx: number) => {
        setConditions(conditions!.splice(idx, 1))
    }

    return (
        <div>
            <label htmlFor="format">Meta (both required)</label>
            <input
                ref={formulaRef}
                name="formula"
                placeholder="#value < 45000"
            />
            <input ref={measureRef} name="measure" placeholder="Revenue" />
            <label htmlFor="format">Format (one required)</label>
            <div>
                <input
                    ref={backgroundColorRef}
                    name="background-color"
                    placeholder="background color"
                />
                <input ref={colorRef} name="color" placeholder="text color" />
                <input
                    ref={fontFamilyRef}
                    name="font-family"
                    placeholder="Not functional"
                    disabled
                />
                <input ref={fontSizeRef} name="font-size" placeholder="13" />
            </div>
            <button className="button" onClick={saveCondition}>
                Save
            </button>
            <div>
                <p>Current conditions:</p>
                <br />
                {conditions
                    ? conditions.forEach((item, idx) => (
                          <div>
                              {item}{' '}
                              <button onClick={() => deleteCondition(idx)}>
                                  Delete
                              </button>
                          </div>
                      ))
                    : 'None'}
            </div>
        </div>
    )
}

export default Formula

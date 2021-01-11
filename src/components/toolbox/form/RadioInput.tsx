import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface RadioInputProps {
    question: string
    options: string[]
    onChange: (option: string) => void
}
const RadioInput = ({question, options, onChange}: RadioInputProps) => {

    const [selected, setSelected] = useState<number>(-1)

    useEffect(() => {
        if (selected >= 0 && selected < options.length) onChange(options[selected]);
    }, [selected])

    return (<div className="radio-input-control">
        <Question>{question}</Question>
        <div style={{display: `flex`, flexWrap: `wrap`}}>
            {options.map((option: string, i: number) => <Option 
                className={selected == i ? `selected` : ``} 
                onClick={() => setSelected(i)}
                key={i}>{option}</Option>)}
        </div>
    </div>)
}

// Styles
const Question = styled.div`
    font-family: sans-serif;
    margin-bottom: 10px;
`

const Option = styled.div`
    border: 2px solid #7896ad;
    width: 31%;
    margin-right: 2%;
    box-sizing: border-box;
    margin-bottom: 10px;
    text-align: center;
    padding: 8px 0;
    font-size: 0.8rem;
    font-family: sans-serif;
    border-radius: 3px;
    color: #7896ad;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.15s, background 0.15s, border 0.15s;

    &:hover {
    border: 2px solid #3B4353;
    }

    &.selected {
        background-color: #7896ad;
        color: white;
    }
`

export default RadioInput;
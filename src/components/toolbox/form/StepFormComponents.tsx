import React, { useState } from 'react';

export class StepFormComponent {

    _state: any;
    _view: JSX.Element;
    description?: string;

    constructor(state: any, view: JSX.Element, desc?: string) {
        this._state = state;
        this._view = view;
        this.description = desc;
    }

    getState(): any { return this._state; }
    getView(): JSX.Element {
        return (<div>
            {this.description && <div style={{ marginBottom: '8px' }}>{this.description}</div>}
            {this._view}
        </div>);
    }

    withDescription(desc: string): StepFormComponent {
        return new StepFormComponent(
            this._state,
            this._view,
            desc
        );
    }
}

/**
 * The InputField component should allow the
 * use of an input form field in the step
 * component.
 */
export const InputField = ({ placeholder }: { placeholder?: string } = {}): StepFormComponent => {

    const [value, setValue] = useState<string>("");

    const getView = (): JSX.Element => (<input
        {...(placeholder ? { placeholder } : {})}
        className="step-input-field"
        onChange={(e) => {
            setValue(e.target.value);
        }}
    />);

    // return [value, getView()];
    return new StepFormComponent(value, getView());
}

/**
 * SelectInput component to select b/w multiple
 * fields.
 */
export const SelectInput = (options: string[]): StepFormComponent => {

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const toggle_ = (index: number) => {
        if (index == selectedIndex) setSelectedIndex(-1);
        else setSelectedIndex(index);
    }

    const getView = (): JSX.Element => (<div className="step-select-input">
        {options.map((option: string, i: number) =>
            <div
                onClick={() => toggle_(i)}
                className={`_selectable-el ${selectedIndex == i ? 'active' : ''}`}
                key={i}>{option}</div>
        )}
    </div>);

    const inRange = (index: number): boolean => index >= 0 && index < options.length;

    return new StepFormComponent(inRange(selectedIndex) ? options[selectedIndex] : undefined, getView());

}
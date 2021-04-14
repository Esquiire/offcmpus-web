import { useSpring, motion, useTransform } from 'framer-motion'
import React, { useRef, useEffect, useState } from 'react'
import { RiBookOpenLine } from 'react-icons/ri'
import Input, { Validators, InputValidatorFlags, alnumOnly, noSpaces, $and, numbersOnly } from '../components/toolbox/form/Input'
import NumberPicker from '../components/toolbox/form/NumberPicker'
import Button from '../components/toolbox/form/Button'
import Centered from '../components/toolbox/layout/Centered'

import { InputField, StepFormComponent, SelectInput } from '../components/toolbox/form/StepFormComponents'

import { HiCheck } from 'react-icons/hi';

const {
  numbersOnly: numbersOnlyValidator,
  minLen: minLenValidator
} = Validators;

const Testing = () => {

  const [stepFormState, stepFormView] = SteppedForm({
    stepsInfo: [{
      label: "Select Input",
      header: "Select Input",
      subheader: "This is an example select-input component",
      beforeContinue: (state: any): boolean => {
        // Do something like save the contents.
        return true;
      },
      continueIf: (state: any) => state != null && state != undefined,
      component: SelectInput(["Option 1", "Option 2", "Option 3", "Option 4"])
        .withDescription("This is an example select-input component with description")
    }, {
      label: "First Step 1",
      header: "First Step Header 1",
      subheader: "First Step Sub-Header",
      beforeContinue: (state: any): boolean => {
        return true;
      },
      continueIf: (state: any) => state == "magic-word",
      component: InputField({ placeholder: "Sample Placeholder 123" })
        .withDescription("Sample input field here")
    }]
  });

  return (<div>
    <Centered width={700} height={600}>
      <div>{stepFormView}</div>
    </Centered>
  </div>)
}

type FormStepInfo = {
  // The label is what the step will be identified as
  label: string,
  // The header is the text that will be shown above the
  // stepped form when the user reaches this page
  header?: string,
  // The subtext located under the header
  subheader?: string,
  continueIf: (state: any) => boolean,
  // beforeContinue is called whenever the user clicks the 
  // "Next" or "Complete" button. If the function resolves
  // with true, then step form will continue to the next step.
  // Otherwise, it will remain on the same step and give an error.
  beforeContinue: ((state: any) => Promise<boolean>) | ((state: any) => boolean),
  // TODO extrapolate this later if necessary
  component: StepFormComponent // { state: any, view: () => JSX.Element }
}

const SteppedForm = ({ stepsInfo }: { stepsInfo: FormStepInfo[] }) => {

  useEffect(() => {
    console.log("Step Info Updated", stepsInfo);
  }, [stepsInfo]);

  const [stepState, setStepState] = useState<number>(0);

  const goToStep = (step_index: number) => {
    setStepState(Math.min(Math.max(0, step_index), stepsInfo.length - 1));
  }

  const renderView = () => {
    if (stepState < 0 || stepState >= stepsInfo.length) return <div>NO COMPONENT</div>;
    return stepsInfo[stepState].component.getView();
  }

  const getView = () => (<div className="stepped-form-container">
    <div className="stepped-form-holder">
      <div className="header-area">
        {stepsInfo[stepState].header != null && <div className="header">{stepsInfo[stepState].header}</div>}
        {stepsInfo[stepState].subheader != null && <div className="sub-header">{stepsInfo[stepState].subheader}</div>}
      </div>

      <div className="stepped-form-contents">

        <div className="stepped-form-step-list">

          <div style={{ padding: '10px 15px', fontWeight: 600 }}>Steps</div>

          <div className="stepped-form-list-scroll-container">
            {(() => {
              let stepLinks: JSX.Element[] = [];
              for (var i = 0; i < stepsInfo.length; ++i) {
                stepLinks.push(<div key={i} className={`step-link-el ${i == stepState ? 'active' : ''}`}>
                  <div className="step-link-index">{i + 1}</div>
                  <div className="step-link-label">{stepsInfo[i].label}</div>
                  <div className="step-link-status">
                    {i % 2 == 0 ?
                      <span style={{ color: "#6AD68B" }}><HiCheck /></span> :
                      <span></span>
                    }
                  </div>
                </div>);
              }
              return stepLinks;
            })()}
          </div>

        </div>
        <div className="stepped-form-interaction-area">
          <div className="stepped-content-area">
            {renderView()}
          </div>

          <div className="step-control-area">
            <div style={{ width: '100px' }}>
              {stepState != 0 &&
                <Button
                  onClick={() => {
                    goToStep(stepState - 1);
                  }}
                  text="Back"
                  transformDisabled={true}
                  bold={true}
                  textColor="#3B4353"
                  background="#dcdcdc"
                />
              }
            </div>
            <div style={{ width: '100px' }}>
              {(() => {

                // check if they can continue
                if (!stepsInfo[stepState].continueIf(stepsInfo[stepState].component.getState())) {
                  return <Button
                    text="Next"
                    disabled={true}
                  />
                }

                // can continue
                return (<Button
                  onClick={() => {
                    goToStep(stepState + 1);
                  }}
                  text={stepState == stepsInfo.length - 1 ? "Complete" : "Next"}
                  transformDisabled={true}
                  bold={true}
                  textColor="white"
                  background={stepState == stepsInfo.length - 1 ? "#E0777D" : "#3B4353"}
                />);
              })()}
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>);

  return [null, getView()];
}

export default Testing
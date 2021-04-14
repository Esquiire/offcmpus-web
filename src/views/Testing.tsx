import React, { useRef, useEffect, useState } from 'react'
import { useSpring, motion, useTransform } from 'framer-motion'
import { RiBookOpenLine } from 'react-icons/ri'
import Input, { Validators, InputValidatorFlags, alnumOnly, noSpaces, $and, numbersOnly } from '../components/toolbox/form/Input'
import NumberPicker from '../components/toolbox/form/NumberPicker'
import Button from '../components/toolbox/form/Button'
import Centered from '../components/toolbox/layout/Centered'

import { HiCheck } from 'react-icons/hi';

const {
  numbersOnly: numbersOnlyValidator,
  minLen: minLenValidator
} = Validators;

const Testing = () => {

  const [stepFormState, stepFormView] = SteppedForm({
    stepsInfo: [{
      label: "First Step 1",
      header: "First Step Header 1",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 2",
      header: "First Step Header 2",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 3",
      header: "First Step Header 3",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 4",
      header: "First Step Header 4",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 5",
      header: "First Step Header 5",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 6",
      header: "First Step Header 6",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 7",
      header: "First Step Header 7",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 8",
      header: "First Step Header 8",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step 9",
      header: "First Step Header 9",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step",
      header: "First Step Header",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
    }, {
      label: "First Step",
      header: "First Step Header",
      subheader: "First Step Sub-Header",
      children: <div>This is a placeholder child</div>
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

  // TODO extrapolate this later if necessary
  children: any
}

const SteppedForm = ({ stepsInfo }: { stepsInfo: FormStepInfo[] }) => {

  const [stepState, setStepState] = useState<number>(0);

  const goToStep = (step_index: number) => {
    setStepState(Math.min(Math.max(0, step_index), stepsInfo.length - 1));
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
                stepLinks.push(<div className={`step-link-el ${i == stepState ? 'active' : ''}`}>
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
          Interaction Area

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
            <div style={{ width: '100px' }}><Button
              onClick={() => {
                goToStep(stepState + 1);
              }}
              text={stepState == stepsInfo.length - 1 ? "Complete" : "Next"}
              transformDisabled={true}
              bold={true}
              textColor="white"
              background={stepState == stepsInfo.length - 1 ? "#E0777D" : "#3B4353"}
            />
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>);

  return [null, getView()];
}

export default Testing
import React from 'react';
// Contexts
import useStepLogic from './customHooks/useStepLogic';
import SidebarSummary from './SidebarSummary/SidebarSummary';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';

const Form = () => {
  const { formState, handleSubmit } = useStepLogic();
  return (
    <div className="wmnds-container wmnds-p-t-lg wmnds-p-b-lg">
      <div className="wmnds-grid wmnds-grid--spacing-md-2-md">
        <div className="wmnds-col-2-3">
          <form onSubmit={handleSubmit}>
            {formState.currentStep === 1 && <Step1 />}
            {formState.currentStep === 2 && <Step2 />}
            {formState.currentStep === 3 && <Step3 />}
            {formState.currentStep === 4 && <Step4 />}
          </form>
        </div>
        <div className="wmnds-col-1-3">
          <SidebarSummary />
        </div>
      </div>
    </div>
  );
};

export default Form;

import { useEffect } from 'react';
import Loader from 'components/shared/Loader/Loader';
import useStepLogic from './customHooks/useStepLogic';
import useTicketingAPI from './customHooks/useTicketingAPI';
import SidebarSummary from './SidebarSummary/SidebarSummary';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import s from './Form.module.scss';

const Form = ({ prevMode }: { prevMode: string[] }) => {
  const { formState } = useStepLogic();
  const { getAPIResults, results, loading } = useTicketingAPI();
  const { ticketInfo } = formState;

  useEffect(() => {
    // Run API search if:
    // - Train mode is not selected
    // - There are no results
    // - If modes have changed
    if (!loading) {
      if (!results.length || prevMode !== ticketInfo.modes) {
        getAPIResults();
      }
    }
  }, [getAPIResults, loading, results, prevMode, ticketInfo.modes]);

  return (
    <div className={`${s.container} wmnds-container wmnds-p-b-lg`}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {formState.currentStep === 4 ? (
            <Step4 />
          ) : (
            <div className="wmnds-grid wmnds-grid--spacing-md-2-md">
              <div className="wmnds-col-1-1 wmnds-col-md-2-3">
                <form>
                  {formState.currentStep === 1 && <Step1 />}
                  {formState.currentStep === 2 && <Step2 />}
                  {formState.currentStep === 3 && <Step3 />}
                </form>
              </div>
              <div className="wmnds-col-1-1 wmnds-col-md-1-3">
                {formState.showAnswers && (
                  <div className="wmnds-hide-desktop">
                    <SidebarSummary />
                  </div>
                )}
                <div className="wmnds-hide-mobile">
                  <SidebarSummary />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Form;

import { useLayoutEffect, useContext, useEffect, useCallback } from 'react';
// Import contexts
import { FormContext } from '../../../../globalState';

const useStepLogic = () => {
  const [formState, formDispatch] = useContext(FormContext); // Get the state/dispatch of form data from FormDataContext
  const { ticketInfo, mounted, editMode } = formState;
  const { modes, ticketType } = ticketInfo;

  // Function for setting the step of the form
  const setStep = useCallback(
    (step: number) => {
      formDispatch({
        type: 'UPDATE_STEP',
        payload: step,
      });
      window.scrollTo(0, 0);
    },
    [formDispatch],
  );

  // Logic which determines which step to go to based on data available
  const runStepLogic = useCallback(() => {
    const {
      traveller,
      travelTime,
      busCompany,
      busArea,
      railZones,
      firstClass,
      ticketDuration,
    } = ticketInfo;
    formDispatch({ type: 'EDIT_MODE', payload: null });

    // Checks to see if step 1 is complete
    const step1Check =
      (ticketType && traveller && busCompany) ||
      (ticketType && traveller && ticketType !== 'single');
    // Checks to see if step 2 is complete
    const step2Check =
      (travelTime && busArea && ticketType === 'nBus') ||
      (travelTime && railZones && ticketType === 'nTicket') ||
      (travelTime && (ticketType === 'single' || ticketType === 'tram'));
    // Checks to see if step 3 is complete
    const step3Check =
      (ticketDuration && ticketType !== 'nTicket') ||
      (ticketDuration && firstClass) ||
      (ticketDuration && railZones && Math.max(...railZones) > 5);

    // If step checks fail (return false), go to the step to get the correct information
    if (step1Check) {
      if (step2Check) {
        if (step3Check) {
          setStep(4);
        } else {
          setStep(3);
        }
      } else {
        setStep(2);
      }
    } else {
      setStep(1);
    }
  }, [setStep, formDispatch, ticketInfo, ticketType]);

  // Try to set the ticket type based on data available
  const setTicketType = useCallback(() => {
    let tType = null;
    if (modes.includes('train')) {
      // If train mode is selected it will be 'nTicket'
      tType = 'nTicket';
    } else if (!modes.includes('bus')) {
      // If bus mode isn't selected it will be 'single'
      tType = 'tram';
    }
    // Do the ticket update only if:
    // - tType is set (above)
    // - or bus mode is selected and ticket type is not set to nBus or single (we set these in step 1)
    if (tType || (modes.includes('bus') && ticketType !== 'nBus' && ticketType !== 'single')) {
      formDispatch({
        type: 'UPDATE_TICKET_TYPE',
        payload: tType,
      });
    }
  }, [modes, ticketType, formDispatch]);

  useLayoutEffect(() => {
    // If app is just mounted run setTicketType and stepLogic
    if (!mounted && modes) {
      formDispatch({ type: 'MOUNT_APP' });
      setTicketType();
      runStepLogic();
    }
  }, [modes, mounted, setTicketType, runStepLogic, formDispatch]);

  // Run step logic when ticketInfo is updated
  useEffect(() => {
    if (mounted && !editMode) {
      runStepLogic();
    }
  }, [mounted, editMode, ticketInfo, runStepLogic]);

  // Run ticket type logic when modes are updated
  useEffect(() => {
    if (modes) {
      setTicketType();
    }
  }, [modes, setTicketType]);

  return {
    setStep,
    setTicketType,
    runStepLogic,
    formState,
    formDispatch,
  };
};

export default useStepLogic;

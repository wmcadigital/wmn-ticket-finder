import React, { useContext } from 'react';
import { FormContext } from '../../../../globalState';
import questions from '../questions';
import SummarySection from './SummarySection';

// helpers
const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const arrayToSentence = (array: string[]) => {
  let sentence;
  if (array.length > 2) {
    sentence = `${array.slice(0, array.length - 1).join(', ')} and ${array.slice(-1)}`;
  } else if (array.length === 2) {
    sentence = `${array[0]} and ${array[1]}`;
  } else {
    [sentence] = array;
  }
  return sentence;
};

const SidebarSummary = () => {
  const [formState, formDispatch] = useContext(FormContext);
  const { ticketInfo } = formState;

  const capitalizedModes = formState.modes.map((m: string) => capitalize(m));

  const getOptionText = (key: string, val: string) => {
    const o = questions[key].options.find(
      (option: any) => option.value.toLowerCase() === val.toLowerCase(),
    );
    return o && o.text;
  };

  // Function for setting the step of the form
  const editStep = (step: number, page: string) => {
    formDispatch({
      type: 'UPDATE_STEP',
      payload: step,
    });
    formDispatch({
      type: 'EDIT_MODE',
      payload: page,
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white wmnds-p-md">
      <SummarySection
        title="Mode of travel"
        value={arrayToSentence(capitalizedModes)}
        onChange={() => editStep(0, 'modes')}
      />
      {(ticketInfo.busCompany || ticketInfo.ticketType === 'nBus') && (
        <>
          <SummarySection
            title="Bus company"
            value={
              ticketInfo.busCompany
                ? getOptionText('busCompany', ticketInfo.busCompany)
                : 'nNetwork'
            }
            onChange={() => editStep(1, 'busCompany')}
          />
        </>
      )}
      {ticketInfo.traveller && (
        <>
          <SummarySection
            title="Traveller"
            value={getOptionText('traveller', ticketInfo.traveller)}
            onChange={() => editStep(1, 'traveller')}
          />
        </>
      )}
      {ticketInfo.busArea && (
        <>
          <SummarySection
            title="Bus area"
            value={getOptionText('busArea', ticketInfo.busArea)}
            onChange={() => editStep(2, 'busArea')}
          />
        </>
      )}
      {ticketInfo.travelTime && (
        <>
          <SummarySection
            title="Travel time"
            value={getOptionText('travelTime', ticketInfo.travelTime)}
            onChange={() => editStep(2, 'travelTime')}
          />
        </>
      )}
      {ticketInfo.firstClass && (
        <>
          <SummarySection
            title="First class"
            value={getOptionText('firstClass', ticketInfo.firstClass)}
            onChange={() => editStep(3, 'firstClass')}
          />
        </>
      )}
      {ticketInfo.ticketDuration && (
        <>
          <SummarySection
            title="Ticket duration"
            value={getOptionText('ticketDuration', ticketInfo.ticketDuration)}
            onChange={() => editStep(3, 'ticketDuration')}
          />
        </>
      )}
    </div>
  );
};

export default SidebarSummary;

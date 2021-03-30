import React from 'react';
import Radios from '../../../../shared/Radios/Radios';
import Button from '../../../../shared/Button/Button';
import QuestionCard from '../../../../shared/QuestionCard/QuestionCard';
import questions from '../../questions';
import useHandleChange from '../../customHooks/useHandleChange';

const BusCompanyStep1 = () => {
  const name = 'busNetwork';
  const { formDispatch, handleChange, value, genericError, error, setError } = useHandleChange(
    name,
  );
  const { question, hint, options } = questions[name];

  const handleContinue = () => {
    if (value) {
      // turn off edit mode

      formDispatch({ type: 'EDIT_MODE', payload: value === 'yes' ? null : 'busCompanyStep2' });
      formDispatch({ type: 'UPDATE_TICKET_TYPE', payload: value === 'yes' ? 'nBus' : 'single' });
    } else {
      setError({ message: 'Please select an answer' });
    }
  };

  return (
    <>
      {genericError}
      <QuestionCard handleContinue={handleContinue}>
        <Radios
          name={name}
          question={question}
          hint={hint}
          radios={options}
          error={error}
          onChange={handleChange}
        />
        <div className="wmnds-p-b-lg">
          <Button btnClass="wmnds-btn--link" text="I don't know which bus I need" />
        </div>
      </QuestionCard>
    </>
  );
};

export default BusCompanyStep1;

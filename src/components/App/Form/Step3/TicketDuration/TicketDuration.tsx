import React from 'react';
import QuestionCard, { ChangeAnswers } from '../../../../shared/QuestionCard/QuestionCard';
import Button from '../../../../shared/Button/Button';
import questions from '../../questions';
import useHandleChange from '../../customHooks/useHandleChange';

const TicketDuration = () => {
  const name = 'ticketDuration';
  const { formDispatch } = useHandleChange(name);
  const { question, hint, options } = questions[name];
  const handleContinue = (value: string) => {
    formDispatch({ type: 'EDIT_MODE', payload: null });
    formDispatch({ type: 'UPDATE_TICKET_INFO', payload: { name, value } });
  };

  return (
    <>
      <QuestionCard showChangeBtn={false}>
        <h2 className="wmnds-fe-question">{question}</h2>
        <p className="wmnds-m-none">{hint}</p>
      </QuestionCard>
      <div className="wmnds-grid wmnds-grid--spacing-md-2-lg">
        {options.map((option: { [key: string]: string }) => (
          <div key={`${name}-${option.value}`} className="wmnds-col-1 wmnds-col-md-1-2">
            <QuestionCard showChangeBtn={false}>
              <h4>
                {option.text} <span>£{option.totalPrice}</span>
              </h4>
              <p>£{option.dailyPrice} per day</p>
              <Button
                btnClass="wmnds-btn--block"
                text="Select"
                onClick={() => handleContinue(option.value)}
              />
            </QuestionCard>
          </div>
        ))}
        <div className="wmnds-col-1 wmnds-hide-desktop">
          <ChangeAnswers />
        </div>
      </div>
    </>
  );
};

export default TicketDuration;

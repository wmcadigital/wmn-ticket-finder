import React from 'react';
import s from './QuestionCard.module.scss';
import Button from '../Button/Button';

interface QuestionCardProps {
  children: JSX.Element | JSX.Element[];
  handleContinue?: () => void;
}

const QuestionCard = ({ children, handleContinue }: QuestionCardProps) => {
  return (
    <div className={`${s.card} bg-white wmnds-m-b-lg`}>
      {children}
      {handleContinue && (
        <Button btnClass="wmnds-col-1 wmnds-col-md-auto" text="Continue" onClick={handleContinue} />
      )}
    </div>
  );
};

QuestionCard.defaultProps = {
  handleContinue: null,
};

export default QuestionCard;

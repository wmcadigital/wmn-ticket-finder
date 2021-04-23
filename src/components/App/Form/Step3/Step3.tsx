import { useFormContext } from 'globalState';
import TicketClass from './TicketClass/TicketClass';
import TicketDuration from './TicketDuration/TicketDuration';

const Step3 = () => {
  const [formState] = useFormContext();
  const { ticketInfo, editMode } = formState;
  let sectionToRender;

  if (ticketInfo.railZones) {
    // Logic to determine which to section to show
    if (
      (ticketInfo.ticketType === 'nTicket' &&
        !ticketInfo.firstClass &&
        Math.min(...ticketInfo.railZones!) === 1 &&
        Math.max(...ticketInfo.railZones!) > 4) ||
      editMode === 'firstClass'
    ) {
      sectionToRender = <TicketClass />;
    }
  }
  return sectionToRender || <TicketDuration />;
};

export default Step3;

import {format, isToday} from "date-fns";

function useFormatDateTime() {
  const formatDateTime = (timestamp: string) => {
    if(!timestamp) {
      return "";
    }
    const date = new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    
    let result: string;
    if(isToday(date)) {
      result = format(date, "h:mm a");
    }
    else {
      result = format(date, "M/d/yyyy, h:mm");
    }
    return result;
  }
  return { formatDateTime }
}

export default useFormatDateTime;


function useMessageListFormatting() {
  const MAX_SUBJECT_LENGTH = 128;
  const formatMessageFrom = (fromStr: string) => {
    if(!fromStr) return '';
    const bits = fromStr.split('<');
    if(bits.length > 1){
      return bits[0];
    }
    return fromStr;
  }

  const formatMessageSubject = (fromStr: string) => {
    if(fromStr?.length > MAX_SUBJECT_LENGTH){
      return `${fromStr.substring(0, MAX_SUBJECT_LENGTH)}...`;
    }
    return fromStr;
  }

  return { formatMessageFrom , formatMessageSubject };
}

export default useMessageListFormatting;

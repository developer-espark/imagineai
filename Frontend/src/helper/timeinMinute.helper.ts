import moment from "moment";

export const getAgeInMinutes = (isoString: string) => {
  const givenTime = new Date(isoString);
  const now = new Date();
  return Math.floor((now.getTime() - givenTime.getTime()) / 60000);
};

export const getMinutesDifference = (timestamp: any) => {
  const date = moment(Number(timestamp)).format("YYYY-MM-DD HH:mm:ss");
  const unixTimestamp = moment(date, "YYYY-MM-DD HH:mm:ss").unix();
  const diffMinutes = moment().diff(moment.unix(unixTimestamp), "minutes");
  
  return diffMinutes;
};

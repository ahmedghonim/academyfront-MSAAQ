export const decimalToTime = (decimal: number) => {
  const hours = Math.floor(decimal / 3600);
  const minutes = Math.floor((decimal % 3600) / 60);
  const seconds = Math.floor(decimal % 60);
  const formatted =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${minutes}:${String(seconds).padStart(2, "0")}`;

  return {
    hours,
    minutes,
    seconds,
    formatted
  };
};

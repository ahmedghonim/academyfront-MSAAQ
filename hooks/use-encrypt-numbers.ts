"use client";

const useEncryptNumbers = (number: string) => {
  const numberStr = String(number);

  const result = numberStr.substring(0, 2) + "****" + numberStr.substring(numberStr.length - 4);

  return { result };
};

export default useEncryptNumbers;

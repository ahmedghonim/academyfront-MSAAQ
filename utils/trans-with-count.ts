const transWithCount = (key: string, count: number) => {
  /*
   * count = 0 => ${key}_WithCount_zero
   * count = 1 => ${key}_WithCount_one
   * count = 2 => ${key}_WithCount_two
   * count = 3/10 => ${key}_WithCount_few
   * count = 11/99 => ${key}_WithCount_many
   * count = 100+ => ${key}_WithCount_other
   * */
  const error = new Error(`Missing count value for key: ${key}`);

  if (count === undefined) {
    throw error;
  }

  const mapCountToPlural = (count: number): string => {
    if (count === 0) return "zero";
    if (count === 1) return "one";
    if (count === 2) return "two";
    if (count % 100 >= 3 && count % 100 <= 10) return "few";
    if (count % 100 >= 11 && count % 100 <= 99) return "many";

    return "other";
  };

  const plural = mapCountToPlural(count);

  return `${key}_${plural}`;
};

export default transWithCount;

const toLocale = (value: number): string => {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
};

export default toLocale;

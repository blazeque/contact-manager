export const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export const formatCPF = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 11);

  if (numericValue.length <= 3) {
    return numericValue;
  } else if (numericValue.length <= 6) {
    return numericValue.replace(/(\d{3})(\d)/, "$1.$2");
  } else if (numericValue.length <= 9) {
    return numericValue.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
  } else {
    return numericValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
      "$1.$2.$3-$4"
    );
  }
};

export const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

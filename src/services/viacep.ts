export const fetchAddress = async (cep: string) => {
  const baseURL = process.env.REACT_APP_VIA_CEP_BASE_URL;

  try {
    const response = await fetch(`${baseURL}/${cep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error("CEP não encontrado");

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      cep: data.cep,
    };
  } catch (error) {
    console.error("Erro ao buscar o endereço:", error);
    return null;
  }
};

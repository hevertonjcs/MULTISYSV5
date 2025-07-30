// Utilitários para formatação e validação
export const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCEP = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const formatTelefone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const sanitizeFilename = (filename) => {
  return filename
    .normalize('NFD') // Separa os caracteres base dos acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos (diacríticos)
    .replace(/[^\w.-]/g, '_') // Substitui caracteres não-alfanuméricos (exceto . e -) por _
    .replace(/\s+/g, '_') // Substitui espaços por _
    .toLowerCase(); // Converte para minúsculas
};

export const formatMoeda = (value) => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(0);
  }

  let cleanedValue = String(value).replace(/[^\d,.-]/g, ''); 

  
  if (cleanedValue.includes(',')) {
    const parts = cleanedValue.split(',');
    if (parts.length > 2) { 
      cleanedValue = parts.slice(0, -1).join('') + '.' + parts.slice(-1);
    } else {
      cleanedValue = cleanedValue.replace(',', '.');
    }
  }
  
  cleanedValue = cleanedValue.replace(/\.(?![^.]*$)/g, '');

  const amount = parseFloat(cleanedValue);

  if (isNaN(amount)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(0);
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};


export const formatDataHora = (dateInput) => {
  if (!dateInput) return 'N/A';
  let date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return 'Data inválida';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const formatData = (dateString, format = 'DD/MM/YYYY') => {
  if (!dateString) return '';
  const date = new Date(dateString);
   if (isNaN(date.getTime())) return 'Data inválida';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  return `${day}/${month}/${year}`;
};

export const validarCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;
  
  return true;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const gerarCodigo = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${timestamp}${random}`;
};

export const buscarCEP = async (cep) => {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return null;
    
    const response = await fetch(`https://viacrm.com.br/ws/${cleanCEP}/json/`); // API ALTERNATIVA, ViaCEP estava instável
    const data = await response.json();
    
    if (data.erro || !data.logradouro) { // ViaCRM pode retornar {} em vez de erro
       const fallbackResponse = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCEP}`);
       const fallbackData = await fallbackResponse.json();
       if (fallbackData.errors) return null;
       return {
        endereco: fallbackData.street || '',
        bairro: fallbackData.neighborhood || '',
        cidade: fallbackData.city || '',
        estado: fallbackData.state || ''
      };
    }
    
    return {
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      const fallbackResponse = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCEP}`);
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.errors) return null;
      return {
       endereco: fallbackData.street || '',
       bairro: fallbackData.neighborhood || '',
       cidade: fallbackData.city || '',
       estado: fallbackData.state || ''
     };
    } catch (fallbackError) {
      console.error('Erro ao buscar CEP (fallback BrasilAPI):', fallbackError);
      return null;
    }
  }
};

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
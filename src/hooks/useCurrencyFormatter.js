import React, { useEffect } from 'react';

const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return ''; // Ou pode retornar um valor padrão como R$ 0,00
  }
  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const useCurrencyFormatter = (fieldName, formData, setFormData) => {
  useEffect(() => {
    const rawValue = formData[fieldName];
    const formattedFieldName = `${fieldName}Fmt`;

    if (rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== '') {
      const currentFormattedValue = formData[formattedFieldName];
      const newFormattedValue = formatCurrency(rawValue);
      
      if (newFormattedValue !== currentFormattedValue) {
        setFormData(prev => ({
          ...prev,
          [formattedFieldName]: newFormattedValue,
        }));
      }
    } else {
      // Se o valor bruto estiver vazio ou nulo, limpa o formatado ou define um padrão
      if (formData[formattedFieldName] !== '') { // Evita loop se já estiver limpo
        setFormData(prev => ({
          ...prev,
          [formattedFieldName]: '', // Ou R$ 0,00 se preferir
        }));
      }
    }
  }, [formData[fieldName], fieldName, setFormData, formData]);
};
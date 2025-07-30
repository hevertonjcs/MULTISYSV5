import React, { useState, useCallback } from 'react';
import { validarCPF, validarEmail } from '@/utils';

export const useFormNavigation = (formData, setError, clearAllErrors, validateFieldFormat) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const validateStep = useCallback((step) => {
    clearAllErrors(); 
    
    let isValid = true;
    const localErrors = {}; 

    const addLocalError = (field, message) => {
      if (!localErrors[field]) {
        localErrors[field] = message;
        isValid = false;
      }
    };
    
    const checkRequired = (field, message) => {
      const fieldValue = formData[field];
      if (fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '') {
        addLocalError(field, message || `${field.replace(/_/g, ' ')} é obrigatório(a)`);
      }
    };
    
    switch (step) {
      case 1: 
        checkRequired('modalidade');
        checkRequired('nome_completo');
        checkRequired('cpf', 'CPF é obrigatório');
        if (String(formData.cpf || '').replace(/\D/g, '').length > 0 && !validarCPF(formData.cpf)) {
            addLocalError('cpf', 'CPF inválido');
        }
        checkRequired('data_nascimento');
        if (formData.data_nascimento) {
          const today = new Date(); today.setHours(0, 0, 0, 0); 
          const birthDate = new Date(formData.data_nascimento + "T00:00:00"); 
          if (birthDate > today) addLocalError('data_nascimento', 'Data de nascimento não pode ser no futuro.');
        }
        checkRequired('nome_mae');
        break;
        
      case 2: 
        checkRequired('telefone');
        checkRequired('email', 'E-mail é obrigatório');
        if (String(formData.email || '').trim() !== '' && !validarEmail(formData.email)) {
            addLocalError('email', 'E-mail inválido');
        }
        break;
        
      case 3: 
        checkRequired('cep', 'CEP é obrigatório');
        checkRequired('endereco');
        checkRequired('numero_residencia');
        checkRequired('bairro');
        checkRequired('cidade');
        checkRequired('estado_uf');
        break;
        
      case 4: 
        if (formData.renda_mensal === undefined || formData.renda_mensal === null || String(formData.renda_mensal).trim() === '' || parseFloat(formData.renda_mensal) <= 0) {
            addLocalError('renda_mensal', 'Renda mensal é obrigatória e deve ser maior que zero.');
        }
        checkRequired('tipo_renda');
        if (formData.valor_credito === undefined || formData.valor_credito === null || String(formData.valor_credito).trim() === '' || parseFloat(formData.valor_credito) <= 0) {
            addLocalError('valor_credito', 'Valor do crédito é obrigatório e deve ser maior que zero.');
        }
        
        if (formData.valor_entrada === undefined || formData.valor_entrada === null || String(formData.valor_entrada).trim() === '') {
             addLocalError('valor_entrada', 'Valor de entrada é obrigatório.');
        } else if (parseFloat(formData.valor_entrada) < 0) {
            addLocalError('valor_entrada', 'Valor de entrada não pode ser negativo.');
        }

        if (formData.parcelas === undefined || formData.parcelas === null || String(formData.parcelas).trim() === '' || parseInt(formData.parcelas, 10) <= 0) {
            addLocalError('parcelas', 'Quantidade de meses inválida.');
        }

        if (formData.valor_parcela === undefined || formData.valor_parcela === null || String(formData.valor_parcela).trim() === '' || parseFloat(formData.valor_parcela) <= 0) {
            addLocalError('valor_parcela', 'Valor da parcela é obrigatório e deve ser maior que zero.');
        }
        checkRequired('segmento');
        break;
        
      case 5: 
        checkRequired('vendedor');
        checkRequired('equipe');
        break;
      
      case 6: 
        break;
        
      default:
        break;
    }
    
    if (Object.keys(localErrors).length > 0) {
      for (const field in localErrors) {
        setError(field, localErrors[field]);
      }
    }
    
    return isValid;
  }, [formData, setError, clearAllErrors]); 
  
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) { 
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      return true;
    }
    return false;
  }, [currentStep, totalSteps, validateStep]); 
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);
  
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    validateStep 
  };
};
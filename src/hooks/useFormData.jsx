import React, { useState, useCallback, useEffect } from 'react';
import { initialFormData as baseInitialFormData } from '@/constants';
import { formatCPF, formatCEP, formatTelefone, buscarCEP, formatData, validarCPF, validarEmail } from '@/utils';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

const getInitialFormData = () => {
  const initial = { ...baseInitialFormData };
  initial.renda_mensalFmt = '';
  initial.valor_creditoFmt = '';
  initial.valor_entradaFmt = '';
  initial.valor_parcelaFmt = '';
  return initial;
};

export const useFormData = (initialDataForEdit = null) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useCurrencyFormatter('renda_mensal', formData, setFormData);
  useCurrencyFormatter('valor_credito', formData, setFormData);
  useCurrencyFormatter('valor_entrada', formData, setFormData);
  useCurrencyFormatter('valor_parcela', formData, setFormData);

  const setError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);
  
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  useEffect(() => {
    const newInitialState = getInitialFormData();
    if (initialDataForEdit) {
      const populatedData = { ...newInitialState };
      for (const key in initialDataForEdit) {
        if (initialDataForEdit.hasOwnProperty(key) && populatedData.hasOwnProperty(key)) {
          if (['renda_mensal', 'valor_credito', 'valor_entrada', 'valor_parcela'].includes(key)) {
            const numericValue = parseFloat(initialDataForEdit[key]);
            populatedData[key] = isNaN(numericValue) ? '' : numericValue;
          } else if (key === 'data_nascimento') {
            populatedData[key] = initialDataForEdit[key] ? formatData(initialDataForEdit[key], 'YYYY-MM-DD') : '';
          } else if (key === 'documentos') {
            let docs = initialDataForEdit[key];
            if (typeof docs === 'string') {
              try {
                docs = JSON.parse(docs);
              } catch (e) {
                console.error("Erro ao fazer parse dos documentos JSON:", e);
                docs = [];
              }
            }
            populatedData[key] = Array.isArray(docs) ? docs : [];
          } else {
            populatedData[key] = initialDataForEdit[key] !== null && initialDataForEdit[key] !== undefined ? initialDataForEdit[key] : '';
          }
        }
      }
      if (initialDataForEdit.vendedor) populatedData.vendedor = initialDataForEdit.vendedor;
      if (initialDataForEdit.equipe) populatedData.equipe = initialDataForEdit.equipe;
      setFormData(populatedData);
    } else {
      setFormData(prev => ({
        ...newInitialState,
        vendedor: prev.vendedor || '',
        equipe: prev.equipe || ''
      }));
    }
    setTouchedFields({}); 
    clearAllErrors();
  }, [initialDataForEdit, clearAllErrors]);

  const validateFieldFormat = useCallback((field, value) => {
    let isValid = true;
    let message = '';
    switch (field) {
      case 'cpf':
        if (String(value).replace(/\D/g, '').length === 11 && !validarCPF(String(value))) {
          message = 'CPF inválido';
          isValid = false;
        }
        break;
      case 'email':
        if (String(value).trim() !== '' && !validarEmail(String(value))) {
          message = 'E-mail inválido';
          isValid = false;
        }
        break;
      default:
        break;
    }
    if (!isValid) {
      setError(field, message);
    } else {
      if(errors[field] === message || (field === 'cpf' && errors[field] === 'CPF inválido') || (field === 'email' && errors[field] === 'E-mail inválido')){
        clearError(field);
      }
    }
    return isValid;
  }, [setError, clearError, errors]);


  const handleInputChange = useCallback((field, value) => {
    let processedValue = value;
    switch (field) {
      case 'cpf':
        processedValue = formatCPF(String(value));
        setFormData(prev => ({ ...prev, [field]: processedValue }));
        if (String(processedValue).replace(/\D/g, '').length === 11) {
          validateFieldFormat(field, processedValue);
        } else {
           if(errors[field] === 'CPF inválido') clearError(field);
        }
        break;
      case 'cep':
        processedValue = formatCEP(String(value));
        setFormData(prev => ({ ...prev, [field]: processedValue }));
        break;
      case 'telefone':
        processedValue = formatTelefone(String(value));
        setFormData(prev => ({ ...prev, [field]: processedValue }));
        break;
      case 'renda_mensal':
      case 'valor_credito':
      case 'valor_entrada':
      case 'valor_parcela':
        const onlyDigits = String(value).replace(/\D/g, '');
        const numericValue = onlyDigits ? parseInt(onlyDigits, 10) / 100 : '';
        setFormData(prev => ({ ...prev, [field]: numericValue, }));
        break;
      case 'parcelas':
        const parcelasDigits = String(value).replace(/\D/g, '');
        processedValue = parcelasDigits ? parseInt(parcelasDigits, 10) : '';
        setFormData(prev => ({ ...prev, [field]: processedValue }));
        break;
      case 'email':
        setFormData(prev => ({ ...prev, [field]: String(value) }));
        if(errors[field] === 'E-mail inválido') clearError(field);
        break;
      default:
        setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field] && errors[field].includes('obrigatór')) {
      clearError(field);
    }
  }, [errors, clearError, validateFieldFormat]);


  const handleInputBlur = useCallback(async (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    validateFieldFormat(field, formData[field]);

    if (field === 'cep' && formData.cep) {
      const cepSemFormato = String(formData.cep).replace(/\D/g, '');
      if (cepSemFormato.length === 8) {
        try {
          const endereco = await buscarCEP(cepSemFormato);
          if (endereco && !endereco.erro) {
            setFormData(prev => ({
              ...prev,
              endereco: endereco.endereco || prev.endereco,
              bairro: endereco.bairro || prev.bairro,
              cidade: endereco.cidade || prev.cidade,
              estado_uf: endereco.estado || prev.estado_uf,
            }));
            clearError('cep'); clearError('endereco'); clearError('bairro'); clearError('cidade'); clearError('estado_uf');
          } else {
            setError('cep', 'CEP não encontrado ou inválido.');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          setError('cep', 'Erro ao buscar CEP. Tente novamente.');
        }
      } else if (cepSemFormato.length > 0) {
        setError('cep', 'CEP incompleto.');
      }
    }
  }, [formData, setTouchedFields, validateFieldFormat, setError, clearError]);

  const uploadFile = useCallback((acceptedFiles) => {
    const newFiles = Array.from(acceptedFiles).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({ ...prev, documentos: [...(prev.documentos || []), ...newFiles] }));
  }, []);

  const removeFile = useCallback((fileIdToRemove) => {
    setFormData(prev => {
      const updatedDocs = prev.documentos.filter(doc => {
        if (doc.id === fileIdToRemove) {
          if (doc.preview) URL.revokeObjectURL(doc.preview);
          return false;
        }
        return true;
      });
      return { ...prev, documentos: updatedDocs };
    });
  }, []);

  const resetForm = useCallback((userInfo) => {
    const newInitialState = getInitialFormData();
    setFormData({
      ...newInitialState,
      vendedor: userInfo?.vendedor || '',
      equipe: userInfo?.equipe || ''
    });
    clearAllErrors();
    setTouchedFields({});
  }, [clearAllErrors]);

  return {
    formData,
    setFormData,
    errors,
    touchedFields,
    handleInputChange,
    handleInputBlur,
    uploadFile,
    removeFile,
    resetForm,
    setError,
    clearError,
    clearAllErrors,
    validateFieldFormat
  };
};
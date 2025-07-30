import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Send, Edit, LayoutDashboard, LogOut } from 'lucide-react';
import { useFormData } from '@/hooks/useFormData';
import { useFormNavigation } from '@/hooks/useFormNavigation';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import FormStep1 from '@/components/form-steps/FormStep1';
import FormStep2 from '@/components/form-steps/FormStep2';
import FormStep3 from '@/components/form-steps/FormStep3';
import FormStep4 from '@/components/form-steps/FormStep4';
import FormStep5 from '@/components/form-steps/FormStep5';
import FormStep6 from '@/components/form-steps/FormStep6';

const FormPageHeader = ({ onBackToDashboard, onLogout }) => (
  <header className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
    <div className="flex items-center gap-4">
      {onBackToDashboard && (
        <Button variant="outline" size="sm" onClick={onBackToDashboard}>
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Painel
        </Button>
      )}
    </div>
    <div className="flex items-center gap-2">
      <Button onClick={onLogout} variant="destructive" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  </header>
);

const FormPage = ({ userInfo, onLogout, logoConfig, initialDataForEdit, onSubmissionSuccess, onBackToDashboard }) => {
  const {
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
    clearAllErrors,
    validateFieldFormat
  } = useFormData(initialDataForEdit);

  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    validateStep 
  } = useFormNavigation(formData, setError, clearAllErrors, validateFieldFormat);

  const { submitForm, isSubmitting } = useFormSubmission();
  const [isEditMode, setIsEditMode] = useState(false);
  const [attemptedStepSubmission, setAttemptedStepSubmission] = useState({});

  useEffect(() => {
    if (initialDataForEdit) {
      setIsEditMode(true);
      goToStep(1); 
    } else {
      setIsEditMode(false);
      if (userInfo) {
         setFormData(prev => ({...prev, vendedor: userInfo.vendedor, equipe: userInfo.equipe}));
      }
    }
    setAttemptedStepSubmission({});
  }, [initialDataForEdit, goToStep, userInfo, setFormData]);

  const handleSubmit = useCallback(async () => {
    setAttemptedStepSubmission(prev => ({ ...prev, [currentStep]: true }));
    if (validateStep(currentStep)) { 
      const result = await submitForm(formData, logoConfig, isEditMode);
      if (result.success) {
        resetForm(userInfo); 
        goToStep(1); 
        setIsEditMode(false); 
        setAttemptedStepSubmission({});
        if (onSubmissionSuccess) onSubmissionSuccess();
      }
    }
  }, [validateStep, currentStep, submitForm, formData, logoConfig, resetForm, goToStep, isEditMode, onSubmissionSuccess, userInfo]);

  const handleNextStep = useCallback(() => {
    setAttemptedStepSubmission(prev => ({ ...prev, [currentStep]: true }));
    nextStep();
  }, [nextStep, currentStep]);

  const renderStep = useMemo(() => {
    const stepProps = {
      formData,
      errors,
      touchedFields,
      stepSubmitted: attemptedStepSubmission[currentStep] || false,
      handleInputChange,
      handleInputBlur,
      uploadFile,
      removeFile
    };

    switch (currentStep) {
      case 1: return <FormStep1 {...stepProps} />;
      case 2: return <FormStep2 {...stepProps} />;
      case 3: return <FormStep3 {...stepProps} />;
      case 4: return <FormStep4 {...stepProps} />;
      case 5: return <FormStep5 {...stepProps} />;
      case 6: return <FormStep6 {...stepProps} />;
      default: return <FormStep1 {...stepProps} />;
    }
  }, [currentStep, formData, errors, touchedFields, attemptedStepSubmission, handleInputChange, handleInputBlur, uploadFile, removeFile]);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-20">
        <FormPageHeader onBackToDashboard={onBackToDashboard} onLogout={onLogout} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {isEditMode ? "Editar Cadastro" : "Formulário de Cadastro"}
            </h1>
            {isEditMode && formData.codigo_cadastro && (
              <p className="text-sm text-accent mt-1">Editando: {formData.codigo_cadastro}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="bg-card rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-card-foreground font-medium">
                Etapa {currentStep} de {totalSteps}
              </span>
              <span className="text-muted-foreground text-sm">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-primary" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {renderStep}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 shadow-md"
        >
          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="border-border text-foreground hover:bg-muted disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting} 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {isEditMode ? "Salvando..." : "Enviando..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? <Edit className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    {isEditMode ? "Salvar Alterações" : "Finalizar"}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextStep} 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FormPage;
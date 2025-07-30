import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User } from 'lucide-react';

const FormStep5 = ({ formData, errors, handleInputChange, handleInputBlur, touchedFields, stepSubmitted }) => {
  const showError = (field) => (touchedFields[field] || stepSubmitted) && errors[field];
  
  return (
    <Card className="form-step">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary rounded-lg">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          Informações do Atendimento
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Dados sobre o vendedor e equipe responsável
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="vendedor" className="text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Vendedor Responsável *
            </Label>
            <Input
              id="vendedor"
              placeholder="Nome do vendedor"
              value={formData.vendedor || ''}
              onChange={(e) => handleInputChange('vendedor', e.target.value)}
              onBlur={() => handleInputBlur('vendedor')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              disabled
            />
            {showError('vendedor') && (
              <p className="text-destructive text-sm">{errors.vendedor}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="equipe" className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Equipe *
            </Label>
            <Input
              id="equipe"
              placeholder="Nome da equipe"
              value={formData.equipe || ''}
              onChange={(e) => handleInputChange('equipe', e.target.value)}
              onBlur={() => handleInputBlur('equipe')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              disabled
            />
            {showError('equipe') && (
              <p className="text-destructive text-sm">{errors.equipe}</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg p-4 border border-border shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">👥 Atendimento personalizado</h4>
          <p className="text-muted-foreground text-sm">
            Essas informações foram preenchidas automaticamente com base no seu login. 
            O vendedor e equipe responsáveis acompanharão todo o processo do seu cadastro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg p-4 border border-border shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">📋 Próximos passos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Dados pessoais ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Informações de contato ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Endereço ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Dados financeiros ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-foreground">Upload de documentos (próximo)</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FormStep5;
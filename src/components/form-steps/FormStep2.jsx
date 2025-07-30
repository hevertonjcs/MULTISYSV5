import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, User } from 'lucide-react';

const FormStep2 = ({ formData, errors, handleInputChange, handleInputBlur, touchedFields, stepSubmitted }) => {
  const showError = (field) => (touchedFields[field] || stepSubmitted) && errors[field];

  return (
    <Card className="form-step">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary rounded-lg">
            <Phone className="w-6 h-6 text-primary-foreground" />
          </div>
          Informações de Contato
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Como podemos entrar em contato com você?
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
            <Label htmlFor="telefone" className="text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Telefone *
            </Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone || ''}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              onBlur={() => handleInputBlur('telefone')}
              maxLength={15}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('telefone') && (
              <p className="text-destructive text-sm">{errors.telefone}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleInputBlur('email')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('email') && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </motion.div>
        </div>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label htmlFor="contato_adicional" className="text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Contato Adicional
            </Label>
            <Input
              id="contato_adicional"
              placeholder="Nome e telefone (opcional)"
              value={formData.contato_adicional || ''}
              onChange={(e) => handleInputChange('contato_adicional', e.target.value)}
              onBlur={() => handleInputBlur('contato_adicional')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('contato_adicional') && (
              <p className="text-destructive text-sm">{errors.contato_adicional}</p>
            )}
          </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg p-4 border border-border shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">📱 Dica importante</h4>
          <p className="text-muted-foreground text-sm">
            Mantenha seus dados de contato atualizados. Utilizaremos essas informações 
            para comunicações importantes sobre seu cadastro.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FormStep2;
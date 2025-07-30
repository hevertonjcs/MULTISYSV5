import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Layers, CalendarDays, FileSignature, Banknote } from 'lucide-react';
import { TIPO_RENDA_OPCOES, SEGMENTO_OPCOES } from '@/constants';

const FormStep4 = ({ formData, errors, handleInputChange, handleInputBlur, touchedFields, stepSubmitted }) => {
  const showError = (field) => (touchedFields[field] || stepSubmitted) && errors[field];

  return (
    <div className="space-y-8">
      <Card className="form-step">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            Informações de Renda
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Detalhes sobre sua ocupação e renda mensal.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="renda_mensal" className="text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Renda Mensal *
              </Label>
              <Input
                id="renda_mensal"
                placeholder="R$ 0,00"
                value={formData.renda_mensalFmt || ''} 
                onChange={(e) => handleInputChange('renda_mensal', e.target.value)} 
                onBlur={() => handleInputBlur('renda_mensal')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              {showError('renda_mensal') && (
                <p className="text-destructive text-sm">{errors.renda_mensal}</p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label className="text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Tipo de Renda *
              </Label>
              <Select
                value={formData.tipo_renda || ''}
                onValueChange={(value) => handleInputChange('tipo_renda', value)}
                onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('tipo_renda'); }}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecione o tipo de renda..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_RENDA_OPCOES.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showError('tipo_renda') && (
                <p className="text-destructive text-sm">{errors.tipo_renda}</p>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card className="form-step">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary rounded-lg">
              <FileSignature className="w-6 h-6 text-primary-foreground" />
            </div>
            Proposta de Crédito
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Informe os detalhes da sua proposta de crédito.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="valor_credito" className="text-foreground flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Valor do Crédito *
              </Label>
              <Input
                id="valor_credito"
                placeholder="R$ 0,00"
                value={formData.valor_creditoFmt || ''}
                onChange={(e) => handleInputChange('valor_credito', e.target.value)}
                onBlur={() => handleInputBlur('valor_credito')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              {showError('valor_credito') && (
                <p className="text-destructive text-sm">{errors.valor_credito}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="valor_entrada" className="text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Valor de Entrada *
              </Label>
              <Input
                id="valor_entrada"
                placeholder="R$ 0,00"
                value={formData.valor_entradaFmt || ''}
                onChange={(e) => handleInputChange('valor_entrada', e.target.value)}
                onBlur={() => handleInputBlur('valor_entrada')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              {showError('valor_entrada') && (
                <p className="text-destructive text-sm">{errors.valor_entrada}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="parcelas" className="text-foreground flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Quantidade de Meses *
              </Label>
              <Input
                id="parcelas"
                type="number" 
                placeholder="Ex: 12"
                value={formData.parcelas || ''}
                onChange={(e) => handleInputChange('parcelas', e.target.value)}
                onBlur={() => handleInputBlur('parcelas')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              {showError('parcelas') && (
                <p className="text-destructive text-sm">{errors.parcelas}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="valor_parcela" className="text-foreground flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Valor da Parcela *
              </Label>
              <Input
                id="valor_parcela"
                placeholder="R$ 0,00"
                value={formData.valor_parcelaFmt || ''}
                onChange={(e) => handleInputChange('valor_parcela', e.target.value)}
                onBlur={() => handleInputBlur('valor_parcela')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              {showError('valor_parcela') && (
                <p className="text-destructive text-sm">{errors.valor_parcela}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="md:col-span-2 space-y-2"
            >
              <Label className="text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Segmento *
              </Label>
              <Select
                value={formData.segmento || ''}
                onValueChange={(value) => handleInputChange('segmento', value)}
                onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('segmento'); }}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecione o segmento..." />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTO_OPCOES.map((segmento) => (
                    <SelectItem key={segmento} value={segmento}>
                      {segmento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showError('segmento') && (
                <p className="text-destructive text-sm">{errors.segmento}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="md:col-span-2 space-y-2"
            >
              <Label htmlFor="observacao_final" className="text-foreground flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-primary" />
                Observação Final
              </Label>
              <Textarea
                id="observacao_final"
                placeholder="Detalhes adicionais sobre a proposta..."
                value={formData.observacao_final || ''}
                onChange={(e) => handleInputChange('observacao_final', e.target.value)}
                onBlur={() => handleInputBlur('observacao_final')}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
              />
               {showError('observacao_final') && (
                <p className="text-destructive text-sm">{errors.observacao_final}</p>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormStep4;
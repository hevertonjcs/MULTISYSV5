import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Home, Hash, Building, Navigation, Edit3 } from 'lucide-react';
import { ESTADOS_BRASIL_OBJ } from '@/constants';
import { Textarea } from '@/components/ui/textarea';


const FormStep3 = ({ formData, errors, handleInputChange, handleInputBlur, touchedFields, stepSubmitted }) => {
  const showError = (field) => (touchedFields[field] || stepSubmitted) && errors[field];

  return (
    <Card className="form-step">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary rounded-lg">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          Endereço Residencial
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Informe seu endereço completo
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
            <Label htmlFor="cep" className="text-foreground flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              CEP *
            </Label>
            <Input
              id="cep"
              placeholder="00000-000"
              value={formData.cep || ''}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              onBlur={() => handleInputBlur('cep')}
              maxLength={9}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('cep') && (
              <p className="text-destructive text-sm">{errors.cep}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="endereco" className="text-foreground flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              Endereço *
            </Label>
            <Input
              id="endereco"
              placeholder="Rua, Avenida..."
              value={formData.endereco || ''}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              onBlur={() => handleInputBlur('endereco')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('endereco') && (
              <p className="text-destructive text-sm">{errors.endereco}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="numero_residencia" className="text-foreground flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              Número *
            </Label>
            <Input
              id="numero_residencia"
              placeholder="123"
              value={formData.numero_residencia || ''}
              onChange={(e) => handleInputChange('numero_residencia', e.target.value)}
              onBlur={() => handleInputBlur('numero_residencia')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('numero_residencia') && (
              <p className="text-destructive text-sm">{errors.numero_residencia}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="complemento" className="text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              Complemento
            </Label>
            <Input
              id="complemento"
              placeholder="Apto, Bloco..."
              value={formData.complemento || ''}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              onBlur={() => handleInputBlur('complemento')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="bairro" className="text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Bairro *
            </Label>
            <Input
              id="bairro"
              placeholder="Nome do bairro"
              value={formData.bairro || ''}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              onBlur={() => handleInputBlur('bairro')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
             {showError('bairro') && (
              <p className="text-destructive text-sm">{errors.bairro}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Label htmlFor="cidade" className="text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              Cidade *
            </Label>
            <Input
              id="cidade"
              placeholder="Nome da cidade"
              value={formData.cidade || ''}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              onBlur={() => handleInputBlur('cidade')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('cidade') && (
              <p className="text-destructive text-sm">{errors.cidade}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2 md:col-span-2"
          >
            <Label className="text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Estado *
            </Label>
            <Select
              value={formData.estado_uf || ''}
              onValueChange={(value) => handleInputChange('estado_uf', value)}
              onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('estado_uf'); }}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Selecione o estado..." />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_BRASIL_OBJ.map((estado) => (
                  <SelectItem key={estado.sigla} value={estado.sigla}>
                    {estado.nome} ({estado.sigla})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError('estado_uf') && (
              <p className="text-destructive text-sm">{errors.estado_uf}</p>
            )}
          </motion.div>
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="md:col-span-2 space-y-2"
          >
            <Label htmlFor="observacao_residencial" className="text-foreground flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary" />
              Observação Residencial
            </Label>
            <Textarea
              id="observacao_residencial"
              placeholder="Ponto de referência, etc. (opcional)"
              value={formData.observacao_residencial || ''}
              onChange={(e) => handleInputChange('observacao_residencial', e.target.value)}
              onBlur={() => handleInputBlur('observacao_residencial')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
            />
            {showError('observacao_residencial') && (
              <p className="text-destructive text-sm">{errors.observacao_residencial}</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-lg p-4 border border-border shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">🔍 Busca automática</h4>
          <p className="text-muted-foreground text-sm">
            Digite o CEP e os campos de endereço serão preenchidos automaticamente, incluindo o estado.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FormStep3;
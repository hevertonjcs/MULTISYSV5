import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Heart, Briefcase, CreditCard, FileText, Car, Users, ShieldCheck } from 'lucide-react';
import { ESTADOS_CIVIS, SEXO_OPCOES, MODALIDADE_OPCOES } from '@/constants';

const FormStep1 = ({ formData, errors, handleInputChange, handleInputBlur, touchedFields, stepSubmitted }) => {
  const showError = (field) => (touchedFields[field] || stepSubmitted) && errors[field];

  return (
    <Card className="form-step">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary rounded-lg">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          Dados Pessoais
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Preencha suas informações pessoais básicas
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <Label className="text-foreground flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              Modalidade *
            </Label>
            <Select
              value={formData.modalidade || ''}
              onValueChange={(value) => handleInputChange('modalidade', value)}
              onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('modalidade'); }}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Selecione a modalidade..." />
              </SelectTrigger>
              <SelectContent>
                {MODALIDADE_OPCOES.map((modalidade) => (
                  <SelectItem key={modalidade} value={modalidade}>
                    {modalidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError('modalidade') && (
              <p className="text-destructive text-sm">{errors.modalidade}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="nome_completo" className="text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nome Completo *
            </Label>
            <Input
              id="nome_completo"
              placeholder="Seu nome completo"
              value={formData.nome_completo || ''}
              onChange={(e) => handleInputChange('nome_completo', e.target.value)}
              onBlur={() => handleInputBlur('nome_completo')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('nome_completo') && (
              <p className="text-destructive text-sm">{errors.nome_completo}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <Label htmlFor="cpf" className="text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              CPF *
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf || ''}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              onBlur={() => handleInputBlur('cpf')}
              maxLength={14}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('cpf') && (
              <p className="text-destructive text-sm">{errors.cpf}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="rg" className="text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              RG
            </Label>
            <Input
              id="rg"
              placeholder="00.000.000-0"
              value={formData.rg || ''}
              onChange={(e) => handleInputChange('rg', e.target.value)}
              onBlur={() => handleInputBlur('rg')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
             {showError('rg') && (
              <p className="text-destructive text-sm">{errors.rg}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label htmlFor="orgao_expedidor" className="text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Órgão Expedidor
            </Label>
            <Input
              id="orgao_expedidor"
              placeholder="Ex: SSP/SP"
              value={formData.orgao_expedidor || ''}
              onChange={(e) => handleInputChange('orgao_expedidor', e.target.value)}
              onBlur={() => handleInputBlur('orgao_expedidor')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
             {showError('orgao_expedidor') && (
              <p className="text-destructive text-sm">{errors.orgao_expedidor}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="data_nascimento" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Data de Nascimento *
            </Label>
            <Input
              id="data_nascimento"
              type="date"
              value={formData.data_nascimento || ''}
              onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
              onBlur={() => handleInputBlur('data_nascimento')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              max="9999-12-31"
            />
            {showError('data_nascimento') && (
              <p className="text-destructive text-sm">{errors.data_nascimento}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <Label className="text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Estado Civil
            </Label>
            <Select
              value={formData.estado_civil || ''}
              onValueChange={(value) => handleInputChange('estado_civil', value)}
              onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('estado_civil'); }}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_CIVIS.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError('estado_civil') && (
              <p className="text-destructive text-sm">{errors.estado_civil}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Sexo
            </Label>
            <Select
              value={formData.sexo || ''}
              onValueChange={(value) => handleInputChange('sexo', value)}
              onOpenChange={(isOpen) => { if (!isOpen) handleInputBlur('sexo'); }}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {SEXO_OPCOES.map((sexo) => (
                  <SelectItem key={sexo} value={sexo}>
                    {sexo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError('sexo') && (
              <p className="text-destructive text-sm">{errors.sexo}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <Label htmlFor="nome_mae" className="text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nome da Mãe *
            </Label>
            <Input
              id="nome_mae"
              placeholder="Nome completo da mãe"
              value={formData.nome_mae || ''}
              onChange={(e) => handleInputChange('nome_mae', e.target.value)}
              onBlur={() => handleInputBlur('nome_mae')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            {showError('nome_mae') && (
              <p className="text-destructive text-sm">{errors.nome_mae}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="nome_pai" className="text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nome do Pai
            </Label>
            <Input
              id="nome_pai"
              placeholder="Nome completo do pai (opcional)"
              value={formData.nome_pai || ''}
              onChange={(e) => handleInputChange('nome_pai', e.target.value)}
              onBlur={() => handleInputBlur('nome_pai')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
             {showError('nome_pai') && (
              <p className="text-destructive text-sm">{errors.nome_pai}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-2"
          >
            <Label htmlFor="profissao" className="text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Profissão
            </Label>
            <Input
              id="profissao"
              placeholder="Sua profissão"
              value={formData.profissao || ''}
              onChange={(e) => handleInputChange('profissao', e.target.value)}
              onBlur={() => handleInputBlur('profissao')}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
             {showError('profissao') && (
              <p className="text-destructive text-sm">{errors.profissao}</p>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormStep1;
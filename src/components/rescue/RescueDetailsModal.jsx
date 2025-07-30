import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Building, Briefcase, Coins as HandCoins, UserCheck, MessageSquare, Calendar, FileText, Hash, DollarSign, Repeat, Save } from 'lucide-react';
import { formatMoeda } from '@/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/supabaseClient';

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Field = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="text-base text-card-foreground">{value || 'Não informado'}</p>
    </div>
  </div>
);

const RescueDetailsModal = ({ isOpen, onClose, cadastro, userInfo, onUpdateObservations }) => {
  const [newObservation, setNewObservation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  if (!cadastro) return null;

  const handleSaveObservation = async () => {
    if (!newObservation.trim()) {
      toast({
        title: "Observação vazia",
        description: "Por favor, escreva algo antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const currentObservations = cadastro.observacao_supervisor || [];
    const observationToAdd = {
      text: newObservation,
      timestamp: new Date().toISOString(),
      author: userInfo.vendedor,
      author_role: userInfo.tipo_acesso,
    };

    const updatedObservations = [...currentObservations, observationToAdd];

    try {
      const { error } = await supabase
        .from('cadastros')
        .update({ observacao_supervisor: updatedObservations })
        .eq('id', cadastro.id);

      if (error) throw error;
      
      toast({
        title: "Observação Salva!",
        description: "Sua anotação foi adicionada com sucesso.",
      });
      
      onUpdateObservations(cadastro.id, updatedObservations);
      setNewObservation('');
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: `Não foi possível salvar a observação: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const allObservations = (cadastro.observacao_supervisor || []).map(obs => {
    // Adiciona compatibilidade para observações antigas sem autor
    if (!obs.author) {
      return { ...obs, author: 'Supervisor', author_role: 'supervisor' };
    }
    return obs;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] bg-card border-border p-6 rounded-lg shadow-xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-3 text-xl md:text-2xl">
            <UserCheck className="w-7 h-7 text-primary" />
            Detalhes do Cliente para Resgate
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Analise as informações e adicione suas observações.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto mt-4 pr-4 -mr-4 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><FileText className="w-5 h-5" /> Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <Field icon={<User className="w-4 h-4"/>} label="Nome Completo" value={cadastro.nome_completo} />
              <Field icon={<Hash className="w-4 h-4"/>} label="CPF" value={cadastro.cpf} />
              <Field icon={<Calendar className="w-4 h-4"/>} label="Data do Cadastro" value={formatDateTime(cadastro.data_cadastro)} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><DollarSign className="w-5 h-5" /> Valores da Simulação</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <Field icon={<DollarSign className="w-4 h-4"/>} label="Valor do Crédito" value={formatMoeda(cadastro.valor_credito)} />
              <Field icon={<HandCoins className="w-4 h-4"/>} label="Valor da Entrada" value={formatMoeda(cadastro.valor_entrada)} />
              <Field icon={<Repeat className="w-4 h-4"/>} label="Parcelas" value={`${cadastro.parcelas}x`} />
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><User className="w-5 h-5" /> Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <Field icon={<Phone className="w-4 h-4"/>} label="Telefone" value={cadastro.telefone} />
              <Field icon={<Mail className="w-4 h-4"/>} label="Email" value={cadastro.email} />
              <Field icon={<Building className="w-4 h-4"/>} label="Endereço" value={`${cadastro.endereco || ''}, ${cadastro.numero_residencia || ''} - ${cadastro.bairro || ''}, ${cadastro.cidade || ''}-${cadastro.estado_uf || ''}`} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><Briefcase className="w-5 h-5" /> Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <Field icon={<Briefcase className="w-4 h-4"/>} label="Profissão" value={cadastro.profissao} />
              <Field icon={<HandCoins className="w-4 h-4"/>} label="Renda Mensal" value={formatMoeda(cadastro.renda_mensal)} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Histórico de Observações</h3>
            <div className="p-4 bg-muted/30 rounded-lg space-y-4 max-h-48 overflow-y-auto">
              {allObservations.length > 0 ? (
                allObservations.map((obs, index) => (
                  <div key={index} className={`border-l-4 ${obs.author_role === 'supervisor' ? 'border-amber-500' : 'border-primary'} pl-4 py-2 bg-background rounded-r-lg`}>
                    <p className="text-sm text-card-foreground">{obs.text}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                       <User className="w-3 h-3" /> {obs.author} • <Calendar className="w-3 h-3"/> {formatDateTime(obs.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center italic">Nenhuma observação registrada.</p>
              )}
            </div>
          </section>
          
          <section>
             <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Adicionar sua Observação</h3>
             <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <Textarea 
                  placeholder="Digite sua observação sobre o contato com o cliente aqui..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  className="bg-background"
                />
                <Button onClick={handleSaveObservation} disabled={isSaving}>
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Salvando..." : "Salvar Observação"}
                </Button>
             </div>
          </section>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-border">
          <Button onClick={onClose} variant="outline">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescueDetailsModal;
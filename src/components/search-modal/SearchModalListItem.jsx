import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Edit, FileText, MessageSquare, Trash2, Users, MoreHorizontal, DownloadCloud, Copy, CheckCircle, XCircle, Clock, User, Phone, DollarSign, LifeBuoy, MessageSquare as MessageSquareText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPCOES } from '@/constants';
import { formatMoeda } from '@/utils';
import { cn } from '@/lib/utils';

const SearchModalListItem = ({ 
  item, 
  onEdit, 
  onGeneratePDF, 
  onOpenChangeSellerModal, 
  userInfo,
  onShowDetails,
  onStatusChange,
  onDownloadDocs,
  onCopyCadastro,
  isDownloading
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newObservation, setNewObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [observacaoSupervisor, setObservacaoSupervisor] = useState(item.observacao_supervisor || []);
  const { toast } = useToast();

  const handleAddObservation = async () => {
    if (!newObservation.trim()) {
      toast({ title: "Observação vazia", description: "Por favor, escreva algo.", variant: "destructive" });
      return;
    }
    if (!userInfo) {
      toast({ title: "Erro de Autenticação", description: "Usuário não identificado. Faça login novamente.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const newObservationEntry = {
      text: newObservation,
      author: userInfo.vendedor,
      timestamp: new Date().toISOString(),
    };

    const updatedObservations = [newObservationEntry, ...observacaoSupervisor].slice(0, 3);

    try {
      const { error: updateError } = await supabase
        .from('cadastros')
        .update({ observacao_supervisor: updatedObservations })
        .eq('id', item.id);

      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from('activity_log')
        .insert({
          user_name: userInfo.vendedor,
          user_role: userInfo.tipo_acesso,
          action_type: 'NOVA_OBSERVACAO',
          details: {
            codigo_cadastro: item.codigo_cadastro,
            cliente_nome: item.nome_completo,
            observacao: newObservation,
          }
        });

      if (logError) throw logError;

      setObservacaoSupervisor(updatedObservations);
      setNewObservation('');
      toast({ title: "Sucesso!", description: "Observação adicionada." });
    } catch (error) {
      console.error("Erro ao adicionar observação:", error);
      toast({ title: "Erro", description: `Não foi possível adicionar a observação: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteObservation = async (indexToDelete) => {
    const updatedObservations = observacaoSupervisor.filter((_, index) => index !== indexToDelete);

    try {
      const { error } = await supabase
        .from('cadastros')
        .update({ observacao_supervisor: updatedObservations })
        .eq('id', item.id);

      if (error) throw error;

      setObservacaoSupervisor(updatedObservations);
      toast({ title: "Sucesso!", description: "Observação removida." });
    } catch (error) {
      console.error("Erro ao remover observação:", error);
      toast({ title: "Erro", description: `Não foi possível remover a observação: ${error.message}`, variant: "destructive" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const statusInfo = useMemo(() => {
    const status = STATUS_OPCOES.find(s => s.value === item.status_cliente);
    if (status) {
      let icon;
      switch (status.value) {
        case 'aprovado':
        case 'comprou':
          icon = <CheckCircle className="w-4 h-4 text-green-500" />;
          break;
        case 'reprovado':
        case 'nao_comprou':
          icon = <XCircle className="w-4 h-4 text-red-500" />;
          break;
        case 'resgatado':
          icon = <LifeBuoy className="w-4 h-4 text-teal-500" />;
          break;
        default:
          icon = <Clock className="w-4 h-4 text-yellow-500" />;
      }
      return {
        label: status.label,
        className: status.className,
        icon: icon
      };
    }
    return {
      label: item.status_cliente ? item.status_cliente.replace(/_/g, ' ').toUpperCase() : 'Não definido',
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      icon: <Clock className="w-4 h-4 text-gray-500" />
    };
  }, [item.status_cliente]);

  const parsedDocs = useMemo(() => {
    if (!item.documentos) return [];
    try {
      const docs = typeof item.documentos === 'string' ? JSON.parse(item.documentos) : item.documentos;
      return Array.isArray(docs) ? docs : [];
    } catch (e) {
      return [];
    }
  }, [item.documentos]);

  const getWhatsAppLink = (phoneNumber) => {
    if (!phoneNumber) return '#';
    const cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    // Assuming Brazilian numbers, add 55 if not present and it's a valid length
    if (cleaned.length === 11 || cleaned.length === 10) { // 11 for 9xxxx-xxxx, 10 for xxxx-xxxx (old format or landline)
      return `https://api.whatsapp.com/send?phone=55${cleaned}`;
    }
    return `https://api.whatsapp.com/send?phone=${cleaned}`; // Fallback for other formats
  };

  return (
    <div className={cn("border-b border-border/30 rounded-lg overflow-hidden transition-all duration-300", statusInfo.className.replace(/text-\w+-\d+/g, ''))}>
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-black/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0 mb-4 sm:mb-0">
          <p className="font-semibold text-primary truncate text-lg">{item.nome_completo}</p>
          <p className="text-sm text-muted-foreground">CPF: {item.cpf}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-foreground/80" /> {item.vendedor}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-foreground/80" /> {item.telefone}</span>
            <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-foreground/80" /> {formatMoeda(item.valor_credito)}</span>
          </div>
        </div>
        <div className="flex items-center ml-auto sm:ml-4 gap-2 w-full sm:w-auto justify-end">
          <span className={cn("text-sm mr-2 flex items-center gap-2 font-medium", statusInfo.className.replace(/bg-\w+-\d+/g, '').replace(/border-\w+-\d+/g, ''))}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold">Equipe</p>
                  <p className="text-sm text-muted-foreground">{item.equipe}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Modalidade</p>
                  <p className="text-sm text-muted-foreground">{item.modalidade}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Data de Cadastro</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.data_cadastro)}</p>
                </div>
              </div>

              {userInfo.tipo_acesso === 'admin' && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <h4 className="text-md font-semibold mb-2 flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Observações do Supervisor</h4>
                  <div className="space-y-3 mb-4">
                    {observacaoSupervisor && observacaoSupervisor.length > 0 ? (
                      observacaoSupervisor.map((obs, index) => (
                        <div key={index} className="text-xs bg-background/50 p-2 rounded-md flex justify-between items-start">
                          <div>
                            <p className="font-bold">{obs.author}</p>
                            <p className="text-muted-foreground">{obs.text}</p>
                            <p className="text-muted-foreground/70 mt-1">{formatDate(obs.timestamp)}</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso removerá permanentemente a observação.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteObservation(index)}>Apagar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma observação ainda.</p>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <textarea
                      value={newObservation}
                      onChange={(e) => setNewObservation(e.target.value)}
                      placeholder="Adicionar nova observação..."
                      className="w-full p-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary"
                      rows={2}
                      disabled={isSubmitting}
                    />
                    <Button onClick={handleAddObservation} disabled={isSubmitting} size="sm">
                      {isSubmitting ? '...' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                <Button onClick={() => onShowDetails(item)} variant="outline" size="sm"><MoreHorizontal className="w-4 h-4 mr-2" /> Ver Detalhes</Button>
                <Button onClick={() => onEdit(item)} variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
                <Button onClick={() => onGeneratePDF(item)} variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" /> Gerar PDF</Button>
                <Button onClick={() => onCopyCadastro(item)} variant="outline" size="sm"><Copy className="w-4 h-4 mr-2" /> Copiar Resumo</Button>
                
                {item.telefone && (
                  <Button asChild variant="outline" size="sm" className="border-green-500/70 text-green-600 hover:bg-green-500/10">
                    <a href={getWhatsAppLink(item.telefone)} target="_blank" rel="noopener noreferrer">
                      <MessageSquareText className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                )}

                {parsedDocs.length > 0 && (
                  <Button onClick={() => onDownloadDocs(item)} variant="outline" size="sm" disabled={isDownloading}>
                    {isDownloading ? <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin mr-2" /> : <DownloadCloud className="w-4 h-4 mr-2" />}
                    {isDownloading ? "Baixando..." : "Baixar Docs"}
                  </Button>
                )}

                {userInfo.tipo_acesso === 'admin' && (
                  <>
                    <Button onClick={() => onOpenChangeSellerModal(item)} variant="outline" size="sm" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Alterar Vendedor
                    </Button>
                    <div className="w-full sm:w-auto">
                      <Select onValueChange={(value) => onStatusChange(item, value, userInfo)} defaultValue={item.status_cliente}>
                        <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                          <SelectValue placeholder="Alterar status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPCOES.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchModalListItem;
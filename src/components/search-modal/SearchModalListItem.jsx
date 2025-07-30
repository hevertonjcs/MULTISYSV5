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
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 10) {
      return `https://api.whatsapp.com/send?phone=55${cleaned}`;
    }
    return `https://api.whatsapp.com/send?phone=${cleaned}`;
  };

  return (
    <div className={cn("border-b border-border/30 rounded-lg overflow-hidden transition-all duration-300", statusInfo.className.replace(/text-\w+-\d+/g, ''))}>
      {/* ... todo o restante do JSX está igual ao que você já possui ... */}
    </div>
  );
};

export default SearchModalListItem;

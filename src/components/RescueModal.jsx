import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LifeBuoy, User, Phone, DollarSign, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { formatMoeda } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RescueDetailsModal from '@/components/rescue/RescueDetailsModal';

const RescueModal = ({ isOpen, onClose, userInfo }) => {
  const [unassignedCadastros, setUnassignedCadastros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rescuingId, setRescuingId] = useState(null);
  const [cadastroToRescue, setCadastroToRescue] = useState(null);
  const [selectedCadastroDetails, setSelectedCadastroDetails] = useState(null);
  const { toast } = useToast();

  const loadUnassignedCadastros = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cadastros')
        .select('*')
        .eq('vendedor', 'SEM VENDEDOR')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      setUnassignedCadastros(data || []);
    } catch (error) {
      toast({
        title: "Erro ao buscar cadastros",
        description: `Não foi possível carregar os clientes para resgate: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      loadUnassignedCadastros();
    }
  }, [isOpen, loadUnassignedCadastros]);

  const handleRescueConfirm = async () => {
    if (!cadastroToRescue || !userInfo) return;

    setRescuingId(cadastroToRescue.id);

    try {
      const { error: updateError } = await supabase
        .from('cadastros')
        .update({
          vendedor: userInfo.vendedor,
          equipe: userInfo.equipe,
          status_cliente: 'resgatado',
        })
        .eq('id', cadastroToRescue.id);

      if (updateError) throw updateError;

      const { error: logError } = await supabase.from('activity_log').insert({
        user_name: userInfo.vendedor,
        user_role: userInfo.tipo_acesso,
        action_type: 'RESGATE_CLIENTE',
        details: {
          cadastro_id: cadastroToRescue.id,
          cliente_nome: cadastroToRescue.nome_completo,
          codigo_cadastro: cadastroToRescue.codigo_cadastro,
        },
      });
      
      const { error: statusLogError } = await supabase.from('status_history').insert({
        cadastro_id: cadastroToRescue.id,
        cadastro_codigo_cadastro: cadastroToRescue.codigo_cadastro,
        cliente_nome: cadastroToRescue.nome_completo,
        old_status: cadastroToRescue.status_cliente,
        new_status: 'resgatado',
        changed_by_user_name: userInfo.vendedor,
      });

      if (logError) console.error("Erro ao registrar log de resgate:", logError.message);
      if (statusLogError) console.error("Erro ao registrar log de status:", statusLogError.message);

      toast({
        title: "Cliente Resgatado!",
        description: `${cadastroToRescue.nome_completo} agora está sob sua responsabilidade.`,
      });

      setUnassignedCadastros(prev => prev.filter(c => c.id !== cadastroToRescue.id));
    } catch (error) {
      toast({
        title: "Erro no Resgate",
        description: `Não foi possível resgatar o cliente: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setRescuingId(null);
      setCadastroToRescue(null);
    }
  };

  const handleShowDetails = (cadastro) => {
    setSelectedCadastroDetails(cadastro);
  };
  
  const handleUpdateObservations = (cadastroId, newObservations) => {
    const updateLocalData = (data) => {
      setSelectedCadastroDetails(prev => prev ? { ...prev, observacao_supervisor: data } : null);
      setUnassignedCadastros(prev => prev.map(c => c.id === cadastroId ? { ...c, observacao_supervisor: data } : c));
    };
    updateLocalData(newObservations);
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-card border-border p-6 rounded-lg shadow-xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-card-foreground flex items-center gap-3 text-2xl">
              <LifeBuoy className="w-7 h-7 text-amber-500" />
              Função Resgate
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Clientes sem vendedor esperando por um contato. Resgate um para atendê-lo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto mt-4 pr-2">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 border-4 border-muted/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : unassignedCadastros.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center text-muted-foreground p-8">
                 <AlertTriangle className="w-12 h-12 mb-4 text-amber-500" />
                <p className="text-lg font-semibold">Nenhum cliente para resgate!</p>
                <p className="text-sm">Todos os clientes estão sendo atendidos no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {unassignedCadastros.map(cadastro => (
                    <motion.div
                      key={cadastro.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                      className="bg-background/50 p-4 rounded-lg border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-primary text-lg">{cadastro.nome_completo}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {cadastro.cpf}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {cadastro.telefone}</span>
                          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {formatMoeda(cadastro.valor_credito)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          onClick={() => handleShowDetails(cadastro)}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button
                          onClick={() => setCadastroToRescue(cadastro)}
                          disabled={rescuingId === cadastro.id}
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-amber-foreground w-full sm:w-auto"
                        >
                          {rescuingId === cadastro.id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          ) : (
                            <LifeBuoy className="w-4 h-4 mr-2" />
                          )}
                          {rescuingId === cadastro.id ? 'Resgatando...' : 'Resgatar'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <RescueDetailsModal 
        cadastro={selectedCadastroDetails}
        isOpen={!!selectedCadastroDetails}
        onClose={() => setSelectedCadastroDetails(null)}
        userInfo={userInfo}
        onUpdateObservations={handleUpdateObservations}
      />

      {cadastroToRescue && (
        <AlertDialog open={!!cadastroToRescue} onOpenChange={() => setCadastroToRescue(null)}>
          <AlertDialogContent className="bg-card border-border text-card-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Resgate</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja resgatar o cliente <span className="font-semibold">{cadastroToRescue.nome_completo}</span>? Ele será atribuído a você.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleRescueConfirm} className="bg-amber-500 hover:bg-amber-600 text-amber-foreground">
                Confirmar Resgate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default RescueModal;
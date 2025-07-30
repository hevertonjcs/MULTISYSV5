import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Loader2, MessageSquare, UserCheck, CheckSquare, Trash2, FilePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { STATUS_OPCOES } from '@/constants';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ActivityLogFeed = ({ userInfo }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const feedRef = useRef(null);
  const { toast } = useToast();
  const isAdmin = userInfo?.tipo_acesso === 'admin';

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);

    const { data: activityLogs, error: activityError } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (activityError) {
      console.error("Erro ao buscar logs de atividade:", activityError);
      setLogs([]);
      setIsLoading(false);
      return;
    }
    
    setLogs(activityLogs || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('public-feed-channel-activity-only')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log' }, (payload) => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  const handleDeleteLog = async (logId) => {
    const { error } = await supabase
      .from('activity_log')
      .delete()
      .eq('id', logId);

    if (error) {
      toast({
        title: "Erro ao apagar",
        description: `Não foi possível apagar o registro: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registro apagado!",
        description: "O registro foi removido do feed de atividades.",
        variant: "default",
      });
      setLogs(currentLogs => currentLogs.filter(log => log.id !== logId));
    }
  };

  const getIconForAction = (actionType) => {
    switch (actionType) {
      case 'NOVO_CADASTRO':
        return <FilePlus className="w-5 h-5 text-cyan-500" />;
      case 'NOVA_OBSERVACAO':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'ALTERACAO_VENDEDOR':
        return <UserCheck className="w-5 h-5 text-green-500" />;
      case 'ALTERACAO_STATUS':
        return <CheckSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatLogMessage = (log) => {
    const { action_type, user_name, details } = log;
    const cliente = details?.cliente_nome || 'um cliente';

    const getStatusLabel = (statusValue) => {
      const status = STATUS_OPCOES.find(s => s.value === statusValue);
      return status ? status.label : statusValue;
    };

    switch (action_type) {
      case 'NOVO_CADASTRO':
        return (
          <span>
            <strong>{user_name}</strong> criou um novo cadastro para <strong>{cliente}</strong>.
          </span>
        );
      case 'NOVA_OBSERVACAO':
        return (
          <span>
            <strong>{user_name}</strong> adicionou uma nova observação para <strong>{cliente}</strong>: <em>"{details.observacao}"</em>
          </span>
        );
      case 'ALTERACAO_VENDEDOR':
        return (
          <span>
            <strong>{user_name}</strong> alterou o vendedor de <strong>{cliente}</strong> para <strong>{details.novo_vendedor}</strong> (Equipe: {details.nova_equipe}).
          </span>
        );
      case 'ALTERACAO_STATUS':
        return (
          <span>
            <strong>{user_name}</strong> alterou o status de <strong>{cliente}</strong> de <em>{getStatusLabel(details.old_status)}</em> para <em>{getStatusLabel(details.new_status)}</em>.
          </span>
        );
      default:
        return <span>Ação desconhecida por {user_name}.</span>;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-card-foreground">
          <Bell className="w-6 h-6 mr-3 text-primary" />
          Feed de Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={feedRef} className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 p-3 rounded-lg bg-background/50 group"
                  >
                    <div className="mt-1">{getIconForAction(log.action_type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{formatLogMessage(log)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso removerá permanentemente o registro de atividade.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteLog(log.id)}>Apagar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  <p>Nenhuma atividade registrada ainda.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogFeed;
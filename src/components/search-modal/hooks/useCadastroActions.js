import { useCallback, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { generatePDF } from '@/pdfGenerator';
import { sendToTelegram, formatTelegramMessage, formatTelegramMessageForBot2 } from '@/telegramService';
import { toast } from '@/components/ui/use-toast';
import JSZip from 'jszip';
import { initialFormData } from '@/constants';
import { sanitizeFilename } from '@/utils';


export const useCadastroActions = (logoConfig, cadastrosState, onEditCadastroRequest) => {
  const { cadastros, setCadastros } = cadastrosState;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = useCallback(async (cadastro) => {
    try {
      const doc = await generatePDF(cadastro, logoConfig);
      
      const date = new Date(cadastro.data_cadastro);
      const formattedDate = !isNaN(date.getTime()) ? `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` : 'SEM_DATA';

      const clientName = sanitizeFilename(cadastro.nome_completo || 'cliente_sem_nome');
      const sellerName = sanitizeFilename(cadastro.vendedor || 'vendedor_sem_nome');
      
      const filename = `${formattedDate} - ${clientName} - ${sellerName}.pdf`;

      doc.save(filename);
      toast({ title: "PDF baixado!", description: "O arquivo foi salvo com sucesso.", variant: "default" });
    } catch (error) {
      toast({ title: "Erro", description: `Falha ao gerar PDF: ${error.message}`, variant: "destructive" });
    }
  }, [logoConfig]);

  const handleDownloadDocs = useCallback(async (cadastro) => {
    if (!supabase || !cadastro.documentos || cadastro.documentos.length === 0) {
      toast({ title: "Nenhum documento", description: "Não há documentos anexados para este cadastro.", variant: "default" });
      return;
    }
    setIsDownloading(true);
    try {
      const docsList = typeof cadastro.documentos === 'string' ? JSON.parse(cadastro.documentos) : cadastro.documentos;
      if (!Array.isArray(docsList) || docsList.length === 0) {
        toast({ title: "Sem documentos", description: "Nenhum documento encontrado.", variant: "default" });
        setIsDownloading(false);
        return;
      }

      const zip = new JSZip();
      for (const doc of docsList) {
        const filePath = doc.path;
        if (!filePath) continue;
        const { data, error } = await supabase.storage.from('cadastros').download(filePath);
        if (error) {
          throw new Error(`Falha ao baixar ${doc.name}: ${error.message}`);
        }
        zip.file(doc.name, data);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `documentos_${cadastro.codigo_cadastro}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({ title: "Download Concluído", description: "Documentos baixados em um arquivo .zip.", variant: "default"});
    } catch (error) {
       toast({ title: "Erro no Download", description: `Não foi possível baixar os documentos. ${error.message}`, variant: "destructive"});
    } finally {
        setIsDownloading(false);
    }
  }, []);

  const handleResendTelegram = useCallback(async (cadastro) => {
    try {
      const doc = await generatePDF(cadastro, logoConfig);
      const pdfBlob = doc.output('blob');
      
      const messageBot1 = formatTelegramMessage(cadastro); 
      await sendToTelegram(messageBot1, pdfBlob, 1);

      const messageBot2 = formatTelegramMessageForBot2(cadastro);
      await sendToTelegram(null, pdfBlob, 2, messageBot2);

      toast({ title: "Reenviado!", description: "Cadastro reenviado para ambos os bots do Telegram.", variant: "default" });
    } catch (error) {
      toast({ title: "Erro", description: `Falha ao reenviar para um ou mais bots do Telegram: ${error.message}`, variant: "destructive" });
    }
  }, [logoConfig]);

  const handleStatusChange = useCallback(async (cadastro, newStatus, userInfo) => {
    const oldStatus = cadastro.status_cliente;
    if (!userInfo || !userInfo.vendedor) {
      toast({ title: "Erro de Autenticação", description: "Não foi possível identificar o usuário. Por favor, faça login novamente.", variant: "destructive" });
      return;
    }
    
    try {
      const { error: updateError } = await supabase
        .from('cadastros')
        .update({ status_cliente: newStatus })
        .eq('id', cadastro.id);
      
      if (updateError) throw updateError;

      const { error: statusLogError } = await supabase.from('status_history').insert({
        cadastro_id: cadastro.id,
        cadastro_codigo_cadastro: cadastro.codigo_cadastro,
        cliente_nome: cadastro.nome_completo,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by_user_name: userInfo.vendedor,
      });

      if (statusLogError) console.error("Erro ao registrar histórico de status:", statusLogError);

      const { error: logError } = await supabase.from('activity_log').insert({
        user_name: userInfo.vendedor,
        user_role: userInfo.tipo_acesso,
        action_type: 'ALTERACAO_STATUS',
        details: {
          cadastro_id: cadastro.id,
          cliente_nome: cadastro.nome_completo,
          codigo_cadastro: cadastro.codigo_cadastro,
          old_status: oldStatus,
          new_status: newStatus,
        },
      });

      if (logError) console.error("Erro ao registrar log de atividade:", logError);

      setCadastros(prev => prev.map(item => item.id === cadastro.id ? { ...item, status_cliente: newStatus } : item));
      toast({
        title: "Status atualizado!",
        description: `Status alterado para: ${newStatus.replace(/_/g,' ').toUpperCase()}.`,
        variant: "default"
      });
    } catch (error) {
      toast({ title: "Erro Supabase", description: `Falha ao atualizar status: ${error.message}.`, variant: "destructive" });
    }
  }, [setCadastros]);
  
  const handleSupervisorObservationUpdate = useCallback((cadastroId, newObservations) => {
    setCadastros(prevCadastros =>
      prevCadastros.map(c =>
        c.id === cadastroId ? { ...c, observacao_supervisor: newObservations } : c
      )
    );
  }, [setCadastros]);

  const handleAddSupervisorObservation = useCallback(async (cadastro, observationText, userInfo) => {
     if (!userInfo || !userInfo.vendedor) {
      toast({ title: "Erro de Autenticação", description: "Não foi possível identificar o usuário. Por favor, faça login novamente.", variant: "destructive" });
      return;
    }
    const newObservation = {
      text: observationText,
      timestamp: new Date().toISOString(),
      author: userInfo.vendedor,
    };

    const currentObservations = Array.isArray(cadastro.observacao_supervisor) ? cadastro.observacao_supervisor : [];
    const updatedObservations = [...currentObservations, newObservation];

    try {
      const { error: updateError } = await supabase
        .from('cadastros')
        .update({ observacao_supervisor: updatedObservations })
        .eq('id', cadastro.id);

      if (updateError) throw updateError;
      
      const { error: logError } = await supabase.from('activity_log').insert({
        user_name: userInfo.vendedor,
        user_role: userInfo.tipo_acesso,
        action_type: 'NOVA_OBSERVACAO',
        details: {
          cadastro_id: cadastro.id,
          cliente_nome: cadastro.nome_completo,
          observacao: observationText,
        },
      });

      if (logError) throw new Error(`Erro ao registrar no log: ${logError.message}`);

      setCadastros(prev => prev.map(c => 
        c.id === cadastro.id 
          ? { ...c, observacao_supervisor: updatedObservations } 
          : c
      ));

      toast({
        title: "Observação Adicionada!",
        description: "A nova observação foi salva com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro ao Salvar Observação",
        description: `Ocorreu um problema: ${error.message}`,
        variant: "destructive"
      });
    }
  }, [setCadastros]);

  const handleSellerUpdate = useCallback((updatedCadastro) => {
    setCadastros(prevCadastros =>
      prevCadastros.map(c =>
        c.id === updatedCadastro.id ? { ...c, vendedor: updatedCadastro.vendedor, equipe: updatedCadastro.equipe } : c
      )
    );
  }, [setCadastros]);


  const handleDelete = useCallback(async (cadastroToDelete) => {
    if (!cadastroToDelete) return null;
    try {
      const { error } = await supabase
        .from('cadastros')
        .delete()
        .eq('id', cadastroToDelete.id);

      if (error) throw error;

      setCadastros(prev => prev.filter(item => item.id !== cadastroToDelete.id));
      toast({
        title: "Cadastro Apagado!",
        description: `O cadastro de ${cadastroToDelete.nome_completo} foi apagado.`,
        variant: "default"
      });
      return cadastroToDelete.id; 
    } catch (error) {
      toast({ title: "Erro Supabase", description: `Falha ao apagar: ${error.message}.`, variant: "destructive" });
      return null;
    }
  }, [setCadastros]);

  const handleEdit = useCallback((cadastro) => {
    if (onEditCadastroRequest) {
       const mappedData = {};
        for (const key in initialFormData) {
          if (cadastro.hasOwnProperty(key)) {
            mappedData[key] = cadastro[key];
          } else {
            mappedData[key] = initialFormData[key];
          }
        }
        onEditCadastroRequest(mappedData);
    } else {
       toast({
        title: "🚧 Edição Indisponível!",
        description: "A função de edição não foi conectada corretamente.",
        variant: "destructive",
      });
    }
  }, [onEditCadastroRequest]);

  const handleCopyCadastro = useCallback((cadastro) => {
    const formatMoeda = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    let obsText = 'N/A';
    if(Array.isArray(cadastro.observacao_supervisor) && cadastro.observacao_supervisor.length > 0) {
      obsText = cadastro.observacao_supervisor.map(obs => `[${new Date(obs.timestamp).toLocaleString('pt-BR')}] ${obs.text}`).join('\n');
    } else if (typeof cadastro.observacao_supervisor === 'object' && cadastro.observacao_supervisor !== null) {
      obsText = `[${new Date(cadastro.observacao_supervisor.timestamp).toLocaleString('pt-BR')}] ${cadastro.observacao_supervisor.text}`
    }

    const dataToCopy = `
Código: ${cadastro.codigo_cadastro || 'N/A'}
Nome: ${cadastro.nome_completo || 'N/A'}
CPF: ${cadastro.cpf || 'N/A'}
Telefone: ${cadastro.telefone || 'N/A'}
Email: ${cadastro.email || 'N/A'}
Vendedor: ${cadastro.vendedor || 'N/A'}
Equipe: ${cadastro.equipe || 'N/A'}
Status: ${cadastro.status_cliente || 'N/A'}
Data: ${cadastro.data_cadastro ? new Date(cadastro.data_cadastro).toLocaleString('pt-BR') : 'N/A'}
Valor Crédito: ${formatMoeda(String(cadastro.valor_credito || '0'))}
Modalidade: ${cadastro.modalidade || 'N/A'}
Observação Supervisor: ${obsText}
    `.trim();
    navigator.clipboard.writeText(dataToCopy)
      .then(() => toast({ title: "Copiado!", description: "Dados do cadastro copiados.", variant: "default" }))
      .catch(() => toast({ title: "Erro", description: "Não foi possível copiar.", variant: "destructive" }));
  }, []);

  const handleDeleteSupervisorObservation = useCallback(async (cadastroId, observationTimestamp) => {
    const cadastro = cadastros.find(c => c.id === cadastroId);
    if (!cadastro || !Array.isArray(cadastro.observacao_supervisor)) return;

    const updatedObservations = cadastro.observacao_supervisor.filter(obs => obs.timestamp !== observationTimestamp);

    try {
      const { error } = await supabase
        .from('cadastros')
        .update({ observacao_supervisor: updatedObservations })
        .eq('id', cadastroId);

      if (error) throw error;

      setCadastros(prev => prev.map(item => 
        item.id === cadastroId 
          ? { ...item, observacao_supervisor: updatedObservations } 
          : item
      ));
      toast({
        title: "Observação Apagada!",
        description: "A observação foi removida com sucesso.",
        variant: "default"
      });
    } catch (error) {
      toast({ title: "Erro Supabase", description: `Falha ao apagar observação: ${error.message}.`, variant: "destructive" });
    }
  }, [cadastros, setCadastros]);

  return {
    isDownloading,
    handleDownloadPDF,
    handleDownloadDocs,
    handleResendTelegram,
    handleStatusChange,
    handleDelete,
    handleEdit,
    handleCopyCadastro,
    handleSupervisorObservationUpdate,
    handleSellerUpdate,
    handleDeleteSupervisorObservation,
    handleAddSupervisorObservation,
  };
};
import { useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useDataMigrator = (userInfo) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!userInfo || userInfo.tipo_acesso !== 'admin') {
      return;
    }

    const migrateObservations = async () => {
      console.log("Iniciando verificação de migração de observações...");
      
      try {
        const { data: cadastros, error } = await supabase
          .from('cadastros')
          .select('id, observacao_supervisor');

        if (error) {
          throw new Error(`Erro ao buscar cadastros para migração: ${error.message}`);
        }

        const migrations = [];
        for (const cadastro of cadastros) {
          if (cadastro.observacao_supervisor && !Array.isArray(cadastro.observacao_supervisor)) {
            // Se for um objeto, mas não for o formato novo, converte
            if (typeof cadastro.observacao_supervisor === 'object' && cadastro.observacao_supervisor !== null) {
              const oldObs = cadastro.observacao_supervisor;
              if (oldObs.text && !oldObs.author) {
                const newObservationFormat = [{
                  text: oldObs.text,
                  author: 'Heverton', 
                  timestamp: oldObs.timestamp || new Date().toISOString(),
                }];
                
                migrations.push(
                  supabase
                    .from('cadastros')
                    .update({ observacao_supervisor: newObservationFormat })
                    .eq('id', cadastro.id)
                );
              }
            } else if (typeof cadastro.observacao_supervisor === 'string') {
              // Se for uma string, converte
              const newObservationFormat = [{
                text: cadastro.observacao_supervisor,
                author: 'Heverton', 
                timestamp: new Date().toISOString(),
              }];
              
              migrations.push(
                supabase
                  .from('cadastros')
                  .update({ observacao_supervisor: newObservationFormat })
                  .eq('id', cadastro.id)
              );
            }
          }
        }

        if (migrations.length > 0) {
          console.log(`Encontrados ${migrations.length} cadastros para migrar observações.`);
          toast({
            title: "Migração de Dados",
            description: `Atualizando ${migrations.length} observações para o novo formato...`,
          });
          
          const results = await Promise.all(migrations);
          const failedMigrations = results.filter(res => res.error);

          if (failedMigrations.length > 0) {
            console.error("Falhas na migração:", failedMigrations);
            toast({
              title: "Erro na Migração",
              description: `Houve erro em ${failedMigrations.length} atualizações. Verifique o console.`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Migração Concluída!",
              description: "Observações antigas foram atualizadas com sucesso.",
            });
            console.log("Migração de observações concluída com sucesso.");
          }
        } else {
          console.log("Nenhuma observação antiga encontrada para migrar. Tudo certo!");
        }

      } catch (error) {
        console.error("Erro no processo de migração:", error);
        toast({
          title: "Erro Crítico na Migração",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    // Executa a migração um pouco depois do login para não atrapalhar a inicialização
    const timer = setTimeout(migrateObservations, 3000); 

    return () => clearTimeout(timer);

  }, [userInfo, toast]);
};
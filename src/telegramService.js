import { TELEGRAM_BOTS } from '@/constants';
import { formatData, formatMoeda } from '@/utils';

export const sendToTelegram = async (message, pdfBlob = null, botNumber = 1, customCaption = null) => {
  const botConfig = TELEGRAM_BOTS[botNumber];
  if (!botConfig || !botConfig.TOKEN || !botConfig.CHAT_ID) {
    console.warn(`Telegram Bot ${botNumber} ou Chat ID não configurado.`);
    return false;
  }
  
  const token = botConfig.TOKEN;
  const chatId = botConfig.CHAT_ID;

  try {
    if (message) {
      const textResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      const textResult = await textResponse.json();
      if (!textResponse.ok) {
        console.error(`Falha ao enviar mensagem para Telegram (Bot ${botNumber}):`, textResult);
        throw new Error(`Falha ao enviar mensagem para Telegram (Bot ${botNumber}): ${textResult.description}`);
      }
    }
    
    if (pdfBlob) {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('document', pdfBlob, `cadastro_${Date.now()}.pdf`);
      
      const captionText = customCaption || `Segue o PDF do cadastro.`;
      formData.append('caption', captionText);
      formData.append('parse_mode', 'HTML');
      
      const pdfResponse = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      
      const pdfResult = await pdfResponse.json();
      if (!pdfResponse.ok) {
        console.error(`Falha ao enviar PDF para Telegram (Bot ${botNumber}):`, pdfResult);
        throw new Error(`Falha ao enviar PDF para Telegram (Bot ${botNumber}): ${pdfResult.description}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro no envio para Telegram (Bot ${botNumber}):`, error);
    throw error;
  }
};

export const formatTelegramMessage = (formData) => {
  const details = [
    `🆕 <b>NOVO CADASTRO</b> 🆕`,
    `------------------------------------`,
    `🔑 <b>Código:</b> ${formData.codigo_cadastro || 'N/A'}`,
    `📅 <b>Data Cadastro:</b> ${formatData(formData.data_cadastro) || 'N/A'}`,
    `------------------------------------`,
    `👤 <b>DADOS PESSOAIS</b>`,
    `   <b>Nome:</b> ${formData.nome_completo || 'N/A'}`,
    `   <b>CPF:</b> ${formData.cpf || 'N/A'}`,
    `   <b>RG:</b> ${formData.rg || 'N/A'}`,
    `   <b>Órgão Exp:</b> ${formData.orgao_expedidor || 'N/A'}`,
    `   <b>Nascimento:</b> ${formatData(formData.data_nascimento) || 'N/A'}`,
    `   <b>Estado Civil:</b> ${formData.estado_civil || 'N/A'}`,
    `   <b>Cônjuge:</b> ${formData.nome_conjuge || 'N/A'}`,
    `   <b>Sexo:</b> ${formData.sexo || 'N/A'}`,
    `   <b>Mãe:</b> ${formData.nome_mae || 'N/A'}`,
    `   <b>Pai:</b> ${formData.nome_pai || 'N/A'}`,
    `------------------------------------`,
    `📞 <b>CONTATO</b>`,
    `   <b>Telefone:</b> ${formData.telefone || 'N/A'}`,
    `   <b>Email:</b> ${formData.email || 'N/A'}`,
    `   <b>Contato Adicional:</b> ${formData.contato_adicional || 'N/A'}`,
    `------------------------------------`,
    `🏠 <b>ENDEREÇO</b>`,
    `   <b>CEP:</b> ${formData.cep || 'N/A'}`,
    `   <b>Endereço:</b> ${formData.endereco || 'N/A'}, Nº ${formData.numero_residencia || 'N/A'}`,
    `   <b>Complemento:</b> ${formData.complemento || 'N/A'}`,
    `   <b>Bairro:</b> ${formData.bairro || 'N/A'}`,
    `   <b>Cidade:</b> ${formData.cidade || 'N/A'} - ${formData.estado_uf || 'N/A'}`,
    `   <b>Obs. Residencial:</b> ${formData.observacao_residencial || 'N/A'}`,
    `------------------------------------`,
    `💰 <b>RENDA E PROFISSÃO</b>`,
    `   <b>Profissão:</b> ${formData.profissao || 'N/A'}`,
    `   <b>Renda Mensal:</b> ${formatMoeda(String(formData.renda_mensal || '0'))}`,
    `   <b>Tipo de Renda:</b> ${formData.tipo_renda || 'N/A'}`,
    `------------------------------------`,
    `💳 <b>PROPOSTA DE CRÉDITO</b>`,
    `   <b>Modalidade:</b> ${formData.modalidade || 'N/A'}`,
    `   <b>Valor Crédito:</b> ${formatMoeda(String(formData.valor_credito || '0'))}`,
    `   <b>Valor Entrada:</b> ${formatMoeda(String(formData.valor_entrada || '0'))}`,
    `   <b>Parcelas:</b> ${formData.parcelas || 'N/A'}`,
    `   <b>Valor Parcela:</b> ${formatMoeda(String(formData.valor_parcela || '0'))}`,
    `   <b>Segmento:</b> ${formData.segmento || 'N/A'}`,
    `   <b>Obs. Final:</b> ${formData.observacao_final || 'N/A'}`,
    `------------------------------------`,
    `👨‍💼 <b>ATENDIMENTO</b>`,
    `   <b>Vendedor:</b> ${formData.vendedor || 'N/A'}`,
    `   <b>Equipe:</b> ${formData.equipe || 'N/A'}`,
    `   <b>Status:</b> ${(formData.status_cliente || 'PENDENTE').replace('_',' ').toUpperCase()}`,
  ];

  return details.join('\n');
};

export const formatTelegramMessageForBot2 = (formData) => {
  const message = `Novo Cadastro Recebido:
        Vendedor: ${formData.vendedor || 'N/A'}
        Equipe: ${formData.equipe || 'N/A'}
        Nome: ${formData.nome_completo || 'N/A'}
        CPF: ${formData.cpf || 'N/A'}
        Email: ${formData.email || 'N/A'}
        Telefone: ${formData.telefone || 'N/A'}
        Valor do crédito: ${formatMoeda(String(formData.valor_credito || '0'))}
        Valor de entrada: ${formatMoeda(String(formData.valor_entrada || '0'))}
        Parcelas: ${formData.parcelas || 'N/A'}

        Status: ${(formData.status_cliente || 'PENDENTE').replace('_',' ').toUpperCase()}`;
        
  return message;
};
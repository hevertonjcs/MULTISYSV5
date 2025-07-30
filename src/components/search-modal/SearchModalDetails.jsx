import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Send, Edit3, Copy, Trash2, DownloadCloud, User, Home, Phone, DollarSign, Briefcase } from 'lucide-react';
import SupervisorObservationForm from './SupervisorObservationForm';
import { formatData, formatMoeda, formatDataHora } from '@/utils';

const DetailSection = ({ title, icon, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2 border-b border-border pb-2 mb-3">
      {icon}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value }) => {
  if (value === null || value === undefined || String(value).trim() === '' || String(value).trim() === 'N/A') {
    return null;
  }
  return (
    <div className="break-words">
      <span className="text-xs text-muted-foreground">{label}: </span>
      <p className="text-sm text-card-foreground">{String(value)}</p>
    </div>
  );
};

const SearchModalDetails = ({ isOpen, onClose, cadastro, onDownloadPDF, onResendTelegram, onEdit, onCopy, onDelete, onDownloadDocs, isDownloading, onAddObservation, userInfo }) => {
  if (!cadastro) return null;

  const teamData = [
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'equipe', label: 'Equipe' },
  ];

  const clientData = [
    { key: 'codigo_cadastro', label: 'Código' },
    { key: 'nome_completo', label: 'Nome Completo' },
    { key: 'cpf', label: 'CPF' },
    { key: 'rg', label: 'RG' },
    { key: 'orgao_expedidor', label: 'Órgão Expedidor' },
    { key: 'data_nascimento', label: 'Data Nascimento', format: formatData },
    { key: 'estado_civil', label: 'Estado Civil' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'nome_mae', label: 'Nome da Mãe' },
    { key: 'nome_pai', label: 'Nome do Pai' },
    { key: 'profissao', label: 'Profissão' },
    { key: 'renda_mensal', label: 'Renda Mensal', format: formatMoeda },
    { key: 'tipo_renda', label: 'Tipo de Renda' },
    { key: 'data_cadastro', label: 'Data Cadastro', format: formatData },
  ];

  const residenceData = [
    { key: 'cep', label: 'CEP' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'numero_residencia', label: 'Número' },
    { key: 'complemento', label: 'Complemento' },
    { key: 'bairro', label: 'Bairro' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado_uf', label: 'Estado' },
  ];

  const contactData = [
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'Email' },
    { key: 'contato_adicional', label: 'Contato Adicional' },
  ];

  const simulationData = [
    { key: 'modalidade', label: 'Modalidade' },
    { key: 'valor_credito', label: 'Valor Crédito', format: formatMoeda },
    { key: 'valor_entrada', label: 'Valor Entrada', format: formatMoeda },
    { key: 'parcelas', label: 'Qtd. Meses' },
    { key: 'valor_parcela', label: 'Valor Parcela', format: formatMoeda },
    { key: 'segmento', label: 'Segmento' },
  ];

  const renderFields = (fields) => {
    return fields.map(({ key, label, format }) => {
      let value = cadastro[key];
      if (format && value) value = format(String(value));
      if (value === null || value === undefined || String(value).trim() === '' || (String(value).trim() === 'R$0,00' && (key === 'valor_credito' || key === 'renda_mensal' || key === 'valor_entrada' || key === 'valor_parcela'))) {
        value = 'N/A';
      }
      return <DetailItem key={key} label={label} value={value} />;
    });
  };
  
  const formatSupervisorObservation = (obsData) => {
    if (!obsData || (Array.isArray(obsData) && obsData.length === 0)) {
        return <p className="text-sm text-muted-foreground">Nenhuma observação.</p>;
    }
    
    let observations = [];
    if (Array.isArray(obsData)) {
        observations = [...obsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (typeof obsData === 'object' && obsData !== null) {
        observations = [obsData];
    } else {
         return <p className="text-sm text-destructive">Formato de observação inválido.</p>;
    }

    return (
        <ul className="space-y-2 list-none p-0 max-h-40 overflow-y-auto">
            {observations.map((obs, index) => (
                <li key={obs.timestamp || index} className="text-sm">
                    <span className="font-medium text-foreground">[{formatDataHora(obs.timestamp)}] por {obs.author || 'Supervisor'}:</span> <span className="text-muted-foreground">{obs.text}</span>
                </li>
            ))}
        </ul>
    );
  };

  let parsedDocs = [];
  if (cadastro.documentos) {
    try {
      parsedDocs = typeof cadastro.documentos === 'string' ? JSON.parse(cadastro.documentos) : cadastro.documentos;
      if (!Array.isArray(parsedDocs)) parsedDocs = [];
    } catch (e) {
      parsedDocs = [];
    }
  }

  const isSupervisorOrAdmin = userInfo?.tipo_acesso === 'admin' || userInfo?.tipo_acesso === 'supervisor';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border-border p-4 md:p-6 rounded-lg shadow-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-card-foreground text-xl md:text-2xl">
            Detalhes do Cadastro
          </DialogTitle>
          <DialogDescription>
            Visualização completa das informações de {cadastro.nome_completo || 'cliente'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-1">
          <div className={`p-3 rounded-md border ${cadastro.status_cliente === 'aprovado' ? 'bg-green-500/10 border-green-500/30 text-green-700' : cadastro.status_cliente === 'reprovado' ? 'bg-red-500/10 border-red-500/30 text-red-700' : 'bg-blue-500/10 border-blue-500/30 text-blue-700'}`}>
            Status Atual: <span className="font-semibold">{cadastro.status_cliente ? cadastro.status_cliente.replace(/_/g,' ').toUpperCase() : 'N/A'}</span>
          </div>

          <DetailSection title="Responsável" icon={<Briefcase className="w-5 h-5" />}>
            {renderFields(teamData)}
          </DetailSection>

          <DetailSection title="Dados do Cliente" icon={<User className="w-5 h-5" />}>
            {renderFields(clientData)}
          </DetailSection>

          <DetailSection title="Dados de Residência" icon={<Home className="w-5 h-5" />}>
            {renderFields(residenceData)}
          </DetailSection>

          <DetailSection title="Informações de Contato" icon={<Phone className="w-5 h-5" />}>
            {renderFields(contactData)}
          </DetailSection>

          <DetailSection title="Simulação e Valores" icon={<DollarSign className="w-5 h-5" />}>
            {renderFields(simulationData)}
          </DetailSection>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2 border-b border-border pb-2 mb-3">
              Observações
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground">Observação do Cliente:</span>
                <p className="text-sm text-card-foreground p-2 bg-muted/50 rounded-md min-h-[30px]">{cadastro.observacao_final || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Histórico do Supervisor:</span>
                <div className="p-2 bg-muted/50 rounded-md min-h-[30px]">
                  {formatSupervisorObservation(cadastro.observacao_supervisor)}
                </div>
                {isSupervisorOrAdmin && (
                   <SupervisorObservationForm 
                     cadastro={cadastro} 
                     onAddObservation={onAddObservation} 
                     userInfo={userInfo}
                   />
                )}
              </div>
            </div>
          </div>

          {parsedDocs.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">Documentos Anexados:</span>
              <ul className="list-disc list-inside pl-1">
                {parsedDocs.map((doc, idx) => (
                  <li key={idx} className="text-sm text-card-foreground truncate">{doc.name || 'Arquivo sem nome'}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-6">
            <Button onClick={() => onEdit(cadastro)} variant="outline" size="sm" className="border-blue-500/70 text-blue-600 hover:bg-blue-500/10">
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Dados
            </Button>
            <Button onClick={() => onCopy(cadastro)} variant="outline" size="sm" className="border-purple-500/70 text-purple-600 hover:bg-purple-500/10">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Dados
            </Button>
            <Button onClick={() => onDownloadPDF(cadastro)} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
             {parsedDocs.length > 0 && (
              <Button onClick={() => onDownloadDocs(cadastro)} variant="outline" size="sm" className="border-green-500/70 text-green-600 hover:bg-green-500/10" disabled={isDownloading}>
                {isDownloading ? <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-600 rounded-full animate-spin mr-2" /> : <DownloadCloud className="w-4 h-4 mr-2" />}
                {isDownloading ? "Baixando..." : "Baixar Documentos"}
              </Button>
            )}
            <Button onClick={() => onResendTelegram(cadastro)} variant="outline" size="sm" className="border-teal-500/70 text-teal-600 hover:bg-teal-500/10">
              <Send className="w-4 h-4 mr-2" />
              Reenviar Telegram
            </Button>
             {onDelete && isSupervisorOrAdmin && (
              <Button onClick={() => { onClose(); setTimeout(() => onDelete(cadastro), 100); }} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-destructive-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Apagar Cadastro
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModalDetails;
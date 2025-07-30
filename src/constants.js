export const TELEGRAM_BOTS = {
  1: {
    TOKEN: '7992237580:AAFMOu71UPOn6QQk7AVcWqaYjiG1lnrRLec',
    CHAT_ID: '-1002578400757'
  },
  2: {
    TOKEN: '7538815536:AAHzPcfndI9YXm6J3QnC9FOYvttu_egNCjk',
    CHAT_ID: '-1002817412209'
  }
};

export const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || 'admin123';

export const initialFormData = {
  // Dados pessoais
  modalidade: '',
  nome_completo: '', 
  cpf: '',
  rg: '',
  orgao_expedidor: '', 
  data_nascimento: '', 
  estado_civil: '', 
  nome_conjuge: '', 
  sexo: '',
  nome_mae: '', 
  nome_pai: '', 
  
  // Contato
  telefone: '',
  email: '',
  contato_adicional: '', 
  
  // Endereço
  cep: '',
  endereco: '',
  numero_residencia: '', 
  complemento: '',
  bairro: '',
  cidade: '',
  estado_uf: '', 
  observacao_residencial: '', 
  
  // Informações de Renda
  profissao: '',
  renda_mensal: '', 
  tipo_renda: '', 

  // Proposta de Crédito
  valor_credito: '', 
  valor_entrada: '', 
  parcelas: '', 
  valor_parcela: '', 
  segmento: '',
  observacao_final: '', 
  observacao_supervisor: '',

  // Documentos
  documentos: [], 
  
  // Metadados
  vendedor: '',
  equipe: '',
  status_cliente: 'pendente', 
  data_cadastro: '', 
  codigo_cadastro: '' 
};

export const ESTADOS_BRASIL_OBJ = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' }, { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' }, { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' }, { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' }, { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export const ESTADOS_CIVIS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'União Estável'
];

export const SEXO_OPCOES = [
  'Masculino',
  'Feminino',
  'Outro',
  'Prefiro não informar'
];

export const MODALIDADE_OPCOES = [
  'Automóvel',
  'Imóvel',
  'Pesados',
  'Serviços',
  'Aquisições de Bens',
  'Autofinanciamento'
];

export const TIPO_RENDA_OPCOES = [
  'CLT',
  'Autônomo',
  'Empresário',
  'Aposentado',
  'Pensionista'
];

export const SEGMENTO_OPCOES = [
  'Veículos Leves',
  'Veículos Pesados',
  'Imóveis Residenciais',
  'Imóveis Comerciais',
  'Serviços Diversos',
  'Outros'
];

export const STATUS_OPCOES = [
  { value: 'pendente', label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'resgatado', label: 'Resgatado', className: 'bg-teal-100 text-teal-800 border-teal-300' },
  { value: 'em_analise', label: 'Em Análise', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'aprovado', label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'reprovado', label: 'Reprovado', className: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'finalizado', label: 'Finalizado', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'marcou_visita', label: 'Marcou Visita', className: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { value: 'comprou', label: 'Comprou', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'nao_comprou', label: 'Não Comprou', className: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'nao_atendeu', label: 'Não Atendeu', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'caixa_postal_bloqueador', label: 'Caixa Postal/Bloqueador', className: 'bg-pink-100 text-pink-800 border-pink-300' },
  { value: 'pediu_contato_vendedor', label: 'Pediu Contato Vendedor', className: 'bg-cyan-100 text-cyan-800 border-cyan-300' }
];
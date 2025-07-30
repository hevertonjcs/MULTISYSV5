import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import FormPage from '@/pages/FormPage';
import AdminDashboard from '@/pages/AdminDashboard';
import SearchModal from '@/components/SearchModal';
import InsightsModal from '@/components/insights/InsightsModal';
import UserManagementModal from '@/components/UserManagementModal';
import SupervisorChatModal from '@/components/SupervisorChatModal';
import RescueModal from '@/components/RescueModal';
import { testConnection, supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { initialFormData } from '@/constants';
import { useDataMigrator } from '@/hooks/useDataMigrator';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userInfo, setUserInfo] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showSupervisorChatModal, setShowSupervisorChatModal] = useState(false);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [logoConfig, setLogoConfig] = useState({
    enabled: false,
    url: '',
    height: 30
  });
  const [editingCadastro, setEditingCadastro] = useState(null);
  const { toast } = useToast();
  const [presenceChannel, setPresenceChannel] = useState(null);

  useDataMigrator(userInfo);

  useEffect(() => {
    const savedLogoConfig = localStorage.getItem('logoConfig');
    if (savedLogoConfig) {
      try {
        setLogoConfig(JSON.parse(savedLogoConfig));
      } catch (error) {
        console.error('Erro ao carregar configurações do logo:', error);
      }
    }
  }, []);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      if (supabase) {
        const connected = await testConnection();
        if (connected) {
          toast({
            title: "Supabase Conectado!",
            description: "Conexão com o banco de dados estabelecida com sucesso.",
            variant: "default",
          });
        }
      } else {
         toast({
            title: "Supabase Não Configurado",
            description: "As credenciais do Supabase não foram carregadas. O app usará localStorage.",
            variant: "destructive",
          });
      }
    };
    checkSupabaseConnection();
  }, [toast]);
  
  useEffect(() => {
    if (!userInfo || (userInfo.tipo_acesso !== 'admin' && !userInfo.permissoes?.pode_ver_chat_supervisores)) {
      return;
    }

    const checkInitialUnreadMessages = async () => {
      const lastSeen = localStorage.getItem('lastSeenChatTimestamp');
      if (!lastSeen) {
        setHasUnreadMessages(true);
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erro ao buscar última mensagem:", error);
        return;
      }

      if (data && data.length > 0) {
        if (new Date(data[0].created_at) > new Date(lastSeen)) {
          setHasUnreadMessages(true);
        }
      }
    };

    checkInitialUnreadMessages();

    const channel = supabase
      .channel('public:chat_messages:app')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
        if (payload.new.sender_name !== userInfo.vendedor) {
            setHasUnreadMessages(true);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };

  }, [userInfo]);

  const handleLogin = (loginData) => {
    const defaultPermissions = {
      pode_ver_todos_cadastros: true,
      pode_ver_cadastros: true,
      pode_ver_insights: false,
      pode_gerenciar_usuarios: false,
      pode_ver_chat_supervisores: false,
      pode_ver_usuarios_ativos: false,
      pode_ver_log_atividades: false,
      pode_usar_funcao_resgate: false,
    };

    let permissions = loginData.permissoes ? { ...defaultPermissions, ...loginData.permissoes } : defaultPermissions;

    if (loginData.tipo_acesso === 'admin') {
      permissions = {
        pode_ver_todos_cadastros: true,
        pode_ver_cadastros: true,
        pode_ver_insights: true,
        pode_gerenciar_usuarios: true,
        pode_ver_chat_supervisores: true,
        pode_ver_usuarios_ativos: true,
        pode_ver_log_atividades: true,
        pode_usar_funcao_resgate: true,
      };
    } else if (loginData.tipo_acesso === 'supervisor') {
      permissions.pode_ver_todos_cadastros = true;
    }


    setUserInfo({ ...loginData, permissoes: permissions });
    setCurrentScreen('admin_dashboard');
    setEditingCadastro(null);

    if (supabase) {
      const channel = supabase.channel('online-users', {
        config: {
          presence: {
            key: loginData.vendedor,
          },
        },
      });

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ 
            online_at: new Date().toISOString(),
            user_name: loginData.vendedor,
            equipe: loginData.equipe,
          });
        }
      });
      setPresenceChannel(channel);
    }
  };

  const handleLogout = () => {
    if (presenceChannel) {
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
      setPresenceChannel(null);
    }
    setUserInfo(null);
    setCurrentScreen('login');
    setEditingCadastro(null);
  };

  const handleShowSearch = () => setShowSearchModal(true);
  const handleShowInsights = () => setShowInsightsModal(true);
  const handleShowUserManagement = () => setShowUserManagementModal(true);
  const handleShowRescueModal = () => setShowRescueModal(true);
  
  const handleShowSupervisorChat = () => {
    setShowSupervisorChatModal(true);
    setHasUnreadMessages(false);
    localStorage.setItem('lastSeenChatTimestamp', new Date().toISOString());
  };

  const handleEditCadastroRequest = useCallback((cadastroData) => {
    const mappedData = {};
    for (const key in initialFormData) {
      if (cadastroData.hasOwnProperty(key)) {
        mappedData[key] = cadastroData[key];
      } else {
        mappedData[key] = initialFormData[key]; 
      }
    }
    
    if (userInfo) {
      mappedData.vendedor = cadastroData.vendedor || userInfo.vendedor;
      mappedData.equipe = cadastroData.equipe || userInfo.equipe;
    }
    
    setEditingCadastro(mappedData);
    setCurrentScreen('form');
    setShowSearchModal(false); 
    toast({ title: "Modo de Edição", description: `Editando cadastro: ${cadastroData.codigo_cadastro || 'Novo Cadastro'}`});
  }, [userInfo, toast]);

  const handleFormSubmissionSuccess = () => {
    setEditingCadastro(null);
    if (userInfo?.tipo_acesso) {
      setCurrentScreen('admin_dashboard');
    }
  };

  const handleNavigateToForm = () => {
    setEditingCadastro(null);
    setCurrentScreen('form');
  };
  
  const handleBackToDashboard = () => {
    setEditingCadastro(null);
    setCurrentScreen('admin_dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'form':
        return (
          <FormPage
            userInfo={userInfo}
            onLogout={handleLogout}
            logoConfig={logoConfig}
            initialDataForEdit={editingCadastro}
            onSubmissionSuccess={handleFormSubmissionSuccess}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'admin_dashboard':
        return (
          <AdminDashboard
            userInfo={userInfo}
            onLogout={handleLogout}
            onShowSearch={handleShowSearch}
            onShowInsights={handleShowInsights}
            onNavigateToForm={handleNavigateToForm}
            onShowUserManagement={handleShowUserManagement}
            onShowSupervisorChat={handleShowSupervisorChat}
            onShowRescueModal={handleShowRescueModal}
            hasUnreadMessages={hasUnreadMessages}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {renderScreen()}

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        logoConfig={logoConfig}
        onEditCadastro={handleEditCadastroRequest}
        userInfo={userInfo}
      />

      <RescueModal
        isOpen={showRescueModal}
        onClose={() => setShowRescueModal(false)}
        userInfo={userInfo}
      />

      <InsightsModal
        isOpen={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
      />

      <UserManagementModal
        isOpen={showUserManagementModal}
        onClose={() => setShowUserManagementModal(false)}
        currentUser={userInfo}
      />
      
      {(userInfo?.tipo_acesso === 'admin' || userInfo?.permissoes?.pode_ver_chat_supervisores) && (
        <SupervisorChatModal
          isOpen={showSupervisorChatModal}
          onClose={() => {
            setShowSupervisorChatModal(false);
            setHasUnreadMessages(false);
            localStorage.setItem('lastSeenChatTimestamp', new Date().toISOString());
          }}
          userInfo={userInfo}
        />
      )}

      <Toaster />
    </main>
  );
};

export default App;
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Search, BarChart2, PlusCircle, Users, MessageSquare, LifeBuoy } from 'lucide-react';
import WelcomeHeader from '@/components/WelcomeHeader';
import ActiveUsersIndicator from '@/components/ActiveUsersIndicator';
import ActivityLogFeed from '@/components/ActivityLogFeed';

const AdminDashboard = ({
  userInfo,
  onLogout,
  onShowSearch,
  onShowInsights,
  onNavigateToForm,
  onShowUserManagement,
  onShowSupervisorChat,
  onShowRescueModal,
  hasUnreadMessages,
}) => {
  const permissions = userInfo?.permissoes || {};
  const isAdmin = userInfo?.tipo_acesso === 'admin';

  const canViewInsights = isAdmin || permissions.pode_ver_insights;
  const canManageUsers = isAdmin || permissions.pode_gerenciar_usuarios;
  const canViewChat = isAdmin || permissions.pode_ver_chat_supervisores;
  const canViewActiveUsers = isAdmin || permissions.pode_ver_usuarios_ativos;
  const canViewActivityLog = isAdmin || permissions.pode_ver_log_atividades;
  const canUseRescueFunction = isAdmin || permissions.pode_usar_funcao_resgate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40 text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <WelcomeHeader userInfo={userInfo} />
          <div className="flex items-center gap-2">
            <Button onClick={onLogout} variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardButton
              icon={<PlusCircle />}
              label="Novo Cadastro"
              onClick={onNavigateToForm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
            <DashboardButton
              icon={<Search />}
              label="Pesquisar Cadastros"
              onClick={onShowSearch}
            />
            {canViewInsights && (
              <DashboardButton
                icon={<BarChart2 />}
                label="Ver Insights"
                onClick={onShowInsights}
              />
            )}
            {canManageUsers && (
              <DashboardButton
                icon={<Users />}
                label="Gerenciar Usuários"
                onClick={onShowUserManagement}
              />
            )}
            {canViewChat && (
              <DashboardButton
                icon={<MessageSquare />}
                label="Chat Supervisores"
                onClick={onShowSupervisorChat}
                hasNotification={hasUnreadMessages}
              />
            )}
            {canUseRescueFunction && (
              <DashboardButton
                icon={<LifeBuoy />}
                label="Função Resgate"
                onClick={onShowRescueModal}
                className="bg-amber-500 text-amber-foreground hover:bg-amber-500/90"
              />
            )}
          </section>

          {(canViewActiveUsers || canViewActivityLog) && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {canViewActiveUsers && (
                <div className="lg:col-span-1">
                  <ActiveUsersIndicator />
                </div>
              )}
              {canViewActivityLog && (
                <div className={canViewActiveUsers ? "lg:col-span-2" : "lg:col-span-3"}>
                  <ActivityLogFeed userInfo={userInfo} />
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const DashboardButton = ({ icon, label, onClick, className = '', hasNotification = false }) => (
  <Button
    onClick={onClick}
    className={`w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2 transition-transform transform hover:scale-105 relative ${className}`}
    variant={className ? 'default' : 'outline'}
  >
    {hasNotification && (
      <span className="absolute top-2 right-2 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    )}
    {icon}
    <span>{label}</span>
  </Button>
);

export default AdminDashboard;
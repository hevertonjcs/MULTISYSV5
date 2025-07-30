import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Edit, Users, X, ShieldCheck } from 'lucide-react';

const UserManagementModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  const defaultPermissions = {
    pode_ver_cadastros: false,
    pode_ver_todos_cadastros: false,
    pode_ver_insights: false,
    pode_gerenciar_usuarios: false,
    pode_ver_chat_supervisores: false,
    pode_ver_usuarios_ativos: false,
    pode_ver_log_atividades: false,
    pode_usar_funcao_resgate: false,
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data.map(u => ({...u, permissoes: { ...defaultPermissions, ...u.permissoes } })));
    } catch (error) {
      toast({ title: "Erro ao buscar usuários", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({ nome_usuario: '', senha: '', tipo_acesso: 'vendedor', equipe: '', permissoes: defaultPermissions });
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser({ ...user, permissoes: { ...defaultPermissions, ...user.permissoes } });
    setIsFormOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const { error } = await supabase.from('usuarios').delete().eq('id', userId);
      if (error) throw error;
      toast({ title: "Usuário excluído com sucesso!", variant: "default" });
      fetchUsers();
    } catch (error) {
      toast({ title: "Erro ao excluir usuário", description: error.message, variant: "destructive" });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser.nome_usuario || (!isEditing && !currentUser.senha) || !currentUser.tipo_acesso) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, senha (para novos) e tipo de acesso.", variant: "destructive" });
      return;
    }

    const userData = {
      nome_usuario: currentUser.nome_usuario,
      tipo_acesso: currentUser.tipo_acesso,
      equipe: currentUser.tipo_acesso === 'admin' ? 'SUPERVISOR' : currentUser.equipe,
      permissoes: currentUser.tipo_acesso === 'admin' 
        ? { 
            pode_ver_cadastros: true, 
            pode_ver_todos_cadastros: true,
            pode_ver_insights: true,
            pode_gerenciar_usuarios: true,
            pode_ver_chat_supervisores: true,
            pode_ver_usuarios_ativos: true,
            pode_ver_log_atividades: true,
            pode_usar_funcao_resgate: true,
          } 
        : currentUser.permissoes,
    };
    
    if (currentUser.senha) {
        userData.senha = currentUser.senha;
    }

    try {
      let error;
      if (isEditing) {
        ({ error } = await supabase.from('usuarios').update(userData).eq('id', currentUser.id));
      } else {
        ({ error } = await supabase.from('usuarios').insert([userData]));
      }
      if (error) throw error;
      toast({ title: `Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso!`, variant: "default" });
      setIsFormOpen(false);
      fetchUsers();
    } catch (error) {
      toast({ title: `Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário`, description: error.message, variant: "destructive" });
    }
  };

  const handlePermissionChange = (permission, value) => {
    setCurrentUser(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [permission]: value
      }
    }));
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-card border-border p-6 rounded-lg shadow-xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2 text-xl md:text-2xl">
            <Users className="w-6 h-6" />
            Gerenciamento de Usuários
          </DialogTitle>
          <DialogDescription>
            Crie, edite ou remova usuários e defina suas permissões.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          <AnimatePresence>
            {isFormOpen ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border rounded-lg bg-background mt-4"
              >
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <h3 className="text-lg font-semibold">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome_usuario">Nome de Usuário</Label>
                      <Input id="nome_usuario" value={currentUser?.nome_usuario || ''} onChange={(e) => setCurrentUser({ ...currentUser, nome_usuario: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="senha">Senha</Label>
                      <Input id="senha" type="password" onChange={(e) => setCurrentUser({ ...currentUser, senha: e.target.value })} placeholder={isEditing ? 'Deixe em branco para não alterar' : 'Defina uma senha'} />
                    </div>
                    <div>
                      <Label htmlFor="tipo_acesso">Tipo de Acesso</Label>
                      <Select value={currentUser?.tipo_acesso || 'vendedor'} onValueChange={(value) => setCurrentUser({ ...currentUser, tipo_acesso: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Supervisor (Admin)</SelectItem>
                          <SelectItem value="vendedor">Vendedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {currentUser?.tipo_acesso === 'vendedor' && (
                      <div>
                        <Label htmlFor="equipe">Equipe</Label>
                        <Input id="equipe" value={currentUser?.equipe || ''} onChange={(e) => setCurrentUser({ ...currentUser, equipe: e.target.value })} />
                      </div>
                    )}
                  </div>

                  {currentUser?.tipo_acesso === 'vendedor' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Permissões</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_cadastros" className="cursor-pointer">Pesquisar Cadastros</Label>
                          <Switch id="pode_ver_cadastros" checked={currentUser.permissoes?.pode_ver_cadastros} onCheckedChange={(checked) => handlePermissionChange('pode_ver_cadastros', checked)} />
                        </div>
                         <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_todos_cadastros" className="cursor-pointer">Ver Todos Cadastros</Label>
                          <Switch id="pode_ver_todos_cadastros" checked={currentUser.permissoes?.pode_ver_todos_cadastros} onCheckedChange={(checked) => handlePermissionChange('pode_ver_todos_cadastros', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_usar_funcao_resgate" className="cursor-pointer">Acessar Função Resgate</Label>
                          <Switch id="pode_usar_funcao_resgate" checked={currentUser.permissoes?.pode_usar_funcao_resgate} onCheckedChange={(checked) => handlePermissionChange('pode_usar_funcao_resgate', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_insights" className="cursor-pointer">Ver Insights</Label>
                          <Switch id="pode_ver_insights" checked={currentUser.permissoes?.pode_ver_insights} onCheckedChange={(checked) => handlePermissionChange('pode_ver_insights', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_gerenciar_usuarios" className="cursor-pointer">Gerenciar Usuários</Label>
                          <Switch id="pode_gerenciar_usuarios" checked={currentUser.permissoes?.pode_gerenciar_usuarios} onCheckedChange={(checked) => handlePermissionChange('pode_gerenciar_usuarios', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_chat_supervisores" className="cursor-pointer">Ver Chat Supervisores</Label>
                          <Switch id="pode_ver_chat_supervisores" checked={currentUser.permissoes?.pode_ver_chat_supervisores} onCheckedChange={(checked) => handlePermissionChange('pode_ver_chat_supervisores', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_usuarios_ativos" className="cursor-pointer">Ver Usuários Ativos</Label>
                          <Switch id="pode_ver_usuarios_ativos" checked={currentUser.permissoes?.pode_ver_usuarios_ativos} onCheckedChange={(checked) => handlePermissionChange('pode_ver_usuarios_ativos', checked)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pode_ver_log_atividades" className="cursor-pointer">Ver Log de Atividades</Label>
                          <Switch id="pode_ver_log_atividades" checked={currentUser.permissoes?.pode_ver_log_atividades} onCheckedChange={(checked) => handlePermissionChange('pode_ver_log_atividades', checked)} />
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                    <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
                  </DialogFooter>
                </form>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="my-4">
                  <Button onClick={handleAddNew}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Novo Usuário
                  </Button>
                </div>
                {isLoading ? (
                  <p>Carregando usuários...</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold">{user.nome_usuario}</p>
                          <p className="text-sm text-muted-foreground">{user.tipo_acesso === 'admin' ? 'Supervisor' : `Vendedor - Equipe: ${user.equipe}`}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {!isFormOpen && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementModal;
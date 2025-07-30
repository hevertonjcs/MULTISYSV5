import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SupervisorChatModal = ({ isOpen, onClose, userInfo }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      const fetchMessages = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          toast({ title: "Erro ao carregar mensagens", description: error.message, variant: "destructive" });
        } else {
          setMessages(data);
        }
        setIsLoading(false);
      };
      fetchMessages();

      const channel = supabase
        .channel('public:chat_messages:modal')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
           setMessages((currentMessages) => [...currentMessages, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userInfo?.vendedor) return;

    setIsSending(true);
    const { error } = await supabase
      .from('chat_messages')
      .insert([{ message: newMessage, sender_name: userInfo.vendedor }]);

    setIsSending(false);
    if (error) {
      toast({ title: "Erro ao enviar mensagem", description: error.message, variant: "destructive" });
    } else {
      setNewMessage('');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Tem certeza que deseja apagar todo o histórico de mensagens? Esta ação não pode ser desfeita.")) {
      return;
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); 

    if (error) {
      toast({ title: "Erro ao limpar histórico", description: error.message, variant: "destructive" });
    } else {
      setMessages([]);
      toast({ title: "Histórico de mensagens apagado!", variant: "default" });
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] h-[80vh] bg-card border-border p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-card-foreground flex items-center gap-2 text-xl">
            <MessageSquare className="w-6 h-6 text-primary" />
            Chat de Supervisores
          </DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            Comunicação em tempo real para a equipe.
            <Button variant="destructive" size="sm" onClick={handleClearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Histórico
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => {
                 const isCurrentUser = msg.sender_name === userInfo?.vendedor;
                 return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex flex-col mb-4 ${isCurrentUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-3 rounded-lg max-w-sm ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {!isCurrentUser && <p className="font-bold text-sm mb-1">{msg.sender_name}</p>}
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-2 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(msg.created_at)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        <DialogFooter className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              autoComplete="off"
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending || !newMessage.trim()}>
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorChatModal;
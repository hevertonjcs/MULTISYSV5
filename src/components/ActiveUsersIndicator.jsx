import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveUsersIndicator = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: '', // A chave aqui é opcional, pois estamos apenas lendo
        },
      },
    });

    const updateUsers = () => {
      const presenceState = channel.presenceState();
      const users = Object.keys(presenceState)
        .map(key => {
          const presences = presenceState[key];
          return presences.length > 0 ? presences[0] : null;
        })
        .filter(user => user !== null);
      setActiveUsers(users);
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        updateUsers();
      })
      .on('presence', { event: 'join' }, () => {
        setTimeout(updateUsers, 100); // Pequeno delay para garantir que o estado seja propagado
      })
      .on('presence', { event: 'leave' }, () => {
        updateUsers();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          updateUsers(); // Garante que a lista seja carregada na inscrição inicial
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-card-foreground">
          <Users className="w-6 h-6 mr-3 text-primary" />
          Usuários Ativos ({activeUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence>
            {activeUsers.length > 0 ? (
              activeUsers.map((user, index) => (
                <motion.div
                  key={user.user_name || index}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center p-2 rounded-lg bg-background/50"
                >
                  <div className="relative mr-3">
                    <User className="w-8 h-8 text-muted-foreground" />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{user.user_name}</p>
                    <p className="text-xs text-muted-foreground">{user.equipe || 'Sem equipe'}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                <p>Nenhum usuário ativo no momento.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersIndicator;
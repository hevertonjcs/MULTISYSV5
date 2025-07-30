import React from 'react';
import { motion } from 'framer-motion';

const WelcomeHeader = ({ userInfo }) => {
  const userName = userInfo?.vendedor || 'Usuário';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-lg md:text-xl"
    >
      <span className="font-light text-muted-foreground">Bem-vindo(a),</span>
      <span className="font-bold text-primary ml-2">{userName}</span>
    </motion.div>
  );
};

export default WelcomeHeader;
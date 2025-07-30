// CÓDIGO OMITIDO PARA FOCO - trecho alterado abaixo substitui o botão WhatsApp original

{item.telefone && (
  <Button asChild variant="outline" size="sm" className="border-green-500/70 text-green-600 hover:bg-green-500/10">
    <a
      href={(() => {
        const cleaned = item.telefone.replace(/\D/g, '');
        const nome = encodeURIComponent(item.nome_completo || '');
        const vendedor = encodeURIComponent(item.vendedor || '');
        const data = item.data_cadastro ? new Date(item.data_cadastro).toLocaleDateString('pt-BR') : '';
        const status = encodeURIComponent(item.status_cliente || '');
        const msg = \`Olá \${nome}, estamos entrando em contato referente ao seu cadastro que está em nosso sistema. Você montou um cadastro com o vendedor \${vendedor} no dia \${data} e verifiquei aqui no sistema que o status está como \${status}.\`;
        return \`https://api.whatsapp.com/send?phone=55\${cleaned}&text=\${msg}\`;
      })()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageSquareText className="w-4 h-4 mr-2" /> WhatsApp
    </a>
  </Button>
)}
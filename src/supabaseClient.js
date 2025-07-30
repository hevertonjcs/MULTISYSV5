import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast'; 

const supabaseUrlFromEnv = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKeyFromEnv = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use as credenciais fornecidas pelo sistema (via <supabase_credentials>)
const systemSupabaseUrl = 'https://bfxamibaxsyxltqkiftd.supabase.co';
const systemSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeGFtaWJheHN5eGx0cWtpZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODQ4MTMsImV4cCI6MjA2NDk2MDgxM30.Yr3tTDElbMAewKq-MqBFeh6PG11N48ruy-xbUOa1EUQ';

// Prefer values provided via environment variables (Vercel/Vite) if set.
// Fallback to the hard‑coded credentials as a last resort.  This allows
// overriding Supabase credentials in deployment environments (e.g. Vercel)
// without modifying source code.
const supabaseUrlToUse = supabaseUrlFromEnv || systemSupabaseUrl;
const supabaseAnonKeyToUse = supabaseAnonKeyFromEnv || systemSupabaseAnonKey;

let supabaseInstance = null;

if (supabaseUrlToUse && supabaseAnonKeyToUse) {
  try {
    supabaseInstance = createClient(supabaseUrlToUse, supabaseAnonKeyToUse, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    console.log("Cliente Supabase inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o cliente Supabase:", error);
    supabaseInstance = null;
     toast({
      title: "Erro Supabase",
      description: "Falha ao inicializar cliente Supabase. Verifique o console.",
      variant: "destructive",
    });
  }
} else {
  console.warn("Credenciais do Supabase não fornecidas. A aplicação usará localStorage.");
}

export const supabase = supabaseInstance;

export const testConnection = async () => {
  if (!supabase) {
    console.warn("Supabase não conectado, teste de conexão ignorado.");
    return false;
  }
  try {
    const { error } = await supabase.from('usuarios').select('id', { count: 'exact', head: true });
    
    if (error) { 
      // Se for erro de fetch, mostra uma mensagem mais amigável.
      if (error.message.includes('Failed to fetch')) {
        console.error('Falha de rede ao conectar com Supabase:', error);
        toast({
          title: "Erro de Conexão de Rede",
          description: "Não foi possível conectar ao servidor. Verifique sua internet.",
          variant: "destructive",
        });
      } else {
        console.error('Erro no teste de conexão com Supabase:', error);
        toast({
          title: "Erro de Conexão Supabase",
          description: `Falha ao testar conexão: ${error.message}`,
          variant: "destructive",
        });
      }
      return false;
    }
    
    console.log('Conexão com Supabase testada com sucesso!');
    return true;
  } catch (error) {
    console.error('Exceção no teste de conexão com Supabase:', error);
    toast({
      title: "Erro Crítico Supabase",
      description: "Exceção durante o teste de conexão. Verifique o console.",
      variant: "destructive",
    });
    return false;
  }
};
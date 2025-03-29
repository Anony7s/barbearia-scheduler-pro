
import { supabase } from "./client";

// Função para verificar se já existe um administrador
export const checkAndCreateAdminUser = async (email: string, password: string, name: string) => {
  try {
    // Verificar se já existe algum usuário
    const { data: existingUsers, error: countError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    
    if (countError) {
      console.error('Erro ao verificar administradores:', countError);
      return;
    }
    
    // Se já existir um administrador, não fazer nada
    if (existingUsers && existingUsers.length > 0) {
      console.log('Já existe um administrador no sistema.');
      return;
    }
    
    // Criar o primeiro usuário administrador
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'admin'
        }
      }
    });
    
    if (error) {
      console.error('Erro ao criar administrador:', error);
      return;
    }
    
    console.log('Administrador criado com sucesso:', data);
    
  } catch (error) {
    console.error('Erro ao configurar administrador:', error);
  }
};

// Esta função pode ser chamada no main.tsx ou outro local apropriado durante a inicialização

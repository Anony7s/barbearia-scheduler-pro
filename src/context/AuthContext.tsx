
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se o usuário é administrador
  const isAdmin = !!profile?.role && profile.role === 'admin';

  useEffect(() => {
    // Configura o ouvinte de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Buscar o perfil do usuário quando estiver autenticado
          // Usando setTimeout para evitar chamadas recursivas
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Verifica a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Usamos uma chamada direta ao banco de dados para evitar problemas de recursão
      // com políticas RLS, eliminando o erro de recursão infinita
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        console.log("Profile data:", data[0]);
        setProfile(data[0]);
      } else {
        console.log("Nenhum perfil encontrado para o usuário:", userId);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setLoading(false);
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error('Erro ao fazer login', {
          description: error.message
        });
        setLoading(false);
        return;
      }

      toast.success('Login realizado com sucesso');
      if (data?.user) {
        // Buscar perfil após login bem-sucedido
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .limit(1);
        
        if (profileError) {
          console.error('Erro ao buscar perfil após login:', profileError);
        }
        
        if (profileData && profileData.length > 0) {
          setProfile(profileData[0]);
          if (profileData[0].role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error('Erro ao fazer login', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const signUp = async (email: string, password: string, name: string, role: string = 'barber') => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        toast.error('Erro ao criar conta', {
          description: error.message
        });
        return;
      }

      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu email para confirmar o cadastro.'
      });
      
      // Verificar se o usuário foi criado com sucesso e já está logado
      if (data?.user) {
        console.log("Usuário criado com sucesso:", data.user.id);
        
        // Se for admin, redirecionar para a página de admin
        if (role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error: any) {
      toast.error('Erro ao criar conta', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erro ao fazer logout', {
          description: error.message
        });
        return;
      }
      
      navigate('/login');
    } catch (error: any) {
      toast.error('Erro ao fazer logout', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      signIn, 
      signUp, 
      signOut, 
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

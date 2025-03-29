
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
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Buscar o perfil do usuário quando estiver autenticado
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
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error('Erro ao fazer login', {
          description: error.message
        });
        return;
      }

      toast.success('Login realizado com sucesso');
      navigate('/admin');
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
      const { error } = await supabase.auth.signUp({ 
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

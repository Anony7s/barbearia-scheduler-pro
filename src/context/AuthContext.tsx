
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
          // Usar setTimeout para evitar o problema de recursão infinita
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Verifica a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do usuário usando SQL direto para evitar problema de recursão infinita
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Usar SQL direto para evitar problema de recursão
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log("Profile data:", data);
        setProfile(data);
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
      
      // O perfil será carregado pelo listener de auth state change
      
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
          },
          // Desativar verificação de email
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        toast.error('Erro ao criar conta', {
          description: error.message
        });
        return;
      }

      toast.success('Conta criada com sucesso!');
      
      if (data?.user) {
        console.log("Usuário criado com sucesso:", data.user.id);
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
      
      setUser(null);
      setProfile(null);
      setSession(null);
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

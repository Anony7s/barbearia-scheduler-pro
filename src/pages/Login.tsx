
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Scissors, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { signIn, signUp, loading, user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Estado para o cadastro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  // Efeito para verificar login e redirecionar
  useEffect(() => {
    console.log("Login page - user:", user?.id);
    console.log("Login page - profile:", profile);
    
    if (user) {
      if (profile?.role === 'admin') {
        console.log("Redirecting to /admin");
        navigate('/admin');
      } else if (profile) {
        console.log("Redirecting to /");
        navigate('/');
      }
    }
  }, [user, profile, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    await signIn(email, password);
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName || !registerConfirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      await signUp(registerEmail, registerPassword, registerName);
      
      // Limpa os campos após o cadastro
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      setRegisterConfirmPassword('');
      
      // Muda para a aba de login
      document.getElementById('login-tab')?.click();
      
      toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
    } catch (error: any) {
      toast.error('Erro ao criar conta', {
        description: error.message
      });
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Preencha o campo de email');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      
      if (error) throw error;
      
      // Limpa o campo após enviar
      setResetEmail('');
      
      toast.success('Link de recuperação enviado para seu email');
    } catch (error: any) {
      toast.error('Erro ao resetar senha', {
        description: error.message
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-barber-primary rounded-full flex items-center justify-center">
              <Scissors className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold">Barber Shop Pro</h1>
          <p className="mt-2 text-gray-600">Acesso para profissionais da barbearia</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger id="login-tab" value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
            <TabsTrigger value="reset">Recuperar Senha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Digite suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="nome@barbershoppro.com"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-barber-secondary hover:bg-barber-accent flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Cadastro
                </CardTitle>
                <CardDescription>
                  Crie uma nova conta para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <Input
                      id="register-name"
                      placeholder="Seu nome completo"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      placeholder="nome@barbershoppro.com"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">A senha deve ter pelo menos 6 caracteres</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-barber-secondary hover:bg-barber-accent flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <UserPlus className="h-5 w-5" />
                    {loading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Recuperação de Senha</CardTitle>
                <CardDescription>
                  Insira seu email para receber um link de recuperação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      placeholder="nome@barbershoppro.com"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-barber-secondary hover:bg-barber-accent"
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-barber-secondary hover:text-barber-accent text-sm">
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

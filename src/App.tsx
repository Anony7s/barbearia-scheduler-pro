
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Agendar from "./pages/Agendar";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Se estiver carregando, não faz nada ainda
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Wrapper do AuthProvider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

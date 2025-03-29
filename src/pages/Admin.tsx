
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CreditCard, Users, Settings, LogOut, BarChart3, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarFooter } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AppointmentList from '@/components/admin/AppointmentList';
import ScheduleEditor from '@/components/admin/ScheduleEditor';
import UserManagement from '@/components/admin/UserManagement';
import Reports from '@/components/admin/Reports';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  
  const handleLogout = () => {
    // This would be a call to your Supabase auth logout
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-barber-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BP</span>
              </div>
              <h1 className="text-lg font-serif font-semibold">Barber Pro</h1>
            </div>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton active={activeTab === "appointments"} onClick={() => setActiveTab("appointments")}>
                      <CalendarDays className="h-5 w-5 mr-2" />
                      <span>Agendamentos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton active={activeTab === "schedule"} onClick={() => setActiveTab("schedule")}>
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Horários</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton active={activeTab === "users"} onClick={() => setActiveTab("users")}>
                      <Users className="h-5 w-5 mr-2" />
                      <span>Usuários</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>
                      <BarChart3 className="h-5 w-5 mr-2" />
                      <span>Relatórios</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Configurações</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-5 w-5 mr-2" />
                      <span>Configurações</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Sair</span>
              </Button>
            </SidebarFooter>
          </div>
        </Sidebar>
        
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold">
                {activeTab === "appointments" && "Agendamentos"}
                {activeTab === "schedule" && "Gerenciamento de Horários"}
                {activeTab === "users" && "Gerenciamento de Usuários"}
                {activeTab === "reports" && "Relatórios"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "appointments" && "Visualize e gerencie os agendamentos dos clientes"}
                {activeTab === "schedule" && "Configure os horários disponíveis para agendamento"}
                {activeTab === "users" && "Gerencie os usuários do sistema"}
                {activeTab === "reports" && "Visualize relatórios sobre os atendimentos"}
              </p>
            </div>
            
            <SidebarTrigger />
          </div>
          
          {/* Content based on active tab */}
          {activeTab === "appointments" && <AppointmentList />}
          {activeTab === "schedule" && <ScheduleEditor />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "reports" && <Reports />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Download, BarChart2 } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const mockDailyData = [
  { day: 'Seg', appointments: 12, revenue: 720 },
  { day: 'Ter', appointments: 15, revenue: 900 },
  { day: 'Qua', appointments: 10, revenue: 600 },
  { day: 'Qui', appointments: 14, revenue: 840 },
  { day: 'Sex', appointments: 18, revenue: 1080 },
  { day: 'Sáb', appointments: 20, revenue: 1200 },
  { day: 'Dom', appointments: 0, revenue: 0 },
];

const mockServiceData = [
  { name: 'Corte Tradicional', value: 45 },
  { name: 'Barba Completa', value: 25 },
  { name: 'Corte + Barba', value: 30 },
  { name: 'Acabamento', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState('daily');
  
  // Handle report date filter
  const today = new Date();
  const handleDateFilterChange = (value: string) => {
    switch (value) {
      case 'today':
        setDateRange({ from: today, to: today });
        break;
      case 'week':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case 'month':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case 'custom':
        // Keep current custom range
        break;
    }
  };
  
  const handleDateRangeSelect = (range: { from: Date; to: Date | undefined }) => {
    setDateRange(range);
  };
  
  // Format for date display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    
    if (dateRange.from) {
      return format(dateRange.from, 'dd/MM/yyyy');
    }
    
    return 'Selecione um período';
  };
  
  // Mock function to export reports
  const exportReport = () => {
    alert('Relatório exportado com sucesso!');
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Relatórios de Atendimento</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select defaultValue="month" onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    locale={ptBR}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Total de Atendimentos</p>
                      <div className="text-3xl font-bold">89</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Faturamento Total</p>
                      <div className="text-3xl font-bold">R$ 5.340</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Média por Dia</p>
                      <div className="text-3xl font-bold">12.7</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockDailyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="appointments" name="Agendamentos" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Faturamento (R$)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockServiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockServiceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} agendamentos`, 'Quantidade']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Detalhamento por Serviço</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Serviço</th>
                        <th className="text-right py-2">Agendamentos</th>
                        <th className="text-right py-2">Faturamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">Corte Tradicional</td>
                        <td className="text-right">45</td>
                        <td className="text-right">R$ 1.800</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Barba Completa</td>
                        <td className="text-right">25</td>
                        <td className="text-right">R$ 875</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Corte + Barba</td>
                        <td className="text-right">30</td>
                        <td className="text-right">R$ 1.950</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Acabamento</td>
                        <td className="text-right">10</td>
                        <td className="text-right">R$ 250</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="py-3">Total</td>
                        <td className="text-right">110</td>
                        <td className="text-right">R$ 4.875</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Data</th>
                      <th className="text-left py-3">Cliente</th>
                      <th className="text-left py-3">Serviço</th>
                      <th className="text-left py-3">Barbeiro</th>
                      <th className="text-right py-3">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">15/07/2023</td>
                      <td className="py-3">João Silva</td>
                      <td className="py-3">Corte Tradicional</td>
                      <td className="py-3">Pedro Barbeiro</td>
                      <td className="text-right py-3">R$ 40</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">15/07/2023</td>
                      <td className="py-3">Pedro Oliveira</td>
                      <td className="py-3">Barba Completa</td>
                      <td className="py-3">João Barbeiro</td>
                      <td className="text-right py-3">R$ 35</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">16/07/2023</td>
                      <td className="py-3">Carlos Santos</td>
                      <td className="py-3">Corte + Barba</td>
                      <td className="py-3">Pedro Barbeiro</td>
                      <td className="text-right py-3">R$ 65</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">16/07/2023</td>
                      <td className="py-3">Marcos Pereira</td>
                      <td className="py-3">Corte Tradicional</td>
                      <td className="py-3">João Barbeiro</td>
                      <td className="text-right py-3">R$ 40</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">17/07/2023</td>
                      <td className="py-3">Lucas Ferreira</td>
                      <td className="py-3">Acabamento</td>
                      <td className="py-3">Pedro Barbeiro</td>
                      <td className="text-right py-3">R$ 25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;

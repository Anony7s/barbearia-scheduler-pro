
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Trash2, X, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments
const mockAppointments = [
  { 
    id: 1, 
    customerName: 'João Silva', 
    customerPhone: '(11) 99999-9999',
    customerEmail: 'joao@example.com',
    date: new Date(2023, 6, 15, 10, 30),
    service: 'Corte Tradicional',
    status: 'confirmed'
  },
  { 
    id: 2, 
    customerName: 'Pedro Oliveira', 
    customerPhone: '(11) 88888-8888',
    customerEmail: 'pedro@example.com',
    date: new Date(2023, 6, 15, 14, 0),
    service: 'Barba Completa',
    status: 'confirmed'
  },
  { 
    id: 3, 
    customerName: 'Carlos Santos', 
    customerPhone: '(11) 77777-7777',
    customerEmail: 'carlos@example.com',
    date: new Date(2023, 6, 16, 11, 0),
    service: 'Corte + Barba',
    status: 'cancelled'
  },
  { 
    id: 4, 
    customerName: 'Marcos Pereira', 
    customerPhone: '(11) 66666-6666',
    customerEmail: 'marcos@example.com',
    date: new Date(2023, 6, 16, 16, 30),
    service: 'Corte Tradicional',
    status: 'pending'
  },
  { 
    id: 5, 
    customerName: 'Lucas Ferreira', 
    customerPhone: '(11) 55555-5555',
    customerEmail: 'lucas@example.com',
    date: new Date(2023, 6, 17, 9, 0),
    service: 'Acabamento',
    status: 'confirmed'
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'confirmed') {
    return <Badge className="bg-green-500">Confirmado</Badge>;
  } else if (status === 'pending') {
    return <Badge className="bg-yellow-500">Pendente</Badge>;
  } else if (status === 'cancelled') {
    return <Badge className="bg-red-500">Cancelado</Badge>;
  }
  return null;
};

const AppointmentList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState(mockAppointments);
  
  // Filter appointments based on search term and status filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    ));
    
    toast({
      title: "Status atualizado",
      description: `O status do agendamento foi alterado para ${newStatus === 'confirmed' ? 'confirmado' : newStatus === 'cancelled' ? 'cancelado' : 'pendente'}.`,
    });
  };
  
  const confirmDelete = () => {
    if (deleteId) {
      setAppointments(appointments.filter(appointment => appointment.id !== deleteId));
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido com sucesso.",
      });
      
      setDeleteId(null);
    }
  };
  
  return (
    <div>
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhum agendamento encontrado.
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{appointment.customerName}</h3>
                        <div className="text-sm text-gray-500">{appointment.customerEmail} | {appointment.customerPhone}</div>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Data:</span>
                        <span>{format(appointment.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Horário:</span>
                        <span>{format(appointment.date, 'HH:mm')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Serviço:</span>
                        <span>{appointment.service}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col border-t md:border-t-0 md:border-l border-gray-200">
                    {appointment.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="flex-1 flex items-center justify-center p-4 hover:bg-green-50 transition-colors"
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </button>
                    )}
                    
                    {appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center p-4 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setDeleteId(appointment.id)}
                      className="flex-1 flex items-center justify-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentList;


import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 20; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (!(hour === 19 && min === 30)) { // Skip 19:30 as the shop closes at 20:00
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Mock data for available slots
const initialAvailableSlots = [
  { day: new Date(), timeSlot: '09:00' },
  { day: new Date(), timeSlot: '10:00' },
  { day: new Date(), timeSlot: '11:00' },
  { day: new Date(), timeSlot: '14:00' },
  { day: new Date(), timeSlot: '15:00' },
  { day: new Date(), timeSlot: '16:00' },
  { day: addDays(new Date(), 1), timeSlot: '10:00' },
  { day: addDays(new Date(), 1), timeSlot: '11:00' },
  { day: addDays(new Date(), 1), timeSlot: '15:00' },
  { day: addDays(new Date(), 2), timeSlot: '09:00' },
  { day: addDays(new Date(), 2), timeSlot: '10:00' },
  { day: addDays(new Date(), 2), timeSlot: '11:00' },
  { day: addDays(new Date(), 2), timeSlot: '14:00' },
];

const ScheduleEditor = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState(initialAvailableSlots);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState<Date | null>(null);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [bulkSelectedTime, setBulkSelectedTime] = useState('');
  
  // Get current week days
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: addDays(startOfCurrentWeek, 6) // Monday to Sunday
  });
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => setCurrentDate(addWeeks(currentDate, -1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  
  // Format date as string for comparison
  const formatDateForComparison = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // Check if a slot is available
  const isSlotAvailable = (day: Date, timeSlot: string) => {
    return availableSlots.some(
      slot => 
        formatDateForComparison(slot.day) === formatDateForComparison(day) && 
        slot.timeSlot === timeSlot
    );
  };
  
  // Add a new available slot
  const addAvailableSlot = () => {
    if (!newSlotDay || !newSlotTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um dia e horário.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the slot already exists
    if (isSlotAvailable(newSlotDay, newSlotTime)) {
      toast({
        title: "Erro",
        description: "Este horário já está disponível.",
        variant: "destructive",
      });
      return;
    }
    
    setAvailableSlots([...availableSlots, { day: newSlotDay, timeSlot: newSlotTime }]);
    
    toast({
      title: "Horário adicionado",
      description: `Horário ${newSlotTime} adicionado para ${format(newSlotDay, 'dd/MM/yyyy', { locale: ptBR })}.`,
    });
    
    setIsAddingSlot(false);
    setNewSlotDay(null);
    setNewSlotTime('');
  };
  
  // Remove an available slot
  const removeAvailableSlot = (day: Date, timeSlot: string) => {
    setAvailableSlots(availableSlots.filter(
      slot => 
        !(formatDateForComparison(slot.day) === formatDateForComparison(day) && slot.timeSlot === timeSlot)
    ));
    
    toast({
      title: "Horário removido",
      description: `Horário ${timeSlot} removido de ${format(day, 'dd/MM/yyyy', { locale: ptBR })}.`,
    });
  };
  
  // Add bulk available slots
  const addBulkAvailableSlots = () => {
    if (Object.keys(selectedDays).length === 0 || !bulkSelectedTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos um dia e um horário.",
        variant: "destructive",
      });
      return;
    }
    
    const newSlots = [...availableSlots];
    let addedCount = 0;
    
    daysOfWeek.forEach(day => {
      const dateKey = formatDateForComparison(day);
      if (selectedDays[dateKey]) {
        // Check if the slot already exists
        if (!isSlotAvailable(day, bulkSelectedTime)) {
          newSlots.push({ day, timeSlot: bulkSelectedTime });
          addedCount++;
        }
      }
    });
    
    setAvailableSlots(newSlots);
    
    if (addedCount > 0) {
      toast({
        title: "Horários adicionados",
        description: `${addedCount} horários adicionados com sucesso.`,
      });
    } else {
      toast({
        title: "Informação",
        description: "Nenhum novo horário adicionado. Todos já existiam.",
      });
    }
    
    // Reset selections
    setSelectedDays({});
    setBulkSelectedTime('');
  };
  
  // Toggle day selection for bulk adding
  const toggleDaySelection = (day: Date) => {
    const dateKey = formatDateForComparison(day);
    setSelectedDays(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(startOfCurrentWeek, "dd/MM/yyyy", { locale: ptBR })} - {format(addDays(startOfCurrentWeek, 6), "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
          <DialogTrigger asChild>
            <Button className="bg-barber-secondary hover:bg-barber-accent">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Horário</DialogTitle>
              <DialogDescription>
                Selecione o dia e o horário que você deseja adicionar à agenda.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dia</label>
                <Select onValueChange={(value) => setNewSlotDay(new Date(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day, index) => (
                      <SelectItem key={index} value={day.toISOString()}>
                        {format(day, 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <Select onValueChange={setNewSlotTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                Cancelar
              </Button>
              <Button onClick={addAvailableSlot} className="bg-barber-secondary hover:bg-barber-accent">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {daysOfWeek.map((day, index) => {
          // Filter slots for this day
          const daySlots = availableSlots.filter(
            slot => formatDateForComparison(slot.day) === formatDateForComparison(day)
          ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
          
          return (
            <Card key={index} className={day.getDay() === 0 ? 'bg-gray-50' : ''}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">
                  {format(day, 'EEEE', { locale: ptBR })}
                  <div className="text-sm font-normal text-gray-500">
                    {format(day, 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {day.getDay() === 0 ? (
                  <p className="text-sm text-gray-500 italic">Fechado</p>
                ) : daySlots.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Nenhum horário disponível</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                        <span>{slot.timeSlot}</span>
                        <button 
                          onClick={() => removeAvailableSlot(day, slot.timeSlot)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Horários em Massa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Selecione os dias:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {daysOfWeek.map((day, index) => (
                  day.getDay() !== 0 && (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${index}`}
                        checked={!!selectedDays[formatDateForComparison(day)]}
                        onCheckedChange={() => toggleDaySelection(day)}
                      />
                      <label htmlFor={`day-${index}`} className="text-sm">
                        {format(day, 'EEEE, dd/MM', { locale: ptBR })}
                      </label>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Selecione o horário:</label>
              <div className="flex space-x-4">
                <div className="w-40">
                  <Select onValueChange={setBulkSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((timeSlot) => (
                        <SelectItem key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={addBulkAvailableSlots}
                  className="bg-barber-secondary hover:bg-barber-accent"
                  disabled={Object.keys(selectedDays).length === 0 || !bulkSelectedTime}
                >
                  Adicionar Horários
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleEditor;

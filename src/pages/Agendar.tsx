
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for services
const services = [
  { id: 1, name: "Corte Tradicional", price: "R$ 40", duration: 30 },
  { id: 2, name: "Barba Completa", price: "R$ 35", duration: 30 },
  { id: 3, name: "Corte + Barba", price: "R$ 65", duration: 60 },
  { id: 4, name: "Acabamento", price: "R$ 25", duration: 15 },
];

// Mock data for available time slots - in a real app this would come from the backend
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 20; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (!(hour === 19 && min === 30)) { // Skip 19:30 as shop closes at 20:00
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }
  }
  return slots;
};

const availableTimeSlots = generateTimeSlots();

const Agendar = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Data validation
    if (!date || !selectedService || !selectedTime || !name || !phone || !email) {
      toast({
        title: "Erro no agendamento",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock API call to book appointment
    // In a real app, this would be a call to your Supabase backend
    toast({
      title: "Agendamento realizado com sucesso!",
      description: `Seu horário foi agendado para ${format(date, 'dd/MM/yyyy')} às ${selectedTime}.`,
    });
    
    // Reset form
    setDate(undefined);
    setSelectedService("");
    setSelectedTime("");
    setName("");
    setPhone("");
    setEmail("");
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">Agende seu Horário</h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between mb-8">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-barber-secondary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-barber-secondary bg-barber-secondary text-white' : 'border-gray-300'} mb-2`}>
                  1
                </div>
                <span className="text-sm">Serviço</span>
              </div>
              
              <div className="relative flex-1 mx-4 mt-5">
                <div className={`h-1 ${step >= 2 ? 'bg-barber-secondary' : 'bg-gray-300'}`}></div>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-barber-secondary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-barber-secondary bg-barber-secondary text-white' : 'border-gray-300'} mb-2`}>
                  2
                </div>
                <span className="text-sm">Data e Hora</span>
              </div>
              
              <div className="relative flex-1 mx-4 mt-5">
                <div className={`h-1 ${step >= 3 ? 'bg-barber-secondary' : 'bg-gray-300'}`}></div>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-barber-secondary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-barber-secondary bg-barber-secondary text-white' : 'border-gray-300'} mb-2`}>
                  3
                </div>
                <span className="text-sm">Seus Dados</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-serif font-medium mb-6">Escolha o serviço desejado</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {services.map((service) => (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedService === service.id.toString() ? 'ring-2 ring-barber-secondary' : ''}`}
                        onClick={() => setSelectedService(service.id.toString())}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{service.name}</h3>
                              <p className="text-sm text-gray-500">Duração: {service.duration} min</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-barber-secondary">{service.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setStep(2)}
                      disabled={!selectedService}
                      className="btn-primary"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Date & Time Selection */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-serif font-medium mb-6">Escolha a data e horário</h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/2">
                      <Label className="text-base mb-2 block">Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={ptBR}
                            className="p-3 pointer-events-auto"
                            // Disable past dates and Sundays (shop is closed)
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today || date.getDay() === 0;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="md:w-1/2">
                      <Label className="text-base mb-2 block">Horário</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((timeSlot) => (
                            <SelectItem key={timeSlot} value={timeSlot}>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {timeSlot}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Voltar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setStep(3)}
                      disabled={!date || !selectedTime}
                      className="btn-primary"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Personal Information */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-serif font-medium mb-6">Complete seus dados</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Digite seu nome completo" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(00) 00000-0000" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Resumo do agendamento</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Serviço:</span>
                        <span className="font-medium">{services.find(s => s.id.toString() === selectedService)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data:</span>
                        <span className="font-medium">{date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Horário:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-gray-500">Valor:</span>
                        <span className="font-bold text-barber-secondary">{services.find(s => s.id.toString() === selectedService)?.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Voltar
                    </Button>
                    <Button 
                      type="submit" 
                      className="btn-primary"
                      disabled={!name || !phone || !email}
                    >
                      Confirmar Agendamento
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agendar;

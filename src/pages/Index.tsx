
import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Clock, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const services = [
  {
    title: "Corte Tradicional",
    description: "Um corte clássico com técnicas tradicionais de barbearia.",
    price: "R$ 40",
    icon: <Scissors className="h-8 w-8" />
  },
  {
    title: "Barba Completa",
    description: "Modelagem completa com toalha quente e produtos premium.",
    price: "R$ 35",
    icon: <Scissors className="h-8 w-8" />
  },
  {
    title: "Corte + Barba",
    description: "Combinação de corte tradicional e barba completa.",
    price: "R$ 65",
    icon: <Scissors className="h-8 w-8" />
  },
  {
    title: "Acabamento",
    description: "Manutenção rápida para manter seu visual em dia.",
    price: "R$ 25",
    icon: <Scissors className="h-8 w-8" />
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Barber Shop Pro</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Experiência premium em barbearia desde 2010. Especialistas em cortes clássicos e modernos.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/agendar">
                <Button className="btn-primary">Agendar Horário</Button>
              </Link>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                <Button className="btn-secondary">Contato via WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Nossa História</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-lg mb-4">Fundada em 2010 por mestres barbeiros com mais de 20 anos de experiência, a Barber Shop Pro nasceu da paixão por preservar a tradição da barbearia clássica enquanto abraça técnicas modernas.</p>
              <p className="text-lg mb-4">Nosso ambiente combina o charme vintage das barbearias tradicionais com o conforto e a tecnologia do século XXI, criando um espaço onde homens de todas as idades podem desfrutar de serviços de alta qualidade.</p>
              <p className="text-lg">Cada cliente recebe atenção personalizada, e nos orgulhamos de criar relacionamentos duradouros com nossa comunidade.</p>
            </div>
            <div className="md:w-1/2 bg-barber-light p-2 rounded-lg shadow-md">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-barber-primary/10">
                {/* Image placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-barber-primary/10 text-barber-primary">
                  <span className="text-xl font-serif">Imagem da Barbearia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="card">
                <CardContent className="p-6">
                  <div className="mb-4 text-barber-secondary">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-barber-primary font-bold text-xl">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/agendar">
              <Button className="btn-primary">Agendar Agora</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Localização & Horários</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-md bg-gray-200 h-[300px] md:h-[400px]">
                {/* This is a placeholder for Google Maps */}
                <div className="w-full h-full flex items-center justify-center bg-barber-primary/10 text-barber-primary">
                  <span className="text-xl font-serif">Mapa Google</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <MapPin className="text-barber-secondary mr-3 h-6 w-6" />
                  <h3 className="text-xl font-semibold">Endereço</h3>
                </div>
                <p className="text-gray-700 ml-9">Rua da Barbearia, 123</p>
                <p className="text-gray-700 ml-9">São Paulo, SP - Brasil</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Clock className="text-barber-secondary mr-3 h-6 w-6" />
                  <h3 className="text-xl font-semibold">Horário de Funcionamento</h3>
                </div>
                <p className="text-gray-700 ml-9">Segunda à Sexta: 9h às 20h</p>
                <p className="text-gray-700 ml-9">Sábado: 9h às 18h</p>
                <p className="text-gray-700 ml-9">Domingo: Fechado</p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Phone className="text-barber-secondary mr-3 h-6 w-6" />
                  <h3 className="text-xl font-semibold">Contato</h3>
                </div>
                <p className="text-gray-700 ml-9">Telefone: (11) 99999-9999</p>
                <p className="text-gray-700 ml-9">Email: contato@barbershoppro.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-barber-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">Pronto para um novo visual?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Agende seu horário agora e tenha uma experiência premium em nossa barbearia.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendar">
              <Button className="btn-primary">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Horário
              </Button>
            </Link>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              <Button className="btn-secondary">Contato via WhatsApp</Button>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

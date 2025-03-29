
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Scissors, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-barber-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white p-1 rounded-full mr-3">
                <Scissors className="h-6 w-6 text-barber-primary" />
              </div>
              <span className="font-serif text-xl font-bold">Barber Shop Pro</span>
            </div>
            <p className="text-white/80 mb-4">
              Experiência premium em barbearia desde 2010. Especialistas em cortes clássicos e modernos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-white/80 hover:text-white transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/#location" className="text-white/80 hover:text-white transition-colors">
                  Localização
                </Link>
              </li>
              <li>
                <Link to="/agendar" className="text-white/80 hover:text-white transition-colors">
                  Agendar
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex justify-between">
                <span>Segunda - Sexta</span>
                <span>9h - 20h</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado</span>
                <span>9h - 18h</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span>Fechado</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-barber-secondary mt-0.5" />
                <span className="text-white/80">
                  Rua da Barbearia, 123<br />
                  São Paulo, SP - Brasil
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-barber-secondary" />
                <span className="text-white/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-barber-secondary" />
                <span className="text-white/80">contato@barbershoppro.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Barber Shop Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

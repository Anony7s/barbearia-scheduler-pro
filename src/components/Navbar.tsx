
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scissors, Calendar, UserCircle, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  
  const navItems = [
    { text: 'Início', path: '/' },
    { text: 'Serviços', path: '/#services' },
    { text: 'Localização', path: '/#location' },
    { text: 'Contato', path: '/#contact' },
  ];
  
  const getInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };
  
  return (
    <header className="bg-barber-primary text-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="bg-white p-1 rounded-full mr-3">
              <Scissors className="h-6 w-6 text-barber-primary" />
            </div>
            <span className="font-serif text-xl font-bold">Barber Shop Pro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.text}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/agendar">
              <Button className="bg-barber-secondary hover:bg-barber-accent">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar
              </Button>
            </Link>
            
            {/* Se o usuário estiver logado */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarFallback className="bg-barber-secondary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profile?.name && (
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/agendar" className="flex items-center cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Meus Agendamentos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-500 hover:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-white/10">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-barber-primary text-white border-barber-primary">
              <div className="flex items-center mt-4 mb-8">
                <div className="bg-white p-1 rounded-full mr-3">
                  <Scissors className="h-6 w-6 text-barber-primary" />
                </div>
                <span className="font-serif text-xl font-bold">Barber Pro</span>
              </div>
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path}
                    className="text-xl font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.text}
                  </Link>
                ))}
                <div className="pt-6 space-y-4">
                  <Link to="/agendar" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-barber-secondary hover:bg-barber-accent">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Horário
                    </Button>
                  </Link>
                  
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                            <Shield className="mr-2 h-4 w-4" />
                            Painel Admin
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full border-white/20 hover:bg-white/10 text-red-400"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

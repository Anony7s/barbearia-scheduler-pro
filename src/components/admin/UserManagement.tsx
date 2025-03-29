
import React, { useState } from 'react';
import { Edit2, Trash2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const initialUsers = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@barbershoppro.com',
    role: 'admin',
    active: true
  },
  {
    id: 2,
    name: 'João Barbeiro',
    email: 'joao@barbershoppro.com',
    role: 'barber',
    active: true
  },
  {
    id: 3,
    name: 'Pedro Barbeiro',
    email: 'pedro@barbershoppro.com',
    role: 'barber',
    active: true
  },
  {
    id: 4,
    name: 'Carlos Recepcionista',
    email: 'carlos@barbershoppro.com',
    role: 'receptionist',
    active: false
  }
];

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    active: true
  });
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const resetNewUser = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      active: true
    });
  };
  
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não correspondem.",
        variant: "destructive",
      });
      return;
    }
    
    // Add new user
    const id = Math.max(...users.map(user => user.id)) + 1;
    setUsers([...users, { id, ...newUser }]);
    
    toast({
      title: "Usuário adicionado",
      description: `${newUser.name} foi adicionado com sucesso.`,
    });
    
    setShowAddUserDialog(false);
    resetNewUser();
  };
  
  const handleEditUser = () => {
    if (!editingUser) return;
    
    // Validate form
    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingUser.password && editingUser.password !== editingUser.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não correspondem.",
        variant: "destructive",
      });
      return;
    }
    
    // Update user
    setUsers(users.map(user => 
      user.id === editingUser.id 
        ? { ...user, name: editingUser.name, email: editingUser.email, role: editingUser.role, active: editingUser.active }
        : user
    ));
    
    toast({
      title: "Usuário atualizado",
      description: `${editingUser.name} foi atualizado com sucesso.`,
    });
    
    setShowEditUserDialog(false);
    setEditingUser(null);
  };
  
  const handleDeleteUser = () => {
    if (deleteUserId === null) return;
    
    const userToDelete = users.find(user => user.id === deleteUserId);
    
    if (!userToDelete) return;
    
    setUsers(users.filter(user => user.id !== deleteUserId));
    
    toast({
      title: "Usuário removido",
      description: `${userToDelete.name} foi removido com sucesso.`,
    });
    
    setDeleteUserId(null);
  };
  
  const startEditUser = (user: any) => {
    setEditingUser({
      ...user,
      password: '',
      confirmPassword: ''
    });
    setShowEditUserDialog(true);
  };
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'barber':
        return 'bg-blue-100 text-blue-800';
      case 'receptionist':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'barber':
        return 'Barbeiro';
      case 'receptionist':
        return 'Recepcionista';
      default:
        return role;
    }
  };
  
  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogTrigger asChild>
            <Button className="bg-barber-secondary hover:bg-barber-accent">
              <UserPlus className="h-5 w-5 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar um novo usuário no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
              
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="role">Função</Label>
                <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="barber">Barbeiro</SelectItem>
                    <SelectItem value="receptionist">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser} className="bg-barber-secondary hover:bg-barber-accent">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nome</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Função</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block py-1 px-2 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block py-1 px-2 rounded text-xs font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-barber-secondary"
                      onClick={() => startEditUser(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => setDeleteUserId(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário conforme necessário.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Deixe em branco para manter a senha atual"
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
              
              <div>
                <Label htmlFor="edit-confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="edit-confirm-password"
                  type="password"
                  value={editingUser.confirmPassword}
                  onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-role">Função</Label>
                <Select 
                  defaultValue={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="barber">Barbeiro</SelectItem>
                    <SelectItem value="receptionist">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingUser.active}
                  onChange={(e) => setEditingUser({ ...editingUser, active: e.target.checked })}
                  className="rounded border-gray-300 text-barber-secondary focus:ring-barber-secondary"
                />
                <Label htmlFor="active">Usuário Ativo</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-barber-secondary hover:bg-barber-accent">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;

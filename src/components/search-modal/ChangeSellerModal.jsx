import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { Loader2, Save } from 'lucide-react';

const ChangeSellerModal = ({ isOpen, onClose, cadastro, onUpdate }) => {
  const [vendedores, setVendedores] = useState([]);
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchVendedores = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_usuario, equipe')
          .eq('tipo_acesso', 'vendedor')
          .order('nome_usuario');

        if (error) {
          toast({ title: "Erro ao buscar vendedores", description: error.message, variant: "destructive" });
        } else {
          setVendedores(data);
        }
        setIsLoading(false);
      };
      fetchVendedores();
      setSelectedVendedor(cadastro?.vendedor || '');
      setSelectedEquipe(cadastro?.equipe || '');
    }
  }, [isOpen, cadastro, toast]);

  const handleVendedorChange = (vendedorNome) => {
    setSelectedVendedor(vendedorNome);
    if (vendedorNome === 'SEM VENDEDOR') {
      setSelectedEquipe('');
    } else {
      const vendedor = vendedores.find(v => v.nome_usuario === vendedorNome);
      if (vendedor) {
        setSelectedEquipe(vendedor.equipe);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!cadastro || !selectedVendedor) {
      toast({ title: "Dados incompletos", description: "Selecione um vendedor.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('cadastros')
        .update({ vendedor: selectedVendedor, equipe: selectedVendedor === 'SEM VENDEDOR' ? '' : selectedEquipe })
        .eq('id', cadastro.id)
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Vendedor e equipe atualizados.", variant: "default" });
      onUpdate(data);
      onClose();
    } catch (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Alterar Vendedor/Equipe do Cadastro</DialogTitle>
          <DialogDescription>
            Altere o vendedor e a equipe associados ao cadastro de <span className="font-semibold">{cadastro?.nome_completo}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="vendedor-select">Vendedor</Label>
                <Select value={selectedVendedor} onValueChange={handleVendedorChange}>
                  <SelectTrigger id="vendedor-select">
                    <SelectValue placeholder="Selecione um vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEM VENDEDOR" className="font-semibold text-amber-600">
                      SEM VENDEDOR (Mover para Resgate)
                    </SelectItem>
                    {vendedores.map(v => (
                      <SelectItem key={v.nome_usuario} value={v.nome_usuario}>
                        {v.nome_usuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipe-input">Equipe</Label>
                <Input 
                  id="equipe-input" 
                  value={selectedEquipe} 
                  onChange={(e) => setSelectedEquipe(e.target.value)}
                  placeholder="A equipe será preenchida automaticamente"
                  disabled={selectedVendedor === 'SEM VENDEDOR'}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isLoading || !selectedVendedor}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeSellerModal;
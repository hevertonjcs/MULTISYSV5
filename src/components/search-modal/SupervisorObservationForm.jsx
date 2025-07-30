import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

const SupervisorObservationForm = ({ cadastro, onAddObservation, userInfo }) => {
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!observation.trim()) return;

    setIsSubmitting(true);
    await onAddObservation(cadastro, observation, userInfo);
    setObservation('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <Label htmlFor={`supervisor-obs-${cadastro.id}`} className="text-xs text-muted-foreground">Adicionar Nova Observação de Supervisor</Label>
      <Textarea
        id={`supervisor-obs-${cadastro.id}`}
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder="Digite sua observação aqui..."
        className="bg-muted/30"
        rows={3}
        disabled={isSubmitting}
      />
      <Button type="submit" size="sm" disabled={!observation.trim() || isSubmitting}>
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? 'Adicionando...' : 'Adicionar Observação'}
      </Button>
    </form>
  );
};

export default SupervisorObservationForm;
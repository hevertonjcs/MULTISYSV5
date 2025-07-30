import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Eye, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LogoSettingsModal = ({ isOpen, onClose, logoConfig, onLogoConfigChange }) => {
  const [config, setConfig] = useState({
    enabled: false,
    url: '',
    height: 30
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (logoConfig) {
      setConfig(logoConfig);
      setPreviewUrl(logoConfig.url || '');
    }
  }, [logoConfig]);

  const handleSave = () => {
    try {
      localStorage.setItem('logoConfig', JSON.stringify(config));
      onLogoConfigChange(config);
      toast({
        title: "Configurações salvas!",
        description: "As configurações do logo foram atualizadas.",
        variant: "default"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    const defaultConfig = {
      enabled: false,
      url: '',
      height: 30
    };
    
    setConfig(defaultConfig);
    setPreviewUrl('');
    localStorage.removeItem('logoConfig');
    onLogoConfigChange(defaultConfig);
    
    toast({
      title: "Configurações resetadas!",
      description: "As configurações foram restauradas para o padrão.",
      variant: "default"
    });
  };

  const handleUrlChange = (url) => {
    setConfig(prev => ({ ...prev, url }));
    setPreviewUrl(url);
  };

  const handleHeightChange = (value) => {
    setConfig(prev => ({ ...prev, height: value[0] }));
  };

  const handleEnabledChange = (enabled) => {
    setConfig(prev => ({ ...prev, enabled }));
  };

  const testImageUrl = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handlePreview = async () => {
    if (!config.url) {
      toast({
        title: "URL necessária",
        description: "Insira uma URL de imagem para visualizar.",
        variant: "destructive"
      });
      return;
    }

    const isValid = await testImageUrl(config.url);
    if (!isValid) {
      toast({
        title: "URL inválida",
        description: "A URL fornecida não é uma imagem válida.",
        variant: "destructive"
      });
      return;
    }

    setPreviewUrl(config.url);
    toast({
      title: "Preview atualizado!",
      description: "A imagem foi carregada com sucesso.",
      variant: "default"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações do Logo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ativar Logo no PDF</CardTitle>
                <CardDescription>
                  Habilite para incluir logo personalizado nos PDFs gerados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="logo-enabled"
                    checked={config.enabled}
                    onCheckedChange={handleEnabledChange}
                  />
                  <Label htmlFor="logo-enabled">
                    {config.enabled ? 'Ativado' : 'Desativado'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">URL da Imagem</CardTitle>
                <CardDescription>
                  Insira a URL pública da imagem do logo (PNG, JPG, GIF)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-url">
                    URL da Imagem
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo-url"
                      placeholder="https://exemplo.com/logo.png"
                      value={config.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      disabled={!config.enabled}
                    />
                    <Button
                      onClick={handlePreview}
                      disabled={!config.enabled || !config.url}
                      variant="outline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {previewUrl && config.enabled && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="rounded-lg p-4 border bg-muted/50">
                      <img
                        src={previewUrl}
                        alt="Preview do logo"
                        style={{ height: `${config.height}px` }}
                        className="max-w-full object-contain"
                        onError={() => {
                          setPreviewUrl('');
                          toast({
                            title: "Erro ao carregar imagem",
                            description: "Verifique se a URL está correta e acessível.",
                            variant: "destructive"
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Altura do Logo</CardTitle>
                <CardDescription>
                  Ajuste a altura do logo no PDF (em pixels)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Altura: {config.height}px</Label>
                    <span className="text-muted-foreground text-sm">20px - 100px</span>
                  </div>
                  
                  <Slider
                    value={[config.height]}
                    onValueChange={handleHeightChange}
                    max={100}
                    min={20}
                    step={5}
                    disabled={!config.enabled}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg">💡 Dicas importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>• Use URLs públicas e acessíveis (ex: Supabase Storage, Imgur, etc.)</li>
                  <li>• Formatos suportados: PNG, JPG, GIF</li>
                  <li>• Recomendamos imagens com fundo transparente (PNG)</li>
                  <li>• Tamanho ideal: 200x200px ou similar</li>
                  <li>• O logo aparecerá no topo esquerdo do PDF</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between"
          >
            <Button
              onClick={handleReset}
              variant="destructive"
              className="bg-red-600/10 text-red-600 hover:bg-red-600/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancelar
              </Button>
              
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSettingsModal;
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FormStep6 = ({ formData, uploadFile, removeFile }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast({
        title: "Arquivos rejeitados",
        description: "Alguns arquivos não atendem aos critérios (tamanho máximo: 10MB).",
        variant: "destructive"
      });
    }

    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles);
      toast({
        title: "Arquivos adicionados!",
        description: `${acceptedFiles.length} arquivo(s) adicionado(s) com sucesso.`,
        variant: "default"
      });
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, 
    multiple: true
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (!type) return '📎';
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  const documentList = Array.isArray(formData.documentos) ? formData.documentos : [];

  return (
    <Card className="form-step">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary rounded-lg">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          Upload de Documentos
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Anexe seus documentos para finalizar o cadastro
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-accent/10'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            
            {isDragActive ? (
              <div>
                <p className="text-foreground font-medium">Solte os arquivos aqui...</p>
                <p className="text-muted-foreground text-sm">Os arquivos serão adicionados automaticamente</p>
              </div>
            ) : (
              <div>
                <p className="text-foreground font-medium">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-muted-foreground text-sm">
                  Suporte: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {documentList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h4 className="text-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Arquivos Anexados ({documentList.length})
            </h4>
            
            <div className="space-y-2">
              {documentList.map((doc, index) => (
                <motion.div
                  key={doc.id || doc.name + index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg p-4 flex items-center justify-between border border-border shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.type)}</span>
                    <div>
                      <p className="text-foreground font-medium">{doc.name}</p>
                      <p className="text-muted-foreground text-sm">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Button
                      onClick={() => removeFile(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg p-4 border border-border shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">📋 Documentos recomendados</h4>
          <ul className="text-muted-foreground text-sm space-y-1">
            <li>• RG e CPF (frente e verso)</li>
            <li>• Comprovante de residência</li>
            <li>• Comprovante de renda</li>
            <li>• Extratos bancários (últimos 3 meses)</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg p-4 border border-green-500/30 shadow-sm"
        >
          <h4 className="text-foreground font-medium mb-2">✅ Pronto para finalizar!</h4>
          <p className="text-muted-foreground text-sm">
            Todos os dados foram preenchidos. Clique em "Finalizar" para enviar seu cadastro 
            e gerar o PDF automaticamente.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FormStep6;

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePropositionActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveAsDraft = async (propositionData: any) => {
    setIsLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sauvegarder dans localStorage pour la démo
      const drafts = JSON.parse(localStorage.getItem('propositionDrafts') || '[]');
      const draftId = `DRAFT-${Date.now()}`;
      drafts.push({
        id: draftId,
        ...propositionData,
        status: 'Brouillon',
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        dateDerniereModification: new Date().toLocaleDateString('fr-FR')
      });
      localStorage.setItem('propositionDrafts', JSON.stringify(drafts));

      toast({
        title: "Brouillon sauvegardé",
        description: `Votre proposition a été sauvegardée avec l'ID: ${draftId}`,
      });

      return draftId;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le brouillon",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendForValidation = async (propositionData: any) => {
    setIsLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sauvegarder dans localStorage pour la démo
      const proposals = JSON.parse(localStorage.getItem('propositions') || '[]');
      const proposalId = `PROP-${new Date().getFullYear()}-${String(proposals.length + 1).padStart(3, '0')}`;
      proposals.push({
        id: proposalId,
        ...propositionData,
        status: 'En attente de validation',
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        dateEnvoi: new Date().toLocaleDateString('fr-FR')
      });
      localStorage.setItem('propositions', JSON.stringify(proposals));

      toast({
        title: "Proposition envoyée",
        description: `Votre proposition ${proposalId} a été envoyée pour validation`,
      });

      return proposalId;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la proposition",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveAsDraft,
    sendForValidation,
    isLoading
  };
};

import React, { useState, useCallback, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward
} from "@mui/icons-material";
import { IdentificationStep } from "../components/steps/IdentificationStep";
import { DynamicStep } from "./steps/DynamicSteps";
import ResultsVisualization from "./ResultVisualizationEnhanced";
import { useGetFactorsHierarchy } from "../../../hooks/factors/useGetFactorsHieraychy";
import { useCalculateScore } from "../../../hooks/useCalculateScore";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { LinearProgress } from "@mui/material";


export const StepFormController = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");


  const { isLoading: isLoadingFactors, data: factors, error: factorsError } = useGetFactorsHierarchy();
  const { mutateAsync: calculateScore, isPending: isCalculatingScore } = useCalculateScore();
  

  const updateFormData = useCallback((newData) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      Object.entries(newData).forEach(([key, value]) => {
        if (value === "0" || value === 0) {
        }
      });
      
      return updated;
    });
  }, []);


  const steps = useMemo(() => {
    
    const baseSteps = [
      { 
        id: "identification", 
        title: "Identification de la Relation",
        component: <IdentificationStep formData={formData} updateFormData={updateFormData} /> 
      }
    ];

    if (factors?.length > 0) {
      
      const dynamicSteps = factors.map(factor => {
        return {
          id: factor.id.toString(),
          title: factor.factorName,
          component: <DynamicStep key={factor.id} factor={factor} formData={formData} updateFormData={updateFormData} />
        };
      });
      
      const finalSteps = [...baseSteps, ...dynamicSteps];
      return finalSteps;
    }

    return baseSteps;
  }, [factors, formData, updateFormData]);

  const theme = useTheme();

const validateIdentificationStep = () => {
  const requiredFields = [
    "company-name",
    "business-activity",
    "manager-name",
    "birth-date",
    "relationship-date",
    "account-number"
  ];

  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    setShowValidationError(true);
    setOpenSnackbar(true); 
    return false;
  }

  return true;
};


const validateAllCriteriasFilled = () => {
  if (!factors || factors.length === 0) {
    console.warn("❌ Aucun facteur chargé");
    return false;
  }

 
  // Récupère tous les critères requis depuis les facteurs chargés
  const allRequiredCriteria = [];
  
  factors.forEach(factor => {
    if (factor.subFactors && factor.subFactors.length > 0) {
      factor.subFactors.forEach(subFactor => {
        if (subFactor.criterias && subFactor.criterias.length > 0) {
          subFactor.criterias.forEach(criteria => {
            allRequiredCriteria.push(criteria.code);
          });
        }
      });
    }
  });

  console.log("✅ Critères requis :", allRequiredCriteria);

  // Vérifie que chaque critère requis a une réponse valide
  const emptyCriteria = allRequiredCriteria.filter(criteriaCode => {
    const value = formData[criteriaCode];
    const isEmpty = value === null || value === undefined || value === "" || value === "-1";
    if (isEmpty) {
      console.log(`❌ Critère vide: ${criteriaCode} = "${value}"`);
    }
    return isEmpty;
  });

  console.log("❌ Critères non remplis :", emptyCriteria.length);
  
  if (emptyCriteria.length > 0) {
    console.warn("❌ Critères non remplis :", emptyCriteria);
    setSnackbarMessage(`Veuillez remplir tous les critères d'évaluation (${emptyCriteria.length} manquant${emptyCriteria.length > 1 ? 's' : ''})`);
    return false;
  }

  return true;
};


  const nextStep = () => {
    if (currentStep === 0 && !validateIdentificationStep()) 
      return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {

  // 1. Vérifie l'identification
  // if (!validateIdentificationStep()) {
  //   console.warn("🚫 Données identification incomplètes");
  //   setCurrentStep(0);
  //   setSnackbarMessage("Veuillez remplir les champs d’identification.");
  //   setOpenSnackbar(true);
  //   return;
  // }

  // // 2. Vérifie les critères dynamiques
  // if (!validateAllCriteriasFilled()) {
  //   console.warn("🚫 Critères d’évaluation incomplets");
  //   setCurrentStep(steps.length - 1);
  //   setSnackbarMessage("Veuillez remplir tous les critères d’évaluation.");
  //   setOpenSnackbar(true);
  //   return;
  // }

  // const calculationPayload = {
  //   clientCode: formData["account-number"] || "15900",
  //   clientName: formData["company-name"] || "TALENTS CONSULT",
  //   criterias: formData
  // };
      console.log("🔍 Données complètes du formulaire:", formData);

    // Séparation des données d'identification
    const identificationFields = [
      "client-code",
      "manager-code", 
      "company-name",
      "manager-name",
      "business-activity",
      "birth-date",
      "relationship-date",
      "account-number"
    ];

    // Extraction des données d'identification
    const identificationData = {};
    identificationFields.forEach(field => {
      if (formData[field]) {
        identificationData[field] = formData[field];
      }
    });

    // Extraction des critères (tout ce qui n'est pas dans les données d'identification)
    const criteriaData = {};
    Object.keys(formData).forEach(key => {
      if (!identificationFields.includes(key)) {
        criteriaData[key] = formData[key];
      }
    });

    console.log("📋 Données d'identification séparées:", identificationData);
    console.log("📊 Critères séparés:", criteriaData); 

   // Construction du payload avec les données séparées
    const calculationPayload = {
      clientCode: identificationData["account-number"] || "15900",
      clientName: identificationData["company-name"] || "TALENTS CONSULT",
      identificationData: identificationData,
      criterias: criteriaData
    };
        console.log("🚀 Payload final envoyé:", calculationPayload);

  setSubmitted(true);

  try {
    const scoreResponse = await calculateScore(calculationPayload);
    const finalData = {
      ...calculationPayload, // contient identificationData + criterias
      scoreResult: scoreResponse
    };
    setTimeout(() => {

      setFormData(finalData);
      setShowResults(true);
    }, 1500);
  } catch (error) {
    console.error("❌ Erreur lors du calcul du score:", error);
    setSubmitted(false);
  }
};

  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
    setSubmitted(false);
    setShowResults(false);
  };

  if (isLoadingFactors) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Chargement des facteurs d'évaluation...
        </Typography>
      </Box>
    );
  }

  if (factorsError) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        <Typography variant="h6">Erreur lors du chargement des facteurs</Typography>
        <Typography variant="body2">{factorsError}</Typography>
      </Alert>
    );
  }

  if (showResults) {
    return (
      <ResultsVisualization  
        formData={formData} 
        onReset={resetForm}
      />
    );
  }
  
return (    
    <Box sx={{ width: '100%' }}>
    
      {/* En-tête blanche séparée */}
      <Card
        sx={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '1.9rem',
              mb: 3,
            }}
          >
            Formulaire d'Évaluation PME
          </Typography>
          {/* Stepper personnalisé avec décalage */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, mb: 4 }}>
            {steps.map((_, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              return (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    // Déplacement du premier et dernier cercle :
                    pl: index === 0 ? 3 : 0,   // 3 == 24px (thème spacing)
                    pr: index === steps.length - 1 ? 3 : 0,
                  }}
                >
                  {/* Cercle avec numéro */}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: isCompleted
                        ? theme.palette.secondary.main
                        : isActive
                        ? theme.palette.primary.main
                        : theme.palette.grey[300],
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      zIndex: 1,
                    }}
                  >
                    {index + 1}
                  </Box>
                  {/* Barre de liaison sauf pour le dernier élément */}
                  {index !== steps.length - 1 && (
                    <Box
                      sx={{
                        height: 4,
                        width: 60,
                        backgroundColor:
                          index < currentStep
                            ? theme.palette.primary.main
                            : theme.palette.grey[300],
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ p: 4 }}>

        {(submitted || isCalculatingScore) && !showResults && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6">Traitement en cours...</Typography>
            <Typography variant="body2">Analyse des données et génération du scoring PME.</Typography>
          </Alert>
        )}

        <Card sx={{ mb: 4, backgroundColor: '#f5f5f5', boxShadow: 'none' }}>
          <CardContent sx={{ flex: 1, p: 0 }}>
            {/* Affichage du step actuel avec vérification */}
            {steps[currentStep] ? steps[currentStep].component : (
              <Alert severity="warning">
                Step {currentStep} non trouvé. Total steps: {steps.length}
              </Alert>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{ px: 4, py: 1.5 }}
          >
            Précédent
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={submitted || isCalculatingScore}
              sx={{ px: 4, py: 1.5 }}
            >
              {submitted || isCalculatingScore ? 'Traitement...' : 'Soumettre'}
            </Button>
          ) : (
            <Button 
              onClick={nextStep} 
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{ px: 4, py: 1.5 }}
            >
              Suivant
            </Button>
          )}
        </Box>
  </Box>
       <Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <MuiAlert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
    Veuillez remplir tous les champs requis dans l'étape d'identification.
  </MuiAlert>
</Snackbar>
    </Box>
  );
};

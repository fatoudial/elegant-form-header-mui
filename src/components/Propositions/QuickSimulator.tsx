
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface QuickSimulatorProps {
  onSimulationComplete?: (results: any) => void;
}

const QuickSimulator = ({ onSimulationComplete }: QuickSimulatorProps) => {
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState("");
  const [taux, setTaux] = useState("7.5");
  const [results, setResults] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateSimulation = () => {
    if (!montant || !duree || !taux) return;

    const principal = parseFloat(montant);
    const months = parseInt(duree);
    const rate = parseFloat(taux) / 100 / 12;

    // Calcul du loyer mensuel
    const loyerMensuel = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalLoyers = loyerMensuel * months;
    const coutTotal = totalLoyers + (principal * 0.02); // 2% de valeur résiduelle
    const tegCalcule = ((totalLoyers - principal) / principal) * 100;

    const simulationResults = {
      loyerMensuel: Math.round(loyerMensuel),
      totalLoyers: Math.round(totalLoyers),
      coutTotal: Math.round(coutTotal),
      teg: Math.round(tegCalcule * 100) / 100
    };

    setResults(simulationResults);
    onSimulationComplete?.(simulationResults);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Simulateur Rapide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="montant">Montant à financer (FCFA)</Label>
            <Input
              id="montant"
              type="number"
              placeholder="50000000"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="duree">Durée (mois)</Label>
            <Input
              id="duree"
              type="number"
              placeholder="36"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="taux">Taux (%)</Label>
            <Input
              id="taux"
              type="number"
              step="0.1"
              placeholder="7.5"
              value={taux}
              onChange={(e) => setTaux(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateSimulation} className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer
        </Button>

        {results && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-3">Résultats de simulation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Loyer mensuel :</span>
                <span className="font-medium">{formatCurrency(results.loyerMensuel)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total des loyers :</span>
                <span className="font-medium">{formatCurrency(results.totalLoyers)}</span>
              </div>
              <div className="flex justify-between">
                <span>Coût total :</span>
                <span className="font-medium">{formatCurrency(results.coutTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>TEG :</span>
                <span className="font-medium">{results.teg}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickSimulator;

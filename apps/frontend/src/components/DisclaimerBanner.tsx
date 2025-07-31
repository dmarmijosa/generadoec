import { AlertTriangle } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mx-4 sm:mx-6 lg:mx-8 my-4 rounded-r-lg">
      <div className="flex items-start">
        <AlertTriangle
          size={20}
          className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
        />
        <div className="text-sm">
          <p className="text-yellow-800 font-semibold mb-1">
            ⚠️ IMPORTANTE: Datos Ficticios para Pruebas
          </p>
          <p className="text-yellow-700 text-xs sm:text-sm">
            Todos los datos generados son completamente ficticios y no
            corresponden a personas reales. Esta herramienta está destinada
            únicamente para desarrollo, testing y educación.
            <strong className="block mt-1">
              El autor no se responsabiliza por el uso indebido de esta
              herramienta.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;

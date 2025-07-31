import { useState, useEffect, useCallback } from "react";
import { Download, RefreshCw, Copy, Settings } from "lucide-react";
import {
  apiService,
  type GeneratedData,
  type GenerationOptions,
} from "../services/api.service";

const Generator = () => {
  const [quantity, setQuantity] = useState(10);
  const [selectedFields, setSelectedFields] = useState({
    cedula: true,
    nombre: true,
    apellido: true,
    email: true,
    telefono: true,
    direccion: true,
    provincia: true,
    canton: true,
    fechaNacimiento: true,
    genero: true,
    profesion: false,
    ruc: false,
    empresa: false,
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const options: GenerationOptions = {
        quantity,
        includeRuc: selectedFields.ruc,
        includeCompany: selectedFields.empresa,
      };

      const data = await apiService.generatePeople(options);
      setGeneratedData(data);
    } catch (error) {
      console.error("Error al generar datos:", error);
      // En caso de error, mostrar mensaje pero mantener la funcionalidad
      alert("Error al conectar con el servidor. Mostrando datos de ejemplo.");
    } finally {
      setIsLoading(false);
    }
  }, [quantity, selectedFields.ruc, selectedFields.empresa]);

  // Verificar estado del backend al cargar
  useEffect(() => {
    const checkBackend = async () => {
      await apiService.checkHealth();
    };

    checkBackend();
  }, []);

  // Generar datos automáticamente al cargar la página
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleFieldToggle = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const exportToCSV = () => {
    const headers = Object.keys(selectedFields).filter(
      (field) => selectedFields[field as keyof typeof selectedFields]
    );
    const csvContent = [
      headers.join(","),
      ...generatedData.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof GeneratedData];
            // Escapar valores que contengan comas
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value || "";
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datos-ecuatorianos-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const headers = Object.keys(selectedFields).filter(
      (field) => selectedFields[field as keyof typeof selectedFields]
    );
    const content = [
      headers.join("\t"),
      ...generatedData.map((row) =>
        headers
          .map((header) => row[header as keyof GeneratedData] || "")
          .join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert("Datos copiados al portapapeles");
      })
      .catch(() => {
        alert("Error al copiar datos");
      });
  };

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Registro copiado al portapapeles");
      })
      .catch(() => {
        alert("Error al copiar registro");
      });
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      cedula: "Cédula",
      nombre: "Nombre",
      apellido: "Apellido",
      email: "Email",
      telefono: "Teléfono",
      direccion: "Dirección",
      provincia: "Provincia",
      canton: "Cantón",
      fechaNacimiento: "Fecha Nacimiento",
      genero: "Género",
      profesion: "Profesión",
      ruc: "RUC",
      empresa: "Empresa",
    };
    return labels[field] || field;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Generador de Datos
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Genera datos ecuatorianos válidos para tus proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Settings
                size={18}
                className="text-ecuador-blue mr-2 sm:w-5 sm:h-5"
              />
              <h2 className="text-base sm:text-lg font-semibold">
                Configuración
              </h2>
            </div>

            {/* Quantity */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Cantidad de registros
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-ecuador-blue"
              />
            </div>

            {/* Field Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
                Campos a generar
              </label>
              <div className="space-y-2">
                {Object.entries(selectedFields).map(([field, checked]) => (
                  <label key={field} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        handleFieldToggle(field as keyof typeof selectedFields)
                      }
                      className="rounded border-gray-300 text-ecuador-blue focus:ring-ecuador-blue"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-700 capitalize">
                      {getFieldLabel(field)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-ecuador-blue text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <RefreshCw
                  size={18}
                  className="animate-spin mr-2 sm:w-5 sm:h-5"
                />
              ) : (
                <RefreshCw size={18} className="mr-2 sm:w-5 sm:h-5" />
              )}
              {isLoading ? "Generando..." : "Generar Datos"}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 mt-6 lg:mt-0">
          <div className="bg-white rounded-lg shadow">
            {/* Results Header */}
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-base sm:text-lg font-semibold">
                  Resultados ({generatedData.length} registros)
                </h2>
                {generatedData.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Copy size={14} className="mr-1 sm:w-4 sm:h-4" />
                      Copiar
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm text-white bg-ecuador-blue hover:bg-blue-700 rounded-md"
                    >
                      <Download size={14} className="mr-1 sm:w-4 sm:h-4" />
                      Exportar CSV
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Table */}
            <div className="p-0 sm:p-6">
              {generatedData.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <RefreshCw
                    size={40}
                    className="mx-auto text-gray-400 mb-4 sm:w-12 sm:h-12"
                  />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No hay datos generados aún
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Configura los parámetros y haz clic en "Generar Datos"
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop/Tablet Table View */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.entries(selectedFields)
                              .filter(([, checked]) => checked)
                              .map(([field]) => (
                                <th
                                  key={field}
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50"
                                >
                                  {getFieldLabel(field)}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {generatedData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {Object.entries(selectedFields)
                                .filter(([, checked]) => checked)
                                .map(([field]) => (
                                  <td
                                    key={field}
                                    className="px-4 py-3 text-sm text-gray-900 max-w-xs"
                                  >
                                    <div className="break-words overflow-hidden">
                                      {row[field as keyof GeneratedData]}
                                    </div>
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile & Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {generatedData.map((row, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-ecuador-blue">
                            Registro #{index + 1}
                          </span>
                          <button
                            onClick={() => {
                              const text = Object.entries(selectedFields)
                                .filter(([, checked]) => checked)
                                .map(
                                  ([field]) =>
                                    `${getFieldLabel(field)}: ${
                                      row[field as keyof GeneratedData]
                                    }`
                                )
                                .join("\n");
                              copyTextToClipboard(text);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="Copiar registro"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(selectedFields)
                            .filter(([, checked]) => checked)
                            .map(([field]) => (
                              <div key={field} className="space-y-1">
                                <span className="text-xs text-gray-500 font-medium block">
                                  {getFieldLabel(field)}:
                                </span>
                                <span className="text-sm text-gray-900 break-words block">
                                  {row[field as keyof GeneratedData]}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;

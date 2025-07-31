import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { apiService, type GeneratedData } from "../services/api.service";

const Home = () => {
  const [previewData, setPreviewData] = useState<GeneratedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    const loadPreviewData = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.generateQuickData(3);
        setPreviewData(data);
      } catch (error) {
        console.error("Error al cargar datos de vista previa:", error);
        // Datos de ejemplo por defecto
        setPreviewData([
          {
            cedula: "1724567890",
            nombre: "María Elena",
            apellido: "Rodríguez Vásquez",
            email: "maria.rodriguez@example.com",
            telefono: "+593 98 123 4567",
            direccion: "Av. República del Salvador N34-183",
            provincia: "Pichincha",
            canton: "Quito",
            fechaNacimiento: "1990-03-15",
            genero: "F",
            profesion: "Ingeniera",
          },
          {
            cedula: "0926781345",
            nombre: "Carlos Alberto",
            apellido: "García López",
            email: "carlos.garcia@example.com",
            telefono: "+593 97 987 6543",
            direccion: "Calle Bolívar N125",
            provincia: "Guayas",
            canton: "Guayaquil",
            fechaNacimiento: "1985-07-22",
            genero: "M",
            profesion: "Médico",
          },
          {
            cedula: "0103456789",
            nombre: "Ana Sofía",
            apellido: "Martínez Pérez",
            email: "ana.martinez@example.com",
            telefono: "+593 96 555 1234",
            direccion: "Av. Huayna Cápac N456",
            provincia: "Azuay",
            canton: "Cuenca",
            fechaNacimiento: "1993-12-08",
            genero: "F",
            profesion: "Abogada",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviewData();
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 lg:py-16">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-ecuador-yellow to-ecuador-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl sm:text-2xl">EC</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
          Generador de Datos
          <span className="block text-ecuador-blue">Ecuatorianos</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Herramienta completa para generar datos ecuatorianos válidos como
          cédulas, nombres, direcciones, teléfonos y más. Perfecto para pruebas,
          desarrollo y proyectos educativos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link
            to="/generator"
            className="bg-ecuador-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            Comenzar a Generar
            <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link
            to="/about"
            className="border-2 border-ecuador-blue text-ecuador-blue px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-ecuador-blue hover:text-white transition-colors text-sm sm:text-base"
          >
            Más Información
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
          ¿Por qué elegir GeneradorEC?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ecuador-yellow rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield size={28} className="text-ecuador-blue sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Datos Válidos
            </h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              Todos los datos generados siguen los algoritmos y formatos
              oficiales ecuatorianos.
            </p>
          </div>
          <div className="text-center p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ecuador-red rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Zap size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Rápido y Fácil
            </h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              Genera datos instantáneamente con un solo clic. Interfaz intuitiva
              y fácil de usar.
            </p>
          </div>
          <div className="text-center p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ecuador-blue rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Múltiples Tipos
            </h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              Cédulas, nombres, direcciones, teléfonos, RUC y más datos
              ecuatorianos.
            </p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-8 sm:py-12 lg:py-16 mx-4 sm:mx-0">
        <div className="bg-gradient-to-br from-ecuador-yellow/10 to-ecuador-blue/10 rounded-xl p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Vista Previa del Generador
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Ejemplo de datos que puedes generar con nuestra herramienta
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ecuador-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos de ejemplo...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {previewData.map((person, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-ecuador-blue">
                      Registro #{index + 1}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      person.genero === 'M' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {person.genero === 'M' ? 'Masculino' : 'Femenino'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Cédula:</span>
                      <p className="font-mono text-sm font-medium">{person.cedula}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 block">Nombre:</span>
                      <p className="text-sm font-medium">{person.nombre} {person.apellido}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 block">Profesión:</span>
                      <p className="text-sm">{person.profesion}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 block">Ubicación:</span>
                      <p className="text-sm">{person.canton}, {person.provincia}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 block">Contacto:</span>
                      <p className="text-xs font-mono">{person.telefono}</p>
                      <p className="text-xs break-all text-gray-600">{person.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/generator"
              className="inline-flex items-center px-6 py-3 bg-ecuador-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generar Más Datos
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Data Types Section */}
      <section className="py-8 sm:py-12 lg:py-16 mx-4 sm:mx-0">
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
            Tipos de Datos Disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Cédulas", desc: "Números de identificación válidos" },
              { title: "Nombres", desc: "Nombres y apellidos ecuatorianos" },
              {
                title: "Direcciones",
                desc: "Direcciones reales por provincia",
              },
              { title: "Teléfonos", desc: "Números móviles y fijos" },
              { title: "Emails", desc: "Correos electrónicos válidos" },
              { title: "Fechas", desc: "Fechas de nacimiento realistas" },
              { title: "Profesiones", desc: "Ocupaciones comunes en Ecuador" },
              { title: "Empresas", desc: "Nombres de empresas ficticias" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          ¿Listo para empezar?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Comienza a generar datos ecuatorianos de alta calidad en segundos
        </p>
        <Link
          to="/generator"
          className="bg-ecuador-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center text-sm sm:text-base"
        >
          Ir al Generador
          <ArrowRight size={20} className="ml-2" />
        </Link>
      </section>
    </div>
  );
};

export default Home;

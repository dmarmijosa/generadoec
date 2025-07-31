import { Github, Mail, Heart, Code, Coffee, Globe, User } from "lucide-react";
import { environment } from "../environments/environment";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Acerca de GeneradorEC
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Una herramienta libre y gratuita para generar datos ecuatorianos
          válidos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Code size={20} className="text-ecuador-blue mr-3 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-semibold">
              ¿Qué es GeneradorEC?
            </h2>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            GeneradorEC es una aplicación web que permite generar datos
            ecuatorianos válidos como cédulas de identidad, nombres,
            direcciones, teléfonos y más información específica del Ecuador.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Ideal para desarrolladores, testers, estudiantes y profesionales que
            necesitan datos de prueba realistas para sus proyectos.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Heart size={20} className="text-ecuador-red mr-3 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-semibold">
              ¿Por qué lo creamos?
            </h2>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            Inspirados en herramientas similares de otros países, decidimos
            crear una versión específicamente diseñada para Ecuador, con datos
            que reflejen nuestra realidad nacional.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Nuestro objetivo es facilitar el trabajo de desarrollo y testing con
            datos que sean culturalmente apropiados y técnicamente válidos.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ecuador-blue rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm sm:text-base">
                ✓
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Datos Válidos
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Cédulas con algoritmo de verificación correcto según el registro
              civil ecuatoriano
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ecuador-yellow rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-ecuador-blue font-bold text-sm sm:text-base">
                ⚡
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Rápido</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Genera miles de registros en segundos con nuestra API optimizada
            </p>
          </div>
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ecuador-red rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm sm:text-base">
                🇪🇨
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              100% Ecuatoriano
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Nombres, direcciones y datos específicos de la realidad
              ecuatoriana
            </p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Detalles Técnicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Frontend
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
              <li>• React 19 con TypeScript</li>
              <li>• Tailwind CSS para diseño responsive</li>
              <li>• Vite como bundler</li>
              <li>• React Router para navegación</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
              <li>• NestJS con TypeScript</li>
              <li>• API RESTful</li>
              <li>• Algoritmos de validación ecuatorianos</li>
              <li>• Base de datos de nombres y lugares</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Fuentes de Datos
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Los datos generados se basan en información pública y estadísticas
            oficiales:
          </p>
          <ul className="text-gray-600 space-y-2 text-sm sm:text-base">
            <li>• Registro Civil del Ecuador - Estructura de cédulas</li>
            <li>• INEC - Datos demográficos y estadísticos</li>
            <li>• División política administrativa del Ecuador</li>
            <li>• Nombres comunes registrados en Ecuador</li>
            <li>• Códigos telefónicos oficiales</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-yellow-800">
              <strong>Importante:</strong> Todos los datos generados son
              ficticios y no corresponden a personas reales. Esta herramienta
              está destinada únicamente para propósitos de desarrollo, testing y
              educación.
            </p>
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <User size={24} className="text-ecuador-blue mr-3 sm:w-7 sm:h-7" />
          Sobre el Autor
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-ecuador-blue to-ecuador-yellow rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-2xl">
                DA
              </span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {environment.author.name}
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Desarrollador Full Stack apasionado por crear herramientas útiles
              para la comunidad ecuatoriana. Con experiencia en tecnologías
              modernas y enfoque en la calidad del software.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center md:justify-start">
              <a
                href={environment.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <User size={14} className="mr-2 sm:w-4 sm:h-4" />
                LinkedIn
              </a>
              <a
                href={environment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Globe size={14} className="mr-2 sm:w-4 sm:h-4" />
                Sitio Web
              </a>
              <a
                href={environment.author.buyMeACoffee}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                <Coffee size={14} className="mr-2 sm:w-4 sm:h-4" />
                Buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          ¿Tienes sugerencias o necesitas soporte?
        </h2>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Este es un proyecto de código abierto y valoramos tu feedback. No
          dudes en contactarnos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href="https://github.com/dmarmijosa/generadorec"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Github size={16} className="mr-2 sm:w-5 sm:h-5" />
            Ver en GitHub
          </a>
          <a
            href={`mailto:${environment.supportEmail}`}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-ecuador-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Mail size={16} className="mr-2 sm:w-5 sm:h-5" />
            Soporte Técnico
          </a>
          <a
            href={environment.author.buyMeACoffee}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
          >
            <Coffee size={16} className="mr-2 sm:w-5 sm:h-5" />
            Apóyanos
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;

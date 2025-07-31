import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import DisclaimerBanner from "./components/DisclaimerBanner";
import FloatingCoffeeButton from "./components/FloatingCoffeeButton";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import About from "./pages/About";
import { environment } from "./environments/environment";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <DisclaimerBanner />
        <main className="w-full">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/about" element={<About />} />
              {/* Ruta catch-all para redirigir rutas no encontradas al home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 w-full">
          <div className="container mx-auto px-4">
            <p className="text-sm">
              © 2025 {environment.author.name} | GeneradorEC - Datos
              Ecuatorianos para Desarrollo
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ Todos los datos son ficticios - Solo para pruebas y desarrollo
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <a
                href={environment.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xs"
              >
                LinkedIn
              </a>
              <a
                href={environment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xs"
              >
                Sitio Web
              </a>
              <a
                href={`mailto:${environment.supportEmail}`}
                className="text-gray-400 hover:text-white text-xs"
              >
                Soporte
              </a>
            </div>
          </div>
        </footer>

        {/* Floating Coffee Button */}
        <FloatingCoffeeButton />
      </div>
    </Router>
  );
}

export default App;

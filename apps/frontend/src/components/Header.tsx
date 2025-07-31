import { Link } from "react-router-dom";
import { Menu, X, Coffee } from "lucide-react";
import { useState } from "react";
import { environment } from "../environments/environment";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b-4 border-ecuador-yellow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-ecuador-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">GeneradorEC</h1>
              <p className="text-xs text-red-600 font-semibold">
                ⚠️ Datos de Prueba
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/generator"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium"
              >
                Generador
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium"
              >
                Acerca de
              </Link>
            </nav>

            {/* Buy me a coffee button - Desktop */}
            <a
              href={environment.author.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium shadow-sm"
            >
              <Coffee size={16} className="mr-2" />
              Buy me a coffee
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Buy me a coffee button - Mobile */}
            <a
              href={environment.author.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs font-medium"
            >
              <Coffee size={14} className="mr-1" />☕
            </a>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t bg-gray-50">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium px-2 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/generator"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium px-2 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Generador
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-ecuador-blue transition-colors font-medium px-2 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>

              {/* Separator */}
              <hr className="border-gray-300" />

              {/* Buy me a coffee button - Mobile Menu */}
              <a
                href={environment.author.buyMeACoffee}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Coffee size={18} className="mr-2" />
                Buy me a coffee ☕
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

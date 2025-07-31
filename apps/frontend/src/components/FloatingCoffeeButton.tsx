import { Coffee } from "lucide-react";
import { environment } from "../environments/environment";

const FloatingCoffeeButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={environment.author.buyMeACoffee}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-4 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        title="Buy me a coffee"
      >
        <Coffee size={20} className="group-hover:animate-bounce" />
        <span className="ml-2 font-medium hidden sm:inline">
          Buy me a coffee
        </span>
        <span className="ml-1 text-lg">☕</span>
      </a>
    </div>
  );
};

export default FloatingCoffeeButton;

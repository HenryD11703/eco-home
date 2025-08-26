import { FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 py teasing-8 relative">
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand and Copyright */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <FaLeaf className="text-teal-500 text-2xl" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Eco-Home Goods
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Eco-Home Goods. Todos los derechos reservados.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-center">
              <a
                href="/about"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Sobre Nosotros
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Contacto
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Términos de Servicio
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Política de Privacidad
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-500 transition-colors duration-200"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-500 transition-colors duration-200"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-500 transition-colors duration-200"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="mailto:support@ecohomegoods.com"
                className="text-gray-600 hover:text-teal-500 transition-colors duration-200"
              >
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
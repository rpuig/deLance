// next.config.mjs
import pkg from './next-i18next.config.js';  // Usamos la importación por defecto
const { i18n } = pkg;  // Desestructuramos i18n del objeto importado

export default {
  i18n,  // Exportamos la configuración de i18n
};

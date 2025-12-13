import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to Rent & Return",
            "Login": "Login",
            "Register": "Register",
            "Search": "Search products...",
            "Dashboard": "Dashboard",
            "Settings": "Settings",
            "Language": "Language",
            "Currency": "Currency",
            "Price": "Price",
            "Rent": "Rent",
            "Return": "Return",
            "PayWith": "Pay with",
            "EditProfile": "Edit Profile",
            "Deposit": "Deposit",
            "Withdraw": "Withdraw"
        }
    },
    ur: {
        translation: {
            "Welcome": "کرایہ اور واپسی میں خوش آمدید",
            "Login": "لاگ ان کریں",
            "Register": "رجسٹر کریں",
            "Search": "مصنوعات تلاش کریں...",
            "Dashboard": "ڈیش بورڈ",
            "Settings": "ترتیبات",
            "Language": "زبان",
            "Currency": "کرنسی",
            "Price": "قیمت",
            "Rent": "کرایہ پر لیں",
            "Return": "واپس کریں",
            "PayWith": "ادائیگی کریں بذریعہ",
            "EditProfile": "پروفائل میں ترمیم کریں",
            "Deposit": "جمع کروائیں",
            "Withdraw": "نکلوائیں"
        }
    },
    es: {
        translation: {
            "Welcome": "Bienvenido a Rent & Return",
            "Login": "Iniciar sesión",
            "Register": "Registrarse",
            "Search": "Buscar productos...",
            "Dashboard": "Tablero",
            "Settings": "Configuración",
            "Language": "Idioma",
            "Currency": "Moneda",
            "Price": "Precio",
            "Rent": "Alquilar",
            "Return": "Devolver",
            "PayWith": "Pagar con"
        }
    },
    fr: {
        translation: {
            "Welcome": "Bienvenue chez Rent & Return",
            "Login": "Connexion",
            "Register": "S'inscrire",
            "Search": "Rechercher...",
            "Dashboard": "Tableau de bord",
            "Settings": "Paramètres",
            "Language": "Langue",
            "Currency": "Devise",
            "Price": "Prix",
            "Rent": "Louer"
        }
    },
    zh: {
        translation: {
            "Welcome": "欢迎来到租赁和归还",
            "Login": "登录",
            "Register": "注册",
            "Search": "搜索产品...",
            "Dashboard": "仪表板",
            "Settings": "设置",
            "Language": "语言",
            "Currency": "货币",
            "Price": "价格"
        }
    },
    ar: {
        translation: {
            "Welcome": "مرحبًا بكم في الإيجار والعودة",
            "Login": "تسجيل الدخول",
            "Register": "سجل",
            "Search": "بحث عن المنتجات...",
            "Dashboard": "لوحة القيادة",
            "Settings": "إعدادات",
            "Language": "لغة",
            "Currency": "عملة",
            "Price": "سعر"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

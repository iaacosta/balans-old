import { LocaleShape } from './en';

export const es: LocaleShape = {
  auth: {
    common: {
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      username: 'Nombre de usuario',
      password: 'Contraseña',
    },
    loginPage: {
      title: '¡Bienvenido!',
      subtitle: 'Por favor inicia sesión con tu cuenta',
      rememberMe: '¿Recordarme?',
    },
    signUpPage: {
      title: '¿Primera vez aquí?',
      subtitle: '¡Rellena tus datos y se parte de la comunidad!',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      confirmPassword: 'Confirmar contraseña',
    },
  },
  navbar: {
    dashboard: 'Tablero',
    accounts: 'Cuentas',
    movements: 'Movimientos',
    categories: 'Categorías',
    places: 'Lugares',
    people: 'Personas',
    users: 'Usuarios',
    en: 'Inglés',
    es: 'Español',
    exit: 'Salir',
  },
  forms: {
    create: 'Crear',
    go: 'Ir',
    cancel: 'Cancelar',
  },
  accounts: {
    title: 'Mis cuentas',
    noDebitAccounts: 'No tienes cuentas aún. ¡Crea tu primera!',
    tabs: {
      debit: 'Cuentas de débito',
      credit: 'Cuentas de crédito',
    },
    checking: 'Corriente',
    vista: 'Vista',
    cash: 'Efectivo',
    create: {
      debit: 'Crear nueva cuenta de débito',
      credit: 'Crear nueva cuenta de crédito',
    },
    form: {
      title: 'Crear cuenta',
      name: 'Nombre',
      type: 'Tipo',
      initialBalance: 'Balance inicial',
      bank: 'Banco',
    },
  },
};

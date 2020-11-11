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
    update: 'Modificar',
    go: 'Ir',
    cancel: 'Cancelar',
  },
  validation: {
    mixed: {
      required: 'Este campo es requerido',
    },
    string: {
      email: 'Este campo debe ser un correo',
      min: 'Debe tener al menos {{value}} caracteres',
    },
    number: {
      min: 'Debe ser mayor que {{value}}',
    },
    date: {
      max: 'Debe ser antes de {{value}}',
    },
    custom: {
      notOneOf: 'Debe ser distinto de {{value}}',
      invalidOption: 'Opción inválida',
      passwordsDontMatch: 'Las contraseñas no coinciden',
      username: "Solo puede contener números, letras, '-', '_' y '.'",
    },
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
  tables: {
    actions: 'Acciones',
  },
  movements: {
    title: 'Mis movimientos',
    transaction: 'Transacción',
    transfer: 'Transferencia',
    atLeastOneAccount: 'Necesitas al menos una cuenta para ver esto',
    atLeastTwoAccounts: 'Necesitas al menos dos cuentas para ver esto',
    noTransactionsCreated: 'Aún no creas transacciones',
    noTransfersCreated: 'Aún no creas transferencias',
    create: {
      transaction: 'Crear nueva transacción',
      transfer: 'Crear nueva transferencia',
    },
    tabs: {
      transactions: 'Transacciones',
      transfers: 'Transferencias',
      passive: 'Pasivos',
    },
    form: {
      amount: 'Monto',
      transactionType: 'Tipo de transacción',
      category: 'Categoría',
      memo: 'Nota',
      account: 'Cuenta',
      fromAccount: 'Cuenta de origen',
      toAccount: 'Cuenta de destino',
      issuedAt: 'Fecha',
    },
  },
  categories: {
    title: 'Mis categorías',
    create: 'Crear nueva categoría',
    expense: 'Gasto',
    income: 'Ingreso',
    form: {
      name: 'Nombre',
      type: 'Tipo',
      color: 'Color',
    },
  },
  users: {
    title: 'Usuarios',
    tabs: {
      active: 'Usuarios activos',
      deleted: 'Usuarios inactivos',
    },
    form: {
      name: 'Nombre',
      role: 'Rol',
    },
  },
  elements: {
    singular: {
      account: 'Cuenta',
      category: 'Categoría',
      transaction: 'Transacción',
      transfer: 'Transferencia',
      user: 'Usuario',
    },
    plural: {
      account: 'Cuentas',
      category: 'Categorías',
      transaction: 'Transacciones',
      transfer: 'Transferencias',
      user: 'Usuarios',
    },
  },
  snackbars: {
    success: {
      created: '{{value}} creada exitosamente',
      updated: '{{value}} modificada exitosamente',
      deleted: '{{value}} borrada exitosamente',
    },
  },
};

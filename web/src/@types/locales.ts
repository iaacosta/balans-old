export type Locale = 'en' | 'es';

type AuthKeys =
  | 'auth:common:login'
  | 'auth:common:signup'
  | 'auth:common:username'
  | 'auth:common:password'
  | 'auth:loginPage:title'
  | 'auth:loginPage:subtitle'
  | 'auth:loginPage:rememberMe'
  | 'auth:signUpPage:title'
  | 'auth:signUpPage:subtitle'
  | 'auth:signUpPage:firstName'
  | 'auth:signUpPage:lastName'
  | 'auth:signUpPage:email'
  | 'auth:signUpPage:confirmPassword';

type NavbarKeys =
  | 'navbar:dashboard'
  | 'navbar:accounts'
  | 'navbar:movements'
  | 'navbar:categories'
  | 'navbar:places'
  | 'navbar:people'
  | 'navbar:users'
  | 'navbar:exit'
  | 'navbar:en'
  | 'navbar:es';

export type LocaleKeys = AuthKeys | NavbarKeys;

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

type FormKeys = 'forms:create' | 'forms:go' | 'forms:cancel';

type AccountKeys =
  | 'accounts:title'
  | 'accounts:noDebitAccounts'
  | 'accounts:checking'
  | 'accounts:vista'
  | 'accounts:cash'
  | 'accounts:tabs:debit'
  | 'accounts:tabs:credit'
  | 'accounts:create:debit'
  | 'accounts:create:credit'
  | 'accounts:form:title'
  | 'accounts:form:name'
  | 'accounts:form:type'
  | 'accounts:form:initialBalance'
  | 'accounts:form:bank';

export type LocaleKeys = AuthKeys | NavbarKeys | FormKeys | AccountKeys;

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

type FormKeys = 'forms:create' | 'forms:update' | 'forms:go' | 'forms:cancel';

type TableKeys = 'tables:actions';

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

type MovementKeys =
  | 'movements:title'
  | 'movements:transaction'
  | 'movements:transfer'
  | 'movements:atLeastOneAccount'
  | 'movements:atLeastTwoAccounts'
  | 'movements:noTransactionsCreated'
  | 'movements:noTransfersCreated'
  | 'movements:create:transaction'
  | 'movements:create:transfer'
  | 'movements:tabs:transactions'
  | 'movements:tabs:transfers'
  | 'movements:tabs:passive'
  | 'movements:form:amount'
  | 'movements:form:transactionType'
  | 'movements:form:category'
  | 'movements:form:memo'
  | 'movements:form:account'
  | 'movements:form:fromAccount'
  | 'movements:form:toAccount'
  | 'movements:form:issuedAt';

type CategoryKeys =
  | 'categories:title'
  | 'categories:create'
  | 'categories:expense'
  | 'categories:income'
  | 'categories:form:name'
  | 'categories:form:type'
  | 'categories:form:color';

type UserKeys =
  | 'users:title'
  | 'users:tabs:active'
  | 'users:tabs:deleted'
  | 'users:form:name'
  | 'users:form:role';

type ValidationKeys =
  | 'validation:mixed:required'
  | 'validation:string:email'
  | 'validation:string:min'
  | 'validation:number:min'
  | 'validation:date:max'
  | 'validation:custom:notOneOf'
  | 'validation:custom:invalidOption'
  | 'validation:custom:username'
  | 'validation:custom:passwordsDontMatch';

type ElementKeys =
  | 'elements:singular:account'
  | 'elements:singular:category'
  | 'elements:singular:transaction'
  | 'elements:singular:transfer'
  | 'elements:singular:user'
  | 'elements:plural:account'
  | 'elements:plural:category'
  | 'elements:plural:transaction'
  | 'elements:plural:transfer'
  | 'elements:plural:user';

type SnackbarKeys =
  | 'snackbars:success:created'
  | 'snackbars:success:updated'
  | 'snackbars:success:deleted'
  | 'snackbars:errors:unknown';

export type LocaleKeys =
  | AuthKeys
  | NavbarKeys
  | FormKeys
  | AccountKeys
  | TableKeys
  | MovementKeys
  | CategoryKeys
  | UserKeys
  | ValidationKeys
  | ElementKeys
  | SnackbarKeys;

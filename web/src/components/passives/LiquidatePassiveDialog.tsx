/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Grid, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import { useLocale } from '../../hooks/utils/useLocale';
import { useMyDebitAccounts, useLiquidatePassive } from '../../hooks/graphql';
import DialogFormContext from '../../contexts/DialogFormContext';

type Props = {
  passive: { id: string };
};

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const LiquidatePassiveDialog: React.FC<Props> = ({ passive }) => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [liquidatePassive, { loading: liquidateLoading }] = useLiquidatePassive();

  return (
    <Formik
      initialValues={{
        liquidatedAccountId: (accounts && accounts[0].id) || '',
      }}
      validationSchema={yup.object().shape({
        liquidatedAccountId: yup.string().required(),
      })}
      onSubmit={(values) => liquidatePassive(passive.id, values, onClose)}
    >
      {() => (
        <Form className={classes.form}>
          <DialogTitle>
            {locale('forms:liquidate')} {locale('elements:singular:passive').toLowerCase()}
          </DialogTitle>
          <DialogContent>
            {accountsLoading || !accounts ? (
              <ContainerLoader />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="liquidatedAccountId"
                    label={locale('elements:singular:liquidatedAccount')}
                    fullWidth
                    displayEmpty
                    options={accounts.map(({ id, name, bank }) => ({
                      key: id,
                      label: `${name} (${bank})`,
                    }))}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogFormButtons loading={liquidateLoading}>
            {locale('forms:liquidate')}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default LiquidatePassiveDialog;

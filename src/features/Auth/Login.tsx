import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {login} from "./auth-reducer";

import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from "./selectors";
import {authActions} from "./index";
import {useAppDispatch} from "../../utils/redux-utils";

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
};

export const Login = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            // const errors: FormikErrorType = {}
            const errors: any = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            return errors
        },
        onSubmit: async (values: FormValuesType, formikHelpers:FormikHelpers<FormValuesType>) => {
            const action = await dispatch<any>(authActions.login(values));

            if(login.rejected.match(action)) {
                if(action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        },
    });

    if(isLoggedIn) {
        return <Navigate to={'/ '}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'} control={<Checkbox
                            {...formik.getFieldProps('rememberMe')}
                            checked={formik.values.rememberMe}
                        />}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
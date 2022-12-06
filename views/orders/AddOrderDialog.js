import { DialogTitle, DialogContent, Grid, Box, Typography, Dialog, Select, FormControl, MenuItem, TextField, InputAdornment, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DialogCloseButton, useClient } from '../../components/';
import * as Icons from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { preventDefault, getErrorInfo, isHttpError, getPath, setQueryParams } from '../../utils';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useContextualRouting } from '../routes.views';
import { CLIENT_URL } from '../../client';


const AddOrderDialog = ({ match, ...props }) => {
    const router = useRouter();
    const client = useClient();

    const form = useForm();
    const formState = form.formState;

    const orderId = match.params.orderId;
    const action = match.params.action;
    const returnUrl = router.query.returnUrl || '/';

    const { getPagePath, constructLink } = useContextualRouting();

    const [fetcher, setFetcher] = useState({ state: 'initializing' });
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (inputs) => {
        try {
            setFetcher({ state: 'submitting' });

            await ({
                'add': () => client.post('/orders', inputs),
                'edit': () => client.put(`/orders/${orderId}`, inputs),
                'delete': () => client.delete(`/orders/${orderId}`)
            }[action])();

            enqueueSnackbar({
                'add': 'Sales order added',
                'edit': 'Sales order updated',
                'delete': 'Sales order deleted'
            }[action], { variant: 'success' });


            form.clearErrors();

            const link = constructLink(returnUrl, { refresh: true });
            router.push(link.href, link.as);

            setFetcher({ state: 'idle' });
        }
        catch (error) {
            setFetcher({ state: 'idle', error });
            console.error(error);

            if (isHttpError(error)) {
                form.clearErrors();
                form.handleSubmit(() => {
                    const inputErrors = error?.response?.data?.errors || {};
                    Object.entries(inputErrors).forEach(([name, message]) => form.setError(name, { type: 'server', message: message?.join('\n') }));
                })();

                enqueueSnackbar(getErrorInfo(error).title, { variant: 'error' });
            }
            else {
                enqueueSnackbar(getErrorInfo(error).title, { variant: 'error' });
            }
        }
    };

    const onLoad = async () => {

        if (!client.user) {
            const link = constructLink(setQueryParams('/account/signin', { returnUrl: router.asPath }));
            router.replace(link.href, link.as);
            return;
        }

        form.reset({
            price: 0,
            status: 'pending'
        });

        if (action == 'edit') {
            try {
                const response = await client.get(`/orders/${orderId}`);
                form.reset(response.data);
            }
            catch (error) {
                enqueueSnackbar('Unable to load sales order.', { variant: 'error' });
                close();
                return;
            }
        }

        setFetcher({ state: 'idle' });
    };

    const onClose = () => {
        router.push(getPagePath());
    };

    useEffect(() => {
        onLoad();
    }, []);

    if (fetcher.state == 'initializing') return;

    return (
        <Dialog {...props} maxWidth={action == "delete" ? "xs" : "sm"} onClose={onClose}>
            <DialogTitle component="div" sx={{ pt: 3, pb: 0 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {{
                        'add': 'Add sales order',
                        'edit': 'Edit sales order',
                        'delete': 'Delete sales order'
                    }[action]}
                </Typography>
                <DialogCloseButton onClose={onClose} />
            </DialogTitle>
            <Box component={"form"} onSubmit={preventDefault(() => onSubmit({ ...form.watch() }))}>
                {(action == 'add' || action == 'edit') &&
                    <DialogContent sx={{ px: 4, pb: 0 }}>

                        <Grid container pt={1} pb={2} spacing={3}>
                            <Grid item xs={12}>
                                <Controller
                                    name="product"
                                    control={form.control}
                                    render={({ field }) => <TextField {...field}
                                        label="Product"
                                        variant="outlined"
                                        error={!!formState.errors.product}
                                        helperText={formState.errors.product?.message}
                                        fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="customer"
                                    control={form.control}
                                    render={({ field }) => <TextField {...field}
                                        label="Customer"
                                        variant="outlined"
                                        error={!!formState.errors.customer}
                                        helperText={formState.errors.customer?.message}
                                        fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="price"
                                    control={form.control}
                                    render={({ field }) =>
                                        <TextField {...field}
                                            label="Price"
                                            variant="outlined"
                                            error={!!formState.errors.price}
                                            helperText={formState.errors.price?.message}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start">GHS</InputAdornment>),
                                            }}
                                        />
                                    } />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field }) =>
                                        <TextField {...field}
                                            select
                                            label="Status"
                                            variant="outlined"
                                            error={!!formState.errors.status}
                                            helperText={formState.errors.status?.message}
                                            fullWidth
                                        >
                                            {[
                                                { label: 'Pending', value: 'pending' },
                                                { label: 'Processing', value: 'processing' },
                                                { label: 'Delivering', value: 'delivering' },
                                                { label: 'Completed', value: 'completed' },
                                                { label: 'Cancelled', value: 'cancelled' }
                                            ].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    } />

                            </Grid>
                            <Grid item xs={12}>
                                <Box mb={3}>
                                    <LoadingButton startIcon={<></>} loading={fetcher.state == 'submitting'} loadingPosition="start" type="submit" fullWidth variant="contained" size="large">
                                        Save
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>

                    </DialogContent>
                }
                {action == 'delete' &&
                    <>
                        <DialogContent>
                            <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                                Are you sure you want to delete this sales order?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { onClose(); }}>Cancel</Button>
                            <LoadingButton startIcon={<></>} loading={fetcher.state == 'submitting'} loadingPosition="center" type="submit" color="error" variant="text">
                                Delete
                            </LoadingButton>
                        </DialogActions>
                    </>
                }
            </Box>
        </Dialog>
    );
};

export default AddOrderDialog;
import Head from 'next/head';
import Image from 'next/image';
import { useContextualRouting } from '../views/routes.views';
import LinkContainer from 'next/link';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useClient } from '../components';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home(props) {

  const router = useRouter();
  const client = useClient();
  const { constructLink } = useContextualRouting();

  const [data, setData] = useState({
    error: false,
    loading: true,
    rows: [],
    rowsPerPageOptions: [15, 30, 60],
    rowCount: 0,
    pageSize: 5,
    page: 1
  });
  const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

  const fetchData = async () => {
    try {
      updateData("loading", true);
      const response = await client.get('/orders', { params: { page: data.page, pageSize: data.pageSize } });
      updateData("rowCount", response.data.totalItems);
      updateData("rows", response.data.items);
      updateData("loading", false);
      updateData("error", false);
    }
    catch (error) {
      updateData("rowCount", 0);
      updateData("rows", []);
      updateData("loading", false);
      updateData("error", true);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90
    },
    {
      field: 'product',
      headerName: 'Product',
      width: 150,
      editable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      editable: false,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 150,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      editable: false,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 160,
      renderCell: (params) =>
        <>
          <LinkContainer href={`/orders/${params.id}/edit`} passHref><Button variant="text">Edit</Button></LinkContainer>
          <LinkContainer href={`/orders/${params.id}/delete`} passHref><Button variant="text" color="error">Delete</Button></LinkContainer>
        </>,
    }
  ];

  useEffect(() => {
    fetchData();
  }, [data.page, data.pageSize]);

  useEffect(() => {
    if (router.query.refresh)
      fetchData();
  }, [router.query.refresh])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ height: "100vh", pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs>
            <Typography variant="h5" component="h1">Sales Orders</Typography>
          </Grid>
          <Grid item xs="auto">
            <LinkContainer href="/orders/add" passHref><Button variant="contained">Add Sales Order</Button></LinkContainer>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 512, width: '100%' }} component={Paper}>
              <DataGrid
                components={{
                  NoRowsOverlay: () => <GridOverlay>
                    <Stack alignItems="center" justifyContent="center" spacing={2}>
                      {<Box>{!data.error ? 'No sales orders.' : 'Unable to load sales orders.'}</Box>}
                      <Button sx={{ zIndex: 100, pointerEvents: "auto" }} variant="outlined" onClick={() => fetchData()}>
                        Reload
                      </Button>
                    </Stack>
                  </GridOverlay>
                }}
                pagination
                paginationMode="server"
                loading={data.loading}
                rowCount={data.rowCount}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page - 1}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(page) => {
                  console.log(page)
                  updateData("page", page + 1);
                }}
                onPageSizeChange={(pageSize) => {
                  updateData("page", 1);
                  updateData("pageSize", pageSize);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}


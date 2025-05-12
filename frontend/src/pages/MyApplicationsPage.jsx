import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Table, Badge, Group, Center, Anchor, Paper, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import classes from './MyApplicationsPage.module.css';

function MyApplicationsPage() {
    const { token, isLoading: authLoading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!token) { setError("Authentication required."); setLoading(false); return; }
            setLoading(true); setError(null);
            try {
                const response = await axios.get('/api/applications/me', { headers: { Authorization: `Bearer ${token}` } });
                setApplications(response.data);
            } catch (err) { console.error("Error fetching applications:", err); setError("Failed to load applications."); }
            finally { setLoading(false); }
        };
        if (!authLoading) { fetchApplications(); }
        else { setLoading(false); }
    }, [token, authLoading]);

    const rows = applications.map((app) => (
        <tr key={app.id}>
            <td><Anchor component={Link} to={`/jobs/${app.job?.id}`} size="sm" fw={500}>{app.job?.title || 'N/A'}</Anchor></td>
            <td>{app.job?.companyName || 'N/A'}</td>
            <td>{format(new Date(app.createdAt), 'PP')}</td>
            <td>
                <Badge
                    color={app.status === 'applied' ? 'blue' : app.status === 'viewed' ? 'yellow' : app.status === 'shortlisted' ? 'green' : app.status === 'rejected' ? 'red' : 'gray'}
                    variant="light" style={{ textTransform: 'capitalize' }} size="sm">
                    {app.status}
                </Badge>
            </td>
        </tr>
    ));

    if (authLoading) { return <Container pt="xl"><Center><Loader /></Center></Container>; }

    return (
        <Container size="lg" my="xl">
            <Title order={1} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 60 }} mb="xl">
                My Applications
            </Title>
            <Paper withBorder shadow="md" radius="md" p="lg">
                <Title order={4} mb="md" c="primary.8" tt="uppercase" fw={600}>Application History</Title>
                {loading ? (
                    <Center p="xl"><Loader /></Center>
                ) : error ? (
                    <Alert color="red" title="Error">{error}</Alert>
                ) : applications.length === 0 ? (
                    <Text c="dimmed" p="md">You haven't applied to any jobs yet.</Text>
                ) : (
                    <Box style={{ overflowX: 'auto' }}>
                        <Table className={classes.myAppsTable} striped highlightOnHover withBorder verticalSpacing="sm" fontSize="sm" miw={600}>
                             <colgroup>
                                <col style={{width: '40%'}} />
                                <col style={{width: '25%'}} />
                                <col style={{width: '20%'}} />
                                <col style={{width: '15%'}} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Job Title</th><th>Company</th><th>Applied On</th><th>Status</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
export default MyApplicationsPage;
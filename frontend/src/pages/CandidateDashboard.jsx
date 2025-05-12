import React, { useState, useEffect } from 'react';
import {
    Container, Title, Text, Loader, Alert, Table, Badge, Group, Center, Anchor, Paper,
    Grid,
    ThemeIcon,
    Box,
    Button,
    Stack
} from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { IconClipboardList, IconBookmark, IconUserCircle } from '@tabler/icons-react';
import classes from './Dashboard.module.css';

function CandidateDashboard() {
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
            <td><Anchor component={Link} to={`/jobs/${app.job?.id}`} size="sm">{app.job?.title || 'N/A'}</Anchor></td>
            <td>{app.job?.companyName || 'N/A'}</td>
            <td>{format(new Date(app.createdAt), 'PP')}</td>
            <td>
                <Badge color={app.status === 'applied' ? 'blue' : app.status === 'viewed' ? 'yellow' : app.status === 'rejected' ? 'red' : 'gray'} variant="light" style={{ textTransform: 'capitalize' }} size="sm"> {app.status} </Badge>
            </td>
        </tr>
    ));

    if (authLoading) { return <Container pt="xl"><Center><Loader /></Center></Container>; }

    return (
        <Container size="lg" my="xl">
            <Group justify="space-between" mb="xl">
                 <Title
                    order={1}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 60 }}
                >
                    My Dashboard
                </Title>
            </Group>

            <Grid gutter="md" mb="xl">
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Paper withBorder p="md" radius="md" shadow="sm" className={classes.summaryCard} >
                        <Group>
                            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                <IconClipboardList size="1.8rem" />
                            </ThemeIcon>
                            <Stack spacing={0}>
                                 <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Applications Sent</Text>
                                 <Text fw={700} size="xl">{loading ? <Loader size="xs"/> : applications.length}</Text>
                             </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                     <Paper withBorder p="md" radius="md" shadow="sm"  className={classes.summaryCard} >
                        <Group>
                            <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                                <IconBookmark size="1.8rem" />
                            </ThemeIcon>
                             <Stack spacing={0}>
                                 <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Saved Jobs</Text>
                                 <Text fw={700} size="xl">N/A</Text>
                             </Stack>
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>

            <Paper withBorder shadow="md" radius="md" p="lg">
                <Title order={4} mb="md" c="primary.8" tt="uppercase" fw={600}>My Applications</Title>
                <Button component={Link} to="/profile" size="sm" variant='outline'>
                     View/Edit Profile
                 </Button>
                {loading ? (
                     <Center p="xl"><Loader /></Center>
                 ) : error ? (
                     <Alert color="red" title="Error">{error || 'Could not load applications.'}</Alert>
                 ) : applications.length === 0 ? (
                    <Text c="dimmed" p="md">You haven't applied to any jobs yet.</Text>
                ) : (
                    <Box style={{ overflowX: 'auto' }}>
                        <Table  className={classes.jobTable}  striped highlightOnHover withBorder verticalSpacing="sm" fontSize="sm" miw={500}>
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
export default CandidateDashboard;
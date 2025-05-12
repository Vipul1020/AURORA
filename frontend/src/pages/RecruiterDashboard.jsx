import React, { useState, useEffect } from 'react';
import {
    Container, Title, Text, Loader, Alert, Table, Button, Group, Center, Paper, Anchor,
    Grid, ThemeIcon, Box, Stack, Skeleton
} from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { IconEdit, IconEye, IconTrash, IconPlus, IconUsers, IconBriefcase } from '@tabler/icons-react';
import classes from './Dashboard.module.css';

const StatCardSkeleton = () => ( <Paper withBorder p="md" radius="md" shadow="sm"><Group><Skeleton height={48} circle /><Stack spacing="xs"><Skeleton height={10} width={100} radius="xl" /><Skeleton height={18} width={50} radius="xl" /></Stack></Group></Paper> );
const JobSkeletonRow = () => ( <tr><td><Skeleton height={12} radius="xl" width="80%" /></td><td><Skeleton height={12} radius="xl" width="60%" /></td><td><Skeleton height={12} radius="xl" width="50%" /></td><td><Skeleton height={28} radius="xl" width="100%" /></td></tr> );


function RecruiterDashboard() {
    const { token, isLoading: authLoading } = useAuth();
    const [postedJobs, setPostedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostedJobs = async () => {
            if (!token) { setError("Authentication required."); setLoading(false); return; }
            setLoading(true); setError(null);
            try {
                const response = await axios.get('/api/jobs/my-postings/all', { headers: { Authorization: `Bearer ${token}` } });
                setPostedJobs(response.data);
            } catch (err) { console.error("Error fetching posted jobs:", err); setError("Failed to load your posted jobs."); }
            finally { setLoading(false); }
        };
        if (!authLoading && token) { fetchPostedJobs(); }
        else if (!authLoading && !token) { setError("Authentication required."); setLoading(false); }
    }, [token, authLoading]);

    const jobRows = postedJobs.map((job) => (
        <tr key={job.id}>
            <td><Anchor component={Link} to={`/jobs/${job.id}`} size="sm" fw={500}>{job.title}</Anchor></td>
            <td>{job.location || 'N/A'}</td>
            <td>{format(new Date(job.createdAt), 'PP')}</td>
            <td>
                <Group spacing="xs" noWrap>
                     <Button component={Link} to={`/jobs/${job.id}/applicants`} variant="subtle" size="xs" color="green" title="View Applicants" className={classes.actionButton}><IconUsers size="1rem" /></Button>
                     <Button component={Link} to={`/jobs/${job.id}`} variant="subtle" size="xs" color="blue" title="View Job Posting" className={classes.actionButton}><IconEye size="1rem" /></Button>
                     <Button component={Link} to={`/jobs/${job.id}/edit`} variant="subtle" size="xs" color="yellow" title="Edit Job" className={classes.actionButton}><IconEdit size="1rem" /></Button>
                     <Button component={Link} to={`/jobs/${job.id}`} variant="subtle" size="xs" color="red" title="Delete Job (via Detail Page)" className={classes.actionButton}><IconTrash size="1rem" /></Button>
                 </Group>
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
                    Recruiter Dashboard
                </Title>
            </Group>

            <Grid gutter="md" mb="xl">
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    {loading ? <StatCardSkeleton /> : (
                        <Paper withBorder p="md" radius="md" shadow="sm" className={classes.summaryCard}>
                             <Group><ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} ><IconBriefcase size="1.8rem" /></ThemeIcon><Stack spacing={0}><Text c="dimmed" size="xs" tt="uppercase" fw={700}>Jobs Posted</Text><Text fw={700} size="xl">{postedJobs.length}</Text></Stack></Group>
                        </Paper>
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                     {loading ? <StatCardSkeleton /> : (
                         <Paper withBorder p="md" radius="md" shadow="sm" className={classes.applicantsCard}>
                            <Group><ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'teal', to: 'lime' }}><IconUsers size="1.8rem" /></ThemeIcon><Stack spacing={0}><Text c="dimmed" size="xs" tt="uppercase" fw={700}>Total Applicants</Text><Text fw={700} size="xl">N/A</Text></Stack></Group>
                         </Paper>
                     )}
                </Grid.Col>
            </Grid>

            <Paper withBorder shadow="md" radius="md" p="lg">
                 <Group justify="space-between" mb="md">
                     <Title order={4} c="primary.8" tt="uppercase" fw={600}>My Job Postings</Title>
                     <Button component={Link} to="/post-job" size="xs"><Group spacing="xs" noWrap><IconPlus size="1rem" stroke={1.5} /><Text span>Post Job</Text></Group></Button>
                 </Group>
                 {loading ? (
                     <Table verticalSpacing="sm" fontSize="sm" miw={600}><thead><tr><th>Job Title</th><th>Location</th><th>Posted</th><th>Actions</th></tr></thead><tbody><JobSkeletonRow /><JobSkeletonRow /><JobSkeletonRow /></tbody></Table>
                 ) : error ? ( <Alert color="red" title="Error">{error || 'Could not load posted jobs.'}</Alert>
                 ) : postedJobs.length === 0 ? ( <Text c="dimmed" p="md">You haven't posted any jobs yet.</Text>
                 ) : (
                    <Box style={{ overflowX: 'auto' }}>
                        <Table className={classes.jobTable} striped highlightOnHover withBorder verticalSpacing="sm" fontSize="sm" miw={600} sx={{ '& th, & td': { textAlign: 'left' } }}>
                             <colgroup><col style={{width: '40%'}} /><col style={{width: '20%'}} /><col style={{width: '20%'}} /><col style={{width: '20%'}} /></colgroup>
                             <thead><tr><th>Job Title</th><th>Location</th><th>Posted</th><th>Actions</th></tr></thead>
                             <tbody>{jobRows}</tbody>
                        </Table>
                    </Box>
                 )}
            </Paper>

             <Paper withBorder shadow="md" p="lg" radius="md" mt="xl">
                 <Title order={4} mb="md" c="dimmed" tt="uppercase" fw={600}>Recent Applicants</Title>
                 <Text c="dimmed">A summary of recent applicants will appear here.</Text>
             </Paper>
        </Container>
    );
}
export default RecruiterDashboard;
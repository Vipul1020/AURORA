// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'; // Ensure React is imported
import axios from 'axios';
import { Container, Title, SimpleGrid, Card, Text, Badge, Button, Group, Loader, Alert, TextInput, Box, Paper, Stack, Skeleton, Center, Grid } from '@mantine/core'; // Make sure Center and Grid are imported if used
import { Link } from 'react-router-dom';
// import { IconSearch } from '@tabler/icons-react'; // Not used in final example
import classes from './HomePage.module.css';

// --- Skeleton Component for Job Card (remains the same) ---
const JobCardSkeleton = () => (
    <Paper withBorder p="lg" radius="md"> <Stack> <Group justify="space-between"> <Skeleton height={20} width="70%" radius="sm" /> <Skeleton height={20} width={50} radius="sm" /> </Group> <Skeleton height={12} width="50%" radius="sm" mt={4} /> <Skeleton height={10} mt="md" radius="sm" /> <Skeleton height={10} mt="xs" radius="sm" /> <Skeleton height={10} mt="xs" width="80%" radius="sm" /> <Group spacing="xs" mt="sm"> <Skeleton height={18} width={60} radius="xl" /> <Skeleton height={18} width={70} radius="xl" /> <Skeleton height={18} width={50} radius="xl" /> </Group> <Skeleton height={36} mt="md" radius="sm" /> </Stack> </Paper>
);
// ------------------------------------------------------------

function HomePage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- fetchJobs, handleSearch, handleKeyPress, useEffect for initial fetch (remain the same) ---
    const fetchJobs = async (keywords = '') => { setLoading(true); setError(null); let apiUrl = '/api/jobs'; if (keywords) { apiUrl += `?keywords=${encodeURIComponent(keywords)}`; } console.log("Fetching jobs from:", apiUrl); try { const response = await axios.get(apiUrl); setJobs(response.data); } catch (err) { console.error("Error fetching jobs:", err); setError('Failed to fetch jobs.'); setJobs([]); } finally { setLoading(false); } };
    useEffect(() => { fetchJobs(); }, []);
    const handleSearch = () => { fetchJobs(searchTerm); };
    const handleKeyPress = (event) => { if (event.key === 'Enter') { handleSearch(); } };
    // ---------------------------------------------------------------------------------------------

    return (
        <Container fluid p="md">
            <Title order={2} mb="lg">Available Jobs</Title>

            {/* --- Search Bar (remains the same) --- */}
            <Box mb="lg"> <Group> <TextInput placeholder="Search by keywords..." value={searchTerm} onChange={(event) => setSearchTerm(event.currentTarget.value)} onKeyDown={handleKeyPress} style={{ flex: 1 }} /> <Button onClick={handleSearch} loading={loading && jobs.length === 0}>Search</Button> <Button variant="outline" onClick={() => { setSearchTerm(''); fetchJobs(''); }} disabled={loading}>Clear</Button> </Group> </Box>
            {/* ----------------------------------- */}

            {/* --- Conditional Rendering for Content --- */}
            {error && <Alert title="Error" color="red" mt="md">{error}</Alert>}

            {loading ? (
                // Render Skeletons when loading
                <SimpleGrid cols={3} spacing="lg" breakpoints={[ { maxWidth: 'md', cols: 2, spacing: 'md' }, { maxWidth: 'sm', cols: 1, spacing: 'sm' } ]} >
                    {[1, 2, 3, 4, 5, 6].map((_, index) => <JobCardSkeleton key={index} />)}
                </SimpleGrid>
            ) : !error && jobs.length === 0 ? (
                // Render No Jobs message if not loading, no error, and no jobs
                // Use Center component directly, no Grid.Col needed here
                <Center mt="xl" style={{width: '100%'}}>
                    <Text c="dimmed">No jobs found{searchTerm ? ` matching "${searchTerm}"` : ' yet'}.</Text>
                </Center>
            ) : !error && jobs.length > 0 ? (
                // Render actual Job Cards if not loading, no error, and jobs exist
                <SimpleGrid cols={3} spacing="lg" breakpoints={[ { maxWidth: 'md', cols: 2, spacing: 'md' }, { maxWidth: 'sm', cols: 1, spacing: 'sm' } ]} >
                    {jobs.map((job) => (
                        <Card className={classes.jobCard} shadow="sm" padding="lg" radius="md" withBorder key={job.id} >
                            <Box className={classes.cardContent}>
                                <Group justify="space-between" mt="md" mb="xs"> <Text fw={500}>{job.title}</Text> {job.jobType && <Badge color="pink" variant="light">{job.jobType}</Badge>} </Group>
                                <Text size="sm" c="dimmed" mb="sm">{job.companyName || 'N/A'} - {job.location || 'Remote'}</Text>
                                <Text size="sm" c="dimmed" lineClamp={3} mb="md">{job.description}</Text>
                                {job.keywords && job.keywords.length > 0 && ( <Box mb="md"> <Group spacing="xs"> {job.keywords.slice(0, 4).map((keyword) => ( <Badge key={keyword} variant="outline" size="sm">{keyword}</Badge> ))} {job.keywords.length > 4 && <Badge variant='transparent' size='sm'>...</Badge>} </Group> </Box> )}
                            </Box>
                            <Button variant="light" color="blue" fullWidth mt="auto" radius="md" component={Link} to={`/jobs/${job.id}`}> View Details </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : null /* Fallback, should not be reached if logic is correct */ }
            {/* ------------------------------------ */}
        </Container>
    );
}

export default HomePage;
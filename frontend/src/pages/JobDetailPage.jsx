import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Title,
    Text,
    Paper,
    Badge,
    Group,
    Loader,
    Alert,
    Button,
    Divider,
    Stack,
    Box,
    SimpleGrid,
    Card,
    Modal,
    Center,
    Skeleton
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconEye, IconTrash, IconPlus, IconUsers, IconBriefcase, IconLogout, IconLogin, IconUserPlus } from '@tabler/icons-react';


const formatSalary = (min, max, currency, period) => {
    const currSymbol = currency === 'INR' ? '₹' : (currency || '');
    const per = period ? `/${period.toLowerCase()}` : '';
    let salaryString = '';
    if (min && max) {
        salaryString = `${currSymbol}${min.toLocaleString()} - ${currSymbol}${max.toLocaleString()}${per}`;
    } else if (min) {
        salaryString = `From ${currSymbol}${min.toLocaleString()}${per}`;
    } else if (max) {
        salaryString = `Up to ${currSymbol}${max.toLocaleString()}${per}`;
    } else {
        return null;
    }
    return salaryString;
};

const JobDetailSkeleton = () => (
    <Paper withBorder p="lg" radius="md" shadow="md">
        <Stack>
            <Group justify="space-between"> <Skeleton height={30} width="60%" radius="sm" /> <Skeleton height={24} width={80} radius="sm" /> </Group>
            <Skeleton height={15} width="40%" radius="sm" mt="sm" /> <Skeleton height={15} width="30%" radius="sm" /> <Skeleton height={15} width="35%" radius="sm" /> <Skeleton height={15} width="45%" radius="sm" />
            <Divider my="sm" /> <Skeleton height={18} width="25%" radius="sm" />
            <Group spacing="xs"> <Skeleton height={20} width={60} radius="xl" /> <Skeleton height={20} width={70} radius="xl" /> <Skeleton height={20} width={50} radius="xl" /> </Group>
            <Divider my="sm" /> <Skeleton height={20} width="30%" radius="sm" />
            <Skeleton height={12} mt="xs" radius="sm" /> <Skeleton height={12} mt="xs" radius="sm" /> <Skeleton height={12} mt="xs" radius="sm" />
            <Skeleton height={36} mt="xl" radius="sm" />
        </Stack>
    </Paper>
);

const RecoSkeletonCard = () => ( <Paper withBorder p="sm" radius="md"><Stack> <Skeleton height={14} width="80%" radius="sm" /> <Skeleton height={10} width="60%" radius="sm" /> <Skeleton height={28} mt="sm" radius="sm" /> </Stack></Paper> );

function JobDetailPage() {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recsLoading, setRecsLoading] = useState(true);
    const [recsError, setRecsError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [applyLoading, setApplyLoading] = useState(false);

    useEffect(() => { if (!authLoading && job && user) { setIsOwner(user.id === job.recruiterId); } else if (!authLoading) { setIsOwner(false); } }, [job, user, authLoading]);

    useEffect(() => {
        const fetchJobDetails = async () => { setLoading(true); setIsOwner(false); setRecommendations([]); setRecsLoading(true); setRecsError(null); setError(null); setJob(null); try { const response = await axios.get(`/api/jobs/${jobId}`); setJob(response.data); } catch (err) { console.error(`Error fetching job ${jobId}:`, err); if (err.response && err.response.status === 404) { setError('Job not found.'); } else { setError('Failed to fetch job details.'); } } finally { setLoading(false); } };
        if (jobId && !authLoading) { fetchJobDetails(); } else if (authLoading) { setLoading(true); }
    }, [jobId, authLoading]);

    useEffect(() => {
        if (job && job.keywords && job.keywords.length > 0) { const fetchRecommendations = async () => { setRecsLoading(true); setRecsError(null); try { const response = await axios.get(`/api/jobs/${jobId}/recommendations`); setRecommendations(response.data); } catch (err) { console.error(`Error fetching recs:`, err); setRecsError('Could not load recs.'); } finally { setRecsLoading(false); } }; fetchRecommendations(); } else { setRecommendations([]); setRecsLoading(false); }
    }, [job, jobId]);

    const handleDeleteJob = async () => { setDeleteLoading(true); const token = localStorage.getItem('authToken'); if (!token) { notifications.show({ title: 'Error', message: 'Authentication required.', color: 'red' }); setDeleteLoading(false); closeDeleteModal(); navigate('/login'); return; } try { const response = await axios.delete(`/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } }); if (response.status === 200 || response.status === 204) { notifications.show({ title: 'Success', message: 'Job deleted successfully!', color: 'green' }); navigate('/'); } else { throw new Error(`Unexpected status code: ${response.status}`); } } catch (err) { console.error("Delete job error:", err); let errorMsg = 'Failed to delete job.'; if (err.response) { if (err.response.status === 403) { errorMsg = 'Not authorized.'; } else if (err.response.data?.message) { errorMsg = err.response.data.message; } } notifications.show({ title: 'Error', message: errorMsg, color: 'red' }); setDeleteLoading(false); closeDeleteModal(); } };

    const handleApply = async () => { if (!isAuthenticated || user?.role !== 'candidate') { notifications.show({ title: 'Action Required', message: 'Please log in as a candidate to apply.', color: 'yellow' }); navigate('/login', { state: { from: location } }); return; } setApplyLoading(true); const token = localStorage.getItem('authToken'); try { const response = await axios.post( `/api/jobs/${jobId}/apply`, {}, { headers: { Authorization: `Bearer ${token}` } } ); if (response.status === 201) { notifications.show({ title: 'Success', message: 'Application submitted successfully!', color: 'green' }); } else { throw new Error(`Unexpected status code: ${response.status}`); } } catch (err) { console.error("Apply job error:", err); let errorMsg = 'Failed to submit application.'; if (err.response) { if (err.response.status === 409) { errorMsg = 'Already applied.'; } else if (err.response.status === 403) { errorMsg = 'Only candidates can apply.'; } else if (err.response.status === 404) { errorMsg = 'Job not found.'; } else if (err.response.data?.message) { errorMsg = err.response.data.message; } } notifications.show({ title: 'Application Error', message: errorMsg, color: 'red' }); } finally { setApplyLoading(false); } };

    if (loading || authLoading) {
        return ( <Container size="lg" my="xl"> <JobDetailSkeleton /> <Title order={3} mt="xl" mb="md"><Skeleton height={24} width={150} /></Title> <SimpleGrid cols={3} spacing="md" breakpoints={[ { maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 } ]}><RecoSkeletonCard /><RecoSkeletonCard /><RecoSkeletonCard /></SimpleGrid> </Container> );
    }
    if (error) { return <Container pt="xl"><Alert title="Error" color="red">{error}</Alert></Container>; }
    if (!job) { return <Container pt="xl"><Text>Job data could not be loaded or the job does not exist.</Text></Container>; }

    const formattedSalary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);

    return (
        <>
            <Container size="lg" my="xl">
                 <Group justify="space-between" mb="lg"> <Button component={Link} to="/" variant="outline"> &larr; Back to Jobs </Button> {isOwner && ( <Group> <Button variant="outline" color="blue" onClick={() => navigate(`/jobs/${jobId}/edit`)}>Edit Job</Button> <Button variant="filled" color="red" onClick={openDeleteModal} loading={deleteLoading}>Delete Job</Button> </Group> )} </Group>
                <Paper shadow="md" p="lg" radius="md" withBorder mb="xl">
                   <Stack spacing="md">
                         <Group justify="space-between"> <Title order={2}>{job.title}</Title> {job.jobType && <Badge size="lg">{job.jobType}</Badge>} </Group>
                         <Group spacing="xs"> <Text fw={500}>Company:</Text> <Text>{job.companyName || 'N/A'}</Text> </Group>
                         <Group spacing="xs"> <Text fw={500}>Location:</Text> <Text>{job.location || 'Remote'}</Text> </Group>
                         {job.experienceLevel && ( <Group spacing="xs"> <Text fw={500}>Experience:</Text> <Text>{job.experienceLevel}</Text> </Group> )}
                         {formattedSalary && ( <Group spacing="xs"> <Text fw={500}>Salary:</Text> <Text>{formattedSalary}</Text> </Group> )}
                         {job.recruiter && ( <Group spacing="xs"> <Text fw={500}>Posted by:</Text> <Text>{job.recruiter.firstName || ''} {job.recruiter.lastName || ''} ({job.recruiter.email})</Text> </Group> )}
                         {job.keywords && job.keywords.length > 0 && ( <> <Divider my="xs" /> <Stack spacing="xs"> <Text fw={500}>Keywords / Skills:</Text> <Group spacing="xs"> {job.keywords.map((keyword) => ( <Badge key={keyword} variant="light" color="teal" size="sm">{keyword}</Badge> ))} </Group> </Stack> </> )}
                         <Divider my="sm" />
                         <Title order={4}>Job Description</Title>
                         <Box sx={{ whiteSpace: 'pre-wrap' }}> <Text >{job.description}</Text> </Box>
                         {isAuthenticated && user?.role === 'candidate' && ( <Button size="md" mt="xl" onClick={handleApply} loading={applyLoading}> Apply Now </Button> )}
                         {!isAuthenticated && ( <Button size="md" mt="xl" component={Link} to="/login" state={{ from: location }}> Log in to Apply </Button> )}
                   </Stack>
                </Paper>

                {recsLoading && ( <> <Title order={3} mt="xl" mb="md"><Skeleton height={24} width={150} /></Title> <SimpleGrid cols={3} spacing="md" breakpoints={[ { maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 } ]}><RecoSkeletonCard /><RecoSkeletonCard /><RecoSkeletonCard /></SimpleGrid> </> )}
                {recsError && <Alert title="Recommendation Error" color="yellow" mt="md" >{recsError}</Alert>}
                {!recsLoading && !recsError && recommendations.length > 0 && ( <> <Title order={3} mt="xl" mb="md">Similar Jobs</Title> <SimpleGrid cols={3} spacing="md" breakpoints={[ { maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 } ]}> {recommendations.map((recJob) => ( <Card shadow="sm" padding="sm" radius="md" withBorder key={recJob.id}> <Text fw={500} size="sm" truncate>{recJob.title}</Text> <Text size="xs" c="dimmed" truncate> {recJob.companyName || 'N/A'} - {recJob.location || 'Remote'} </Text> <Button component={Link} to={`/jobs/${recJob.id}`} variant="subtle" size="xs" fullWidth mt="sm"> View Job </Button> </Card> ))} </SimpleGrid> </> )}
            </Container>
            <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Deletion" centered> <Text>Are you sure?</Text> <Text c="red" fw={700}>Cannot be undone.</Text> <Group mt="xl" justify="flex-end"> <Button variant="default" onClick={closeDeleteModal} disabled={deleteLoading}> Cancel </Button> <Button color="red" onClick={handleDeleteJob} loading={deleteLoading}> Confirm Delete </Button> </Group> </Modal>
        </>
    );
}
export default JobDetailPage;
import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Table, Badge, Group, Center, Anchor, Select, Box, Paper, Button, Stack, Skeleton } from '@mantine/core';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { notifications } from '@mantine/notifications';
import classes from './JobApplicantsPage.module.css';

const SkeletonRow = () => (
    <tr>
        <td><Skeleton height={12} radius="xl" width="70%" /></td>
        <td><Skeleton height={12} radius="xl" width="90%" /></td>
        <td><Skeleton height={12} radius="xl" width="80%" /></td>
        <td><Skeleton height={12} radius="xl" width="50%" /></td>
        <td><Skeleton height={28} radius="sm" width="100%" /></td>
    </tr>
);

function JobApplicantsPage() {
    const { jobId } = useParams();
    const { token, isLoading: authLoading, user } = useAuth();
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    const APPLICATION_STATUSES = ['applied', 'viewed', 'shortlisted', 'rejected'];

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !jobId) { setError("Authentication required or Job ID missing."); setLoading(false); return; }
            setLoading(true); setError(null); setJobTitle(''); setApplicants([]);
            try {
                const appResponse = await axios.get(`/api/jobs/${jobId}/applicants`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplicants(appResponse.data);
                try {
                   const jobResponse = await axios.get(`/api/jobs/${jobId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setJobTitle(jobResponse.data.title);
                } catch (jobErr) {
                     console.error("Could not fetch job title", jobErr);
                }
            } catch (err) {
                console.error("Error fetching applicants:", err);
                if (err.response && (err.response.status === 403 || err.response.status === 404)) {
                    setError("Could not load applicants. You may not own this job or the job does not exist.");
                } else { setError("Failed to load applicants."); }
            } finally {
                setLoading(false);
            }
        };
        if (!authLoading && token) { fetchData(); }
        else if (!authLoading && !token) { setError("Authentication required."); setLoading(false); }
    }, [jobId, token, authLoading]);

    const handleStatusChange = async (applicationId, newStatus) => {
        if (!token || !newStatus) return;
        setUpdatingStatusId(applicationId);
        try {
            const response = await axios.put(`/api/applications/${applicationId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 200) {
                notifications.show({ title: 'Success', message: `Application status updated to ${newStatus}`, color: 'green' });
                setApplicants(prevApps => prevApps.map(app => app.id === applicationId ? { ...app, status: newStatus } : app ));
            } else { throw new Error(`Unexpected status code: ${response.status}`); }
        } catch (err) {
             console.error(`Error updating status for application ${applicationId}:`, err);
             let errorMsg = 'Failed to update status.'; if (err.response?.data?.message) errorMsg = err.response.data.message;
             notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
        } finally { setUpdatingStatusId(null); }
    };

    const rows = applicants.map((app) => (
        <tr key={app.id}>
            <td>{app.candidate?.firstName || ''} {app.candidate?.lastName || ''}</td>
            <td>{app.candidate?.email || 'N/A'}</td>
            <td>
                 {app.candidate?.skills && app.candidate.skills.length > 0 ? (
                    <Group spacing={4} sx={{maxWidth: 200}}>
                        {app.candidate.skills.slice(0, 3).map(skill => <Badge key={skill} size="xs" variant='outline'>{skill}</Badge>)}
                        {app.candidate.skills.length > 3 && <Badge size="xs" variant='transparent'>...</Badge>}
                    </Group>
                 ) : ( <Text size="xs" c="dimmed">No skills</Text> )}
            </td>
            <td>{format(new Date(app.createdAt), 'PP')}</td>
            <td>
                <Select
                    size="xs" value={app.status} withinPortal
                    data={APPLICATION_STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                    onChange={(value) => handleStatusChange(app.id, value)}
                    disabled={updatingStatusId === app.id}
                />
            </td>
        </tr>
    ));

    if (authLoading) { return <Container pt="xl"><Center><Loader /></Center></Container>; }

    return (
        <Container size="lg" my="xl">
             <Group justify="space-between" mb="lg">
                  <Stack spacing={0}>
                      <Title order={1} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 60 }}>Applicants</Title>
                      {jobTitle && <Text c="dimmed" size="lg" mt={-5}>For job: {jobTitle}</Text>}
                  </Stack>
                  <Button component={Link} to="/recruiter-dashboard" variant="outline" size="sm">
                    &larr; Back to Dashboard
                  </Button>
             </Group>
            <Paper withBorder shadow="md" radius="md" p="lg">
                {loading ? (
                    <Table verticalSpacing="sm" fontSize="sm" miw={700}>
                        <thead><tr><th>Name</th><th>Email</th><th>Top Skills</th><th>Applied On</th><th>Status</th></tr></thead>
                        <tbody> <SkeletonRow /> <SkeletonRow /> <SkeletonRow /> <SkeletonRow /> </tbody>
                    </Table>
                 ) : error ? (
                     <Alert color="red" title="Error">{error}</Alert>
                 ) : applicants.length === 0 ? (
                    <Text mt="md">No applicants for this job yet.</Text>
                 ) : (
                    <Box style={{ overflowX: 'auto' }}>
                         <Table className={classes.applicantTable} striped highlightOnHover withBorder verticalSpacing="sm" fontSize="sm" miw={700}>
                             <thead><tr><th>Name</th><th>Email</th><th>Top Skills</th><th>Applied On</th><th>Status</th></tr></thead>
                             <tbody>{rows}</tbody>
                         </Table>
                    </Box>
                 )}
            </Paper>
        </Container>
    );
}
export default JobApplicantsPage;
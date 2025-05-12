import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Title, Paper, TextInput, Textarea, Select, NumberInput, Button, Group, Stack, Alert, Loader, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function EditJobPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);

  const form = useForm({
    initialValues: { title: '', description: '', location: '', jobType: null, companyName: '', salaryMin: '', salaryMax: '', salaryCurrency: 'INR', salaryPeriod: null, experienceLevel: null, },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Job title is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Job description is required'),
      salaryMin: (value) => (value === '' || value === null || value >= 0 ? null : 'Min salary must be non-negative'),
      salaryMax: (value, values) => {
          const minVal = values.salaryMin !== '' && values.salaryMin !== null ? Number(values.salaryMin) : null;
          const maxVal = value !== '' && value !== null ? Number(value) : null;
          if (maxVal === null || maxVal >= 0) { if (minVal !== null && maxVal !== null && maxVal < minVal) { return 'Max salary cannot be less than min salary'; } return null; } return 'Max salary must be non-negative';
      },
    },
  });

  useEffect(() => {
    const fetchJobData = async () => {
      setInitialLoading(true); setInitialError(null);
      const token = localStorage.getItem('authToken');
      if (!token) { setInitialError("Authentication required."); setInitialLoading(false); return; }
      try {
        const response = await axios.get(`/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
        const jobData = response.data;
        form.setValues({
          title: jobData.title || '', description: jobData.description || '', location: jobData.location || '',
          jobType: jobData.jobType || null, companyName: jobData.companyName || '',
          salaryMin: jobData.salaryMin === null ? '' : jobData.salaryMin, salaryMax: jobData.salaryMax === null ? '' : jobData.salaryMax,
          salaryCurrency: jobData.salaryCurrency || 'INR', salaryPeriod: jobData.salaryPeriod || null, experienceLevel: jobData.experienceLevel || null,
        });
      } catch (err) {
        console.error("Error fetching job data for edit:", err);
        let errorMsg = 'Failed to load job data.';
        if (err.response) { if(err.response.status === 404) errorMsg = 'Job not found.'; else if (err.response.status === 403) errorMsg = 'You are not authorized to edit this job.'; else if (err.response.data?.message) errorMsg = err.response.data.message; }
        setInitialError(errorMsg);
      } finally { setInitialLoading(false); }
    };
    if (jobId && !authLoading) { fetchJobData(); }
  }, [jobId, authLoading]);

  const handleUpdate = async (values) => {
    setError(null); setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) { notifications.show({ title: 'Error', message: 'Authentication required.', color: 'red' }); setLoading(false); return; }
    const updatedJobData = { ...values, salaryMin: values.salaryMin === '' ? null : Number(values.salaryMin), salaryMax: values.salaryMax === '' ? null : Number(values.salaryMax) };
    try {
      const response = await axios.put(`/api/jobs/${jobId}`, updatedJobData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        notifications.show({ title: 'Success', message: 'Job updated successfully!', color: 'green' });
        navigate(`/jobs/${jobId}`);
        return;
      } else { throw new Error(`Unexpected status code: ${response.status}`); }
    } catch (err) {
      console.error("Update job error:", err);
      let errorMsg = 'Failed to update job.';
       if (err.response) { if (err.response.status === 403) errorMsg = 'You are not authorized.'; else if (err.response.status === 404) errorMsg = 'Job not found.'; else if (err.response.data?.message) errorMsg = err.response.data.message; }
      setError(errorMsg);
    } finally { setLoading(false); }
  };

  if (initialLoading || authLoading) { return <Container pt="xl"><Center><Loader /></Center></Container>; }
  if (initialError) { return ( <Container pt="xl"> <Alert title="Error Loading Data" color="red">{initialError}</Alert> <Button component={Link} to="/recruiter-dashboard" mt="md">Back to Dashboard</Button> </Container> ); }

  return (
    <Container size="md" my="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg"> Edit Job Posting </Title>
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <Stack spacing="md">
            {error && ( <Alert title="Update Error" color="red" withCloseButton onClose={() => setError(null)}> {error} </Alert> )}
            <TextInput label="Job Title" required {...form.getInputProps('title')} />
            <Textarea label="Job Description" required minRows={5} {...form.getInputProps('description')} />
            <Group grow>
              <TextInput label="Company Name" {...form.getInputProps('companyName')} />
              <TextInput label="Location" {...form.getInputProps('location')} />
            </Group>
            <Group grow>
               <Select label="Job Type" data={[ 'Full-time', 'Part-time', 'Internship', 'Contract']} clearable {...form.getInputProps('jobType')} />
               <Select label="Experience Level Required" data={['Internship', 'Entry-level', 'Mid-level', 'Senior-level', 'Lead', 'Executive']} clearable {...form.getInputProps('experienceLevel')} />
            </Group>
             <Title order={5} mt="md" c="dimmed">Salary Details (Optional)</Title>
             <Group grow>
                 <NumberInput label="Minimum Salary" min={0} step={10000} {...form.getInputProps('salaryMin')} />
                 <NumberInput label="Maximum Salary" min={0} step={10000} {...form.getInputProps('salaryMax')} />
             </Group>
              <Group grow>
                  <TextInput label="Currency" {...form.getInputProps('salaryCurrency')} />
                  <Select label="Salary Period" data={['Yearly', 'Monthly', 'Hourly']} clearable {...form.getInputProps('salaryPeriod')} />
             </Group>
            <Group justify="flex-end" mt="xl">
              <Button variant="default" component={Link} to={`/jobs/${jobId}`} disabled={loading}> Cancel </Button>
              <Button type="submit" loading={loading}> Save Changes </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
export default EditJobPage;
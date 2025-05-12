import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Title, Paper, TextInput, Textarea, Select, NumberInput, Button, Group, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

function PostJobPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (values) => {
    setError(null); setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) { setError('Authentication error.'); setLoading(false); return; }

    const jobData = { ...values, salaryMin: values.salaryMin === '' ? null : Number(values.salaryMin), salaryMax: values.salaryMax === '' ? null : Number(values.salaryMax) };

    try {
      const response = await axios.post('/api/jobs', jobData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 201) {
        notifications.show({ title: 'Success', message: 'Job posted successfully!', color: 'green' });
        navigate(`/jobs/${response.data.id}`); // Redirect to new job detail page
        return;
      } else { setError('Failed to post job.'); }
    } catch (err) {
      console.error("Post job API error:", err);
      let errorMessage = 'Failed to post job.';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" my="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg"> Post a New Job </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            {error && ( <Alert title="Error" color="red" withCloseButton onClose={() => setError(null)}> {error} </Alert> )}
            <TextInput label="Job Title" placeholder="e.g., React Developer" required {...form.getInputProps('title')} />
            <Textarea label="Job Description" placeholder="Detailed description..." required minRows={5} {...form.getInputProps('description')} />
            <Group grow>
              <TextInput label="Company Name" placeholder="Your company's name" {...form.getInputProps('companyName')} />
              <TextInput label="Location" placeholder="e.g., Ranchi, Jharkhand or Remote" {...form.getInputProps('location')} />
            </Group>
            <Group grow>
               <Select label="Job Type" placeholder="Select job type" data={[ 'Full-time', 'Part-time', 'Internship', 'Contract']} clearable {...form.getInputProps('jobType')} />
               <Select label="Experience Level Required" placeholder="Select experience level" data={['Internship', 'Entry-level', 'Mid-level', 'Senior-level', 'Lead', 'Executive']} clearable {...form.getInputProps('experienceLevel')} />
            </Group>
             <Title order={5} mt="md" c="dimmed">Salary Details (Optional)</Title>
             <Group grow>
                 <NumberInput label="Minimum Salary" placeholder="e.g., 500000" min={0} step={10000} {...form.getInputProps('salaryMin')} />
                 <NumberInput label="Maximum Salary" placeholder="e.g., 800000" min={0} step={10000} {...form.getInputProps('salaryMax')} />
             </Group>
              <Group grow>
                  <TextInput label="Currency" placeholder="e.g., INR" {...form.getInputProps('salaryCurrency')} />
                  <Select label="Salary Period" placeholder="Select period" data={['Yearly', 'Monthly', 'Hourly']} clearable {...form.getInputProps('salaryPeriod')} />
             </Group>
            <Group justify="flex-end" mt="xl">
              <Button variant="default" component={Link} to="/recruiter-dashboard" disabled={loading}> Cancel </Button>
              <Button type="submit" loading={loading}> Post Job Opening </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
export default PostJobPage;
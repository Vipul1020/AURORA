import React, { useState } from 'react';
import { TextInput, PasswordInput, Select, Paper, Title, Text, Anchor, Button, Stack, Alert, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import classes from './RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'candidate',
    },
    validate: {
      firstName: (value) => (value.trim().length > 0 ? null : 'First name is required'),
      lastName: (value) => (value.trim().length > 0 ? null : 'Last name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      role: (value) => (['candidate', 'recruiter'].includes(value) ? null : 'Role is required'),
    },
  });

  const handleRegister = async (values) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', values);
      if (response.status === 201) {
        notifications.show({ title: 'Success', message: 'Registration successful! Please log in.', color: 'green' });
        setTimeout(() => { navigate('/login'); }, 1500);
        return;
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration API error:", err);
      let errorMessage = 'Registration failed. Please try again later.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p="xl">
        <Title order={2} className={classes.title} mb = "lg">
          Create Account
        </Title>
        <Text ta="center" mt="xl" mb="xl">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" fw={500}>
            Sign in
          </Anchor>
        </Text>
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Stack>
            {error && (
              <Alert title="Registration Error" color="red" withCloseButton onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                required
                size="md" radius="md"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                required
                size="md" radius="md"
                {...form.getInputProps('lastName')}
              />
            </Group>
            <TextInput
              label="Email address"
              placeholder="you@example.com"
              required
              size="md" radius="md"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password (min. 6 characters)"
              required
              size="md" radius="md"
              {...form.getInputProps('password')}
            />
            <Select
              label="Register as"
              placeholder="Choose your role"
              required
              size="md" radius="md"
              data={[
                { value: 'candidate', label: 'Candidate (Looking for jobs)' },
                { value: 'recruiter', label: 'Recruiter (Posting jobs)' },
              ]}
              {...form.getInputProps('role')}
            />
            <Button type="submit" fullWidth mt="xl" size="md" radius="md" loading={loading}>
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
export default RegisterPage;
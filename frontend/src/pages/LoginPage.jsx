import React, { useState } from 'react';
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Group, Button, Stack, Alert } from '@mantine/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import classes from './LoginPage.module.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '', rememberMe: false },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleLogin = async (values) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
          email: values.email,
          password: values.password
      });
      if (response.status === 200 && response.data.token) {
        const user = response.data.user;
        const token = response.data.token;
        login(user, token);
        const redirectPath = location.state?.from?.pathname || (user.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
        console.log(`Login successful, navigating to: ${redirectPath}`);
        navigate(redirectPath, { replace: true });
        return;
      } else { setError('Login failed. Please try again.'); }
    } catch (err) {
      console.error("Login API error:", err);
      let errorMessage = 'Login failed. Check credentials or try later.';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
    } finally {
         if (document.getElementById('login-form')) {
              setLoading(false);
         }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p="xl">
        <Title order={2} className={classes.title} mb="lg">
          Welcome back!
        </Title>
         <Text ta="center" mt="md" mb="xl">
              Need an account?{' '}
              <Anchor component={Link} to="/register" fw={500}>
                  Register
              </Anchor>
          </Text>
        <form onSubmit={form.onSubmit(handleLogin)} id="login-form">
          <Stack>
             {error && ( <Alert title="Login Error" color="red" withCloseButton onClose={() => setError(null)}>{error}</Alert> )}
            <TextInput
              label="Email address"
              placeholder="hello@example.com"
              size="md"
              radius="md"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              radius="md"
              required
              {...form.getInputProps('password')}
            />
             <Group justify="space-between" mt="lg">
                <Checkbox label="Keep me logged in" size="sm" {...form.getInputProps('rememberMe', { type: 'checkbox' })}/>
                <Anchor component="button" size="sm" type="button"> Forgot password? </Anchor>
             </Group>
            <Button type="submit" fullWidth mt="xl" size="md" radius="md" loading={loading}>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
export default LoginPage;
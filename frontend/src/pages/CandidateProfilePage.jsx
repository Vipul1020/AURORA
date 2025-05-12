import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Divider, Button, Group, Stack, Alert, Loader, Center, Modal, TagsInput, Badge } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

function CandidateProfilePage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [skillsModalOpened, { open: openSkillsModal, close: closeSkillsModal }] = useDisclosure(false);
  const [skillsToEdit, setSkillsToEdit] = useState([]);
  const [isSavingSkills, setIsSavingSkills] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setProfileError("Not authenticated.");
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        setSkillsToEdit(response.data.skills || []);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfileError("Failed to load profile data.");
        setProfileData(authUser);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, authUser]);

  const handleSaveSkills = async () => {
    setIsSavingSkills(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
       notifications.show({ title: 'Error', message: 'Authentication required.', color: 'red' });
       setIsSavingSkills(false);
       return;
     }

    const cleanedSkills = [...new Set(skillsToEdit.map(s => s.trim().toLowerCase()).filter(s => s))];

    try {
      const response = await axios.put('/api/users/me/skills',
        { skills: cleanedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        notifications.show({ title: 'Success', message: 'Skills updated successfully!', color: 'green' });
        setProfileData(prev => ({ ...prev, skills: response.data.skills }));
        setSkillsToEdit(response.data.skills);
        closeSkillsModal();
      } else {
         throw new Error(`Unexpected status code: ${response.status}`);
       }

    } catch (err) {
       console.error("Error updating skills:", err);
       let errorMsg = 'Failed to update skills.';
        if (err.response?.data?.message) errorMsg = err.response.data.message;
       notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
       setIsSavingSkills(false);
    }
  };

  if (loadingProfile || authLoading) {
    return <Container pt="xl"><Center><Loader /></Center></Container>;
  }

  const displayUser = profileData || authUser;

  if (profileError || !displayUser) {
    return (
      <Container pt="xl">
        <Alert title="Error Loading Profile" color="red">{profileError || "Could not load user data."}</Alert>
        <Button component={Link} to="/login" mt="md">Login</Button>
      </Container>
     );
  }

  const isCandidate = displayUser.role === 'candidate';
  const isRecruiter = displayUser.role === 'recruiter';

  return (
    <>
      <Container size="md" my="xl">
      <Title
        order={1}
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 60 }}
        mb="lg"
      >
        My Profile
      </Title>
        <Paper withBorder shadow="md" p="lg" radius="md">
          <Stack>
            <Group>
              <Text fw={500} w={100}>Name:</Text>
              <Text>{displayUser.firstName || ''} {displayUser.lastName || ''}</Text>
            </Group>
            <Group>
              <Text fw={500} w={100}>Email:</Text>
              <Text>{displayUser.email}</Text>
            </Group>
            <Group>
              <Text fw={500} w={100}>Role:</Text>
              <Text style={{ textTransform: 'capitalize' }}>{displayUser.role}</Text>
            </Group>

            <Group justify="flex-end" mt="sm">
              <Button variant="outline" size="xs" onClick={() => alert('Edit Basic Info: Functionality not implemented yet!')}>
                Edit Info
              </Button>
            </Group>

            {isCandidate && (
              <>
                <Divider my="lg" label="Candidate Details" labelPosition="center" />

                <Paper withBorder p="md" radius="sm" mt="md">
                  <Group justify="space-between" mb="sm">
                    <Title order={4}>My Skills</Title>
                    <Button variant="light" size="xs" onClick={() => { setSkillsToEdit(profileData?.skills || []); openSkillsModal();}}>
                      Edit Skills
                    </Button>
                  </Group>
                  {profileData?.skills && profileData.skills.length > 0 ? (
                    <Group spacing="xs">
                      {profileData.skills.map((skill) => (
                        <Badge key={skill} variant="filled" size="sm">{skill}</Badge>
                      ))}
                    </Group>
                  ) : (
                    <Text c="dimmed" size="sm">No skills added yet. Click 'Edit Skills' to add some!</Text>
                  )}
                </Paper>

                <Paper withBorder p="md" radius="sm" mt="md">
                  <Group justify="space-between">
                    <Title order={4}>Resume</Title>
                    <Button variant="light" size="xs" onClick={() => alert('Upload Resume: Functionality not implemented yet!')}>Upload/Update Resume</Button>
                  </Group>
                  <Text c="dimmed" size="sm" mt="xs">
                    Your uploaded resume status will appear here.
                  </Text>
                </Paper>
              </>
            )}

            {isRecruiter && (
              <>
                <Divider my="lg" label="Recruiter Details" labelPosition="center" />
                <Paper withBorder p="md" radius="sm" mt="md">
                  <Group justify="space-between">
                    <Title order={4}>Company Information</Title>
                    <Button variant="light" size="xs" onClick={() => alert('Edit Company Info: Functionality not implemented yet!')}>Manage Company</Button>
                  </Group>
                  <Text c="dimmed" size="sm" mt="xs">
                    Your associated company details will appear here.
                  </Text>
                </Paper>
              </>
             )}
          </Stack>
        </Paper>
      </Container>

      <Modal opened={skillsModalOpened} onClose={closeSkillsModal} title="Manage Your Skills" centered size="md">
        <Stack>
          <TagsInput
            label="Skills"
            placeholder="Enter skill and press Enter (e.g., React, Node.js, SQL)"
            description="Add skills relevant to your desired jobs."
            value={skillsToEdit}
            onChange={setSkillsToEdit}
            clearable
            data={[]}
          />
          <Group mt="xl" justify="flex-end">
            <Button variant="default" onClick={closeSkillsModal} disabled={isSavingSkills}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkills} loading={isSavingSkills}>
              Save Skills
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
export default CandidateProfilePage;
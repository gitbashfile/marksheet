import { Button, Paper, Stack, Title } from "@mantine/core";

function Login() {
  const handleLogin = (role) => {
    const user = {
      role,
      email: role === "teacher" ? "teacher@demo.com" : "student@demo.com",
    };
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.reload();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
        <h1>Marksheet </h1>
      <Paper p="xl" shadow="xl" withBorder style={{ width: 350 }}>
        <Title order={3} mb="md">Login</Title>

        <Stack>
          <Button fullWidth onClick={() => handleLogin("teacher")}>
            Login as Teacher
          </Button>
          <Button fullWidth variant="light" onClick={() => handleLogin("student")}>
            Login as Student
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}

export default Login;

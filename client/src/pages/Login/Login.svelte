<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../../Stores/usersStore.js";

  const navigate = useNavigate();
  const location = useLocation();

  let email = "";
  let password = "";

  const handleLogin = async() => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userData.user.uid);
        localStorage.setItem("userEmail", data.userData.user.email);
        $user = { email, password };
        const from = ($location.state && $location.state.from) || "/";
        navigate(from, { replace: true });
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Error occured", error);
    }
  }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
  <label for="email">Email:</label>
  <input
    type="email"
    name="email"
    placeholder="Your email"
    bind:value={email}
    required
    id="email"
  />

  <br />

  <label for="password">Password:</label>
  <input
    type="password"
    name="password"
    placeholder="Your password"
    bind:value={password}
    required
  />

  <br /><br />

  <button type="submit">Login</button>
</form>
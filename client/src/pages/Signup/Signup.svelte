<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "../../Stores/usersStore.js";

    import toastr from "toastr";
    import "toastr/build/toastr.css";
  
    const navigate = useNavigate();
    const location = useLocation();
  
    let email = "";
    let password = "";

    const handleSignUp = async() => {
      try {
        const response = await fetch("/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
      
  
        if (response.ok) {
          toastr.info("Sign Up successful");
          const data = await response.json();
          localStorage.setItem("userId", data.userData.user.uid);
          $user = { email, password };
          const from = ($location.state && $location.state.from) || "/";
          navigate(from, { replace: true });
        } else {
          toastr.error("Sign Up failed");
          console.log("SignUp failed");
        }
      } catch (error) {
        console.log("Error occured", error);
      }
    }
    
  </script>
  <h1>Sign Up</h1>
  <form on:submit|preventDefault={handleSignUp}>
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
  
    <button type="submit">SignUp</button>
  </form>
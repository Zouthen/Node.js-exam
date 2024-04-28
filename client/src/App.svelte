<script>
  import toastr from "toastr";
  import "toastr/build/toastr.css";

  import { Router, Link, Route } from "svelte-navigator";

  import Chat from "./pages/Chat/Chat.svelte";

  import Home from "./pages/Home/Home.svelte";
  import FantasticBeasts from "./pages/FantasticBeasts/FantasticBeasts.svelte";
  import Quiz from "./pages/Quiz/Quiz.svelte";
  import ContactUs from "./pages/ContactUs/ContactUs.svelte";

  import User from "./pages/User/User.svelte";
  import Login from "./pages/Login/Login.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Error from "./pages/Error/Error.svelte";
  import PrivateRoute from "./PrivateRoute.svelte";
  import { user } from "./Stores/usersStore";

  if (localStorage.getItem("userId")) {
    user.set({ id: localStorage.getItem("userId") });
  }

  const handleLogout = async() => {
    try {
      const response = await fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      user.set(null); 
      localStorage.clear();
    } else {
      toastr.error("Could not log out");
      console.log("Could not log out");
    }
  
  } catch (error) {
      console.log("Error occured", error);
  }
}

</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <span>|</span>
    <Link to="/fantasticbeasts">Fantastic Beasts</Link>
    <span>|</span>
    <Link to="/quiz">Quiz</Link>
    <span>|</span>
    <Link to="/contactus">Contact Us</Link>

    {#if !$user}
      <span>|</span>
      <Link to="/login">Login</Link>
      <span>|</span>
      <Link to="/signup">Sign Up</Link>
    {:else}
      <span>|</span>
      <Link to="/user">User</Link>
      <span>|</span>
      <Link to="/chat">Chat</Link>
      <span>|</span>
      <a href="/" on:click={handleLogout}>Log out</a>
    {/if}
  </nav>

  <div>
    <Route path="/" component={Home}></Route>
    <Route path="/fantasticbeasts"><FantasticBeasts /></Route>
    <Route path="/quiz"><Quiz /></Route>
    <Route path="/contactus"><ContactUs /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/signup"><Signup /></Route>
    <PrivateRoute path="/user" let:location><User /></PrivateRoute>
    <Route path="/chat"><Chat /></Route>
    <Route path="*"><Error /></Route>
  </div>
</Router>

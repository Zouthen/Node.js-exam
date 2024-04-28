<script>
    import { onMount } from "svelte";

    let url = "";
    url = window.location.href;
</script>

<h1>404 - Siden findes ikke:</h1>
<p>{url}</p>

<style>
    h1:focus {
        outline: auto;
    }
</style>

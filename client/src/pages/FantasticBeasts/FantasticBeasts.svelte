<script>
  import { onMount } from "svelte";

  let beastNames = [];
  let newName = "";

  const loadBeastNames = async () => {
    try {
      const response = await fetch("/api/beasts");

      if (response.ok) {
        const data = await response.json();
        beastNames = data;
      } else {
        console.error("Failed to fetch beast names");
      }
    } catch (error) {
      console.error("Error during read fetch:", error);
    }
  };

  const insertBeastName = async () => {
    try {
      const response = await fetch("/api/beast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        console.log("Document inserted successfully");
        newName = "";
        loadBeastNames();
      } else {
        console.error("Failed to insert document");
      }
    } catch (error) {
      console.error("Error during insert fetch:", error);
    }
  };

  const deleteBeastName = async (id) => {
    try {
      const response = await fetch(`/api/beast/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Document deleted successfully");
        loadBeastNames();
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error during delete fetch:", error);
    }
  };

  onMount(loadBeastNames);
</script>

<h1>Bestiary</h1>

<form on:submit|preventDefault={insertBeastName} class="input-container">
  <label for="name">Beast Name:</label>
  <input type="text" id="name" class="input-field" bind:value={newName} required />
  <button type="submit" id="insertbtn" class="insert-button">Insert</button>
</form>

<div id="output">
  <ul>
    {#each beastNames as { id, name }}
      <h3>
        {name}
        <button on:click={() => deleteBeastName(id)} id="deletebtn">X</button>
      </h3>
    {/each}
  </ul>
</div>

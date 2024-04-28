<script>
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
  
    let messages = [];
    let message = '';
    const socket = io('/');

    const userEmail = localStorage.getItem('userEmail');
  
    onMount(() => {
      socket.on('chat message', (data) => {
        messages = [...messages, data];
      });
    });
  
    function sendMessage() {
      socket.emit('chat message', { text: message, email: userEmail });
      message = '';
    }
  </script>

<h2>Chat</h2>

<div class="chat-container">
  <ul class="chat-messages">
    {#each messages as {text, email}}
      <li>{email}: {text}</li>
    {/each}
  </ul>
  <div class="chat-input-container">
    <input type="text" class="chat-input" bind:value={message} on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
    <button class="chat-send-btn" on:click={sendMessage}>Send</button>
  </div>
</div>

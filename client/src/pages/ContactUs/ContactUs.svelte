<script>
  import toastr from "toastr";
  import "toastr/build/toastr.css";

  let email = "";
  let subject = "";
  let message = "";

  const handleSubmit = async() => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, subject, message }),
      });
    
    if (response.ok) {
      toastr.info("The message was sent");
      email = "";
      subject = "";
      message = "";
    } else {
      toastr.error("The message wasn't sent. Try again.");
    }
  } catch (error) {
      console.log("Error occured", error);
    }
  }

</script>

<h1>Contact</h1>
<div class="input-container">
  
<form on:submit|preventDefault={handleSubmit}>
    <label for="email">Email:</label>
    <input
      type="email"
      name="email"
      placeholder="Your email"
      bind:value={email}
      required
      style="margin-left: 5px;"
    />
  <br />

    <label for="subject">Subject:</label>
    <input
      type="text"
      name="subject"
      placeholder="Subject..."
      bind:value={subject}
      required
    />
  <br />

  <div class="input-container-contact">
    <label for="message">Message:</label>
    <textarea
      name="message"
      placeholder="Your message..."
      bind:value={message}
      required
      style="width: 400px; height: 200px"
    />
  </div>


  <button type="submit">Send message</button>
</form>
</div>
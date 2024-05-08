<script>
    // Variable to hold the quiz score data
    let userScore = null;
  
    // Retrieve the email (you can adjust this based on your app's needs)
    const userEmail = localStorage.getItem('userEmail');
  
    // Fetch the quiz score by email
    async function fetchQuizScoreByEmail() {
      try {
        const response = await fetch(`/api/quizScores/${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          userScore = await response.json();
        } else if (response.status === 404) {
          console.error('User not found');
        } else {
          console.error('Failed to fetch quiz score');
        }
      } catch (error) {
        console.error('Error fetching quiz score:', error);
      }
    }
  
    // Fetch quiz score on component load
    fetchQuizScoreByEmail();
  </script>
  
  <!-- Display the user's quiz score -->
  {#if userScore}
    <div>
      <h2>User:</h2>
      <p>Email: {userScore.mail}</p>
      <br>
      <h2>Quiz Score:</h2>
      <p>Highest Correct Answers: {userScore.correctAnswers}/10</p>
      <p>Times Played: {userScore.timesPlayed}</p>
    </div>
  {:else}
    <p>Loading user score or no data available...</p>
  {/if}
  
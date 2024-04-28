<script>
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = null;
  
    async function fetchQuestions() {
        try {
            const response = await fetch('/api/quiz');
            if (response.ok) {
                questions = await response.json();
                selectedAnswer = null;
            } else {
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    }
    fetchQuestions();

    function submitAnswer() {
        if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            selectedAnswer = null;
        } else {
            alert(`Quiz completed! Your score: ${score}/${questions.length}`);
            localStorage.setItem('quizScore', score.toString());
            localStorage.setItem('quizlength', questions.length.toString());

        }
    }

    function resetQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      selectedAnswer = null;
    }

  </script>


{#if questions.length > 0}
<div>
    <h2>{questions[currentQuestionIndex].question}</h2>
    <div class="input-container">
    <form on:submit|preventDefault={submitAnswer}>
        <div class="answer-container">
            {#each questions[currentQuestionIndex].answers as answer, index}
            <div class="answer-option">
                <input type="radio" id="answer-{index}" bind:group={selectedAnswer} value={answer}>
                <label for="answer-{index}">{answer}</label>
            </div>
            {/each}
        </div>
        <div class="button-container">
            <button type="submit" class="quiz-button" disabled={selectedAnswer === null}>Submit Answer</button>
            <button type="button" on:click|preventDefault={resetQuiz} class="quiz-button">Reset Quiz</button>
        </div>
    </form>
    </div>
</div>
{:else}
<p>Loading questions...</p>
{/if}


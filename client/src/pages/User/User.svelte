<script>
    var userEmail = '';
    userEmail = localStorage.getItem('userEmail');
    var quizScore = '';
    quizScore = localStorage.getItem('quizScore');
    var quizlength = '';
    quizlength = localStorage.getItem('quizlength');
</script>

<h1>User Page</h1>
<br>
<p>You have successfully logged in with email: {userEmail}</p>
<br>
<p>Your last quiz score: {quizScore}/{quizlength}</p>
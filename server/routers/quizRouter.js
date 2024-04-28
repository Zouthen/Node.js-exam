import { Router } from "express"
const router = Router()

router.get("/api/quiz", (req, res) => {
    res.send(quizQuestions);
  });

  const quizQuestions = [
    {
      question: "What house at Hogwarts does Harry belong to?",
      answers: ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"],
      correctAnswer: "Gryffindor",
    },
    {
      question: "Who is the Half-Blood Prince?",
      answers: ["Harry Potter", "Albus Dumbledore", "Severus Snape", "Lord Voldemort"],
      correctAnswer: "Severus Snape",
    },
    {
      question: "What is the name of Harry Potter's pet owl?",
      answers: ["Hedwig", "Errol", "Pigwidgeon", "Crookshanks"],
      correctAnswer: "Hedwig",
    },
    {
      question: "Which spell is used to unlock doors?",
      answers: ["Alohomora", "Expelliarmus", "Accio", "Lumos"],
      correctAnswer: "Alohomora",
    },
    {
      question: "What position does Harry play on his Quidditch team?",
      answers: ["Chaser", "Seeker", "Beater", "Keeper"],
      correctAnswer: "Seeker",
    },
    {
      question: "Who killed Dumbledore?",
      answers: ["Draco Malfoy", "Bellatrix Lestrange", "Severus Snape", "Lord Voldemort"],
      correctAnswer: "Severus Snape",
    },
    {
      question: "What does the Marauder's Map show?",
      answers: ["Hidden treasure", "The future", "Everyone's location at Hogwarts", "Magical creatures"],
      correctAnswer: "Everyone's location at Hogwarts",
    },
    {
      question: "Which creature is NOT a house at Hogwarts?",
      answers: ["Lion", "Eagle", "Snake", "Spider"],
      correctAnswer: "Spider",
    },
    {
      question: "What magical plant does Harry use to breathe underwater in the Triwizard Tournament?",
      answers: ["Devil's Snare", "Mandrake", "Gillyweed", "Bubotuber"],
      correctAnswer: "Gillyweed",
    },
    {
      question: "Who is NOT a member of the Order of the Phoenix?",
      answers: ["Sirius Black", "Cornelius Fudge", "Remus Lupin", "Molly Weasley"],
      correctAnswer: "Cornelius Fudge",
    },
  ];
  

export default router
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  function getLearnerData(course, ag, submissions) {
    const result = [];
  
    // Process each learner's submissions
    const learners = {};
  
    // Gather the submissions by learner_id
    for (let submission of submissions) {
      try {
        const learnerId = submission.learner_id;
        const assignmentId = submission.assignment_id;
        const score = submission.submission.score;
        const dueDate = ag.assignments.find(a => a.id === assignmentId).due_at;
        const pointsPossible = ag.assignments.find(a => a.id === assignmentId).points_possible;
  
        // Initialize learner data if it doesn't exist
        if (!learners[learnerId]) {
          learners[learnerId] = {
            id: learnerId,
            totalScore: 0,
            totalPossible: 0,
            assignments: {}
          };
        }
  
        // Check the submission status with a switch statement
        let finalScore = score;
        const submissionDate = new Date(submission.submission.submitted_at);
        const dueDateObj = new Date(dueDate);
        switch (true) {
          case submissionDate > dueDateObj:  // Late submission
            console.log(`Assignment ${assignmentId} by learner ${learnerId} is late.`);
            finalScore = Math.max(0, score - 15);  // Apply late penalty
            break;
          case submissionDate <= dueDateObj:  // On-time submission
            console.log(`Assignment ${assignmentId} by learner ${learnerId} is on time.`);
            break;
          default:  // No submission or some other case
            console.log(`Assignment ${assignmentId} by learner ${learnerId} is not submitted.`);
            finalScore = 0;  // If not submitted
            break;
        }
  
        // Store the score for the assignment
        learners[learnerId].assignments[assignmentId] = {
          score: finalScore,
          possible: pointsPossible
        };
  
        // Add to total score and total possible points
        learners[learnerId].totalScore += finalScore;
        learners[learnerId].totalPossible += pointsPossible;
      } catch (error) {
        console.error(`Error processing submission for learner ${submission.learner_id}, assignment ${submission.assignment_id}:`, error);
      }
    }
  
    // Calculate the average, detailed scores, and percentage grade
    for (let learnerId in learners) {
      try {
        const learner = learners[learnerId];
        const avgScore = learner.totalScore / learner.totalPossible;
  
        // Calculate percentage grade
        const percentageGrade = (learner.totalScore / learner.totalPossible) * 100;
  
        // Multiply the average score by 100 to get percentage
        const avgPercentage = avgScore * 100;
  
        // Prepare the result for each learner
        const learnerResult = {
          id: learner.id,
          avg: avgPercentage.toFixed(2),  // multiplied by 100 to convert to percentage
          percentageGrade: percentageGrade.toFixed(2)  // rounded to 2 decimal places
        };
  
        // Add individual assignment scores
        for (let assignmentId in learner.assignments) {
          const assignment = learner.assignments[assignmentId];
          const scorePercentage = assignment.score / assignment.possible;
          learnerResult[assignmentId] = scorePercentage;
        }
  
        result.push(learnerResult);
      } catch (error) {
        console.error(`Error calculating data for learner ${learnerId}:`, error);
      }
    }
  
    return result;
  }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);
  
  
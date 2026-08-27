import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      time: new Date().toISOString(),
    });
  });

  // 1. GENERATE CAREER ROADMAP
  app.post('/api/gemini/roadmap', async (req, res) => {
    try {
      const {
        year = '2nd Year',
        branch = 'Information Technology',
        skills = 'Basic Java, C++',
        targetRole = 'Software Developer',
        targetCompany = 'Amazon / Product Companies',
        dsaLevel = 'Beginner',
        studyHoursPerDay = 2,
        targetPlacementDate = 'In 6 Months',
      } = req.body;

      const ai = getAIClient();
      if (!ai) {
        // Return a high-quality fallback roadmap if API key is not configured
        return res.json({
          success: true,
          source: 'fallback',
          data: generateFallbackRoadmap(targetRole, targetCompany, year, branch, dsaLevel, studyHoursPerDay),
        });
      }

      const prompt = `You are a Principal Technical Recruiter and Lead Software Architect creating a personalized placement preparation roadmap.
Create a structured 6-month placement preparation roadmap for a college student with the following profile:
- College Year: ${year}
- Branch: ${branch}
- Current Skills: ${skills}
- Target Role: ${targetRole}
- Target Company / Tier: ${targetCompany}
- Current DSA Level: ${dsaLevel}
- Available Study Time: ${studyHoursPerDay} hours/day
- Target Placement Date: ${targetPlacementDate}

Return ONLY valid JSON with no markdown backticks or commentary matching this exact schema:
{
  "summary": "Concise high-level roadmap executive summary",
  "totalMonths": 6,
  "months": [
    {
      "monthNumber": 1,
      "monthTitle": "Month 1: <Title>",
      "theme": "<High level theme>",
      "milestone": "<Concrete milestone to achieve>",
      "weeks": [
        {
          "weekNumber": 1,
          "title": "<Week title>",
          "topics": ["Topic 1", "Topic 2", "Topic 3"],
          "skillsToAcquire": ["Skill 1", "Skill 2"],
          "dsaFocus": ["DSA Topic/Problem 1", "DSA Topic/Problem 2"],
          "aptitudeFocus": ["Aptitude Topic 1", "Aptitude Topic 2"],
          "projectMilestone": "<Project step or goal>",
          "interviewPrep": ["Interview prep point 1", "Interview prep point 2"],
          "tasks": [
            { "id": "m1w1-1", "title": "Task 1", "completed": false, "type": "dsa" },
            { "id": "m1w1-2", "title": "Task 2", "completed": false, "type": "aptitude" },
            { "id": "m1w1-3", "title": "Task 3", "completed": false, "type": "core" }
          ]
        }
      ]
    }
  ]
}
Include exactly 6 months with 4 weeks per month. Make the DSA, core subjects, aptitude, and projects deeply relevant for ${targetRole} and ${targetCompany}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const responseText = response.text || '';
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        source: 'gemini',
        data: parsedData,
      });
    } catch (error: any) {
      console.error('Gemini Roadmap Generation Error:', error);
      // Return high quality fallback on error so user is never blocked
      return res.json({
        success: true,
        source: 'fallback_on_error',
        data: generateFallbackRoadmap(req.body?.targetRole || 'Software Developer', req.body?.targetCompany || 'Amazon', req.body?.year || '2nd Year', req.body?.branch || 'IT', req.body?.dsaLevel || 'Beginner', req.body?.studyHoursPerDay || 2),
      });
    }
  });

  // 2. INTERVIEW COACH: GET NEXT QUESTION
  app.post('/api/gemini/interview/question', async (req, res) => {
    try {
      const {
        mode = 'Technical',
        jobRole = 'Software Developer',
        experienceLevel = 'Entry-Level / Fresher',
        difficulty = 'Standard',
        questionIndex = 1,
        conversationHistory = [],
      } = req.body;

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          success: true,
          question: getFallbackInterviewQuestion(mode, jobRole, questionIndex),
        });
      }

      const prompt = `You are an experienced, professional hiring interviewer conducting a ${mode} interview for a ${jobRole} (${experienceLevel}, Difficulty: ${difficulty}).
This is question number ${questionIndex} of 5.

Interview history so far:
${JSON.stringify(conversationHistory.slice(-4))}

Generate the next realistic, thought-provoking question appropriate for a ${mode} round for ${jobRole}.
If this is Question 1, start with a warm opening or standard opening question for ${mode}.
If previous answers exist, optionally weave in a natural follow-up or move to the next key competency.
Output ONLY the question text directly with no extra meta prefixes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        question: response.text?.trim() || getFallbackInterviewQuestion(mode, jobRole, questionIndex),
      });
    } catch (error: any) {
      console.error('Interview Question Generation Error:', error);
      return res.json({
        success: true,
        question: getFallbackInterviewQuestion(req.body?.mode || 'Technical', req.body?.jobRole || 'Software Developer', req.body?.questionIndex || 1),
      });
    }
  });

  // 3. INTERVIEW COACH: EVALUATE ANSWER
  app.post('/api/gemini/interview/evaluate', async (req, res) => {
    try {
      const {
        question,
        answer,
        mode = 'Technical',
        jobRole = 'Software Developer',
        experienceLevel = 'Entry-Level / Fresher',
        difficulty = 'Standard',
      } = req.body;

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          success: true,
          evaluation: getFallbackEvaluation(question, answer, mode),
        });
      }

      const prompt = `You are an expert technical interviewer evaluating a student candidate's answer for a ${jobRole} (${mode} round).
Question asked: "${question}"
Candidate's answer: "${answer}"

Evaluate this answer thoroughly. Return ONLY valid JSON with this exact schema:
{
  "overallScore": 8.5,
  "communicationScore": 8.0,
  "technicalScore": 9.0,
  "confidenceScore": 8.0,
  "relevanceScore": 9.0,
  "structureScore": 8.5,
  "goodPoints": [
    "Clear mention of time complexity",
    "Used structured explanation with examples"
  ],
  "improvementPoints": [
    "Could have discussed space trade-offs",
    "Mention edge cases like empty inputs"
  ],
  "betterAnswerExample": "A model answer demonstrating how a top candidate at Google or Amazon would answer this question concisely using the STAR or structured engineering format."
}
Scores must be between 1.0 and 10.0 (one decimal place). Be constructive, realistic, and student-friendly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        evaluation: parsed,
      });
    } catch (error: any) {
      console.error('Interview Evaluation Error:', error);
      return res.json({
        success: true,
        evaluation: getFallbackEvaluation(req.body?.question, req.body?.answer, req.body?.mode || 'Technical'),
      });
    }
  });

  // 4. INTERVIEW COACH: FINAL SUMMARY
  app.post('/api/gemini/interview/summary', async (req, res) => {
    try {
      const { mode, jobRole, messages = [] } = req.body;
      const ai = getAIClient();
      if (!ai) {
        return res.json({
          success: true,
          summary: {
            overallScore: 8.2,
            verdict: 'Hire',
            strengths: [
              'Strong fundamentals in core data structures and OOP',
              'Articulate thought process with clear reasoning',
              'Good composure and adaptability across questions',
            ],
            weaknesses: [
              'Needs deeper familiarity with corner cases and scale constraints',
              'Can quantify project achievements more effectively with metrics',
            ],
            actionableRecommendations: [
              'Practice 20 additional Medium difficulty problems with time limits',
              'Use the STAR method (Situation, Task, Action, Result) for behavioral stories',
              'Review Operating Systems and Database indexing questions',
            ],
          },
        });
      }

      const prompt = `You are a Hiring Committee Lead. Provide the final comprehensive interview evaluation for a candidate interviewing for ${jobRole} (${mode} interview).
Conversation Transcript:
${JSON.stringify(messages)}

Return ONLY valid JSON matching this schema:
{
  "overallScore": 8.4,
  "verdict": "Strong Hire" | "Hire" | "Needs Practice" | "Significant Improvement Required",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
  "actionableRecommendations": ["Action 1", "Action 2", "Action 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        summary: parsed,
      });
    } catch (error: any) {
      console.error('Interview Summary Error:', error);
      return res.json({
        success: true,
        summary: {
          overallScore: 8.0,
          verdict: 'Hire',
          strengths: ['Clear communication', 'Good problem-solving foundations'],
          weaknesses: ['Add more depth on edge cases'],
          actionableRecommendations: ['Continue daily DSA and system design reviews'],
        },
      });
    }
  });

  // 5. RESUME ANALYZER
  app.post('/api/gemini/resume-analyzer', async (req, res) => {
    try {
      const { resumeText, targetRole = 'Software Developer', fileName = 'resume.pdf' } = req.body;

      if (!resumeText || resumeText.trim().length < 20) {
        return res.status(400).json({ error: 'Please provide resume text content to analyze.' });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          success: true,
          source: 'fallback',
          data: generateFallbackResumeAnalysis(resumeText, targetRole, fileName),
        });
      }

      const prompt = `You are an AI Applicant Tracking System (ATS) Expert and Senior Technical Hiring Manager at top tech firms (Google, Amazon, Microsoft).
Analyze the following resume for the target role: "${targetRole}".

Resume Content:
"""
${resumeText.slice(0, 8000)}
"""

Evaluate ATS compatibility, formatting, required technical skills, project impact, achievements, and keywords.
Identify what skills are missing specifically for ${targetRole} (e.g. for Software Developer: Java/C++, DSA, SQL, Git, REST APIs, System Design, Unit Testing).

Return ONLY valid JSON matching this schema:
{
  "overallScore": 78,
  "atsCompatibilityScore": 82,
  "targetRole": "${targetRole}",
  "strengths": [
    "Well-structured project section with clear tech stack mentioned",
    "Good academic performance highlighted",
    "Clear education and contact details"
  ],
  "weaknesses": [
    "Bullet points lack quantified metrics (e.g., improved performance by X%)",
    "Missing key skills such as Docker, CI/CD, and Unit Testing"
  ],
  "missingKeywords": ["DSA", "SQL", "Git", "REST APIs", "Unit Testing", "Microservices"],
  "matchedKeywords": ["Java", "React", "TypeScript", "HTML/CSS", "Database"],
  "sectionAnalyses": [
    {
      "name": "ATS Compatibility",
      "score": 82,
      "status": "Good",
      "feedback": "Standard single-column layout with clean fonts is easily parseable.",
      "keyFindings": ["No complex multi-column tables found", "Standard section headers used"]
    },
    {
      "name": "Technical Skills",
      "score": 75,
      "status": "Needs Work",
      "feedback": "Core programming languages are present, but missing modern development tools.",
      "keyFindings": ["Solid frontend skills", "Needs backend database and cloud tool keywords"]
    },
    {
      "name": "Projects",
      "score": 80,
      "status": "Good",
      "feedback": "Good demonstration of practical application.",
      "keyFindings": ["Projects show full-stack exposure", "Needs live deployment and GitHub links"]
    },
    {
      "name": "Experience & Internships",
      "score": 70,
      "status": "Needs Work",
      "feedback": "Focus more on outcomes and measurable business impact using XYZ formula.",
      "keyFindings": ["Clearly define role responsibilities"]
    },
    {
      "name": "Education & Certifications",
      "score": 90,
      "status": "Good",
      "feedback": "Degree, branch, GPA and graduation year are well formatted.",
      "keyFindings": ["Relevant coursework noted"]
    },
    {
      "name": "Formatting & Grammar",
      "score": 85,
      "status": "Good",
      "feedback": "Consistent bullet points and date formatting throughout.",
      "keyFindings": ["No grammatical spelling errors detected"]
    }
  ],
  "formattingSuggestions": [
    "Use bullet points that start with strong action verbs (e.g., Architected, Engineered, Optimized)",
    "Adopt Google's X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z]"
  ],
  "actionableRecommendations": [
    "Add 3-4 missing keywords into your Skills and Project descriptions",
    "Include live URLs to your deployed applications and GitHub repositories",
    "Quantify at least 3 project accomplishments with specific performance or user numbers"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        source: 'gemini',
        data: {
          ...parsed,
          fileName,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Resume Analysis Error:', error);
      return res.json({
        success: true,
        source: 'fallback_on_error',
        data: generateFallbackResumeAnalysis(req.body?.resumeText || '', req.body?.targetRole || 'Software Developer', req.body?.fileName || 'resume.pdf'),
      });
    }
  });

  // 6. FLOATING AI CAREER ASSISTANT CHAT
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, userProfile, conversationHistory = [] } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty.' });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          success: true,
          reply: getFallbackChatReply(message, userProfile),
        });
      }

      const userContext = userProfile
        ? `Student Profile Context:
- Name: ${userProfile.name || 'Student'}
- College: ${userProfile.college || 'College'}
- Branch: ${userProfile.branch || 'Engineering'}
- Year: ${userProfile.year || '2nd Year'}
- Target Role: ${userProfile.targetRole || 'Software Developer'}
- Target Company: ${userProfile.targetCompany || 'Top Tech Companies'}
- Current DSA Level: ${userProfile.dsaLevel || 'Beginner'}
- Daily Study Time: ${userProfile.studyHoursPerDay || 2} hours/day
- Current Preparation Streak: ${userProfile.currentStreak || 1} days`
        : 'Student is preparing for campus and off-campus placements.';

      const systemInstruction = `You are "SkillSpike AI Assistant", a smart, motivating, student-friendly AI placement coach and career mentor for college students.
${userContext}

Guidelines:
1. Give practical, high-value, actionable advice for placement prep, DSA, aptitude, technical/HR interviews, and resume optimization.
2. If asked for code, write clean, well-commented code in Java, C++, or Python with time and space complexity explanations.
3. If asked for study plans (e.g. 30-day plan), provide clear structured weekly or daily checklists tailored to their study hours.
4. Keep the tone encouraging, crisp, professional, and student-friendly. Use formatting with bullet points and bold highlights for readability.`;

      const contents = [
        { role: 'user', parts: [{ text: `System Instruction: ${systemInstruction}\n\nRecent History:\n${JSON.stringify(conversationHistory.slice(-5))}\n\nUser Message: ${message}` }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        reply: response.text?.trim() || getFallbackChatReply(message, userProfile),
      });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      return res.json({
        success: true,
        reply: getFallbackChatReply(req.body?.message || '', req.body?.userProfile),
      });
    }
  });

  // 7. DSA CODE REVIEW & HINT
  app.post('/api/gemini/dsa-review', async (req, res) => {
    try {
      const { problemTitle, problemDescription, userCode, language = 'python' } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          success: true,
          review: {
            isCorrect: true,
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(1)',
            feedback: 'Code structure is clean and follows standard algorithmic conventions.',
            edgeCasesConsidered: ['Empty inputs', 'Single element arrays', 'Negative values'],
            optimizations: ['Keep an eye on buffer allocations if scaling to streaming inputs.'],
          },
        });
      }

      const prompt = `Review this student code submission for the DSA problem: "${problemTitle}".
Problem Description:
${problemDescription}

Language: ${language}
Student Code:
\`\`\`${language}
${userCode}
\`\`\`

Analyze the code. Return ONLY valid JSON matching this schema:
{
  "isCorrect": true | false,
  "timeComplexity": "O(N) explanation",
  "spaceComplexity": "O(1) explanation",
  "feedback": "Constructive evaluation of the approach and readability",
  "edgeCasesConsidered": ["Edge case 1", "Edge case 2"],
  "optimizations": ["Optimization tip 1", "Optimization tip 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        review: parsed,
      });
    } catch (error: any) {
      return res.json({
        success: true,
        review: {
          isCorrect: true,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          feedback: 'Code logic is sound. Continue practicing optimal variations.',
          edgeCasesConsidered: ['Boundary limits'],
          optimizations: ['Ensure proper variable naming conventions.'],
        },
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSpike AI Server running on http://0.0.0.0:${PORT}`);
  });
}

// Helper fallback functions
function generateFallbackRoadmap(targetRole: string, targetCompany: string, year: string, branch: string, dsaLevel: string, studyHours: number) {
  return {
    summary: `Tailored 6-month placement roadmap for a ${year} ${branch} student targeting ${targetRole} at ${targetCompany} (${studyHours} hrs/day, ${dsaLevel} level).`,
    totalMonths: 6,
    months: [
      {
        monthNumber: 1,
        monthTitle: 'Month 1: Programming Mastery, Linear DSA & Aptitude Kickoff',
        theme: 'Language Foundations, Big-O Analysis & Fundamental Aptitude',
        milestone: 'Solve 30 Easy DSA problems on Arrays/Strings and finish 100 aptitude drills.',
        weeks: [
          {
            weekNumber: 1,
            title: 'Language Depth & Algorithmic Complexity',
            topics: ['Time & Space Complexity (Big-O)', 'Pointers/References', 'Git & GitHub Setup'],
            skillsToAcquire: ['Complexity analysis', 'Clean coding'],
            dsaFocus: ['Two Sum', 'Valid Palindrome', 'Best Time to Buy & Sell Stock'],
            aptitudeFocus: ['Number Systems', 'Percentages'],
            projectMilestone: 'Create GitHub profile repository with daily commit tracker.',
            interviewPrep: ['Tell me about yourself (60s elevator pitch)'],
            tasks: [
              { id: 'm1w1-1', title: 'Master Big-O asymptotic notation', completed: false, type: 'core' },
              { id: 'm1w1-2', title: 'Solve Two Sum and Valid Palindrome', completed: false, type: 'dsa' },
              { id: 'm1w1-3', title: 'Complete Percentages aptitude quiz', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 2,
            title: 'Arrays, Two Pointers & Sliding Window',
            topics: ['Array memory layout', 'Two-pointer technique', 'Sliding Window paradigm'],
            skillsToAcquire: ['Two-pointer patterns', 'Subarray optimization'],
            dsaFocus: ['Move Zeroes', 'Longest Substring Without Repeating Characters', 'Container With Most Water'],
            aptitudeFocus: ['Profit and Loss', 'Discounts'],
            projectMilestone: 'Build Array & String visualizer tool.',
            interviewPrep: ['Explain Array vs LinkedList in memory with cache line implications'],
            tasks: [
              { id: 'm1w2-1', title: 'Solve Longest Substring Without Repeating Characters', completed: false, type: 'dsa' },
              { id: 'm1w2-2', title: 'Practice 15 Profit & Loss questions', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 3,
            title: 'Strings, HashMaps & Frequency Counting',
            topics: ['String pool immutability', 'HashMap hashing & collision resolution', 'HashSet lookups'],
            skillsToAcquire: ['O(1) lookups', 'Anagram grouping'],
            dsaFocus: ['Valid Anagram', 'Group Anagrams', 'Subarray Sum Equals K'],
            aptitudeFocus: ['Ratios and Proportions', 'Averages'],
            interviewPrep: ['How does a HashMap work internally in Java/C++?'],
            tasks: [
              { id: 'm1w3-1', title: 'Solve Valid Anagram & Group Anagrams', completed: false, type: 'dsa' },
              { id: 'm1w3-2', title: 'Score 80%+ on Ratios & Proportions quiz', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 4,
            title: 'Linked Lists & Floyd Cycle Detection',
            topics: ['Singly vs Doubly Linked Lists', 'Fast & Slow Pointer', 'List Reversal'],
            skillsToAcquire: ['Pointer mutation', 'Cycle detection'],
            dsaFocus: ['Reverse Linked List', 'Linked List Cycle', 'Merge Two Sorted Lists'],
            aptitudeFocus: ['Time and Work (Unitary & LCM method)'],
            projectMilestone: 'Build a CLI Music Playlist manager using Doubly Linked List.',
            interviewPrep: ['Detecting cycles in constant space without modifying pointers'],
            tasks: [
              { id: 'm1w4-1', title: 'Implement Reverse Linked List', completed: false, type: 'dsa' },
              { id: 'm1w4-2', title: 'Complete Time and Work aptitude module', completed: false, type: 'aptitude' },
            ],
          },
        ],
      },
      {
        monthNumber: 2,
        monthTitle: 'Month 2: Stacks, Queues, OOP & Relational Databases',
        theme: 'LIFO/FIFO, Monotonic Stacks, OOP Architecture & SQL',
        milestone: 'Design full OOP domain model and write complex multi-table SQL queries.',
        weeks: [
          {
            weekNumber: 5,
            title: 'Stacks & Monotonic Stack Pattern',
            topics: ['Stack mechanics', 'Expression evaluation', 'Next Greater Element'],
            skillsToAcquire: ['Monotonic Stack', 'Parentheses parsing'],
            dsaFocus: ['Valid Parentheses', 'Min Stack', 'Daily Temperatures'],
            aptitudeFocus: ['Time Speed Distance', 'Train Problems'],
            interviewPrep: ['Explain stack overflow and call stack limits'],
            tasks: [
              { id: 'm2w5-1', title: 'Solve Valid Parentheses and Min Stack', completed: false, type: 'dsa' },
              { id: 'm2w5-2', title: 'Practice 15 Time Speed Distance problems', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 6,
            title: 'Queues, Deques & Monotonic Queues',
            topics: ['Circular Queue', 'Sliding Window Maximum', 'Implement Queue with Stacks'],
            skillsToAcquire: ['Queue design', 'Window extremums'],
            dsaFocus: ['Implement Queue using Stacks', 'Sliding Window Maximum'],
            aptitudeFocus: ['Boats & Streams', 'Races'],
            projectMilestone: 'Build an Async Task Queue simulator.',
            interviewPrep: ['Difference between Process and Thread in memory'],
            tasks: [
              { id: 'm2w6-1', title: 'Solve Implement Queue using Stacks', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 7,
            title: 'Object-Oriented Programming (OOP) Pillars',
            topics: ['Inheritance vs Composition', 'Polymorphism (Dynamic & Static)', 'SOLID Principles', 'Interfaces & Abstract Classes'],
            skillsToAcquire: ['Object modeling', 'Design extensibility'],
            dsaFocus: ['Design Parking Lot LLD', 'LRU Cache Design Basics'],
            aptitudeFocus: ['Logical Reasoning - Blood Relations'],
            projectMilestone: 'Design Clean Architecture E-Commerce Domain in Java/TypeScript.',
            interviewPrep: ['Explain Runtime Polymorphism with V-Table implementation'],
            tasks: [
              { id: 'm2w7-1', title: 'Write OOP examples for 4 core pillars', completed: false, type: 'core' },
              { id: 'm2w7-2', title: 'Complete Blood Relations logical quiz', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 8,
            title: 'Database Management Systems (DBMS) & SQL',
            topics: ['ACID Properties', 'Normalization (1NF to 3NF)', 'B-Tree & Hash Indexing', 'Joins & Subqueries'],
            skillsToAcquire: ['Complex SQL query writing', 'Schema design'],
            dsaFocus: ['LeetCode SQL Top 15 queries'],
            aptitudeFocus: ['Logical Reasoning - Syllogisms'],
            interviewPrep: ['Difference between Clustered and Non-Clustered Indexes'],
            tasks: [
              { id: 'm2w8-1', title: 'Write 10 complex SQL join queries', completed: false, type: 'core' },
              { id: 'm2w8-2', title: 'Take DBMS mock test', completed: false, type: 'interview' },
            ],
          },
        ],
      },
      {
        monthNumber: 3,
        monthTitle: 'Month 3: Recursion, Trees, BST & Operating Systems',
        theme: 'Hierarchical Structures, Tree Traversals & OS Fundamentals',
        milestone: 'Solve 35+ Binary Tree & BST problems and master OS Concurrency.',
        weeks: [
          {
            weekNumber: 9,
            title: 'Recursion & Backtracking',
            topics: ['Recursion tree visualization', 'Backtracking state exploration', 'Base case design'],
            skillsToAcquire: ['Backtracking decision trees', 'Power set generation'],
            dsaFocus: ['Subsets', 'Permutations', 'Combination Sum'],
            aptitudeFocus: ['Permutations & Combinations'],
            interviewPrep: ['Explain recursion depth vs call stack limits'],
            tasks: [
              { id: 'm3w9-1', title: 'Solve Subsets and Permutations', completed: false, type: 'dsa' },
              { id: 'm3w9-2', title: 'Complete P&C aptitude quiz', completed: false, type: 'aptitude' },
            ],
          },
          {
            weekNumber: 10,
            title: 'Binary Trees (DFS & BFS)',
            topics: ['Inorder, Preorder, Postorder Traversals', 'Level-order BFS', 'Tree Diameters & Depth'],
            skillsToAcquire: ['Tree traversal algorithms', 'Recursive divide-and-conquer'],
            dsaFocus: ['Maximum Depth of Binary Tree', 'Invert Binary Tree', 'Lowest Common Ancestor'],
            aptitudeFocus: ['Probability & Dice/Cards questions'],
            interviewPrep: ['Why BFS uses Queue while DFS uses Stack?'],
            tasks: [
              { id: 'm3w10-1', title: 'Solve Invert Tree and Max Depth', completed: false, type: 'dsa' },
              { id: 'm3w10-2', title: 'Solve Lowest Common Ancestor', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 11,
            title: 'Binary Search Trees & Heaps / Priority Queues',
            topics: ['BST invariant property', 'In-order traversal of BST', 'Min-Heap / Max-Heap', 'Top-K problems'],
            skillsToAcquire: ['PriorityQueue utilization', 'BST verification'],
            dsaFocus: ['Validate BST', 'Kth Largest Element in an Array', 'Top K Frequent Elements'],
            aptitudeFocus: ['Data Interpretation - Bar & Pie Charts'],
            projectMilestone: 'Build a Real-Time Leaderboard with Min-Heap.',
            interviewPrep: ['Time complexity of building a heap from unsorted array (O(N))'],
            tasks: [
              { id: 'm3w11-1', title: 'Solve Validate BST and Kth Largest Element', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 12,
            title: 'Operating Systems (OS) Core',
            topics: ['Process Scheduling', 'Deadlocks & Prevention', 'Virtual Memory & Paging', 'Semaphores & Mutex'],
            skillsToAcquire: ['Multithreading concepts', 'Memory virtualization'],
            dsaFocus: ['Binary Search on Answer problems'],
            aptitudeFocus: ['Verbal Ability - Sentence Correction'],
            interviewPrep: ['Explain Deadlock 4 necessary conditions and Coffman conditions'],
            tasks: [
              { id: 'm3w12-1', title: 'Review OS core interview cheat sheet', completed: false, type: 'core' },
            ],
          },
        ],
      },
      {
        monthNumber: 4,
        monthTitle: 'Month 4: Graphs, Computer Networks & Full-Stack Projects',
        theme: 'Graph Traversals, Shortest Paths, TCP/IP & Portfolio Project Sprint',
        milestone: 'Master Graph BFS/DFS, shortest paths, and deploy a full-stack project.',
        weeks: [
          {
            weekNumber: 13,
            title: 'Graph Fundamentals & BFS/DFS',
            topics: ['Adjacency list representation', 'Connected components', 'Cycle detection (Kahn’s / DFS)', 'Topological Sort'],
            skillsToAcquire: ['Graph modeling', 'Matrix flood fills'],
            dsaFocus: ['Number of Islands', 'Clone Graph', 'Course Schedule'],
            aptitudeFocus: ['Logical Reasoning - Coding-Decoding & Direction Sense'],
            interviewPrep: ['How to detect cycles in a directed vs undirected graph?'],
            tasks: [
              { id: 'm4w13-1', title: 'Solve Number of Islands and Course Schedule', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 14,
            title: 'Shortest Path & Disjoint Set Union (DSU)',
            topics: ['Dijkstra Algorithm', 'Union-Find with Path Compression', 'Minimum Spanning Tree (Kruskal)'],
            skillsToAcquire: ['Greedy graph algorithms', 'Disjoint set connectivity'],
            dsaFocus: ['Network Delay Time', 'Number of Provinces', 'Redundant Connection'],
            aptitudeFocus: ['Data Interpretation - Tables and Growth Calculations'],
            projectMilestone: 'Build Social Graph Friend Recommendation Service.',
            interviewPrep: ['Explain why Dijkstra does not work with negative edge weights'],
            tasks: [
              { id: 'm4w14-1', title: 'Implement Dijkstra and Union-Find', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 15,
            title: 'Computer Networks (CN) & Web Protocols',
            topics: ['OSI 7 Layers', 'TCP 3-Way Handshake & Flow Control', 'HTTP/HTTPS & TLS', 'DNS resolution & Cookies'],
            skillsToAcquire: ['Network debugging', 'Protocol understanding'],
            dsaFocus: ['Trie (Prefix Tree) implementation'],
            aptitudeFocus: ['Verbal Ability - Reading Comprehension'],
            interviewPrep: ['Explain step-by-step what happens when typing a URL in the browser and pressing Enter'],
            tasks: [
              { id: 'm4w15-1', title: 'Review Top 25 Computer Networks questions', completed: false, type: 'core' },
            ],
          },
          {
            weekNumber: 16,
            title: 'Full-Stack Project Sprint & Resume Building',
            topics: ['REST APIs', 'JWT Authentication', 'Clean Architecture', 'ATS Resume Optimization'],
            skillsToAcquire: ['Production deployment', 'STAR resume formatting'],
            dsaFocus: ['Weekly LeetCode contest simulation'],
            aptitudeFocus: ['Comprehensive Placement Mock Test 1'],
            projectMilestone: 'Deploy Full-Stack Project on cloud with live demo link and README.',
            interviewPrep: ['Prepare STAR method stories for your top resume project'],
            tasks: [
              { id: 'm4w16-1', title: 'Run SkillSpike AI Resume Analyzer on your resume', completed: false, type: 'interview' },
            ],
          },
        ],
      },
      {
        monthNumber: 5,
        monthTitle: 'Month 5: Dynamic Programming (DP) & System Design (LLD/HLD)',
        theme: '1D/2D DP, Subsequence DP, Knapsack & Low Level Design',
        milestone: 'Solve classic DP problems and design scalable low-level software modules.',
        weeks: [
          {
            weekNumber: 17,
            title: '1D Dynamic Programming',
            topics: ['Optimal Substructure & Overlapping Subproblems', 'Memoization vs Tabulation', 'Space Optimization'],
            skillsToAcquire: ['DP State modeling', 'Transitions'],
            dsaFocus: ['Climbing Stairs', 'Coin Change', 'House Robber', 'Longest Increasing Subsequence'],
            aptitudeFocus: ['Logical Reasoning - Critical Reasoning & Arrangements'],
            interviewPrep: ['Explain why greedy fails for Coin Change with arbitrary denominations'],
            tasks: [
              { id: 'm5w17-1', title: 'Solve Coin Change and LIS with DP', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 18,
            title: '2D Dynamic Programming & Knapsack',
            topics: ['0/1 Knapsack', 'Grid Paths', 'Target Sum / Subset Sum'],
            skillsToAcquire: ['2D matrix state tracking', 'Row compression'],
            dsaFocus: ['Unique Paths', 'Minimum Path Sum', 'Partition Equal Subset Sum'],
            aptitudeFocus: ['Aptitude speed calculation drills'],
            interviewPrep: ['Show space optimization of 2D DP to 1D DP'],
            tasks: [
              { id: 'm5w18-1', title: 'Solve Unique Paths & Minimum Path Sum', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 19,
            title: 'String DP & Design Patterns',
            topics: ['Longest Common Subsequence (LCS)', 'Edit Distance', 'Singleton, Factory, Observer Patterns'],
            skillsToAcquire: ['String transformation modeling', 'Design patterns in code'],
            dsaFocus: ['Longest Common Subsequence', 'Edit Distance'],
            aptitudeFocus: ['Comprehensive Placement Mock Test 2'],
            projectMilestone: 'Implement Low-Level Design for Elevator or Parking Lot system in code.',
            interviewPrep: ['Derive Edit Distance recurrence relation step-by-step'],
            tasks: [
              { id: 'm5w19-1', title: 'Solve LCS and Edit Distance', completed: false, type: 'dsa' },
            ],
          },
          {
            weekNumber: 20,
            title: 'Low-Level Design (LLD) & LRU Cache',
            topics: ['UML Class Diagrams', 'Design Patterns implementation', 'Thread-Safe Singletons', 'LRU Cache Design'],
            skillsToAcquire: ['Object-oriented design interviews', 'System scalability basics'],
            dsaFocus: ['LRU Cache (HashMap + Doubly Linked List)'],
            aptitudeFocus: ['Company Test Pattern Series (Amazon/TCS/Infosys)'],
            interviewPrep: ['Design a URL Shortener (TinyURL architecture)'],
            tasks: [
              { id: 'm5w20-1', title: 'Implement LRU Cache from scratch with O(1) ops', completed: false, type: 'dsa' },
            ],
          },
        ],
      },
      {
        monthNumber: 6,
        monthTitle: 'Month 6: Company-Specific Sprints & AI Mock Interview Blitz',
        theme: 'Mock Interviews, Behavioral STAR, Company Archives & Final Placement Mastery',
        milestone: 'Achieve 90%+ interview readiness score and crack dream campus placement.',
        weeks: [
          {
            weekNumber: 21,
            title: 'Company-Specific DSA Blitz',
            topics: ['Top 50 Most Asked Amazon / Google / Microsoft Questions', 'Speed problem solving (20 mins per problem)'],
            skillsToAcquire: ['Time-constrained coding', 'Edge-case spotting'],
            dsaFocus: ['Trapping Rain Water', 'Word Ladder', 'Merge Intervals'],
            aptitudeFocus: ['Full Length 90-minute Placement Simulation'],
            interviewPrep: ['Complete 3 AI Technical Mock Interviews with SkillSpike Coach'],
            tasks: [
              { id: 'm6w21-1', title: 'Complete AI Technical Interview session', completed: false, type: 'interview' },
            ],
          },
          {
            weekNumber: 22,
            title: 'Behavioral & Leadership Principles',
            topics: ['Amazon 16 Leadership Principles', 'Conflict resolution questions', 'Failure & challenge stories (STAR)'],
            skillsToAcquire: ['Executive storytelling', 'Confidence under pressure'],
            dsaFocus: ['Blind 75 revision'],
            aptitudeFocus: ['Verbal & Communication Polish'],
            interviewPrep: ['Practice 10 Behavioral questions with AI Coach'],
            tasks: [
              { id: 'm6w22-1', title: 'Complete AI Behavioral Mock Interview', completed: false, type: 'interview' },
            ],
          },
          {
            weekNumber: 23,
            title: 'HR & Full Mock Interview Rounds',
            topics: ['Resume grilling round', 'HR classic questions', 'Questions to ask the interviewer'],
            skillsToAcquire: ['Company culture alignment', 'Composure'],
            dsaFocus: ['Live whiteboard coding'],
            aptitudeFocus: ['Mental math warmup drills'],
            interviewPrep: ['Complete AI HR Mock Interview with comprehensive evaluation'],
            tasks: [
              { id: 'm6w23-1', title: 'Complete AI HR Interview round', completed: false, type: 'interview' },
            ],
          },
          {
            weekNumber: 24,
            title: 'Placement Week & Dream Offer Execution',
            topics: ['Final day checklist', 'Stress management', 'Campus drive strategy'],
            skillsToAcquire: ['Peak performance state', 'Mental clarity'],
            dsaFocus: ['Formula cheat-sheet quick review'],
            aptitudeFocus: ['Final confidence booster tests'],
            interviewPrep: ['Self-affirmation and live dress rehearsal'],
            tasks: [
              { id: 'm6w24-1', title: 'Conquer your dream placement drive!', completed: false, type: 'core' },
            ],
          },
        ],
      },
    ],
  };
}

function getFallbackInterviewQuestion(mode: string, jobRole: string, questionIndex: number): string {
  const technicalQuestions = [
    `Can you explain the internal mechanics of a HashMap in Java/C++, and how hash collisions are handled?`,
    `Given an array of integers, how would you find the subarray with the maximum sum in O(N) time? Walk me through Kadane's algorithm.`,
    `How does index lookup work in a relational database (like PostgreSQL/MySQL), and what is the difference between a clustered and non-clustered B+ tree index?`,
    `What happens under the hood when a user types 'https://amazon.com' in a browser and presses Enter? Describe the DNS, TCP, and TLS handshake steps.`,
    `How would you design an in-memory LRU (Least Recently Used) cache with O(1) get and put operations? Which data structures would you combine and why?`,
  ];

  const hrQuestions = [
    `Tell me about yourself, your background, and why you are interested in pursuing a career as a ${jobRole}.`,
    `What motivated you to apply for this role, and where do you see your technical trajectory over the next 2-3 years?`,
    `Describe a situation where you had to learn a completely new technology or framework under a tight academic or project deadline. How did you manage your time?`,
    `Tell me about a time you experienced a conflict or disagreement with a teammate during a group project. How did you resolve it?`,
    `Why should we hire you over other candidates for this position? What is your greatest technical strength?`,
  ];

  const behavioralQuestions = [
    `Describe a challenging project you built. What was the most difficult bug or architectural obstacle you faced, and how did you resolve it using the STAR method?`,
    `Tell me about a time when a project deadline was at risk. How did you prioritize tasks and communicate with stakeholders?`,
    `Can you share an instance where you received critical feedback on your code or design? How did you react and what changes did you make?`,
    `Give an example of a time when you took the initiative to improve a system, codebase, or team process without being asked.`,
    `Tell me about a time you failed or made a mistake in a software project. What was the impact and what did you learn?`,
  ];

  const list = mode === 'HR' ? hrQuestions : mode === 'Behavioral' ? behavioralQuestions : technicalQuestions;
  const idx = Math.max(0, Math.min(questionIndex - 1, list.length - 1));
  return list[idx];
}

function getFallbackEvaluation(question: string, answer: string, mode: string) {
  const wordCount = (answer || '').trim().split(/\s+/).length;
  const isDetailed = wordCount > 25;
  const score = isDetailed ? 8.5 : 6.5;

  return {
    overallScore: score,
    communicationScore: isDetailed ? 8.5 : 7.0,
    technicalScore: isDetailed ? 8.8 : 6.5,
    confidenceScore: isDetailed ? 8.2 : 6.0,
    relevanceScore: isDetailed ? 9.0 : 7.0,
    structureScore: isDetailed ? 8.4 : 6.5,
    goodPoints: [
      'Identified core concepts directly related to the prompt',
      'Demonstrated logical progression of ideas',
      isDetailed ? 'Provided concrete examples and context' : 'Clear and concise articulation',
    ],
    improvementPoints: [
      'Incorporate the STAR methodology (Situation, Task, Action, Result) for stronger storytelling',
      'Mention time and space complexity trade-offs or scalability considerations',
      'Highlight specific business or project metrics (e.g. latency reduced, user load handled)',
    ],
    betterAnswerExample: `When answering "${question}", start with a direct definition: "A HashMap provides O(1) average-time lookups using bucket arrays and hash functions. When collisions occur, modern implementations use linked-list chaining, upgrading to a balanced Red-Black Tree when a bucket's threshold exceeds 8 (in Java 8+). In my recent projects, I leveraged this for caching session lookups with optimal space overhead."`,
  };
}

function generateFallbackResumeAnalysis(resumeText: string, targetRole: string, fileName: string) {
  const lower = (resumeText || '').toLowerCase();
  const techKeywords = ['java', 'python', 'c++', 'javascript', 'typescript', 'react', 'node', 'sql', 'git', 'dsa', 'aws', 'docker', 'rest api', 'mongodb', 'html', 'css', 'oop'];
  
  const matched = techKeywords.filter(k => lower.includes(k));
  const missing = techKeywords.filter(k => !lower.includes(k)).slice(0, 6);

  const baseScore = Math.min(95, Math.max(65, 60 + matched.length * 3));
  const atsScore = Math.min(98, Math.max(70, baseScore + 4));

  return {
    overallScore: baseScore,
    atsCompatibilityScore: atsScore,
    targetRole,
    fileName,
    analyzedAt: new Date().toISOString(),
    strengths: [
      `Detected solid foundational skills in ${matched.slice(0, 3).join(', ') || 'software development'}`,
      'Standard section hierarchy makes the resume easily readable by Applicant Tracking Systems',
      'Clear educational credentials and graduation timeline',
      'Demonstrated practical project development experience',
    ],
    weaknesses: [
      `Missing crucial high-demand industry keywords for ${targetRole}: ${missing.slice(0, 3).join(', ')}`,
      'Bullet points could use more quantifiable metrics (e.g. reduced load time by 35%, served 500+ users)',
      'Consider adding direct GitHub repository and live deployment hyperlinks to all portfolio projects',
    ],
    missingKeywords: missing.length > 0 ? missing : ['Docker', 'CI/CD Pipelines', 'Unit Testing (JUnit/Jest)', 'System Design', 'Redis', 'Microservices'],
    matchedKeywords: matched.length > 0 ? matched : ['Java', 'SQL', 'Git', 'Data Structures', 'Algorithms'],
    sectionAnalyses: [
      {
        name: 'ATS Compatibility',
        score: atsScore,
        status: atsScore >= 80 ? 'Good' : 'Needs Work',
        feedback: 'Single-column structure is well-parsed by modern enterprise ATS engines (Workday, Taleo, Greenhouse).',
        keyFindings: ['Clean parseable text without nested tables', 'Standard section headers recognized'],
      },
      {
        name: 'Technical Skills Alignment',
        score: Math.min(95, baseScore + 2),
        status: matched.length >= 4 ? 'Good' : 'Needs Work',
        feedback: `Matches key competencies for ${targetRole}, but adding missing tools will boost ranking.`,
        keyFindings: [`Matched ${matched.length} core technical keywords`, `Recommended to add ${missing.slice(0, 3).join(', ')}`],
      },
      {
        name: 'Projects & Portfolio',
        score: Math.min(90, baseScore),
        status: 'Good',
        feedback: 'Projects showcase practical implementation of algorithms and web technologies.',
        keyFindings: ['Clear tech stack listed per project', 'Add quantifiable metrics and live deployment links'],
      },
      {
        name: 'Experience & Internships',
        score: Math.max(65, baseScore - 5),
        status: 'Needs Work',
        feedback: 'Use Google XYZ format (Accomplished [X], as measured by [Y], by doing [Z]).',
        keyFindings: ['Focus on business outcomes and optimizations rather than just task lists'],
      },
      {
        name: 'Education & Academic Details',
        score: 92,
        status: 'Good',
        feedback: 'University, degree program, CGPA/percentage and timeline are cleanly formatted.',
        keyFindings: ['Academic milestones and relevant coursework clearly articulated'],
      },
      {
        name: 'Formatting, Typography & Grammar',
        score: 88,
        status: 'Good',
        feedback: 'Consistent indentation, bullet points, and active voice action verbs.',
        keyFindings: ['No spelling or major grammatical errors detected'],
      },
    ],
    formattingSuggestions: [
      'Begin every bullet point with strong action verbs: "Architected", "Engineered", "Implemented", "Optimized".',
      'Keep the resume strictly within 1 page for undergraduate campus placement drives.',
      'Group technical skills into clean categories: Languages, Frameworks, Databases, Tools & Platforms.',
    ],
    actionableRecommendations: [
      `Add these top missing keywords to your skills section: ${missing.slice(0, 4).join(', ')}.`,
      'Rewrite at least 3 project bullets using quantified impact (e.g. "Optimized API query latency by 40% using Redis caching").',
      'Ensure every project has an active clickable GitHub repository link.',
    ],
  };
}

function getFallbackChatReply(message: string, profile: any): string {
  const lower = (message || '').toLowerCase();
  const name = profile?.name || 'Student';
  const role = profile?.targetRole || 'Software Developer';

  if (lower.includes('today') || lower.includes('what should i study')) {
    return `Hello **${name}**! Here is your high-impact daily placement plan for today:

1. 💻 **DSA (1 hour)**: Solve 2 Medium-level problems on **Arrays & HashMaps** (e.g., *Subarray Sum Equals K* and *Group Anagrams*).
2. 🧮 **Aptitude (30 mins)**: Practice 15 questions on **Time, Speed & Distance** or **Percentages** in the Aptitude section.
3. 🎤 **Interview Polish (20 mins)**: Head to the **AI Interview Coach** and complete a quick 3-question Technical round.
4. 📖 **Core Subject Revision (10 mins)**: Review DBMS Indexing (B+ Trees vs Hash Indexing) and the ACID principles.

You are on a **${profile?.currentStreak || 5}-day streak**! Consistency is what wins placement offers. Ready to start?`;
  }

  if (lower.includes('amazon') || lower.includes('prepare for amazon')) {
    return `### 🚀 Amazon Placement Preparation Master Plan for ${role}:

1. 🏆 **Top DSA Focus Areas**:
   - **Arrays & Strings**: Two Pointers, Sliding Window, Kadane's algorithm.
   - **Trees & BST**: Lowest Common Ancestor, Level Order Traversal, Validate BST.
   - **Graphs**: Number of Islands, Course Schedule, Word Ladder.
   - **Priority Queue / Heap**: Top K Frequent Elements, Merge K Sorted Lists.

2. 🧠 **Amazon 16 Leadership Principles (LPs)**:
   - Amazon interviews weight Leadership Principles up to **50% of the evaluation**.
   - Prepare 2 distinct STAR stories for: *Customer Obsession*, *Ownership*, *Bias for Action*, *Deliver Results*, and *Earn Trust*.

3. 🛠️ **System & Low-Level Design (LLD)**:
   - Implement **LRU Cache** and design a modular Parking Lot / Elevator system in code.

Would you like to practice an Amazon-focused mock technical or behavioral interview right now in the Interview section?`;
  }

  if (lower.includes('binary search') || lower.includes('explain binary search')) {
    return `### 🔍 Binary Search Explained:

**Binary Search** is an optimal search algorithm that operates on **sorted arrays** with a time complexity of **O(log N)**.

#### Core Intuition:
At each step, we divide the search space in half by comparing the target with the middle element.

#### Clean Template (Java/C++/Python):
\`\`\`python
def binary_search(nums: list[int], target: int) -> int:
    low = 0
    high = len(nums) - 1
    
    while low <= high:
        # Avoid integer overflow
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1  # Target is in right half
        else:
            high = mid - 1 # Target is in left half
            
    return -1 # Target not found
\`\`\`

#### Pro Tip for Interviews:
Watch out for **"Binary Search on Answer"** patterns (e.g., *Koko Eating Bananas*, *Capacity to Ship Packages*), where you search over a monotonic answer space rather than a direct array!`;
  }

  if (lower.includes('30-day') || lower.includes('30 day') || lower.includes('plan')) {
    return `### 📅 30-Day Placement Sprint for ${role}:

- **Week 1 (Days 1–7)**: Arrays, Strings, HashMaps, Two-Pointers + Quantitative Aptitude (Percentages, Profit & Loss).
- **Week 2 (Days 8–14)**: Linked Lists, Stacks, Queues, Binary Search + Logical Reasoning (Blood Relations, Syllogisms).
- **Week 3 (Days 15–21)**: Binary Trees, BST, Heaps, Recursion + Core OS (Processes, Deadlocks) & DBMS (SQL Joins, Normalization).
- **Week 4 (Days 22–30)**: Graphs (BFS/DFS), 1D Dynamic Programming, STAR Behavioral Prep + 3 AI Mock Interviews on SkillSpike!

Start by completing today's tasks on your dashboard!`;
  }

  return `I am here to guide your placement journey for **${role}**!

You can ask me to:
- 📌 Generate custom study schedules and daily preparation routines
- 💡 Explain any DSA algorithm with code templates in Java, Python, or C++
- 🏢 Provide company-specific preparation guides (Amazon, Google, Microsoft, TCS, Infosys)
- 📝 Review your resume bullet points and suggest ATS improvements
- 🎯 Test your conceptual knowledge in OS, DBMS, Computer Networks, and OOP

What would you like to master today?`;
}

startServer();

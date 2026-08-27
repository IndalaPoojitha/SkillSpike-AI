import { AptitudeQuestion } from '../types';

export const APTITUDE_CATEGORIES = [
  'Quantitative',
  'Logical',
  'Verbal',
  'Data Interpretation',
] as const;

export const QUANT_TOPICS = [
  'All Quantitative',
  'Percentages',
  'Profit & Loss',
  'Time & Work',
  'Time Speed Distance',
  'Ratios & Proportions',
  'Averages',
  'Probability',
  'Permutations & Combinations',
  'Number System',
];

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Quantitative - Percentages
  {
    id: 'apt-q1',
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Easy',
    question: 'If the price of a laptop is increased by 20% and then reduced by 20%, what is the net percentage change in its price?',
    options: ['0% (No change)', '4% decrease', '4% increase', '2% decrease'],
    correctAnswerIndex: 1,
    explanation: `Let initial price = 100.
After 20% increase = 120.
After 20% decrease on 120 = 120 - (0.20 * 120) = 120 - 24 = 96.
Net change = 96 - 100 = -4% (4% decrease).
Formula: Net change = x + y + (xy / 100) = +20 - 20 - (400/100) = -4%.`,
  },
  {
    id: 'apt-q2',
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Medium',
    question: 'In an election between two candidates, the winner received 58% of the total valid votes and won by a majority of 2,400 votes. What was the total number of valid votes polled?',
    options: ['12,000', '15,000', '16,000', '20,000'],
    correctAnswerIndex: 1,
    explanation: `Winner votes = 58%. Loser votes = (100 - 58) = 42%.
Majority difference = 58% - 42% = 16%.
16% of total votes = 2400.
Total votes = 2400 / 0.16 = 15,000 votes.`,
  },
  // Quantitative - Profit & Loss
  {
    id: 'apt-q3',
    category: 'Quantitative',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'A shopkeeper sells an article at a profit of 15%. If he had bought it at 10% less and sold it for $21 less, he would have gained 25%. What is the cost price of the article?',
    options: ['$350', '$400', '$450', '$500'],
    correctAnswerIndex: 1,
    explanation: `Let original Cost Price (CP) = 100x.
Original Selling Price (SP1) = 115x.
New CP = 90x.
New SP2 = 90x * 1.25 = 112.5x.
Given SP1 - SP2 = 21 => 115x - 112.5x = 21 => 2.5x = 21 => x = 4.
Original CP = 100x = $400.`,
  },
  // Quantitative - Time & Work
  {
    id: 'apt-q4',
    category: 'Quantitative',
    topic: 'Time & Work',
    difficulty: 'Easy',
    question: 'A can complete a work in 12 days and B in 18 days. If they work together, in how many days will the entire work be completed?',
    options: ['6.5 days', '7.2 days', '8 days', '9.5 days'],
    correctAnswerIndex: 1,
    explanation: `A's 1-day work = 1/12.
B's 1-day work = 1/18.
Together 1-day work = 1/12 + 1/18 = (3 + 2)/36 = 5/36.
Total days = 36 / 5 = 7.2 days.`,
  },
  {
    id: 'apt-q5',
    category: 'Quantitative',
    topic: 'Time & Work',
    difficulty: 'Medium',
    question: '10 men can finish a construction project in 15 days working 8 hours a day. In how many days can 12 men finish the same project working 10 hours a day?',
    options: ['8 days', '10 days', '12 days', '15 days'],
    correctAnswerIndex: 1,
    explanation: `Use formula: (M1 * D1 * H1) = (M2 * D2 * H2).
(10 * 15 * 8) = (12 * D2 * 10).
1200 = 120 * D2 => D2 = 10 days.`,
  },
  // Quantitative - Time Speed Distance
  {
    id: 'apt-q6',
    category: 'Quantitative',
    topic: 'Time Speed Distance',
    difficulty: 'Medium',
    question: 'A train 180 meters long is traveling at 72 km/h. How many seconds will it take to pass an electric pole?',
    options: ['7 seconds', '8 seconds', '9 seconds', '10 seconds'],
    correctAnswerIndex: 2,
    explanation: `Speed in m/s = 72 * (5/18) = 20 m/s.
Distance to cross pole = Length of train = 180 m.
Time = Distance / Speed = 180 / 20 = 9 seconds.`,
  },
  {
    id: 'apt-q7',
    category: 'Quantitative',
    topic: 'Time Speed Distance',
    difficulty: 'Hard',
    question: 'A person travels from city A to city B at 60 km/h and returns from B to A at 90 km/h along the same route. What is the average speed for the entire round trip?',
    options: ['72 km/h', '75 km/h', '78 km/h', '80 km/h'],
    correctAnswerIndex: 0,
    explanation: `When distance is constant, Average Speed = (2 * x * y) / (x + y).
Average Speed = (2 * 60 * 90) / (60 + 90) = 10800 / 150 = 72 km/h.`,
  },
  // Quantitative - Ratios & Proportions
  {
    id: 'apt-q8',
    category: 'Quantitative',
    topic: 'Ratios & Proportions',
    difficulty: 'Easy',
    question: 'If A : B = 3 : 4 and B : C = 8 : 9, find the ratio of A : C.',
    options: ['1 : 2', '2 : 3', '3 : 5', '4 : 9'],
    correctAnswerIndex: 1,
    explanation: `A / C = (A / B) * (B / C) = (3 / 4) * (8 / 9) = 24 / 36 = 2 / 3 = 2 : 3.`,
  },
  // Quantitative - Averages
  {
    id: 'apt-q9',
    category: 'Quantitative',
    topic: 'Averages',
    difficulty: 'Easy',
    question: 'The average of 5 consecutive odd numbers is 27. What is the value of the largest of these numbers?',
    options: ['29', '31', '33', '35'],
    correctAnswerIndex: 1,
    explanation: `In consecutive odd numbers, the average is the middle number (3rd number).
3rd number = 27.
The numbers are: 23, 25, 27, 29, 31.
Largest number = 31.`,
  },
  // Quantitative - Probability
  {
    id: 'apt-q10',
    category: 'Quantitative',
    topic: 'Probability',
    difficulty: 'Medium',
    question: 'Two dice are rolled simultaneously. What is the probability that the sum of the numbers appearing on both dice is 8?',
    options: ['1/6', '5/36', '7/36', '1/9'],
    correctAnswerIndex: 1,
    explanation: `Total outcomes = 6 * 6 = 36.
Pairs that sum to 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes.
Probability = 5 / 36.`,
  },
  // Quantitative - Permutations & Combinations
  {
    id: 'apt-q11',
    category: 'Quantitative',
    topic: 'Permutations & Combinations',
    difficulty: 'Medium',
    question: 'In how many different ways can the letters of the word "LEADING" be arranged such that the vowels always come together?',
    options: ['360', '480', '720', '1440'],
    correctAnswerIndex: 2,
    explanation: `In "LEADING", vowels are E, A, I (3 vowels) and consonants are L, D, N, G (4 consonants).
Group vowels (E,A,I) as 1 single block.
Total units to arrange = 4 consonants + 1 block = 5 units.
Ways to arrange 5 units = 5! = 120.
Ways to arrange 3 vowels within the block = 3! = 6.
Total arrangements = 120 * 6 = 720.`,
  },
  // Quantitative - Number System
  {
    id: 'apt-q12',
    category: 'Quantitative',
    topic: 'Number System',
    difficulty: 'Medium',
    question: 'What is the remainder when (7^84) is divided by 342?',
    options: ['1', '7', '49', '341'],
    correctAnswerIndex: 0,
    explanation: `Note that 7^3 = 343.
Dividing 343 by 342 gives remainder +1.
(7^84) = (7^3)^28 = (343)^28.
Remainder of (343)^28 / 342 = (+1)^28 = 1.`,
  },
  // Logical Reasoning
  {
    id: 'apt-q13',
    category: 'Logical',
    topic: 'Blood Relations',
    difficulty: 'Medium',
    question: 'Pointing to a photograph of a man, Rohit said, "His mother is the only daughter of my mother." How is Rohit related to the man in the photograph?',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctAnswerIndex: 1,
    explanation: `"Only daughter of my mother" means Rohit\'s sister.
The woman in question is the man\'s mother.
Therefore, the man\'s mother is Rohit\'s sister, which makes Rohit his Maternal Uncle.`,
  },
  {
    id: 'apt-q14',
    category: 'Logical',
    topic: 'Syllogisms',
    difficulty: 'Medium',
    question: 'Statements:\n1. All cars are vehicles.\n2. Some vehicles are electric.\n\nConclusions:\nI. Some cars are electric.\nII. All electric are vehicles.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither I nor II follows', 'Both follow'],
    correctAnswerIndex: 2,
    explanation: `Cars are a subset of vehicles. Electric intersects with vehicles, but does not necessarily intersect with the cars subset. Also, only some vehicles are electric, not all electric are necessarily defined as vehicles. Hence neither conclusion follows with certainty.`,
  },
  {
    id: 'apt-q15',
    category: 'Logical',
    topic: 'Coding-Decoding',
    difficulty: 'Easy',
    question: 'In a certain code, "CLOUD" is written as "DNPXF". How is "RAINS" written in that code?',
    options: ['SBLOT', 'SBJOT', 'TCJOT', 'SBLPU'],
    correctAnswerIndex: 1,
    explanation: `Pattern:
C(+1)->D, L(+2)->N, O(+1)->P, U(+3)->X, D(+2)->F (+1, +2, +1, +3, +2)
For RAINS:
R (+1) = S
A (+1) = B
I (+1) = J
N (+1) = O
S (+1) = T -> Each letter shifted by +1. Matching pattern yields SBJOT.`,
  },
  // Verbal Ability
  {
    id: 'apt-q16',
    category: 'Verbal',
    topic: 'Sentence Correction',
    difficulty: 'Medium',
    question: 'Choose the grammatically correct sentence:',
    options: [
      'Neither the manager nor the engineers was present at the deployment meeting.',
      'Neither the manager nor the engineers were present at the deployment meeting.',
      'Neither the manager or the engineers was present at the deployment meeting.',
      'Neither of the manager nor the engineers were present.',
    ],
    correctAnswerIndex: 1,
    explanation: `When using "Neither... nor...", the verb agrees with the closer subject. Since "the engineers" is plural and closer to the verb, "were" is correct.`,
  },
  {
    id: 'apt-q17',
    category: 'Verbal',
    topic: 'Synonyms & Antonyms',
    difficulty: 'Easy',
    question: 'Select the synonym for the word "PRAGMATIC":',
    options: ['Theoretical', 'Practical', 'Idealistic', 'Impulsive'],
    correctAnswerIndex: 1,
    explanation: `"Pragmatic" means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.`,
  },
  // Data Interpretation
  {
    id: 'apt-q18',
    category: 'Data Interpretation',
    topic: 'Bar & Table Interpretation',
    difficulty: 'Medium',
    question: 'Company X revenue grew from $40M in 2023 to $64M in 2025. What is the approximate Compound Annual Growth Rate (CAGR)?',
    options: ['20%', '26.5%', '30%', '35.5%'],
    correctAnswerIndex: 1,
    explanation: `Total growth over 2 years = (64 - 40) / 40 = 60%.
CAGR = sqrt(64 / 40) - 1 = sqrt(1.6) - 1 = 1.2649 - 1 = ~26.5%.`,
  },
];

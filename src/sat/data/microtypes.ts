import type { MicroTypeInfo } from '../types';

export const MICRO_TYPES: MicroTypeInfo[] = [
  // ==========================================
  // ALGEBRA (H)
  // ==========================================
  {
    id: 'alg-linear-one-solutions-count',
    title: 'Linear Equations: Number of Solutions (Infinite / None)',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear equations in one variable',
    description: 'Determining constants when an equation in one variable has no solution, exactly one solution, or infinitely many solutions.',
    theorySummary: 'For ax + b = cx + d: If a = c and b ≠ d, there is NO SOLUTION (parallel lines). If a = c and b = d, there are INFINITELY MANY SOLUTIONS (identical lines). If a ≠ c, exactly one unique solution.',
    formulasOrRules: [
      'No Solution: Coefficient of x matches, constant terms differ (e.g. 3x + 5 = 3x - 2)',
      'Infinitely Many Solutions: Identical on both sides after simplifying (e.g. 4x + 8 = 4x + 8)',
      'Exactly One Solution: Coefficients of x are distinct (a ≠ c)'
    ],
    commonTraps: [
      'Forgetting to distribute negative signs across parentheses before equating coefficients.',
      'Assuming "no solution" means x = 0 (x = 0 is a valid single solution!).'
    ],
    desmosTip: 'Enter Left Side as y1 and Right Side as y2. If parallel, no intersection. If overlapping, infinite solutions.',
    bestResources: [
      {
        title: 'Desmos Lesson #1: Solve Any Linear Equation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=UCJZ-cmg5rE',
        provider: 'Scalar Learning',
        durationOrLength: '12 min'
      },
      {
        title: 'College Board Official Guide: Linear Equations',
        type: 'article',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra/x0fcc98a58ba3bea7:linear-equations-in-one-variable/a/v2-sat-lesson-linear-equations-in-one-variable',
        provider: 'Khan Academy SAT'
      }
    ]
  },
  {
    id: 'alg-linear-one-fractional',
    title: 'Linear Equations with Fractions and Clearing Denominators',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear equations in one variable',
    description: 'Solving multi-step equations featuring multiple rational fractional terms by finding the Lowest Common Multiple (LCM).',
    theorySummary: 'Multiply every single term on both sides by the LCM of all denominators to eliminate fractions instantly.',
    formulasOrRules: [
      'Multiply entire equation by LCM(denominators).',
      'Always distribute the LCM to solitary constants (e.g., + 1 must be multiplied too!).'
    ],
    commonTraps: [
      'Missing a lone constant when multiplying through by the LCM.',
      'Sign errors when distributing negative numerators like -(x - 3).'
    ],
    desmosTip: 'Type the entire equation directly into Desmos. Desmos will place vertical lines at the exact x-values of solutions!',
    bestResources: [
      {
        title: 'Solving Equations & 38 SAT Math Strategies',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=sO-oF-l-oY8',
        provider: 'Scalar Learning'
      }
    ]
  },
  {
    id: 'alg-linear-one-basic',
    title: 'Multi-Step Linear Equations & Isolating Variables',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear equations in one variable',
    description: 'Isolating variables in word problems and algebraic equations involving distribution, combining like terms, and reciprocal multiplication.',
    theorySummary: 'Use reverse PEMDAS (SADMEP) to isolate the target variable: undo addition/subtraction first, then multiplication/division.',
    formulasOrRules: [
      'Distribute factors: a(b + c) = ab + ac',
      'Combine like terms on each side before moving across the equal sign.'
    ],
    commonTraps: ['Calculating x when the question specifically asks for (2x + 5) or (x - 1)!'],
    desmosTip: 'Type the equation into Desmos and read the vertical line x-intercept.',
    bestResources: [
      {
        title: 'Official Khan Academy: Linear Equations in One Variable',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra/x0fcc98a58ba3bea7:linear-equations-in-one-variable/a/v2-sat-lesson-linear-equations-in-one-variable'
      }
    ]
  },
  {
    id: 'alg-sys-no-solution',
    title: 'Systems of Equations: No Solution (Parallel Lines)',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Systems of two linear equations in two variables',
    description: 'Solving for missing constants k, a, or b in 2x2 linear systems where the lines never intersect.',
    theorySummary: 'Two lines have no solution if and only if they have equal slopes (m1 = m2) but unequal y-intercepts (b1 ≠ b2). In standard form a1/a2 = b1/b2 ≠ c1/c2.',
    formulasOrRules: [
      'Standard Form Ratio: a1 / a2 = b1 / b2 ≠ c1 / c2',
      'Slope matching: -a1 / b1 = -a2 / b2'
    ],
    commonTraps: ['Forgetting that if c1 / c2 also matches, the system has INFINITELY many solutions, not zero.'],
    desmosTip: 'Plot both lines with a slider for the unknown constant (e.g. k). Adjust until the lines are parallel.',
    bestResources: [
      {
        title: 'Desmos Lesson #2: Systems of Equations & Intersections',
        type: 'video',
        provider: 'Tutorllini Test Prep',
        url: 'https://www.youtube.com/watch?v=aG0K06q_yWk'
      }
    ]
  },
  {
    id: 'alg-sys-inf-solutions',
    title: 'Systems of Equations: Infinitely Many Solutions',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Systems of two linear equations in two variables',
    description: 'Finding coefficients when two linear equations represent the exact same line.',
    theorySummary: 'The equations are multiples of each other. The ratios of x-coefficients, y-coefficients, and constants are all identical: a1/a2 = b1/b2 = c1/c2.',
    formulasOrRules: ['a1/a2 = b1/b2 = c1/c2'],
    commonTraps: ['Overcomplicating with substitution instead of just finding the scale multiplier between equations.'],
    desmosTip: 'Add slider for variable; the correct value makes both lines completely overlap.',
    bestResources: [
      {
        title: 'Systems with Infinite Solutions Explained',
        type: 'article',
        provider: 'PrepPros SAT Guide',
        url: 'https://preppros.io'
      }
    ]
  },
  {
    id: 'alg-sys-substitution-elimination',
    title: 'Solving Systems by Elimination & Substitution',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Systems of two linear equations in two variables',
    description: 'Finding the solution (x, y) or expressions like (x + y) or (x - y) using elimination or substitution.',
    theorySummary: 'Check if you can directly add or subtract the two equations to get the requested expression (like x + y) without finding x and y individually!',
    formulasOrRules: [
      'Elimination: multiply one or both equations by constants to cancel a variable.',
      'Shortcut: Look for adding equations: (3x + 2y = 10) + (x + 2y = 6) -> 4x + 4y = 16 -> x + y = 4.'
    ],
    commonTraps: ['Solving for x when the question asks for x + y or y - x.'],
    desmosTip: 'Type both equations into Desmos and click the point of intersection! Desmos displays (x, y) coordinates instantly.',
    bestResources: [
      {
        title: 'Systems of Equations Fast Elimination & Substitution',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=sO-oF-l-oY8'
      }
    ]
  },
  {
    id: 'alg-func-slope-interpretation',
    title: 'Linear Function: Slope as Rate of Change in Context',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear functions',
    description: 'Interpreting what the coefficient m represents in f(x) = mx + b in real-world contexts (dollars per month, speed, etc.).',
    theorySummary: 'Slope m always represents the change in the dependent variable (output) for every 1-unit increase in the independent variable (input).',
    formulasOrRules: [
      'Slope m = Δy / Δx = (Units of y) per 1 (Unit of x)',
      'Look for keywords: "each", "every", "per", "rate".'
    ],
    commonTraps: ['Confusing the rate of change (m) with the baseline initial value (b).'],
    desmosTip: 'Check values at x = 0 and x = 1 to verify the unit increase.',
    bestResources: [
      {
        title: 'Khan Academy: Linear Functions & Slope Interpretation',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:algebra/x0fcc98a58ba3bea7:linear-functions/a/v2-sat-lesson-linear-functions'
      }
    ]
  },
  {
    id: 'alg-func-intercept',
    title: 'Linear Function: Initial Value & Y-Intercept in Context',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear functions',
    description: 'Interpreting the constant b in f(x) = mx + b as the starting or initial value when the input is 0.',
    theorySummary: 'y-intercept (0, b) represents the baseline condition before any time, distance, or units have elapsed (x = 0).',
    formulasOrRules: ['Evaluate f(0) = b: value of y when x = 0.'],
    commonTraps: ['Forgetting that x might represent years after 2010 (so x = 0 means 2010, not year 0).'],
    desmosTip: 'Find the point where the line crosses the vertical y-axis.',
    bestResources: [
      {
        title: 'Desmos Lesson #3: Slopes and Intercepts',
        type: 'video',
        provider: 'Tutorllini Test Prep',
        url: 'https://www.youtube.com/watch?v=F52s6s-gL40'
      }
    ]
  },
  {
    id: 'alg-dist-pts',
    title: 'Calculating Distance Between Two Points & Midpoints',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear equations in two variables',
    description: 'Using coordinates (x1, y1) and (x2, y2) to compute Euclidean distance, segment lengths, or midpoint coordinates.',
    theorySummary: 'Distance d = √((x2 - x1)² + (y2 - y1)²). This is simply the Pythagorean theorem: a² + b² = c².',
    formulasOrRules: [
      'Distance formula: d = √((x2 - x1)² + (y2 - y1)²)',
      'Midpoint formula: M = ((x1 + x2)/2, (y1 + y2)/2)'
    ],
    commonTraps: ['Subtracting coordinates with negative signs incorrectly (e.g. 5 - (-3) = 8, not 2).'],
    desmosTip: 'Type distance((x1,y1), (x2,y2)) into Desmos; it has a built-in distance function!',
    bestResources: [
      {
        title: 'Digital SAT Math Formula Bible: Distance & Coordinate Geometry',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=F3S6d34K57s'
      }
    ]
  },
  {
    id: 'alg-ineq-system',
    title: 'Linear Inequalities & Feasible Regions',
    section: 'math',
    domain: 'Algebra',
    domainCode: 'H',
    skill: 'Linear inequalities in one or two variables',
    description: 'Determining whether a coordinate (x, y) satisfies a system of inequalities, or finding maximum/minimum integer values.',
    theorySummary: 'Solid line for ≤ and ≥; dashed line for < and >. Test the origin (0, 0) to confirm which side is shaded.',
    formulasOrRules: [
      'Test point (0, 0): If true, shade the side containing (0,0).',
      'Remember to FLIP the inequality sign when multiplying or dividing by a negative number!'
    ],
    commonTraps: ['Forgetting to reverse the inequality sign when dividing by a negative number.'],
    desmosTip: 'Type both inequalities into Desmos (e.g., y >= 2x + 1 and x + y < 5). The darkest overlapping shaded area is the solution set!',
    bestResources: [
      {
        title: 'Desmos Lesson: Systems of Inequalities & Shading',
        type: 'video',
        provider: 'Tutorllini Test Prep',
        url: 'https://www.youtube.com/watch?v=aG0K06q_yWk'
      }
    ]
  },

  // ==========================================
  // ADVANCED MATH (P)
  // ==========================================
  {
    id: 'adv-quad-vertex',
    title: 'Quadratic Functions: Vertex Form & Min/Max Extremum',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Nonlinear functions',
    description: 'Finding the maximum or minimum value of a parabola and the input that yields that extremum.',
    theorySummary: 'Vertex Form: y = a(x - h)² + k has vertex at (h, k). For standard form y = ax² + bx + c, the x-coordinate of the vertex is x = -b / (2a).',
    formulasOrRules: [
      'Vertex Form: y = a(x - h)² + k -> Vertex is (h, k)',
      'Standard Form: x_vertex = -b / (2a); y_vertex = f(-b / (2a))',
      'If a > 0: Minimum at vertex. If a < 0: Maximum at vertex.'
    ],
    commonTraps: [
      'Mixing up what the question asks: the maximum value is the y-coordinate; the value of x at which it occurs is the x-coordinate!',
      'Sign error in vertex form: (x + 3)² means h = -3, not +3.'
    ],
    desmosTip: 'Graph the parabola in Desmos and click directly on the vertex point. Desmos displays the exact coordinates (h, k)!',
    bestResources: [
      {
        title: 'How to Solve the 38 Hardest Digital SAT Math Problems: Quadratics',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=jW8m3rK5y98'
      }
    ]
  },
  {
    id: 'adv-quad-discriminant',
    title: 'Quadratic Discriminant & Number of Real Solutions',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Nonlinear functions',
    description: 'Using b² - 4ac to determine whether a quadratic equation has 0, 1, or 2 real solutions or finding unknown constants.',
    theorySummary: 'From ax² + bx + c = 0, the discriminant is Δ = b² - 4ac. Δ > 0: 2 distinct real solutions. Δ = 0: exactly 1 real solution (tangent to x-axis). Δ < 0: 0 real solutions.',
    formulasOrRules: [
      'Δ = b² - 4ac',
      'b² - 4ac > 0 -> 2 real solutions (2 x-intercepts)',
      'b² - 4ac = 0 -> 1 real solution / double root (vertex touches x-axis)',
      'b² - 4ac < 0 -> 0 real solutions (no x-intercepts)'
    ],
    commonTraps: ['Not setting the equation equal to 0 before identifying a, b, and c!'],
    desmosTip: 'Graph the equation. The number of times it crosses the x-axis equals the number of real solutions.',
    bestResources: [
      {
        title: 'Khan Academy: Quadratic Equations & The Discriminant',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math/x0fcc98a58ba3bea7:quadratic-equations/a/v2-sat-lesson-quadratic-equations'
      }
    ]
  },
  {
    id: 'adv-exp-growth-decay',
    title: 'Exponential Growth and Decay Models',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Nonlinear functions',
    description: 'Interpreting and writing models f(t) = a(b)^t or a(1 ± r)^t, compound interest, half-life, and percent rates.',
    theorySummary: 'Initial value is a. If growth: b = 1 + r. If decay: b = 1 - r, where r is the decimal rate. If time interval is every k years: exponent is t/k.',
    formulasOrRules: [
      'Growth: y = a(1 + r)^t',
      'Decay: y = a(1 - r)^t',
      'Periodic rate: y = a(b)^(t/k) where k is the time required for factor b.'
    ],
    commonTraps: [
      'Thinking a base of 0.82 means an 82% decrease (it is an 18% decrease, because 1 - 0.18 = 0.82!).',
      'Forgetting to divide t by the period k in compound or half-life problems.'
    ],
    desmosTip: 'Create a table of values in Desmos for the given years to verify matching outputs.',
    bestResources: [
      {
        title: 'Khan Academy: Exponential Functions, Growth & Decay',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math/x0fcc98a58ba3bea7:exponential-functions/a/v2-sat-lesson-exponential-functions'
      }
    ]
  },
  {
    id: 'adv-radical-extraneous',
    title: 'Radical Equations & Extraneous Solutions',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Nonlinear equations in one variable and systems of equations in two variables',
    description: 'Solving equations with square roots and identifying false solutions introduced by squaring both sides.',
    theorySummary: 'Whenever you square both sides of an equation (e.g. √(2x + 1) = x - 7), you MUST plug potential solutions back into the ORIGINAL equation because principal square roots cannot equal a negative number!',
    formulasOrRules: [
      'Isolate radical before squaring.',
      'Check: If right side is negative after squaring, that solution is EXTRANEOUS.'
    ],
    commonTraps: ['Forgetting to check solutions in the original equation and choosing an extraneous root.'],
    desmosTip: 'Graph y1 = √(expression) and y2 = other side. Desmos only shows TRUE intersections!',
    bestResources: [
      {
        title: 'Desmos Lesson #1: Finding Extraneous Solutions Instantly',
        type: 'video',
        provider: 'Tutorllini Test Prep',
        url: 'https://www.youtube.com/watch?v=UCJZ-cmg5rE'
      }
    ]
  },
  {
    id: 'adv-nonlinear-linear-system',
    title: 'Nonlinear-Linear Systems (Parabola & Line)',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Nonlinear equations in one variable and systems of equations in two variables',
    description: 'Finding intersection points between a quadratic curve and a linear equation, or conditions for tangency.',
    theorySummary: 'Set the two equations equal to each other (ax² + bx + c = mx + k) $\rightarrow$ rearrange into standard quadratic form $\rightarrow$ solve or use discriminant.',
    formulasOrRules: [
      'Substitute y: ax² + (b - m)x + (c - k) = 0',
      'For exactly 1 point of intersection (tangent): Discriminant = 0.'
    ],
    commonTraps: ['Forgetting that a line can intersect a parabola at 0, 1, or 2 points.'],
    desmosTip: 'Plot both equations in Desmos and click the intersection dots directly!',
    bestResources: [
      {
        title: 'Desmos Lesson: Linear-Quadratic Systems',
        type: 'video',
        provider: 'Tutorllini Test Prep',
        url: 'https://www.youtube.com/watch?v=aG0K06q_yWk'
      }
    ]
  },
  {
    id: 'adv-exp-rules',
    title: 'Exponent and Radical Rules & Fractional Exponents',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'P',
    skill: 'Equivalent expressions',
    description: 'Manipulating rational exponents x^(a/b) = ^b√(x^a) and simplifying high-power polynomial expressions.',
    theorySummary: 'Numerator is power, denominator is root: x^(p/q) = q-th root of x^p. Product rule: x^a · x^b = x^(a+b). Quotient: x^a / x^b = x^(a-b). Power of power: (x^a)^b = x^(ab).',
    formulasOrRules: [
      'x^(a/b) = b√(x^a)',
      'x^(-n) = 1 / x^n',
      'x^a · x^b = x^(a + b)',
      '(x^a)^b = x^(a · b)'
    ],
    commonTraps: ['Adding exponents when multiplying powers with the same base vs multiplying exponents in power-of-power.'],
    desmosTip: 'Pick a test value for x (e.g. x = 2) and evaluate both the original expression and the answer choices to find the matching value!',
    bestResources: [
      {
        title: 'Khan Academy: Equivalent Expressions & Exponent Rules',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math/x0fcc98a58ba3bea7:equivalent-expressions/a/v2-sat-lesson-equivalent-expressions'
      }
    ]
  },

  // ==========================================
  // GEOMETRY & TRIGONOMETRY (S)
  // ==========================================
  {
    id: 'geo-circle-equation',
    title: 'Circle Equations & Completing the Square',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'S',
    skill: 'Circles',
    description: 'Transforming expanded circle equations x² + y² + Ax + By + C = 0 into standard form (x - h)² + (y - k)² = r².',
    theorySummary: 'Standard equation is (x - h)² + (y - k)² = r², where (h, k) is the center and r is the radius. Complete the square for x and y by adding (B/2)² to both sides.',
    formulasOrRules: [
      'Standard form: (x - h)² + (y - k)² = r²',
      'Completing square: add (coefficient/2)² to both sides.',
      'Radius is √(right-side), NOT the right-side itself!'
    ],
    commonTraps: [
      'Forgetting that r² is on the right side: if the right side is 49, the radius is 7, NOT 49!',
      'Sign confusion: (x + 4)² means the center x-coordinate is -4.'
    ],
    desmosTip: 'Paste the entire equation directly into Desmos. Click the center and circle edge to read coordinates and radius!',
    bestResources: [
      {
        title: 'Digital SAT Math Formula Bible: Circle Theorems & Standard Form',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=F3S6d34K57s'
      }
    ]
  },
  {
    id: 'geo-circle-arcs-sectors',
    title: 'Circle Arc Lengths, Sector Areas & Radian Measure',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'S',
    skill: 'Circles',
    description: 'Calculating fractions of circumference and circle area using central angles in degrees and radians.',
    theorySummary: 'Fraction of circle = θ / 360° (in degrees) or θ / (2π) (in radians). Arc length s = rθ (when θ is in radians). Sector area = 1/2 r² θ (radians).',
    formulasOrRules: [
      'Radians to degrees: multiply by 180 / π',
      'Arc length: s = (θ / 360) · 2πr = r · θ (radians)',
      'Sector area: A = (θ / 360) · πr² = 1/2 r² θ (radians)'
    ],
    commonTraps: ['Using degree formulas when θ is given in radians without converting.'],
    desmosTip: 'Calculate ratios directly in Desmos.',
    bestResources: [
      {
        title: 'Khan Academy: Circles, Arcs & Sector Area',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:geometry-and-trigonometry/x0fcc98a58ba3bea7:circles/a/v2-sat-lesson-circles'
      }
    ]
  },
  {
    id: 'geo-trig-cofunction',
    title: 'Trigonometry: Complementary Angle Co-Function Identity',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'S',
    skill: 'Right triangles and trigonometry',
    description: 'Using the identity sin(x°) = cos(90° - x°) in right triangles and algebraic equations.',
    theorySummary: 'In any right triangle, the two acute angles sum to 90° (they are complementary). Therefore, the sine of one angle equals the cosine of the other: sin(A) = cos(B) when A + B = 90° or π/2.',
    formulasOrRules: [
      'sin(x) = cos(90° - x)',
      'cos(x) = sin(90° - x)',
      'If sin(A) = cos(B), then A + B = 90° (or π/2 in radians)'
    ],
    commonTraps: ['Not recognizing when sin(3x - 5) = cos(2x + 10) can simply be solved as (3x - 5) + (2x + 10) = 90.'],
    desmosTip: 'Set angle to Degree mode in Desmos wrench settings and graph y = sin(A) - cos(B).',
    bestResources: [
      {
        title: 'Digital SAT Formula Bible: Trigonometric Co-Function Identities',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=F3S6d34K57s'
      }
    ]
  },
  {
    id: 'geo-triangles-similar',
    title: 'Similar Triangles & Proportional Side Ratios',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'S',
    skill: 'Lines, angles, and triangles',
    description: 'Using angle-angle similarity to set up ratios between corresponding side lengths.',
    theorySummary: 'Similar triangles have equal angles and proportional corresponding sides: a1/a2 = b1/b2 = c1/c2. The ratio of their areas is the square of the ratio of their sides: Area1/Area2 = (side1/side2)²',
    formulasOrRules: [
      'Side ratio = k -> Perimeter ratio = k',
      'Side ratio = k -> Area ratio = k²'
    ],
    commonTraps: ['Matching non-corresponding sides when one triangle is rotated or reflected.'],
    desmosTip: 'Calculate proportions in Desmos.',
    bestResources: [
      {
        title: 'Khan Academy: Lines, Angles, and Similar Triangles',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:geometry-and-trigonometry/x0fcc98a58ba3bea7:lines-angles-and-triangles/a/v2-sat-lesson-lines-angles-and-triangles'
      }
    ]
  },

  // ==========================================
  // READING & WRITING: STANDARD ENGLISH CONVENTIONS (SEC)
  // ==========================================
  {
    id: 'rw-bound-comma-splices',
    title: 'Sentence Boundaries: Comma Splices & Run-Ons',
    section: 'reading_writing',
    domain: 'Standard English Conventions',
    domainCode: 'SEC',
    skill: 'Boundaries',
    description: 'Fixing run-on sentences and comma splices connecting two independent clauses.',
    theorySummary: 'A comma ALONE cannot join two independent clauses. To connect two complete sentences, you must use: (1) Period, (2) Semicolon, or (3) Comma + FANBOYS (for, and, nor, but, or, yet, so).',
    formulasOrRules: [
      'Independent + comma + Independent = COMMA SPLICE (Wrong!)',
      'Valid: Independent . Independent',
      'Valid: Independent ; Independent',
      'Valid: Independent , [FANBOYS] Independent',
      'Valid: Dependent , Independent'
    ],
    commonTraps: [
      'Using a comma before conjunctive adverbs like "however" or "therefore" without a semicolon (e.g., "Sentence, however, sentence" is a comma splice; it must be "Sentence; however, sentence").'
    ],
    bestResources: [
      {
        title: 'Official Khan Academy: Boundaries, Clauses & Commas',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:standard-english-conventions/x3722a27521096a56:boundaries/a/digital-sat-lesson-boundaries'
      },
      {
        title: 'Official Khan Academy: Boundaries Practice Guide',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:standard-english-conventions/x3722a27521096a56:boundaries/a/digital-sat-lesson-boundaries'
      }
    ]
  },
  {
    id: 'rw-bound-colons-dashes',
    title: 'Punctuation: Colons, Em-Dashes & Lists',
    section: 'reading_writing',
    domain: 'Standard English Conventions',
    domainCode: 'SEC',
    skill: 'Boundaries',
    description: 'Rules for using colons (:) and dashes (—) for explanations, definitions, and interruptions.',
    theorySummary: 'A COLON must be preceded by a COMPLETE INDEPENDENT CLAUSE. What follows can be an explanation, list, or single word. Em-dashes must come in pairs if setting off an interruption, or single if acting like a colon.',
    formulasOrRules: [
      'Colon rule: [Complete Independent Clause] : [Explanation, list, or amplification]',
      'Dash pair: [Main clause start] — non-essential element — [main clause end]'
    ],
    commonTraps: ['Putting a colon after verbs like "including:" or "such as:" (Never put a colon directly after a verb or preposition!).'],
    bestResources: [
      {
        title: 'Khan Academy Guide: Colons, Semicolons & Dashes',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:standard-english-conventions/x3722a27521096a56:boundaries/a/digital-sat-lesson-boundaries'
      }
    ]
  },
  {
    id: 'rw-form-modifiers',
    title: 'Modifiers: Misplaced and Dangling Modifiers',
    section: 'reading_writing',
    domain: 'Standard English Conventions',
    domainCode: 'SEC',
    skill: 'Form, Structure, and Sense',
    description: 'Ensuring introductory modifying phrases immediately precede the exact noun they describe.',
    theorySummary: 'When a sentence begins with a descriptive phrase (e.g. "Walking through the park, ..."), the noun immediately following the comma MUST be the person or thing doing the action!',
    formulasOrRules: [
      'Pattern: [Introductory Modifier], [Subject that performs the action] + [verb]...',
      'Check: Ask "Who is doing the action in the intro phrase?" That entity must be the first word after the comma.'
    ],
    commonTraps: ['Having an inanimate object or possessive noun directly follow the modifier (e.g., "Having finished the report, Maria\'s computer...").'],
    bestResources: [
      {
        title: 'Khan Academy: Modifiers, Form, Structure & Sense',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:standard-english-conventions/x3722a27521096a56:form-structure-and-sense/a/digital-sat-lesson-form-structure-and-sense'
      }
    ]
  },
  {
    id: 'rw-form-subject-verb',
    title: 'Subject-Verb Agreement with Intervening Prepositional Phrases',
    section: 'reading_writing',
    domain: 'Standard English Conventions',
    domainCode: 'SEC',
    skill: 'Form, Structure, and Sense',
    description: 'Identifying the true grammatical subject when separated from the main verb by long prepositional phrases or relative clauses.',
    theorySummary: 'Cross out prepositional phrases (starting with of, in, with, for, by, to) between the subject and verb. The verb must agree with the singular or plural status of the core subject noun.',
    formulasOrRules: [
      'Singular subject takes singular verb (ends in -s, e.g. "runs", "is", "has").',
      'Plural subject takes plural verb (no -s, e.g. "run", "are", "have").',
      'Ignore words between commas and prepositional phrases: "The collection [of rare antique books] IS valuable."'
    ],
    commonTraps: ['Matching the verb with the nearest noun inside a prepositional phrase rather than the actual subject.'],
    bestResources: [
      {
        title: 'Subject-Verb Agreement Tricks on SAT',
        type: 'article',
        provider: 'Erica Meltzer SAT',
        url: 'https://thecriticalreader.com'
      }
    ]
  },

  // ==========================================
  // READING & WRITING: EXPRESSION OF IDEAS (EOI)
  // ==========================================
  {
    id: 'rw-trans-contrast',
    title: 'Transitions: Contrast Connectors',
    section: 'reading_writing',
    domain: 'Expression of Ideas',
    domainCode: 'EOI',
    skill: 'Transitions',
    description: 'Selecting transition words that introduce an unexpected outcome, counterargument, or qualification.',
    theorySummary: 'Contrast words indicate that Idea B opposes, qualifies, or contradicts Idea A. Examples: However, Nevertheless, Nonetheless, In contrast, Conversely, Yet.',
    formulasOrRules: [
      'Step 1: Read Sentence 1 and summarize in 3 words.',
      'Step 2: Read Sentence 2 and summarize in 3 words.',
      'Step 3: Decide relationship: Continue (addition/cause) or Turn (contrast)?'
    ],
    commonTraps: ['Choosing a contrast transition when the second sentence merely adds a detail or example without disagreeing.'],
    bestResources: [
      {
        title: 'Official Khan Academy: Digital SAT Transitions',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:expression-of-ideas/x3722a27521096a56:transitions/a/digital-sat-lesson-transitions'
      }
    ]
  },
  {
    id: 'rw-trans-cause-effect',
    title: 'Transitions: Cause-and-Effect & Sequence',
    section: 'reading_writing',
    domain: 'Expression of Ideas',
    domainCode: 'EOI',
    skill: 'Transitions',
    description: 'Selecting transitions that signal logical consequence, conclusion, or chronological progression.',
    theorySummary: 'Cause-and-effect transitions signify that Sentence 2 is the logical consequence or result of Sentence 1. Examples: Therefore, Consequently, Thus, As a result, Accordingly.',
    formulasOrRules: [
      'Sentence 1: Reason / Cause $\rightarrow$ Transition $\rightarrow$ Sentence 2: Result / Consequence',
      'Test: Can you replace the transition with "Because of this"?'
    ],
    commonTraps: ['Confusing "Furthermore" (addition) with "Therefore" (causation).'],
    bestResources: [
      {
        title: 'Khan Academy: Transitions Cause-and-Effect Strategy',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:expression-of-ideas/x3722a27521096a56:transitions/a/digital-sat-lesson-transitions'
      }
    ]
  },
  {
    id: 'rw-rhetorical-synthesis',
    title: 'Rhetorical Synthesis: Goal-Oriented Bullet Points',
    section: 'reading_writing',
    domain: 'Expression of Ideas',
    domainCode: 'EOI',
    skill: 'Rhetorical Synthesis',
    description: 'Selecting the one sentence that directly fulfills the prompt\'s specific goal (e.g. emphasize similarity, contrast, or introduce an organism).',
    theorySummary: 'DO NOT read the bullet points first! Read the QUESTION STEM first to find the EXACT GOAL (e.g., "The student wants to emphasize a difference..."). Then find the ONLY answer choice that satisfies that specific goal with accurate facts.',
    formulasOrRules: [
      'Rule 1: Identify goal keyword in stem (e.g. "difference", "introduce", "explain technique").',
      'Rule 2: Eliminate choices that are factually true from the bullets but DO NOT satisfy the requested goal.'
    ],
    commonTraps: ['Reading all bullets and getting bogged down in detail instead of checking the prompt goal directly.'],
    bestResources: [
      {
        title: 'Khan Academy: Rhetorical Synthesis Strategy & Practice',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:expression-of-ideas/x3722a27521096a56:rhetorical-synthesis/a/digital-sat-lesson-rhetorical-synthesis'
      }
    ]
  },

  // ==========================================
  // READING & WRITING: CRAFT & STRUCTURE (CAS)
  // ==========================================
  {
    id: 'rw-vocab-secondary-meaning',
    title: 'Words in Context: Secondary Meanings & Academic Tone',
    section: 'reading_writing',
    domain: 'Craft and Structure',
    domainCode: 'CAS',
    skill: 'Words in Context',
    description: 'Selecting high-frequency vocabulary based on context clues rather than common everyday definitions.',
    theorySummary: 'The SAT tests secondary or tertiary meanings of familiar words (e.g., "plastic" = flexible/adaptable; "qualify" = limit/moderate; "compromise" = endanger). Cover the blank, predict a simple synonym from context clues, then match.',
    formulasOrRules: [
      'Cover the blank before looking at options.',
      'Underline context clues and tone markers in the sentence.',
      'Substitute your prediction into the sentence to verify coherence.'
    ],
    commonTraps: ['Picking the most common dictionary definition of a word instead of what fits the specific sentence context.'],
    bestResources: [
      {
        title: 'Khan Academy: Words in Context Lessons & Drills',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:craft-and-structure/x3722a27521096a56:words-in-context/a/digital-sat-lesson-words-in-context'
      }
    ]
  },
  {
    id: 'rw-struct-sentence-function',
    title: 'Text Structure: Function of an Underlined Sentence',
    section: 'reading_writing',
    domain: 'Craft and Structure',
    domainCode: 'CAS',
    skill: 'Text Structure and Purpose',
    description: 'Analyzing the specific role an underlined sentence plays in relation to the overall argument.',
    theorySummary: 'Identify what the sentence DOES, not just what it SAYS. Does it provide evidence? Introduce a concession? Pose a research question? Challenge a conventional hypothesis?',
    formulasOrRules: [
      'Ask: What is the author\'s move here? (Claim, Evidence, Counterclaim, or Conclusion?)',
      'Match with active verb choices: "corroborate", "refute", "introduce a limitation".'
    ],
    commonTraps: ['Choosing a response that describes what the sentence is about instead of its structural function.'],
    bestResources: [
      {
        title: 'Khan Academy: Text Structure and Purpose',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:craft-and-structure/x3722a27521096a56:text-structure-and-purpose/a/digital-sat-lesson-text-structure-and-purpose'
      }
    ]
  },

  // ==========================================
  // READING & WRITING: INFORMATION & IDEAS (INI)
  // ==========================================
  {
    id: 'rw-inferences-conclusion',
    title: 'Inferences: Logical Completion of Claims',
    section: 'reading_writing',
    domain: 'Information and Ideas',
    domainCode: 'INI',
    skill: 'Inferences',
    description: 'Completing the logical trajectory of a passage with the most defensible, least extreme conclusion.',
    theorySummary: 'The correct inference must be 100% directly supported by the text with ZERO outside speculation. Avoid extreme words like "always", "never", "only", or "proves entirely". Prefer cautious, moderate language like "suggests", "may indicate", "is likely".',
    formulasOrRules: [
      'Rule of thumb: The less extreme and more modest the claim, the more likely it is correct.',
      'The conclusion must bridge the premises directly stated in the text.'
    ],
    commonTraps: ['Picking tempting options that seem reasonable in real life but are NOT directly warranted by the passage.'],
    bestResources: [
      {
        title: 'Khan Academy: Inferences and Conclusions',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:information-and-ideas/x3722a27521096a56:inferences/a/digital-sat-lesson-inferences'
      }
    ]
  },
  {
    id: 'rw-evidence-quantitative',
    title: 'Command of Evidence: Quantitative Data & Charts',
    section: 'reading_writing',
    domain: 'Information and Ideas',
    domainCode: 'INI',
    skill: 'Command of Evidence',
    description: 'Selecting data points from a table, bar graph, or scatterplot that support or weaken a researcher\'s claim.',
    theorySummary: 'Two requirements: (1) The numbers in the answer choice must accurately match the graphic. (2) The statement must logically support the SPECIFIC hypothesis mentioned in the text.',
    formulasOrRules: [
      'Step 1: Verify the numbers in the options against the table or graph axes.',
      'Step 2: Verify whether the trend supports or refutes the exact claim stated in the prompt.'
    ],
    commonTraps: ['Selecting an answer choice that accurately describes the graph, but does NOT relate to the researcher\'s claim!'],
    bestResources: [
      {
        title: 'Khan Academy: Command of Evidence (Quantitative Graphs & Tables)',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:information-and-ideas/x3722a27521096a56:command-of-evidence/a/digital-sat-lesson-command-of-evidence'
      }
    ]
  },

  // ==========================================
  // GEOMETRY & TRIGONOMETRY (G)
  // ==========================================
  {
    id: 'math-geom-circle-theorems',
    title: 'Circle Equations, Tangent Lines & Completing the Square',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'G',
    skill: 'Circles',
    description: 'Finding center and radius by completing the square, and applying perpendicular tangent line properties.',
    theorySummary: 'Standard form: (x - h)² + (y - k)² = r² with center (h, k) and radius r. Tangent lines are perpendicular to the radius drawn to the point of tangency (m_tangent = -1 / m_radius).',
    formulasOrRules: [
      'Standard Form: (x - h)² + (y - k)² = r²',
      'Completing square: x² + bx + (b/2)² = (x + b/2)²',
      'Perpendicular slope: m₁ · m₂ = -1'
    ],
    commonTraps: [
      'Forgetting that the equation has r² on the right-hand side, so radius is √r².',
      'Sign errors in the center: (x + 3)² means h = -3, not +3.'
    ],
    desmosTip: 'Type the full expanded equation directly into Desmos (e.g. x^2 + y^2 - 6x + 8y = 0). Click the circle to see its center and extremes immediately!',
    bestResources: [
      {
        title: 'Khan Academy: Circle Equations on Digital SAT',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:geometry-and-trigonometry/x0fcc98a58ba3bea7:circle-equations/a/v2-sat-lesson-circle-equations'
      },
      {
        title: 'Scalar Learning: Digital SAT Circles & Desmos Tricks',
        type: 'video',
        provider: 'Scalar Learning',
        url: 'https://www.youtube.com/watch?v=UCJZ-cmg5rE',
        durationOrLength: '14 min'
      }
    ]
  },

  // ==========================================
  // ADVANCED MATH (PAM)
  // ==========================================
  {
    id: 'math-pam-exponential-models',
    title: 'Exponential Growth & Decay: Rate vs Factor',
    section: 'math',
    domain: 'Advanced Math',
    domainCode: 'PAM',
    skill: 'Exponential functions and equations',
    description: 'Distinguishing between percent growth rate and growth factor, interpreting real-world decay models, and handling fractional exponent time periods.',
    theorySummary: 'f(t) = a · b^(t/k) where a is initial value, b is growth/decay factor (b = 1 + r or 1 - r), and k is the number of time units required for one full compounding cycle.',
    formulasOrRules: [
      'Growth: b = 1 + r (e.g., 7% growth → b = 1.07)',
      'Decay: b = 1 - r (e.g., 12% decay → b = 0.88)',
      'Half-life: f(t) = a · (1/2)^(t/half_life)',
      'Compounding k times per period: exponent is t/k'
    ],
    commonTraps: [
      'Confusing rate r with factor b (e.g. interpreting 1.45 as 45% growth, not 145% growth).',
      'Forgetting that if t is in months and the model is annual, the exponent is t/12.'
    ],
    desmosTip: 'Plot the points or equation in Desmos. Use a slider for parameters a and b or use regression y1 ~ a * b^(x1).',
    bestResources: [
      {
        title: 'Khan Academy: Exponential Functions and Percent Change',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math/x0fcc98a58ba3bea7:exponential-functions/a/v2-sat-lesson-exponential-functions'
      }
    ]
  },

  // ==========================================
  // PROBLEM-SOLVING & DATA ANALYSIS (Q)
  // ==========================================
  {
    id: 'math-psda-margins-of-error',
    title: 'Margin of Error, Random Sampling & Inferences',
    section: 'math',
    domain: 'Problem Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'One-variable data: distributions and measures of center and spread',
    description: 'Evaluating survey methodology, recognizing why larger random samples decrease margin of error, and interpreting confidence intervals properly.',
    theorySummary: 'A random sample produces an estimate of the population parameter with margin of error. Margin of error decreases as sample size increases. Results can ONLY be generalized to the population from which the random sample was drawn.',
    formulasOrRules: [
      'Margin of error decreases when sample size n increases.',
      'Margin of error applies to the estimated population MEAN or PROPORTION, never to individual data values.',
      'Generalizability requires RANDOM SAMPLING from that specific population.'
    ],
    commonTraps: [
      'Claiming margin of error guarantees that individual values must fall within the range.',
      'Thinking a sample of 2,000 is invalid because the country has 300 million people (sample proportion matters far less than raw random sample size).'
    ],
    desmosTip: 'Calculate confidence intervals: [mean - margin_of_error, mean + margin_of_error].',
    bestResources: [
      {
        title: 'Khan Academy: Margin of Error on Digital SAT',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis/x0fcc98a58ba3bea7:sampling-and-margin-of-error/a/v2-sat-lesson-sampling-and-margin-of-error'
      }
    ]
  },

  // ==========================================
  // STANDARD ENGLISH CONVENTIONS (SEC)
  // ==========================================
  {
    id: 'rw-sec-boundaries-modifiers',
    title: 'Boundaries: Dangling Modifiers & Nonessential Relative Clauses',
    section: 'reading_writing',
    domain: 'Standard English Conventions',
    domainCode: 'SEC',
    skill: 'Boundaries',
    description: 'Ensuring participial modifiers are immediately followed by the intended logical agent, and punctuating parenthetical nonessential clauses correctly.',
    theorySummary: 'An introductory modifier (e.g. "Having completed the experiment, ...") MUST be followed immediately by the noun that actually performed the action. Nonessential information must have matching punctuation on both sides (comma-comma or dash-dash).',
    formulasOrRules: [
      'Introductory modifier rule: [Action phrase], [Logical Subject doing the action] + [Verb]...',
      'Nonessential clause: Subject, nonessential clause, verb...',
      'Essential clause (uses "that", no commas): The manuscript that won the award...'
    ],
    commonTraps: [
      'Allowing a passive subject or inanimate object to follow an active participial phrase (e.g. "Walking through the forest, the trees seemed tall").',
      'Using a comma before "that" in a restrictive defining clause.'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Modifiers and Sentence Structure',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:standard-english-conventions/x3722a27521096a56:modifier-placement/a/digital-sat-lesson-modifier-placement'
      }
    ]
  },

  // ==========================================
  // EXPRESSION OF IDEAS (EOI)
  // ==========================================
  {
    id: 'rw-eoi-transitions-contrast',
    title: 'Transitions: Cause vs Contrast vs Addition',
    section: 'reading_writing',
    domain: 'Expression of Ideas',
    domainCode: 'EOI',
    skill: 'Transitions',
    description: 'Selecting transitional words and phrases based on logical relationships between ideas (cause/effect, contrast/concession, addition/elaboration).',
    theorySummary: 'Always test transition questions by reading the two sentences WITHOUT the transition first to determine the organic logical relationship. Classify options into categories: Contrast (However, Nevertheless, Conversely), Cause/Effect (Consequently, Therefore, Thus), Addition (Furthermore, Moreover), Exemplification (For instance, Specifically).',
    formulasOrRules: [
      'Step 1: Read Sentence 1 and Sentence 2 without the transition word.',
      'Step 2: Ask: Does S2 continue the idea, contradict it, or explain the outcome?',
      'Step 3: Eliminate synonyms (e.g., if "Therefore" and "Consequently" are both choices, neither can be uniquely correct!).'
    ],
    commonTraps: [
      'Picking a transition based on how "smart" it sounds rather than the exact logical relationship between clauses.',
      'Overlooking subtle transitions like "Indeed" (intensifying/confirming) vs "In contrast" (opposing).'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Transitions on Digital SAT Reading and Writing',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:expression-of-ideas/x3722a27521096a56:transitions/a/digital-sat-lesson-transitions'
      }
    ]
  },

  // ==========================================
  // PROBLEM-SOLVING & DATA ANALYSIS (EXPANDED)
  // ==========================================
  {
    id: 'ps-ratio-proportions-units',
    title: 'Ratios, Rates, Proportions & Unit Conversions',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'Ratios, rates, proportional relationships, and units',
    description: 'Setting up direct and inverse proportions, converting complex compound units, and calculating rates of work or speed.',
    theorySummary: 'Unit conversions require dimensional analysis: multiply by conversion fractions where units cancel diagonally. For proportional scaling, cross-multiply: a/b = c/d.',
    formulasOrRules: [
      'Proportion Cross-Multiplication: a/b = c/d -> a * d = b * c',
      'Unit Conversion Factor: (Given Unit) * (Target Unit / Given Unit) = Target Unit',
      'Speed/Distance/Time: Distance = Rate * Time'
    ],
    commonTraps: [
      'Square or cubic unit conversions: converting square feet to square yards requires dividing by 3^2 = 9, NOT 3!',
      'Inverting the ratio when setting up proportions.'
    ],
    desmosTip: 'Enter equations as ratios directly into Desmos or use sliders for missing scale factors.',
    bestResources: [
      {
        title: 'Khan Academy: Ratios, Rates, and Proportions',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },
  {
    id: 'ps-percentages-multistep',
    title: 'Percentages: Percent Change, Tax, Discounts & Base Traps',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'Percentages',
    description: 'Solving multi-step percent change problems, consecutive discounts, markup/tax, and reverse percentage calculations.',
    theorySummary: 'Percent Change = (New - Original) / Original * 100%. To increase by p%, multiply by (1 + p/100). To decrease by p%, multiply by (1 - p/100). Never add successive percentages directly!',
    formulasOrRules: [
      'Percent Increase: Value * (1 + r)',
      'Percent Decrease: Value * (1 - r)',
      'Percent Change: |New - Old| / Old * 100%'
    ],
    commonTraps: [
      'Successive discounts: a 20% discount followed by a 10% discount is NOT a 30% discount (0.80 * 0.90 = 0.72 -> 28% total discount).',
      'Dividing by the new amount instead of the original baseline amount when calculating percent change.'
    ],
    desmosTip: 'Write equations as decimals in Desmos (e.g. 1.25 * x = 150) to solve instantaneously.',
    bestResources: [
      {
        title: 'Khan Academy: Percentages and Multi-Step Problems',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },
  {
    id: 'ps-stat-center-spread',
    title: 'Data Distributions: Mean, Median, Box Plots & Standard Deviation',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'One-variable data: Distributions and measures of center and spread',
    description: 'Analyzing how outliers affect mean vs median, comparing standard deviations across frequency distributions, and reading box plots.',
    theorySummary: 'The median is robust against extreme outliers; the mean is heavily skewed towards outliers. Standard deviation measures data dispersion around the mean; data that is more spread out has a higher standard deviation.',
    formulasOrRules: [
      'Mean = Sum of all values / Total count',
      'Median = Middle value of ordered set (average of middle two if even)',
      'High Dispersion = Higher Standard Deviation; Clustered = Lower Standard Deviation',
      'Box Plot: Minimum, Q1 (25th percentile), Median (50th), Q3 (75th), Maximum'
    ],
    commonTraps: [
      'Assuming adding a constant to all data values changes standard deviation (shifting shifts mean and median, but standard deviation remains UNCHANGED!).',
      'Multiplying data by a factor c multiplies standard deviation by |c|.'
    ],
    desmosTip: 'Use mean(data) and stdev(data) built-in Desmos functions on lists.',
    bestResources: [
      {
        title: 'Khan Academy: Center, Spread & Box Plots',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },
  {
    id: 'ps-scatterplots-models',
    title: 'Two-Variable Data: Scatterplots, Lines of Best Fit & Residuals',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'Two-variable data: Models and scatterplots',
    description: 'Interpreting linear and exponential trend lines, estimating predicted values, and calculating residuals (Actual - Predicted).',
    theorySummary: 'Line of best fit models trends: y = mx + b. Residual = Actual Observed Value - Predicted Model Value. Positive residual means data point is above line; negative residual means below line.',
    formulasOrRules: [
      'Residual = Observed y - Predicted y',
      'Slope m in scatterplot context: average predicted change in y per 1 unit change in x',
      'Outlier detection: point lying far away from the overall regression line'
    ],
    commonTraps: [
      'Confusing the slope of the line of best fit with individual data points.',
      'Misreading the axis scales (e.g. axes that do not start at 0).'
    ],
    desmosTip: 'Plot coordinates into a Desmos table and add linear regression y1 ~ mx1 + b.',
    bestResources: [
      {
        title: 'Khan Academy: Scatterplots and Line of Best Fit',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },
  {
    id: 'ps-probability-conditional',
    title: 'Probability & Two-Way Frequency Tables',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'Probability and conditional probability',
    description: 'Calculating simple and conditional probabilities from two-way tables, paying close attention to restricted sample spaces.',
    theorySummary: 'P(A given B) = Count of (A and B) / Total Count of B. Look for conditional keywords: "given that", "of the respondents who...", "among those who...". The denominator changes to the subgroup, NOT the grand total!',
    formulasOrRules: [
      'Simple Probability: P(E) = Favorable Outcomes / Total Outcomes',
      'Conditional Probability: P(A | B) = Favorable in condition group / Total in condition group'
    ],
    commonTraps: [
      'Using the grand total table denominator when a conditional subgroup is specified!',
      'Mixing up row totals vs column totals in two-way tables.'
    ],
    desmosTip: 'Calculate simple fractions directly in Desmos and press the fraction button to convert to simplified form.',
    bestResources: [
      {
        title: 'Khan Academy: Conditional Probability and Tables',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },
  {
    id: 'ps-evaluating-statistical-claims',
    title: 'Evaluating Statistical Claims: Studies, Experiments & Generalizability',
    section: 'math',
    domain: 'Problem-Solving and Data Analysis',
    domainCode: 'Q',
    skill: 'Evaluating statistical claims: Observational studies and experiments',
    description: 'Determining when conclusions can be generalized to a population (random selection) and when causation can be concluded (random assignment).',
    theorySummary: 'Random Selection allows results to be generalized to the broader target population. Random Assignment to treatment/control groups is REQUIRED to conclude cause and effect (causation). Observational studies only show correlation, NEVER causation.',
    formulasOrRules: [
      'Random Selection -> Generalize to population',
      'Random Assignment -> Establish Cause and Effect',
      'No Random Assignment -> Correlation only'
    ],
    commonTraps: [
      'Concluding cause-and-effect from an observational survey where participants chose their own habits.',
      'Generalizing sample findings beyond the specific population sampled (e.g. survey of college athletes generalized to all college students).'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Observational Studies vs Experiments',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:problem-solving-and-data-analysis'
      }
    ]
  },

  // ==========================================
  // GEOMETRY & TRIGONOMETRY (EXPANDED)
  // ==========================================
  {
    id: 'geo-area-volume-3d',
    title: 'Area of Polygons, Shaded Regions & 3D Volume',
    section: 'math',
    domain: 'Geometry and Trigonometry',
    domainCode: 'S',
    skill: 'Area and volume',
    description: 'Computing area of composite 2D figures, shaded regions, and volume/surface area of cylinders, prisms, pyramids, and spheres.',
    theorySummary: 'Composite figures: decompose complex shapes into rectangles, triangles, and semicircles. For shaded regions: Area_shaded = Area_total - Area_unshaded. Reference sheet formulas: Cylinder V = πr²h, Sphere V = 4/3 πr³, Cone V = 1/3 πr²h.',
    formulasOrRules: [
      'Triangle Area: A = 1/2 * b * h',
      'Circle Area: A = π * r²',
      'Cylinder Volume: V = π * r² * h',
      'Rectangular Prism Volume: V = l * w * h',
      'Sphere Volume: V = (4/3) * π * r³'
    ],
    commonTraps: [
      'Using diameter instead of radius in volume and area formulas.',
      'Forgetting that if linear dimensions are scaled by k, area scales by k² and volume scales by k³!'
    ],
    desmosTip: 'Use the reference sheet modal in the SAT Suite or enter formulas into Desmos with variable parameters.',
    bestResources: [
      {
        title: 'Khan Academy: Area and Volume on Digital SAT',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:geometry-and-trigonometry'
      }
    ]
  },

  // ==========================================
  // CRAFT AND STRUCTURE (EXPANDED)
  // ==========================================
  {
    id: 'rw-cross-text-connections',
    title: 'Cross-Text Connections: Comparing Multiple Texts & Author Arguments',
    section: 'reading_writing',
    domain: 'Craft and Structure',
    domainCode: 'CAS',
    skill: 'Cross-Text Connections',
    description: 'Synthesizing two short paired passages (Text 1 and Text 2) to evaluate points of agreement, disagreement, or how one author would respond to the other.',
    theorySummary: 'Identify Author 1 main claim and Author 2 main claim independently. Determine relationship: Does Text 2 support, qualify, or refute Text 1? When asked how Author 2 would respond to a specific statement in Text 1, locate the exact counterpart in Text 2.',
    formulasOrRules: [
      'Step 1: Summarize Text 1 claim in 3 words.',
      'Step 2: Summarize Text 2 claim in 3 words.',
      'Step 3: Define relationship (+, -, or nuance).',
      'Step 4: Check that the answer choice matches the viewpoint of the SPECIFIED author!'
    ],
    commonTraps: [
      'Choosing an answer that accurately summarizes Text 1 when the question asked for Text 2’s perspective!',
      'Selecting an overly extreme choice when the authors only partially disagree.'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Cross-Text Connections',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:craft-and-structure'
      }
    ]
  },

  // ==========================================
  // INFORMATION AND IDEAS (EXPANDED)
  // ==========================================
  {
    id: 'rw-central-ideas-details',
    title: 'Central Ideas and Details: Main Arguments & Purpose',
    section: 'reading_writing',
    domain: 'Information and Ideas',
    domainCode: 'INI',
    skill: 'Central Ideas and Details',
    description: 'Identifying the primary argument or overarching theme of a passage and locating explicit factual details that substantiate claims.',
    theorySummary: 'The central idea must encompass the ENTIRE text, not just a single compelling detail or introductory example. Eliminate choices that are too narrow (true, but only about one sentence) or too broad (exaggerates the scope).',
    formulasOrRules: [
      'Overarching Theme: Ask "What did the author write this whole passage to say?"',
      'Direct Detail: Must be explicitly stated or paraphrased in the text, zero assumptions.'
    ],
    commonTraps: [
      'Selecting an answer that is factually true according to the passage but only represents a supporting minor detail, not the central thesis.',
      'Extrapolating outside knowledge not found in the passage.'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Central Ideas and Details',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:information-and-ideas'
      }
    ]
  },
  {
    id: 'rw-evidence-textual',
    title: 'Command of Evidence: Textual Literature & Scientific Hypotheses',
    section: 'reading_writing',
    domain: 'Information and Ideas',
    domainCode: 'INI',
    skill: 'Command of Evidence',
    description: 'Selecting quotations or textual excerpts from poems, literature, or research descriptions that directly substantiate or undermine a stated claim.',
    theorySummary: 'First, highlight the exact hypothesis or claim that needs support. Then test each quotation: Does this quote provide concrete proof of THAT specific claim, or is it merely on the same general topic? Eliminate quotes that are irrelevant or support the opposite premise.',
    formulasOrRules: [
      'Step 1: Underline the claim: "Which quotation most effectively illustrates the claim that..."',
      'Step 2: Identify the critical keywords of the claim.',
      'Step 3: Match the quote that contains unambiguous textual proof.'
    ],
    commonTraps: [
      'Picking a beautiful or poignant literary quote that discusses a different theme than the specific hypothesis in the prompt.',
      'Failing to verify whether the quote supports vs undermines the hypothesis.'
    ],
    bestResources: [
      {
        title: 'Khan Academy: Command of Textual Evidence',
        type: 'article',
        provider: 'Khan Academy SAT',
        url: 'https://www.khanacademy.org/test-prep/digital-sat/x3722a27521096a56:information-and-ideas'
      }
    ]
  }
];

export const MICRO_TYPE_MAP = new Map<string, MicroTypeInfo>(
  MICRO_TYPES.map(mt => [mt.id, mt])
);

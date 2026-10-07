export interface FormulaItem {
  id: string;
  name: string;
  category: 'geometry' | 'algebra' | 'trigonometry' | 'grammar';
  latex: string;
  description: string;
  diagramSvg?: string;
}

export const SAT_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'f-circle-area',
    name: 'Area of a Circle',
    category: 'geometry',
    latex: 'A = \\pi r^2',
    description: 'where r is the radius of the circle.'
  },
  {
    id: 'f-circle-circ',
    name: 'Circumference of a Circle',
    category: 'geometry',
    latex: 'C = 2\\pi r = \\pi d',
    description: 'where r is the radius and d is the diameter.'
  },
  {
    id: 'f-rect-area',
    name: 'Area of a Rectangle',
    category: 'geometry',
    latex: 'A = \\ell w',
    description: 'where ℓ is length and w is width.'
  },
  {
    id: 'f-tri-area',
    name: 'Area of a Triangle',
    category: 'geometry',
    latex: 'A = \\frac{1}{2} b h',
    description: 'where b is the base and h is the perpendicular height.'
  },
  {
    id: 'f-pythagorean',
    name: 'Pythagorean Theorem',
    category: 'geometry',
    latex: 'a^2 + b^2 = c^2',
    description: 'In a right triangle where c is the hypotenuse.'
  },
  {
    id: 'f-special-30-60-90',
    name: 'Special Right Triangle: 30°-60°-90°',
    category: 'geometry',
    latex: 'x : x\\sqrt{3} : 2x',
    description: 'Side opposite 30° is x, opposite 60° is x√3, hypotenuse is 2x.'
  },
  {
    id: 'f-special-45-45-90',
    name: 'Special Right Triangle: 45°-45°-90°',
    category: 'geometry',
    latex: 's : s : s\\sqrt{2}',
    description: 'Legs are s and s; hypotenuse is s√2.'
  },
  {
    id: 'f-vol-rect-prism',
    name: 'Volume of a Rectangular Prism',
    category: 'geometry',
    latex: 'V = \\ell w h',
    description: 'where ℓ is length, w is width, and h is height.'
  },
  {
    id: 'f-vol-cylinder',
    name: 'Volume of a Right Cylinder',
    category: 'geometry',
    latex: 'V = \\pi r^2 h',
    description: 'where r is base radius and h is height.'
  },
  {
    id: 'f-vol-sphere',
    name: 'Volume of a Sphere',
    category: 'geometry',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: 'where r is the radius.'
  },
  {
    id: 'f-vol-cone',
    name: 'Volume of a Right Cone',
    category: 'geometry',
    latex: 'V = \\frac{1}{3}\\pi r^2 h',
    description: 'where r is base radius and h is height.'
  },
  {
    id: 'f-vol-pyramid',
    name: 'Volume of a Pyramid',
    category: 'geometry',
    latex: 'V = \\frac{1}{3} B h',
    description: 'where B is the area of the base and h is height.'
  },
  {
    id: 'f-circle-degrees-radians',
    name: 'Circle Angle Constants',
    category: 'geometry',
    latex: '360^\\circ = 2\\pi \\text{ radians}',
    description: 'The number of degrees of arc in a circle is 360; radians is 2π.'
  },
  {
    id: 'f-triangle-sum',
    name: 'Triangle Angle Sum',
    category: 'geometry',
    latex: '\\sum \\theta = 180^\\circ',
    description: 'The sum of the measures in degrees of the angles of a triangle is 180.'
  },
  {
    id: 'f-quad-formula',
    name: 'Quadratic Formula',
    category: 'algebra',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'For any quadratic ax² + bx + c = 0.'
  },
  {
    id: 'f-discriminant',
    name: 'Discriminant',
    category: 'algebra',
    latex: '\\Delta = b^2 - 4ac',
    description: '>0: 2 real roots, =0: 1 real root, <0: 0 real roots.'
  },
  {
    id: 'f-trig-sohcahtoa',
    name: 'SOH CAH TOA Definitions',
    category: 'trigonometry',
    latex: '\\sin = \\frac{\\text{opp}}{\\text{hyp}}, \\quad \\cos = \\frac{\\text{adj}}{\\text{hyp}}, \\quad \\tan = \\frac{\\text{opp}}{\\text{adj}}',
    description: 'Basic trigonometric ratios in a right triangle.'
  },
  {
    id: 'f-trig-cofunction',
    name: 'Co-Function Identity',
    category: 'trigonometry',
    latex: '\\sin(\\theta) = \\cos(90^\\circ - \\theta)',
    description: 'Sine of an angle equals cosine of its complement.'
  }
];

export const SAT_GRAMMAR_RULES = [
  {
    title: 'FANBOYS Conjunctions',
    rule: 'Use a comma before FANBOYS (for, and, nor, but, or, yet, so) ONLY when connecting two independent clauses.',
    example: 'She wanted to study physics, but her university did not offer the major.'
  },
  {
    title: 'Semicolon Rule',
    rule: 'A semicolon (;) must connect two complete, independent thoughts that could stand alone as separate sentences.',
    example: 'The expedition ran out of provisions; consequently, they returned to camp.'
  },
  {
    title: 'Colon Rule',
    rule: 'A colon (:) must be preceded by a complete independent clause. It introduces a list, explanation, or dramatic reveal.',
    example: 'Scientists discovered the ancient fossil\'s secret: it belonged to an entirely new genus.'
  },
  {
    title: 'Dangling Modifier Trap',
    rule: 'An introductory modifying phrase must be immediately followed by the exact noun that performs the action.',
    example: 'Walking down the crowded street, Marco noticed a lost puppy. (NOT: Walking down the street, the puppy was seen by Marco).'
  },
  {
    title: 'Subject-Verb Agreement',
    rule: 'Ignore prepositional phrases between the subject and verb. The verb agrees only with the primary head noun.',
    example: 'The discovery of several ancient coins was (not were) announced yesterday.'
  }
];

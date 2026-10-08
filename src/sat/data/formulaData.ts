import type { ShapeVisualizationType } from '../components/FormulaShapeDiagram';

export interface FormulaPracticeQuestion {
  stem: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  tip?: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  category: 'geometry' | 'coordinate_geometry' | 'algebra' | 'trigonometry' | 'statistics';
  subcategory?: string;
  latex: string;
  description: string;
  keyTakeaway?: string;
  officialReference?: boolean;
  visualizationType?: ShapeVisualizationType;
  diagramLabels?: { symbol: string; label: string }[];
  practiceQuestions: FormulaPracticeQuestion[];
  practiceQuestion: FormulaPracticeQuestion;
}

export const SAT_FORMULA_SHEET: FormulaItem[] = [
  // ─── SECTION 1: OFFICIAL COLLEGE BOARD REFERENCE FORMULAS ───
  {
    id: 'f-circle-area',
    name: 'Area of a Circle',
    category: 'geometry',
    subcategory: 'Circles',
    latex: 'A = \\pi r^2',
    description: 'Calculates total internal 2D surface area, where r is the radius (half the diameter).',
    keyTakeaway: 'If the question gives diameter d, divide by 2 first: r = d / 2.',
    officialReference: true,
    visualizationType: 'circle-area',
    diagramLabels: [
      { symbol: 'r', label: 'Radius (distance from center to edge)' },
      { symbol: 'A', label: 'Shaded 2D interior area' }
    ],
    practiceQuestions: [
      {
        stem: 'A circle has a diameter of 16 centimeters. What is the area of the circle, in square centimeters?',
        options: [
          { label: 'A', text: '16π' },
          { label: 'B', text: '32π' },
          { label: 'C', text: '64π' },
          { label: 'D', text: '256π' }
        ],
        correctAnswer: 'C',
        explanation: 'First, find the radius: r = diameter / 2 = 16 / 2 = 8 cm. Next, substitute r = 8 into the area formula: A = π(8)² = 64π cm².',
        tip: 'Common Trap: Do not square the diameter directly (16² = 256π is the most frequent wrong answer chosen by unprepared students).'
      },
      {
        stem: 'The area of a circle is 144π square inches. What is the circumference of this circle, in inches?',
        options: [
          { label: 'A', text: '12π' },
          { label: 'B', text: '24π' },
          { label: 'C', text: '36π' },
          { label: 'D', text: '72π' }
        ],
        correctAnswer: 'B',
        explanation: 'Set πr² = 144π ⟹ r² = 144 ⟹ r = 12. Substitute into C = 2πr = 2π(12) = 24π inches.',
        tip: 'Whenever area is given with π, divide out π immediately to solve for radius r.'
      },
      {
        stem: 'If the radius of circle A is 3 times the radius of circle B, what is the ratio of the area of circle A to the area of circle B?',
        options: [
          { label: 'A', text: '3 to 1' },
          { label: 'B', text: '6 to 1' },
          { label: 'C', text: '9 to 1' },
          { label: 'D', text: '27 to 1' }
        ],
        correctAnswer: 'C',
        explanation: 'Area scales with the square of linear dimensions: Area ratio = (r_A / r_B)² = (3 / 1)² = 9 / 1.',
        tip: 'Linear ratio k ⟹ Area ratio k² ⟹ Volume ratio k³.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-circle-circ',
    name: 'Circumference of a Circle',
    category: 'geometry',
    subcategory: 'Circles',
    latex: 'C = 2\\pi r = \\pi d',
    description: 'The perimeter or total linear distance around the outer boundary of a circle.',
    keyTakeaway: 'One full revolution of a wheel or circular gear equals its circumference C = 2πr.',
    officialReference: true,
    visualizationType: 'circle-circ',
    diagramLabels: [
      { symbol: 'd', label: 'Diameter (distance across through center)' },
      { symbol: 'C', label: 'Outer perimeter boundary' }
    ],
    practiceQuestions: [
      {
        stem: 'A circular running track has a circumference of 400π meters. What is the radius of the track, in meters?',
        options: [
          { label: 'A', text: '100' },
          { label: 'B', text: '200' },
          { label: 'C', text: '400' },
          { label: 'D', text: '800' }
        ],
        correctAnswer: 'B',
        explanation: 'Use C = 2πr. Set 400π = 2πr. Dividing both sides by 2π yields r = 400π / 2π = 200 meters.',
        tip: 'SAT Shortcut: Cancel π on both sides immediately before computing.'
      },
      {
        stem: 'A bicycle wheel has a diameter of 28 inches. If the wheel completes 25 full revolutions along a flat sidewalk, what total distance in inches has the bicycle traveled?',
        options: [
          { label: 'A', text: '350π' },
          { label: 'B', text: '700π' },
          { label: 'C', text: '1400π' },
          { label: 'D', text: '4900π' }
        ],
        correctAnswer: 'B',
        explanation: 'Circumference for 1 revolution is C = πd = 28π inches. Total distance = 25 × 28π = 700π inches.',
        tip: 'Total distance = (Number of revolutions) × (Circumference).'
      },
      {
        stem: 'The circumference of circle X is 4 times the circumference of circle Y. What is the ratio of the radius of circle X to the radius of circle Y?',
        options: [
          { label: 'A', text: '2 to 1' },
          { label: 'B', text: '4 to 1' },
          { label: 'C', text: '8 to 1' },
          { label: 'D', text: '16 to 1' }
        ],
        correctAnswer: 'B',
        explanation: 'Circumference C = 2πr is directly proportional to radius r. If C_X / C_Y = 4, then r_X / r_Y = 4 to 1.',
        tip: 'Radius and circumference share the identical linear scale factor.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-rect-area',
    name: 'Area of a Rectangle',
    category: 'geometry',
    subcategory: 'Polygons',
    latex: 'A = \\ell w',
    description: 'Calculates the area of any four-sided shape with 90° interior angles, where ℓ is length and w is width.',
    keyTakeaway: 'For squares, ℓ = w, giving A = s².',
    officialReference: true,
    visualizationType: 'rectangle-area',
    diagramLabels: [
      { symbol: 'ℓ', label: 'Length along horizontal base' },
      { symbol: 'w', label: 'Width along vertical side' }
    ],
    practiceQuestions: [
      {
        stem: 'A rectangular garden has a perimeter of 48 meters. The length of the garden is 15 meters and the width is 9 meters. What is the area of the garden in square meters?',
        options: [
          { label: 'A', text: '96' },
          { label: 'B', text: '110' },
          { label: 'C', text: '116' },
          { label: 'D', text: '135' }
        ],
        correctAnswer: 'D',
        explanation: 'Apply A = ℓ · w = 15 · 9 = 135 square meters.',
        tip: 'On the SAT, verify that 2(ℓ + w) = 2(15 + 9) = 48 meters matches the given perimeter.'
      },
      {
        stem: 'A rectangular patio has an area of 180 square feet. If its length is 3 feet greater than its width, what is the width of the patio in feet?',
        options: [
          { label: 'A', text: '12' },
          { label: 'B', text: '15' },
          { label: 'C', text: '18' },
          { label: 'D', text: '20' }
        ],
        correctAnswer: 'A',
        explanation: 'Let width = w. Then length = w + 3. w(w + 3) = 180 ⟹ w² + 3w - 180 = 0 ⟹ (w - 12)(w + 15) = 0. Since width must be positive, w = 12.',
        tip: 'Test the options directly: 12 × (12 + 3) = 12 × 15 = 180.'
      },
      {
        stem: 'The length of a rectangle is increased by 20% and its width is decreased by 10%. What is the percent change in the area of the rectangle?',
        options: [
          { label: 'A', text: 'Decreased by 2%' },
          { label: 'B', text: 'Increased by 8%' },
          { label: 'C', text: 'Increased by 10%' },
          { label: 'D', text: 'Increased by 12%' }
        ],
        correctAnswer: 'B',
        explanation: 'New Area = (1.20ℓ)(0.90w) = 1.08(ℓw) = 1.08 A_original. That represents an 8% increase.',
        tip: 'Multiply the multipliers: 1.20 × 0.90 = 1.08.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-tri-area',
    name: 'Area of a Triangle',
    category: 'geometry',
    subcategory: 'Triangles',
    latex: 'A = \\frac{1}{2} b h',
    description: 'Calculates the area of any triangle using base b and perpendicular altitude height h.',
    keyTakeaway: 'Height h must always be perpendicular (90°) to base b, not the slant side.',
    officialReference: true,
    visualizationType: 'triangle-area',
    diagramLabels: [
      { symbol: 'b', label: 'Base line segment' },
      { symbol: 'h', label: 'Perpendicular altitude height' }
    ],
    practiceQuestions: [
      {
        stem: 'In triangle ABC, the length of base AC is 14. If the perpendicular altitude from vertex B to line AC has a length of 9, what is the area of triangle ABC?',
        options: [
          { label: 'A', text: '42' },
          { label: 'B', text: '63' },
          { label: 'C', text: '126' },
          { label: 'D', text: '252' }
        ],
        correctAnswer: 'B',
        explanation: 'Apply A = ½ · b · h with b = 14 and h = 9: A = ½ · (14) · (9) = 7 · 9 = 63.',
        tip: 'Do not forget the factor of 1/2. 14 × 9 = 126 is the area of a rectangle, not a triangle!'
      },
      {
        stem: 'A right triangle has legs of lengths 12 and 16. What is the area of this right triangle?',
        options: [
          { label: 'A', text: '48' },
          { label: 'B', text: '96' },
          { label: 'C', text: '192' },
          { label: 'D', text: '240' }
        ],
        correctAnswer: 'B',
        explanation: 'In a right triangle, the two perpendicular legs act as base and height: A = ½(12)(16) = 6 × 16 = 96.',
        tip: 'The hypotenuse is not used when calculating right triangle area using its legs.'
      },
      {
        stem: 'The area of an equilateral triangle is 36√3 square units. What is the side length of this triangle?',
        options: [
          { label: 'A', text: '6' },
          { label: 'B', text: '12' },
          { label: 'C', text: '18' },
          { label: 'D', text: '24' }
        ],
        correctAnswer: 'B',
        explanation: 'Equilateral triangle area formula: A = (s²√3)/4. Set (s²√3)/4 = 36√3 ⟹ s²/4 = 36 ⟹ s² = 144 ⟹ s = 12.',
        tip: 'Memorize A = (s²√3)/4 for fast equilateral triangle questions.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-pythagorean',
    name: 'Pythagorean Theorem',
    category: 'geometry',
    subcategory: 'Right Triangles',
    latex: 'a^2 + b^2 = c^2',
    description: 'Fundamental relationship among the three sides of a right triangle where c is the hypotenuse.',
    keyTakeaway: 'Memorize high-frequency SAT Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples.',
    officialReference: true,
    visualizationType: 'pythagorean',
    diagramLabels: [
      { symbol: 'a, b', label: 'Legs perpendicular to each other' },
      { symbol: 'c', label: 'Hypotenuse (longest side opposite 90°)' }
    ],
    practiceQuestions: [
      {
        stem: 'A right triangle has a hypotenuse of length 26 and one leg of length 10. What is the length of the other leg?',
        options: [
          { label: 'A', text: '16' },
          { label: 'B', text: '20' },
          { label: 'C', text: '24' },
          { label: 'D', text: '28' }
        ],
        correctAnswer: 'C',
        explanation: 'Use a² + b² = c²: 10² + b² = 26² ⟹ 100 + b² = 676 ⟹ b² = 576 ⟹ b = √576 = 24. Alternatively, recognize this as a scaled 5-12-13 triple multiplied by 2: (5×2, 12×2, 13×2) = (10, 24, 26).',
        tip: 'Spotting scaled triples (like 2 × 5-12-13) saves over 30 seconds on test day.'
      },
      {
        stem: 'A 17-foot ladder is leaning against a vertical wall. If the base of the ladder is placed 8 feet away from the wall, how many feet up the wall does the top of the ladder reach?',
        options: [
          { label: 'A', text: '12' },
          { label: 'B', text: '14' },
          { label: 'C', text: '15' },
          { label: 'D', text: '16' }
        ],
        correctAnswer: 'C',
        explanation: 'Ladder is hypotenuse c = 17, ground distance a = 8. 8² + h² = 17² ⟹ 64 + h² = 289 ⟹ h² = 225 ⟹ h = 15. Recognizable 8-15-17 triple.',
        tip: '8-15-17 is an authentic College Board favorite triple.'
      },
      {
        stem: 'In right triangle XYZ with right angle at Y, XY = 7 and YZ = 24. What is the length of hypotenuse XZ?',
        options: [
          { label: 'A', text: '25' },
          { label: 'B', text: '26' },
          { label: 'C', text: '27' },
          { label: 'D', text: '31' }
        ],
        correctAnswer: 'A',
        explanation: '7² + 24² = 49 + 576 = 625 = 25². This is the 7-24-25 Pythagorean triple.',
        tip: 'Commit 7-24-25 to memory alongside 3-4-5 and 5-12-13.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-special-30-60-90',
    name: 'Special Right Triangle: 30°-60°-90°',
    category: 'geometry',
    subcategory: 'Special Triangles',
    latex: 'x : x\\sqrt{3} : 2x',
    description: 'Fixed side ratio where the side opposite 30° is x, opposite 60° is x√3, and the hypotenuse is 2x.',
    keyTakeaway: 'Always find the short leg x first! All other sides scale directly from x.',
    officialReference: true,
    visualizationType: 'triangle-30-60-90',
    diagramLabels: [
      { symbol: 'x', label: 'Short leg (opposite 30°)' },
      { symbol: 'x√3', label: 'Long leg (opposite 60°)' },
      { symbol: '2x', label: 'Hypotenuse (opposite 90°)' }
    ],
    practiceQuestions: [
      {
        stem: 'In a 30°-60°-90° triangle, the hypotenuse has length 18. What is the length of the side opposite the 60° angle?',
        options: [
          { label: 'A', text: '9' },
          { label: 'B', text: '9√2' },
          { label: 'C', text: '9√3' },
          { label: 'D', text: '18√3' }
        ],
        correctAnswer: 'C',
        explanation: 'In a 30°-60°-90° triangle, Hypotenuse = 2x = 18 ⟹ Short leg x = 9. The side opposite 60° is the long leg: x√3 = 9√3.',
        tip: 'Step 1: Divide hypotenuse by 2 to get short leg x. Step 2: Multiply short leg by √3 for long leg.'
      },
      {
        stem: 'In a 30°-60°-90° triangle, the side opposite the 30° angle has length 7. What is the length of the hypotenuse?',
        options: [
          { label: 'A', text: '7√2' },
          { label: 'B', text: '7√3' },
          { label: 'C', text: '14' },
          { label: 'D', text: '14√3' }
        ],
        correctAnswer: 'C',
        explanation: 'The short leg is opposite 30°, so x = 7. The hypotenuse is 2x = 2(7) = 14.',
        tip: 'Hypotenuse is always exactly twice the shortest leg.'
      },
      {
        stem: 'An equilateral triangle has a side length of 10. An altitude is drawn from one vertex to the opposite side. What is the length of this altitude?',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '5√2' },
          { label: 'C', text: '5√3' },
          { label: 'D', text: '10√3' }
        ],
        correctAnswer: 'C',
        explanation: 'The altitude cuts the equilateral triangle into two congruent 30°-60°-90° triangles with hypotenuse 10 and short base 5. The altitude is the side opposite 60°: 5√3.',
        tip: 'Altitude of equilateral triangle with side s is always (s/2)√3.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-special-45-45-90',
    name: 'Special Right Triangle: 45°-45°-90°',
    category: 'geometry',
    subcategory: 'Special Triangles',
    latex: 's : s : s\\sqrt{2}',
    description: 'An isosceles right triangle where both legs have equal length s, and the hypotenuse is s√2.',
    keyTakeaway: 'A diagonal cutting across any square forms two identical 45°-45°-90° triangles.',
    officialReference: true,
    visualizationType: 'triangle-45-45-90',
    diagramLabels: [
      { symbol: 's', label: 'Equal legs (opposite 45° angles)' },
      { symbol: 's√2', label: 'Hypotenuse (square diagonal)' }
    ],
    practiceQuestions: [
      {
        stem: 'A square has a diagonal of length 14√2 inches. What is the perimeter of the square, in inches?',
        options: [
          { label: 'A', text: '28' },
          { label: 'B', text: '56' },
          { label: 'C', text: '98' },
          { label: 'D', text: '196' }
        ],
        correctAnswer: 'B',
        explanation: 'The diagonal of a square of side s is s√2. Since diagonal = 14√2, the side length is s = 14. Perimeter = 4s = 4(14) = 56 inches.',
        tip: 'Whenever the SAT mentions the diagonal of a square, instantly apply the 45°-45°-90° ratio s : s : s√2.'
      },
      {
        stem: 'An isosceles right triangle has legs of length 8 inches each. What is the length of its hypotenuse?',
        options: [
          { label: 'A', text: '8√2' },
          { label: 'B', text: '8√3' },
          { label: 'C', text: '16' },
          { label: 'D', text: '16√2' }
        ],
        correctAnswer: 'A',
        explanation: 'Legs are equal: s = 8. Hypotenuse = s√2 = 8√2 inches.',
        tip: 'In a 45°-45°-90° triangle, Hypotenuse = Leg × √2.'
      },
      {
        stem: 'If the hypotenuse of a 45°-45°-90° triangle is 10, what is the length of each leg?',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '5√2' },
          { label: 'C', text: '10√2' },
          { label: 'D', text: '20' }
        ],
        correctAnswer: 'B',
        explanation: 's√2 = 10 ⟹ s = 10 / √2 = (10√2) / 2 = 5√2.',
        tip: 'Dividing an integer by √2: divide by 2 and multiply by √2 (10/2 = 5 ⟹ 5√2).'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vol-rect-prism',
    name: 'Volume of a Rectangular Prism',
    category: 'geometry',
    subcategory: '3D Solids',
    latex: 'V = \\ell w h',
    description: 'Calculates the volume of a 3D box, where ℓ is length, w is width, and h is height.',
    keyTakeaway: 'Surface area of this prism is SA = 2(ℓw + ℓh + wh).',
    officialReference: true,
    visualizationType: 'rect-prism',
    diagramLabels: [
      { symbol: 'ℓ, w, h', label: 'Length, width, and height dimensions' },
      { symbol: 'V', label: 'Total 3D internal capacity' }
    ],
    practiceQuestions: [
      {
        stem: 'A rectangular container has a length of 12 cm, a width of 5 cm, and a height of 8 cm. What is the volume of the container in cubic centimeters?',
        options: [
          { label: 'A', text: '240' },
          { label: 'B', text: '480' },
          { label: 'C', text: '520' },
          { label: 'D', text: '960' }
        ],
        correctAnswer: 'B',
        explanation: 'V = ℓ · w · h = 12 · 5 · 8 = 60 · 8 = 480 cm³.',
        tip: 'Multiply dimensions sequentially: 12 × 5 = 60, then 60 × 8 = 480.'
      },
      {
        stem: 'A rectangular box has a square base with side length 6 cm. If the volume of the box is 288 cm³, what is its height in centimeters?',
        options: [
          { label: 'A', text: '6' },
          { label: 'B', text: '8' },
          { label: 'C', text: '12' },
          { label: 'D', text: '16' }
        ],
        correctAnswer: 'B',
        explanation: 'Base area = 6 × 6 = 36. V = Base × h ⟹ 36 · h = 288 ⟹ h = 288 / 36 = 8 cm.',
        tip: 'Square base means ℓ = w.'
      },
      {
        stem: 'If the length, width, and height of a rectangular prism are all doubled, by what factor is the volume multiplied?',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '4' },
          { label: 'C', text: '6' },
          { label: 'D', text: '8' }
        ],
        correctAnswer: 'D',
        explanation: 'New Volume = (2ℓ)(2w)(2h) = 8(ℓwh) = 8 V_original.',
        tip: 'Scaling all 3 dimensions by k scales volume by k³: 2³ = 8.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vol-cylinder',
    name: 'Volume of a Right Cylinder',
    category: 'geometry',
    subcategory: '3D Solids',
    latex: 'V = \\pi r^2 h',
    description: 'Calculates volume of a cylinder with base radius r and vertical height h.',
    keyTakeaway: 'The base is a circle (Area = πr²), so volume is simply Base Area × Height.',
    officialReference: true,
    visualizationType: 'cylinder',
    diagramLabels: [
      { symbol: 'r', label: 'Base circle radius' },
      { symbol: 'h', label: 'Vertical height perpendicular to base' }
    ],
    practiceQuestions: [
      {
        stem: 'A cylindrical water tank has a radius of 4 meters and a height of 10 meters. What is the volume of the tank in cubic meters?',
        options: [
          { label: 'A', text: '40π' },
          { label: 'B', text: '80π' },
          { label: 'C', text: '160π' },
          { label: 'D', text: '320π' }
        ],
        correctAnswer: 'C',
        explanation: 'Substitute r = 4 and h = 10 into V = πr²h: V = π(4)²(10) = π(16)(10) = 160π m³.',
        tip: 'Remember to square the radius before multiplying by the height: 4² = 16, then 16 × 10 = 160.'
      },
      {
        stem: 'A cylinder has a volume of 500π cubic centimeters and a height of 20 centimeters. What is the radius of the base, in centimeters?',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '10' },
          { label: 'C', text: '25' },
          { label: 'D', text: '50' }
        ],
        correctAnswer: 'A',
        explanation: 'Set πr²(20) = 500π ⟹ 20r² = 500 ⟹ r² = 25 ⟹ r = 5 cm.',
        tip: 'Cancel π on both sides first.'
      },
      {
        stem: 'Cylinder A has radius r and height h. Cylinder B has radius 2r and height h/2. What is the ratio of the volume of Cylinder B to the volume of Cylinder A?',
        options: [
          { label: 'A', text: '1 to 2' },
          { label: 'B', text: '1 to 1' },
          { label: 'C', text: '2 to 1' },
          { label: 'D', text: '4 to 1' }
        ],
        correctAnswer: 'C',
        explanation: 'V_B = π(2r)²(h/2) = π(4r²)(h/2) = 2πr²h = 2 V_A. Ratio is 2 to 1.',
        tip: 'Squaring the radius quadruples the base area; halving the height halves the volume. 4 × ½ = 2.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vol-sphere',
    name: 'Volume of a Sphere',
    category: 'geometry',
    subcategory: '3D Solids',
    latex: 'V = \\frac{4}{3} \\pi r^3',
    description: 'Volume of a perfectly symmetrical 3D ball, where r is the radius from center to surface.',
    keyTakeaway: 'Notice r is cubed (r³). Dividing or multiplying radius drastically alters volume.',
    officialReference: true,
    visualizationType: 'sphere',
    diagramLabels: [
      { symbol: 'r', label: 'Radius from spherical center' },
      { symbol: 'V', label: 'Total 3D volume enclosed' }
    ],
    practiceQuestions: [
      {
        stem: 'A solid spherical ball has a radius of 3 inches. What is the volume of the ball in cubic inches?',
        options: [
          { label: 'A', text: '12π' },
          { label: 'B', text: '36π' },
          { label: 'C', text: '72π' },
          { label: 'D', text: '108π' }
        ],
        correctAnswer: 'B',
        explanation: 'Apply V = (4/3)πr³ with r = 3: V = (4/3)π(3³) = (4/3)π(27) = 4 · 9 · π = 36π in³.',
        tip: 'Cancel 27 with the denominator 3 first: 27 / 3 = 9, then 9 × 4 = 36.'
      },
      {
        stem: 'The volume of a sphere is 288π cubic centimeters. What is the radius of the sphere in centimeters?',
        options: [
          { label: 'A', text: '4' },
          { label: 'B', text: '6' },
          { label: 'C', text: '8' },
          { label: 'D', text: '12' }
        ],
        correctAnswer: 'B',
        explanation: '(4/3)πr³ = 288π ⟹ (4/3)r³ = 288 ⟹ r³ = 288 × (3/4) = 216 ⟹ r = ∛216 = 6 cm.',
        tip: 'Multiply by reciprocal (3/4) to isolate r³.'
      },
      {
        stem: 'If the radius of sphere P is 2 times the radius of sphere Q, what is the ratio of the volume of sphere P to the volume of sphere Q?',
        options: [
          { label: 'A', text: '2 to 1' },
          { label: 'B', text: '4 to 1' },
          { label: 'C', text: '6 to 1' },
          { label: 'D', text: '8 to 1' }
        ],
        correctAnswer: 'D',
        explanation: 'Volume of a sphere scales with r³: (2 / 1)³ = 8 / 1.',
        tip: 'Volume scaling factor is always k³.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vol-cone',
    name: 'Volume of a Right Circular Cone',
    category: 'geometry',
    subcategory: '3D Solids',
    latex: 'V = \\frac{1}{3} \\pi r^2 h',
    description: 'Volume of a cone with circular base of radius r and vertical altitude h.',
    keyTakeaway: 'The volume of a cone is exactly 1/3 the volume of a cylinder with the same radius and height.',
    officialReference: true,
    visualizationType: 'cone',
    diagramLabels: [
      { symbol: 'r', label: 'Base radius' },
      { symbol: 'h', label: 'Vertical height from vertex to base center' }
    ],
    practiceQuestions: [
      {
        stem: 'A right cone has a base radius of 6 cm and a height of 9 cm. What is the volume of the cone in cubic centimeters?',
        options: [
          { label: 'A', text: '54π' },
          { label: 'B', text: '108π' },
          { label: 'C', text: '216π' },
          { label: 'D', text: '324π' }
        ],
        correctAnswer: 'B',
        explanation: 'V = (1/3)πr²h = (1/3)π(6²)(9) = (1/3)π(36)(9) = 36 · 3 · π = 108π cm³.',
        tip: 'Simplify (1/3) × 9 = 3 first, then 3 × 36 = 108.'
      },
      {
        stem: 'A right circular cone has a base circumference of 12π and a height of 10. What is the volume of the cone?',
        options: [
          { label: 'A', text: '40π' },
          { label: 'B', text: '120π' },
          { label: 'C', text: '240π' },
          { label: 'D', text: '360π' }
        ],
        correctAnswer: 'B',
        explanation: 'Circumference = 2πr = 12π ⟹ r = 6. Then V = (1/3)π(6²)(10) = (1/3)π(36)(10) = 12 · 10 · π = 120π.',
        tip: 'Convert circumference to radius before plugging into volume formula.'
      },
      {
        stem: 'A cone and a cylinder have identical radius and height. What fraction of the cylinder’s volume is the cone’s volume?',
        options: [
          { label: 'A', text: '1/4' },
          { label: 'B', text: '1/3' },
          { label: 'C', text: '1/2' },
          { label: 'D', text: '2/3' }
        ],
        correctAnswer: 'B',
        explanation: 'V_cone = (1/3)πr²h and V_cylinder = πr²h. Thus V_cone / V_cylinder = 1/3.',
        tip: 'The 1/3 factor directly relates cones to cylinders.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vol-pyramid',
    name: 'Volume of a Pyramid',
    category: 'geometry',
    subcategory: '3D Solids',
    latex: 'V = \\frac{1}{3} B h',
    description: 'Volume of any pyramid where B is the area of the base and h is perpendicular height.',
    keyTakeaway: 'B stands for Base AREA, not base length! For a square base, B = s².',
    officialReference: true,
    visualizationType: 'pyramid',
    diagramLabels: [
      { symbol: 'B', label: 'Area of polygonal base' },
      { symbol: 'h', label: 'Perpendicular height from apex to base' }
    ],
    practiceQuestions: [
      {
        stem: 'A pyramid has a square base with an area of 100 square meters and a height of 12 meters. What is the volume of the pyramid in cubic meters?',
        options: [
          { label: 'A', text: '300' },
          { label: 'B', text: '400' },
          { label: 'C', text: '600' },
          { label: 'D', text: '1200' }
        ],
        correctAnswer: 'B',
        explanation: 'Use V = (1/3)Bh: V = (1/3) · (100) · (12) = 100 · 4 = 400 m³.',
        tip: 'Multiply (1/3) by 12 first to get 4, then 4 × 100 = 400.'
      },
      {
        stem: 'A pyramid has a square base with side length 6 meters and a volume of 72 cubic meters. What is the vertical height of the pyramid, in meters?',
        options: [
          { label: 'A', text: '4' },
          { label: 'B', text: '6' },
          { label: 'C', text: '8' },
          { label: 'D', text: '12' }
        ],
        correctAnswer: 'B',
        explanation: 'Base area B = 6² = 36. V = (1/3)Bh ⟹ 72 = (1/3)(36)h = 12h ⟹ h = 72 / 12 = 6 meters.',
        tip: 'Always compute base area B = s² first.'
      },
      {
        stem: 'A rectangular pyramid has a base with length 8 and width 5, and a height of 9. What is its volume?',
        options: [
          { label: 'A', text: '120' },
          { label: 'B', text: '180' },
          { label: 'C', text: '240' },
          { label: 'D', text: '360' }
        ],
        correctAnswer: 'A',
        explanation: 'Base Area B = 8 × 5 = 40. V = (1/3)(40)(9) = 40 × 3 = 120.',
        tip: 'B = ℓ · w for rectangular base.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-circle-degrees-radians',
    name: 'Circle Degrees and Radians Conversion',
    category: 'geometry',
    subcategory: 'Circles',
    latex: '360^\\circ = 2\\pi \\text{ rad} \\iff 180^\\circ = \\pi \\text{ rad}',
    description: 'Fundamental ratio relating degree measures to radian arc measurements.',
    keyTakeaway: 'To convert degrees to radians, multiply by π/180. To convert radians to degrees, multiply by 180/π.',
    officialReference: true,
    visualizationType: 'radians-degrees',
    diagramLabels: [
      { symbol: '360°', label: 'Full circular rotation in degrees' },
      { symbol: '2π rad', label: 'Full circular rotation in radians' }
    ],
    practiceQuestions: [
      {
        stem: 'An angle measures 120°. What is the measure of this angle in radians?',
        options: [
          { label: 'A', text: 'π/3' },
          { label: 'B', text: '2π/3' },
          { label: 'C', text: '3π/4' },
          { label: 'D', text: '5π/6' }
        ],
        correctAnswer: 'B',
        explanation: 'Multiply degrees by π/180: 120° · (π / 180°) = (120/180)π = 2π/3 radians.',
        tip: 'Reduce fraction 120/180 by dividing numerator and denominator by 60.'
      },
      {
        stem: 'What is an angle measure of 5π/4 radians converted into degrees?',
        options: [
          { label: 'A', text: '135°' },
          { label: 'B', text: '210°' },
          { label: 'C', text: '225°' },
          { label: 'D', text: '240°' }
        ],
        correctAnswer: 'C',
        explanation: '(5π/4) · (180° / π) = 5 · (180° / 4) = 5 · 45° = 225°.',
        tip: 'Replace π directly with 180°: 5(180)/4 = 5(45) = 225°.'
      },
      {
        stem: 'An angle measures 300°. Which of the following is the measure of the angle in radians?',
        options: [
          { label: 'A', text: '4π/3' },
          { label: 'B', text: '5π/3' },
          { label: 'C', text: '7π/4' },
          { label: 'D', text: '11π/6' }
        ],
        correctAnswer: 'B',
        explanation: '300 · (π / 180) = (30/18)π = (5/3)π = 5π/3.',
        tip: '300° is 5 times 60° (π/3), so 5 × (π/3) = 5π/3.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-triangle-sum',
    name: 'Triangle Angle Sum Theorem',
    category: 'geometry',
    subcategory: 'Triangles',
    latex: '\\angle A + \\angle B + \\angle C = 180^\\circ',
    description: 'The sum of the measures of the interior angles of any planar triangle is always 180°.',
    keyTakeaway: 'In an isosceles triangle, the two angles opposite the equal sides are congruent.',
    officialReference: true,
    visualizationType: 'triangle-sum',
    diagramLabels: [
      { symbol: '∠A, ∠B, ∠C', label: 'Interior angles of triangle' },
      { symbol: '180°', label: 'Sum of all 3 interior angles' }
    ],
    practiceQuestions: [
      {
        stem: 'In triangle PQR, the measure of angle P is 48° and the measure of angle Q is 72°. What is the measure of angle R in degrees?',
        options: [
          { label: 'A', text: '50°' },
          { label: 'B', text: '60°' },
          { label: 'C', text: '70°' },
          { label: 'D', text: '80°' }
        ],
        correctAnswer: 'B',
        explanation: 'Sum = 180°. ∠R = 180° - (48° + 72°) = 180° - 120° = 60°.',
        tip: 'Sum the known angles first: 48 + 72 = 120, then subtract from 180.'
      },
      {
        stem: 'In an isosceles triangle, the vertex angle measures 40°. What is the measure of each of the two base angles in degrees?',
        options: [
          { label: 'A', text: '50°' },
          { label: 'B', text: '70°' },
          { label: 'C', text: '80°' },
          { label: 'D', text: '140°' }
        ],
        correctAnswer: 'B',
        explanation: 'The two base angles are congruent. 180° - 40° = 140°. Each base angle = 140° / 2 = 70°.',
        tip: 'Base angles in an isosceles triangle are always equal.'
      },
      {
        stem: 'The measures of the three angles of a triangle are in the ratio 2 : 3 : 4. What is the measure of the largest angle in degrees?',
        options: [
          { label: 'A', text: '40°' },
          { label: 'B', text: '60°' },
          { label: 'C', text: '80°' },
          { label: 'D', text: '90°' }
        ],
        correctAnswer: 'C',
        explanation: '2x + 3x + 4x = 9x = 180° ⟹ x = 20°. Largest angle is 4x = 4(20°) = 80°.',
        tip: 'Set up ratio parts: sum of parts = 9 ⟹ 180 / 9 = 20 per part.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },

  // ─── SECTION 2: HIGH-YIELD COORDINATE GEOMETRY & CIRCLES ───
  {
    id: 'f-circle-equation',
    name: 'Standard Equation of a Circle',
    category: 'coordinate_geometry',
    subcategory: 'Circles in xy-Plane',
    latex: '(x - h)^2 + (y - k)^2 = r^2',
    description: 'Equation of a circle with center (h, k) and radius r in Cartesian coordinates.',
    keyTakeaway: 'Signs flip inside parentheses: (x - 3) means h = +3, but (x + 5) means h = -5. And right side is r², NOT r!',
    officialReference: false,
    visualizationType: 'circle-equation',
    diagramLabels: [
      { symbol: '(h, k)', label: 'Coordinates of center point' },
      { symbol: 'r²', label: 'Square of radius on right side' }
    ],
    practiceQuestions: [
      {
        stem: 'A circle in the xy-plane has the equation (x - 3)² + (y + 5)² = 49. What are the coordinates of the center and the radius of this circle?',
        options: [
          { label: 'A', text: 'Center (-3, 5), radius 49' },
          { label: 'B', text: 'Center (3, -5), radius 49' },
          { label: 'C', text: 'Center (-3, 5), radius 7' },
          { label: 'D', text: 'Center (3, -5), radius 7' }
        ],
        correctAnswer: 'D',
        explanation: 'Compare to (x - h)² + (y - k)² = r²: h = 3, k = -5, so center is (3, -5). r² = 49 ⟹ r = √49 = 7.',
        tip: 'Always take square root of the constant on the right side to get the radius.'
      },
      {
        stem: 'What is the diameter of the circle with equation x² + y² - 6x + 8y = 0 in the xy-plane?',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '10' },
          { label: 'C', text: '20' },
          { label: 'D', text: '25' }
        ],
        correctAnswer: 'B',
        explanation: 'Complete the square: (x² - 6x + 9) + (y² + 8y + 16) = 9 + 16 ⟹ (x - 3)² + (y + 4)² = 25. Thus r² = 25 ⟹ r = 5. Diameter = 2r = 10.',
        tip: 'The question asks for DIAMETER, not radius!'
      },
      {
        stem: 'A circle in the xy-plane has center (-2, 4) and passes through (2, 7). Which equation represents this circle?',
        options: [
          { label: 'A', text: '(x + 2)² + (y - 4)² = 25' },
          { label: 'B', text: '(x - 2)² + (y + 4)² = 25' },
          { label: 'C', text: '(x + 2)² + (y - 4)² = 5' },
          { label: 'D', text: '(x - 2)² + (y + 4)² = 5' }
        ],
        correctAnswer: 'A',
        explanation: 'Radius r² = (2 - (-2))² + (7 - 4)² = 4² + 3² = 25. Center (-2, 4) gives (x + 2)² + (y - 4)² = 25.',
        tip: 'h = -2 gives (x - (-2)) = (x + 2).'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-arc-length',
    name: 'Arc Length of a Circle',
    category: 'geometry',
    subcategory: 'Circles',
    latex: 's = \\frac{\\theta}{360^\\circ} \\cdot (2\\pi r) = r\\theta \\text{ (if } \\theta \\text{ in radians)}',
    description: 'Calculates the curved perimeter distance of an arc intercepted by central angle θ.',
    keyTakeaway: 'When θ is in radians, arc length formula is simply s = rθ.',
    officialReference: false,
    visualizationType: 'arc-length',
    diagramLabels: [
      { symbol: 's', label: 'Curved arc length along perimeter' },
      { symbol: 'θ', label: 'Central angle subtending the arc' }
    ],
    practiceQuestions: [
      {
        stem: 'In a circle with radius 9, a central angle of 60° intercepts an arc. What is the length of this arc?',
        options: [
          { label: 'A', text: '2π' },
          { label: 'B', text: '3π' },
          { label: 'C', text: '6π' },
          { label: 'D', text: '9π' }
        ],
        correctAnswer: 'B',
        explanation: 's = (60/360) · 2π(9) = (1/6) · 18π = 3π.',
        tip: '60° is 1/6 of a full circle (360°), so the arc is 1/6 of total circumference.'
      },
      {
        stem: 'In a circle with radius 10, a central angle of θ radians intercepts an arc of length 15. What is the value of θ?',
        options: [
          { label: 'A', text: '0.75' },
          { label: 'B', text: '1.5' },
          { label: 'C', text: '3.0' },
          { label: 'D', text: '5.0' }
        ],
        correctAnswer: 'B',
        explanation: 'Use s = rθ: 15 = 10θ ⟹ θ = 15 / 10 = 1.5 radians.',
        tip: 'In radians, angle θ = s / r.'
      },
      {
        stem: 'A circle has a radius of 12. An arc on this circle has length 4π. What is the measure of the central angle in degrees?',
        options: [
          { label: 'A', text: '30°' },
          { label: 'B', text: '45°' },
          { label: 'C', text: '60°' },
          { label: 'D', text: '90°' }
        ],
        correctAnswer: 'C',
        explanation: 'Total circumference = 2π(12) = 24π. Arc fraction = 4π / 24π = 1/6. Central angle = (1/6) × 360° = 60°.',
        tip: 'Fraction of circumference = Fraction of 360°.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-sector-area',
    name: 'Area of a Sector',
    category: 'geometry',
    subcategory: 'Circles',
    latex: 'A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot (\\pi r^2) = \\frac{1}{2} r^2 \\theta \\text{ (radians)}',
    description: 'Calculates the area of a slice of pizza cut from a circle by central angle θ.',
    keyTakeaway: 'Sector area is simply the angle fraction (θ/360) times the total circle area (πr²).',
    officialReference: false,
    visualizationType: 'circle-sector',
    diagramLabels: [
      { symbol: 'A_sector', label: 'Shaded pie slice area' },
      { symbol: 'θ', label: 'Central angle opening' }
    ],
    practiceQuestions: [
      {
        stem: 'A circle has a radius of 12. What is the area of a sector formed by a central angle of 45°?',
        options: [
          { label: 'A', text: '9π' },
          { label: 'B', text: '18π' },
          { label: 'C', text: '36π' },
          { label: 'D', text: '72π' }
        ],
        correctAnswer: 'B',
        explanation: 'Total area = π(12)² = 144π. Angle fraction = 45/360 = 1/8. Sector Area = (1/8)(144π) = 18π.',
        tip: '45° is exactly 1/8 of 360°.'
      },
      {
        stem: 'A sector of a circle with radius 6 has an area of 6π. What is the central angle in radians?',
        options: [
          { label: 'A', text: 'π/6' },
          { label: 'B', text: 'π/4' },
          { label: 'C', text: 'π/3' },
          { label: 'D', text: '2π/3' }
        ],
        correctAnswer: 'C',
        explanation: 'Area = ½ r² θ ⟹ 6π = ½ (36) θ = 18θ ⟹ θ = 6π / 18 = π/3.',
        tip: 'Area in radians is ½ r² θ.'
      },
      {
        stem: 'A circle has an area of 72π. A sector has a central angle of 50°. What is the area of the sector?',
        options: [
          { label: 'A', text: '10π' },
          { label: 'B', text: '12π' },
          { label: 'C', text: '15π' },
          { label: 'D', text: '20π' }
        ],
        correctAnswer: 'A',
        explanation: 'Sector Area = (50/360) × 72π = (5/36) × 72π = 5 × 2π = 10π.',
        tip: '72 divided by 36 is 2.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-slope-formula',
    name: 'Slope Formula',
    category: 'coordinate_geometry',
    subcategory: 'Lines in xy-Plane',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}',
    description: 'Measures the rate of change or steepness of a line between two points.',
    keyTakeaway: 'Rise over run. Keep order consistent: if y2 is first in the numerator, x2 must be first in denominator.',
    officialReference: false,
    visualizationType: 'slope-rise-run',
    diagramLabels: [
      { symbol: 'Δy', label: 'Vertical change (Rise)' },
      { symbol: 'Δx', label: 'Horizontal change (Run)' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the slope of the line passing through points (2, 5) and (6, 17) in the xy-plane?',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '3' },
          { label: 'C', text: '4' },
          { label: 'D', text: '6' }
        ],
        correctAnswer: 'B',
        explanation: 'm = (17 - 5) / (6 - 2) = 12 / 4 = 3.',
        tip: 'Subtract: Δy = 17 - 5 = 12; Δx = 6 - 2 = 4. 12 / 4 = 3.'
      },
      {
        stem: 'Line k passes through points (-3, 4) and (5, -8). What is the slope of line k?',
        options: [
          { label: 'A', text: '-3/2' },
          { label: 'B', text: '-2/3' },
          { label: 'C', text: '2/3' },
          { label: 'D', text: '3/2' }
        ],
        correctAnswer: 'A',
        explanation: 'm = (-8 - 4) / (5 - (-3)) = -12 / (5 + 3) = -12 / 8 = -3/2.',
        tip: 'Watch out for double negatives in the denominator: 5 - (-3) = 8.'
      },
      {
        stem: 'A line with slope 4 passes through (1, k) and (4, 15). What is the value of k?',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '3' },
          { label: 'C', text: '7' },
          { label: 'D', text: '11' }
        ],
        correctAnswer: 'B',
        explanation: '(15 - k) / (4 - 1) = 4 ⟹ (15 - k) / 3 = 4 ⟹ 15 - k = 12 ⟹ k = 3.',
        tip: 'Cross multiply by run Δx = 3.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-parallel-perpendicular',
    name: 'Parallel and Perpendicular Slopes',
    category: 'coordinate_geometry',
    subcategory: 'Lines in xy-Plane',
    latex: 'm_{\\parallel} = m_1, \\quad m_{\\perp} = -\\frac{1}{m_1} \\iff m_1 \\cdot m_{\\perp} = -1',
    description: 'Parallel lines have equal slopes; perpendicular lines have negative reciprocal slopes.',
    keyTakeaway: 'To find perpendicular slope: flip the fraction and switch the positive/negative sign.',
    officialReference: false,
    visualizationType: 'parallel-perpendicular',
    diagramLabels: [
      { symbol: 'm_1 = m_2', label: 'Parallel lines never intersect' },
      { symbol: 'm ⊥ (-1/m)', label: 'Perpendicular lines intersect at 90°' }
    ],
    practiceQuestions: [
      {
        stem: 'Line L has the equation 3x - 2y = 8. What is the slope of a line that is perpendicular to Line L?',
        options: [
          { label: 'A', text: '-3/2' },
          { label: 'B', text: '-2/3' },
          { label: 'C', text: '2/3' },
          { label: 'D', text: '3/2' }
        ],
        correctAnswer: 'B',
        explanation: 'Convert to slope-intercept form: -2y = -3x + 8 ⟹ y = (3/2)x - 4, so m = 3/2. The perpendicular slope is the negative reciprocal: -2/3.',
        tip: 'Negative reciprocal means flip numerator/denominator and invert sign: +3/2 becomes -2/3.'
      },
      {
        stem: 'Line m is parallel to y = -5x + 7 and passes through (2, 3). What is the y-intercept of line m?',
        options: [
          { label: 'A', text: '-7' },
          { label: 'B', text: '7' },
          { label: 'C', text: '13' },
          { label: 'D', text: '17' }
        ],
        correctAnswer: 'C',
        explanation: 'Parallel means same slope m = -5. Equation: y - 3 = -5(x - 2) ⟹ y = -5x + 10 + 3 = -5x + 13. y-intercept is 13.',
        tip: 'Plug (2, 3) into y = -5x + b ⟹ 3 = -10 + b ⟹ b = 13.'
      },
      {
        stem: 'Line j passes through (1, 2) and (4, 8). Line p is perpendicular to line j. What is the slope of line p?',
        options: [
          { label: 'A', text: '-2' },
          { label: 'B', text: '-1/2' },
          { label: 'C', text: '1/2' },
          { label: 'D', text: '2' }
        ],
        correctAnswer: 'B',
        explanation: 'Slope of j = (8 - 2) / (4 - 1) = 6 / 3 = 2. Perpendicular slope is -1/2.',
        tip: 'The negative reciprocal of 2 is -1/2.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-midpoint-formula',
    name: 'Midpoint Formula',
    category: 'coordinate_geometry',
    subcategory: 'Points in xy-Plane',
    latex: 'M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)',
    description: 'Finds the exact center coordinate between two points in the xy-plane.',
    keyTakeaway: 'The midpoint is simply the average of the x-coordinates and the average of the y-coordinates.',
    officialReference: false,
    visualizationType: 'distance-midpoint',
    diagramLabels: [
      { symbol: '(x_m, y_m)', label: 'Midpoint dividing line segment into 2 equal halves' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the midpoint of the line segment connecting (-4, 7) and (8, -3) in the xy-plane?',
        options: [
          { label: 'A', text: '(2, 2)' },
          { label: 'B', text: '(2, 5)' },
          { label: 'C', text: '(4, 2)' },
          { label: 'D', text: '(6, 2)' }
        ],
        correctAnswer: 'A',
        explanation: 'M = ((-4 + 8)/2, (7 + (-3))/2) = (4/2, 4/2) = (2, 2).',
        tip: 'Add coordinates and divide by 2: (-4+8)/2 = 2 and (7-3)/2 = 2.'
      },
      {
        stem: 'Point M(3, 5) is the midpoint of segment AB. If A is at (-1, 2), what are the coordinates of point B?',
        options: [
          { label: 'A', text: '(1, 3.5)' },
          { label: 'B', text: '(5, 7)' },
          { label: 'C', text: '(7, 8)' },
          { label: 'D', text: '(7, 12)' }
        ],
        correctAnswer: 'C',
        explanation: 'x-coordinate: (-1 + x_B)/2 = 3 ⟹ x_B = 6 + 1 = 7. y-coordinate: (2 + y_B)/2 = 5 ⟹ y_B = 10 - 2 = 8. B is (7, 8).',
        tip: 'Step size from A to M: x increased by 4, y increased by 3. Add same step to M: 3+4=7, 5+3=8.'
      },
      {
        stem: 'The endpoints of a circle diameter are (2, -3) and (8, 5). What is the center of the circle?',
        options: [
          { label: 'A', text: '(3, 1)' },
          { label: 'B', text: '(5, 1)' },
          { label: 'C', text: '(5, 4)' },
          { label: 'D', text: '(10, 2)' }
        ],
        correctAnswer: 'B',
        explanation: 'Center is the midpoint: ((2 + 8)/2, (-3 + 5)/2) = (10/2, 2/2) = (5, 1).',
        tip: 'Center of any circle is always the midpoint of its diameter.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-distance-formula',
    name: 'Distance Formula',
    category: 'coordinate_geometry',
    subcategory: 'Points in xy-Plane',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    description: 'Calculates straight-line Euclidean distance between two points in the Cartesian plane.',
    keyTakeaway: 'This is the Pythagorean Theorem in disguise! (Δx)² + (Δy)² = d².',
    officialReference: false,
    visualizationType: 'distance-midpoint',
    diagramLabels: [
      { symbol: 'd', label: 'Hypotenuse distance between two points' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the distance between points (1, -2) and (7, 6) in the xy-plane?',
        options: [
          { label: 'A', text: '8' },
          { label: 'B', text: '10' },
          { label: 'C', text: '12' },
          { label: 'D', text: '14' }
        ],
        correctAnswer: 'B',
        explanation: 'd = √((7 - 1)² + (6 - (-2))²) = √(6² + 8²) = √(36 + 64) = √100 = 10.',
        tip: 'Notice the 6-8-10 Pythagorean triple (scaled 3-4-5).'
      },
      {
        stem: 'What is the distance between (-2, 3) and (4, -5) in the xy-plane?',
        options: [
          { label: 'A', text: '8' },
          { label: 'B', text: '10' },
          { label: 'C', text: '12' },
          { label: 'D', text: '14' }
        ],
        correctAnswer: 'B',
        explanation: 'Δx = 4 - (-2) = 6. Δy = -5 - 3 = -8. d = √(6² + (-8)²) = √(36 + 64) = √100 = 10.',
        tip: 'Squaring turns negative differences positive: (-8)² = 64.'
      },
      {
        stem: 'The distance between (0, 0) and (k, 12) is 13, where k > 0. What is the value of k?',
        options: [
          { label: 'A', text: '5' },
          { label: 'B', text: '7' },
          { label: 'C', text: '9' },
          { label: 'D', text: '11' }
        ],
        correctAnswer: 'A',
        explanation: 'k² + 12² = 13² ⟹ k² + 144 = 169 ⟹ k² = 25 ⟹ k = 5. (5-12-13 triple).',
        tip: 'Recognize the 5-12-13 triple instantly.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },

  // ─── SECTION 3: ADVANCED ALGEBRA & QUADRATICS ───
  {
    id: 'f-quad-formula',
    name: 'Quadratic Formula',
    category: 'algebra',
    subcategory: 'Quadratics',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Yields exact roots of any quadratic equation in standard form ax² + bx + c = 0.',
    keyTakeaway: 'Always ensure the quadratic is set to 0 before identifying coefficients a, b, and c.',
    officialReference: false,
    visualizationType: 'quadratic-parabola',
    diagramLabels: [
      { symbol: 'x_1, x_2', label: 'Parabola x-intercepts (roots)' }
    ],
    practiceQuestions: [
      {
        stem: 'What are the solutions to the equation 2x² - 4x - 3 = 0?',
        options: [
          { label: 'A', text: '(2 ± √10) / 2' },
          { label: 'B', text: '(4 ± √10) / 2' },
          { label: 'C', text: '1 ± √7' },
          { label: 'D', text: '(4 ± √40) / 2' }
        ],
        correctAnswer: 'A',
        explanation: 'a = 2, b = -4, c = -3. x = (-(-4) ± √((-4)² - 4(2)(-3))) / (2 · 2) = (4 ± √(16 + 24)) / 4 = (4 ± √40) / 4 = (4 ± 2√10) / 4 = (2 ± √10) / 2.',
        tip: 'Divide all terms in the fraction by 2 to reduce: 4/4 ± (2√10)/4 = 1 ± (√10)/2 = (2 ± √10)/2.'
      },
      {
        stem: 'For what positive value of x is x² - 6x - 1 = 0?',
        options: [
          { label: 'A', text: '3 - √10' },
          { label: 'B', text: '3 + √10' },
          { label: 'C', text: '6 + √10' },
          { label: 'D', text: '3 + 2√10' }
        ],
        correctAnswer: 'B',
        explanation: 'x = (6 ± √(36 - 4(1)(-1))) / 2 = (6 ± √40) / 2 = (6 ± 2√10) / 2 = 3 ± √10. The positive root is 3 + √10.',
        tip: '3 - √10 is negative because √10 > 3.'
      },
      {
        stem: 'How many real solutions does the quadratic equation 3x² - 5x + 4 = 0 have?',
        options: [
          { label: 'A', text: 'Exactly 0' },
          { label: 'B', text: 'Exactly 1' },
          { label: 'C', text: 'Exactly 2' },
          { label: 'D', text: 'Infinitely many' }
        ],
        correctAnswer: 'A',
        explanation: 'Discriminant: b² - 4ac = (-5)² - 4(3)(4) = 25 - 48 = -23. Since -23 < 0, there are 0 real solutions.',
        tip: 'A negative discriminant means no real x-intercepts.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-discriminant',
    name: 'Quadratic Discriminant',
    category: 'algebra',
    subcategory: 'Quadratics',
    latex: '\\Delta = b^2 - 4ac',
    description: 'Determines the number and nature of real solutions without calculating them.',
    keyTakeaway: 'Δ > 0: 2 distinct real solutions; Δ = 0: exactly 1 real solution (vertex touches x-axis); Δ < 0: 0 real solutions.',
    officialReference: false,
    visualizationType: 'quadratic-parabola',
    diagramLabels: [
      { symbol: 'Δ > 0', label: 'Crosses x-axis at 2 points' },
      { symbol: 'Δ = 0', label: 'Touches x-axis at 1 vertex point' },
      { symbol: 'Δ < 0', label: 'Floating above/below, 0 intercepts' }
    ],
    practiceQuestions: [
      {
        stem: 'For what value of k will the equation x² + kx + 9 = 0 have exactly one real solution, where k > 0?',
        options: [
          { label: 'A', text: '3' },
          { label: 'B', text: '6' },
          { label: 'C', text: '9' },
          { label: 'D', text: '18' }
        ],
        correctAnswer: 'B',
        explanation: 'Exactly one real solution requires Δ = 0: b² - 4ac = 0 ⟹ k² - 4(1)(9) = 0 ⟹ k² - 36 = 0 ⟹ k² = 36 ⟹ k = 6 (since k > 0).',
        tip: 'When a quadratic has 1 solution, it is a perfect square trinomial: (x + 3)² = x² + 6x + 9.'
      },
      {
        stem: 'For what value of c does the equation 2x² - 8x + c = 0 have exactly one real solution?',
        options: [
          { label: 'A', text: '4' },
          { label: 'B', text: '8' },
          { label: 'C', text: '16' },
          { label: 'D', text: '32' }
        ],
        correctAnswer: 'B',
        explanation: 'Set b² - 4ac = 0 ⟹ (-8)² - 4(2)(c) = 0 ⟹ 64 - 8c = 0 ⟹ 8c = 64 ⟹ c = 8.',
        tip: 'Δ = 0 is the hallmark of tangent vertex.'
      },
      {
        stem: 'If 4x² - 12x + k = 0 has two distinct real solutions, which inequality represents all possible values of k?',
        options: [
          { label: 'A', text: 'k < 9' },
          { label: 'B', text: 'k > 9' },
          { label: 'C', text: 'k < 18' },
          { label: 'D', text: 'k > 18' }
        ],
        correctAnswer: 'A',
        explanation: 'b² - 4ac > 0 ⟹ (-12)² - 4(4)(k) > 0 ⟹ 144 - 16k > 0 ⟹ 16k < 144 ⟹ k < 9.',
        tip: 'Divide by positive 16; inequality direction stays unchanged.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vertex-form',
    name: 'Parabola Vertex Form',
    category: 'algebra',
    subcategory: 'Quadratics',
    latex: 'y = a(x - h)^2 + k',
    description: 'Reveals the maximum or minimum vertex coordinate (h, k) of a parabola directly as constants.',
    keyTakeaway: 'The vertex is (h, k). If a > 0, k is the MINIMUM; if a < 0, k is the MAXIMUM.',
    officialReference: false,
    visualizationType: 'vertex-form',
    diagramLabels: [
      { symbol: '(h, k)', label: 'Parabola peak (maximum) or valley (minimum)' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the vertex of the parabola defined by y = 2(x - 3)² - 8?',
        options: [
          { label: 'A', text: '(-3, -8)' },
          { label: 'B', text: '(3, -8)' },
          { label: 'C', text: '(3, 8)' },
          { label: 'D', text: '(-3, 8)' }
        ],
        correctAnswer: 'B',
        explanation: 'In y = a(x - h)² + k, the vertex is (h, k). Here, h = 3 and k = -8, so vertex is (3, -8).',
        tip: 'Notice x - 3 gives h = +3, while constant -8 retains its negative sign k = -8.'
      },
      {
        stem: 'A parabola has its vertex at (-4, 5) and passes through (-2, 13). What is the value of a in y = a(x - h)² + k?',
        options: [
          { label: 'A', text: '1' },
          { label: 'B', text: '2' },
          { label: 'C', text: '3' },
          { label: 'D', text: '4' }
        ],
        correctAnswer: 'B',
        explanation: 'y = a(x + 4)² + 5. Substitute (-2, 13): 13 = a(-2 + 4)² + 5 ⟹ 13 = a(4) + 5 ⟹ 4a = 8 ⟹ a = 2.',
        tip: 'Substitute given coordinates directly into the vertex form.'
      },
      {
        stem: 'For what value of x does f(x) = -3(x - 7)² + 15 achieve its maximum value?',
        options: [
          { label: 'A', text: '-7' },
          { label: 'B', text: '7' },
          { label: 'C', text: '15' },
          { label: 'D', text: '22' }
        ],
        correctAnswer: 'B',
        explanation: 'Because a = -3 < 0, the parabola opens downward. Maximum occurs at the vertex x = h = 7.',
        tip: 'The question asks for the VALUE OF X (which is h = 7), not the maximum value itself (which is k = 15).'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-axis-of-symmetry',
    name: 'Axis of Symmetry Formula',
    category: 'algebra',
    subcategory: 'Quadratics',
    latex: 'x = -\\frac{b}{2a}',
    description: 'Finds the vertical line x = h dividing a standard-form parabola ax² + bx + c into mirrored halves.',
    keyTakeaway: 'The x-coordinate of the vertex is ALWAYS -b / (2a).',
    officialReference: false,
    visualizationType: 'quadratic-parabola',
    diagramLabels: [
      { symbol: 'x = -b/(2a)', label: 'Vertical mirror fold-line of symmetry' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the x-coordinate of the vertex of the parabola defined by y = 2x² - 12x + 7?',
        options: [
          { label: 'A', text: '-3' },
          { label: 'B', text: '3' },
          { label: 'C', text: '6' },
          { label: 'D', text: '12' }
        ],
        correctAnswer: 'B',
        explanation: 'a = 2, b = -12. Axis of symmetry: x = -b / (2a) = -(-12) / (2 · 2) = 12 / 4 = 3.',
        tip: 'Remember the negative sign: -(-12) becomes +12 in the numerator.'
      },
      {
        stem: 'The graph of y = -x² + 8x - 11 is a parabola. What is the equation of its axis of symmetry?',
        options: [
          { label: 'A', text: 'x = -8' },
          { label: 'B', text: 'x = -4' },
          { label: 'C', text: 'x = 4' },
          { label: 'D', text: 'x = 8' }
        ],
        correctAnswer: 'C',
        explanation: 'x = -b / (2a) = -8 / (2(-1)) = -8 / -2 = 4.',
        tip: 'a = -1, so denominator is 2(-1) = -2.'
      },
      {
        stem: 'A quadratic function has x-intercepts at x = -2 and x = 10. What is the x-coordinate of its vertex?',
        options: [
          { label: 'A', text: '2' },
          { label: 'B', text: '4' },
          { label: 'C', text: '6' },
          { label: 'D', text: '8' }
        ],
        correctAnswer: 'B',
        explanation: 'The axis of symmetry lies halfway between the x-intercepts: (-2 + 10) / 2 = 8 / 2 = 4.',
        tip: 'Average the roots to get the vertex x-coordinate in 2 seconds.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-vietas-formulas',
    name: "Vieta's Formulas (Sum and Product of Roots)",
    category: 'algebra',
    subcategory: 'Quadratics',
    latex: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
    description: 'Computes sum and product of polynomial roots directly from coefficients without solving.',
    keyTakeaway: 'When asked "What is the sum of the solutions to ax² + bx + c = 0?", do NOT factor! Answer is instantly -b/a.',
    officialReference: false,
    visualizationType: 'quadratic-parabola',
    diagramLabels: [
      { symbol: '-b/a', label: 'Sum of solutions' },
      { symbol: 'c/a', label: 'Product of solutions' }
    ],
    practiceQuestions: [
      {
        stem: 'What is the sum of the solutions to the equation 2x² - 10x + 7 = 0?',
        options: [
          { label: 'A', text: '-5' },
          { label: 'B', text: '3.5' },
          { label: 'C', text: '5' },
          { label: 'D', text: '10' }
        ],
        correctAnswer: 'C',
        explanation: 'Using Vieta’s formulas, Sum of solutions = -b / a = -(-10) / 2 = 10 / 2 = 5.',
        tip: 'Never waste time using quadratic formula when the question only asks for the SUM of solutions.'
      },
      {
        stem: 'What is the product of the solutions to the equation 3x² + 7x - 18 = 0?',
        options: [
          { label: 'A', text: '-6' },
          { label: 'B', text: '-7/3' },
          { label: 'C', text: '6' },
          { label: 'D', text: '7/3' }
        ],
        correctAnswer: 'A',
        explanation: 'Product of roots = c / a = -18 / 3 = -6.',
        tip: 'Product of roots is simply c / a.'
      },
      {
        stem: 'If the sum of the roots of 4x² + bx - 15 = 0 is 3, what is the value of b?',
        options: [
          { label: 'A', text: '-12' },
          { label: 'B', text: '-3' },
          { label: 'C', text: '3' },
          { label: 'D', text: '12' }
        ],
        correctAnswer: 'A',
        explanation: '-b / a = 3 ⟹ -b / 4 = 3 ⟹ -b = 12 ⟹ b = -12.',
        tip: 'Be careful with signs: -b / a = 3.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-exponential-growth',
    name: 'Exponential Growth and Decay Model',
    category: 'algebra',
    subcategory: 'Functions',
    latex: 'y = a(1 \\pm r)^t = a \\cdot b^t',
    description: 'Models quantities increasing or decreasing at a constant percentage rate r per period t.',
    keyTakeaway: 'b = 1 + r for growth (b > 1); b = 1 - r for decay (0 < b < 1). Initial value is always a (when t = 0).',
    officialReference: false,
    visualizationType: 'exponential-growth',
    diagramLabels: [
      { symbol: 'a', label: 'Initial amount at t = 0 (y-intercept)' },
      { symbol: 'b', label: 'Growth/decay factor per step' }
    ],
    practiceQuestions: [
      {
        stem: 'A city population is modeled by P(t) = 500(1.04)^t, where t is the number of years since 2010. What is the annual percent growth rate of the city?',
        options: [
          { label: 'A', text: '0.04%' },
          { label: 'B', text: '1.04%' },
          { label: 'C', text: '4%' },
          { label: 'D', text: '40%' }
        ],
        correctAnswer: 'C',
        explanation: 'The growth factor is b = 1 + r = 1.04 ⟹ r = 0.04 = 4% annual growth rate.',
        tip: 'Subtract 1 from the base: 1.04 - 1 = 0.04 = 4%.'
      },
      {
        stem: 'A radioactive substance decays according to M(t) = 800(0.85)^t, where t is in years. What is the annual percent decrease?',
        options: [
          { label: 'A', text: '8.5%' },
          { label: 'B', text: '15%' },
          { label: 'C', text: '85%' },
          { label: 'D', text: '115%' }
        ],
        correctAnswer: 'B',
        explanation: 'Decay factor = 1 - r = 0.85 ⟹ r = 1 - 0.85 = 0.15 = 15% decrease.',
        tip: 'For decay, percent rate is 1 - base.'
      },
      {
        stem: 'The population of a town was 12,000 in 2020 and grew by 5% each year. Which function models the population P(t) after t years?',
        options: [
          { label: 'A', text: 'P(t) = 12000(0.05)^t' },
          { label: 'B', text: 'P(t) = 12000(1.05)^t' },
          { label: 'C', text: 'P(t) = 12000 + 1.05t' },
          { label: 'D', text: 'P(t) = 12000(1.5)^t' }
        ],
        correctAnswer: 'B',
        explanation: 'Growth model: a(1 + r)^t = 12000(1 + 0.05)^t = 12000(1.05)^t.',
        tip: '5% growth corresponds to 1 + 0.05 = 1.05, not 1.5.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-compound-interest',
    name: 'Compound Interest Formula',
    category: 'algebra',
    subcategory: 'Exponential Models',
    latex: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt}',
    description: 'Calculates accumulated amount where principal P is compounded n times per year for t years at rate r.',
    keyTakeaway: 'Common n values: annually n = 1, semi-annually n = 2, quarterly n = 4, monthly n = 12.',
    officialReference: false,
    visualizationType: 'compound-interest',
    diagramLabels: [
      { symbol: 'P', label: 'Principal starting investment' },
      { symbol: 'n', label: 'Compounding frequency per year' }
    ],
    practiceQuestions: [
      {
        stem: 'A student deposits $2,000 into a savings account that pays an annual interest rate of 6% compounded quarterly. Which expression represents the account balance after 5 years?',
        options: [
          { label: 'A', text: '2000(1.06)^5' },
          { label: 'B', text: '2000(1.015)^5' },
          { label: 'C', text: '2000(1.015)^20' },
          { label: 'D', text: '2000(1.06)^20' }
        ],
        correctAnswer: 'C',
        explanation: 'P = 2000, r = 0.06, n = 4 (quarterly), t = 5. Rate per period = 0.06 / 4 = 0.015. Total compounding periods = nt = 4 × 5 = 20. Expression is 2000(1 + 0.015)^20 = 2000(1.015)^20.',
        tip: 'Quarterly means n = 4. Divide annual rate by 4 and multiply years by 4.'
      },
      {
        stem: 'An investment of $5,000 earns 8% annual interest compounded semiannually. What is the value after 3 years?',
        options: [
          { label: 'A', text: '5000(1.04)^3' },
          { label: 'B', text: '5000(1.04)^6' },
          { label: 'C', text: '5000(1.08)^3' },
          { label: 'D', text: '5000(1.08)^6' }
        ],
        correctAnswer: 'B',
        explanation: 'Semiannual means n = 2. r/n = 0.08/2 = 0.04. nt = 2 × 3 = 6. Result: 5000(1.04)^6.',
        tip: 'Semiannually: 2 compoundings per year.'
      },
      {
        stem: 'If $1,000 is compounded monthly at an annual rate r, what is the periodic interest rate applied each month?',
        options: [
          { label: 'A', text: 'r' },
          { label: 'B', text: 'r/10' },
          { label: 'C', text: 'r/12' },
          { label: 'D', text: '12r' }
        ],
        correctAnswer: 'C',
        explanation: 'Monthly compounding divides the annual rate r across 12 months, yielding r/12 per period.',
        tip: 'Periodic rate is always annual rate divided by frequency n.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },

  // ─── SECTION 4: TRIGONOMETRY ───
  {
    id: 'f-trig-sohcahtoa',
    name: 'Trigonometric Ratios (SOH CAH TOA)',
    category: 'trigonometry',
    subcategory: 'Right Triangle Trig',
    latex: '\\sin \\theta = \\frac{\\text{Opp}}{\\text{Hyp}}, \\quad \\cos \\theta = \\frac{\\text{Adj}}{\\text{Hyp}}, \\quad \\tan \\theta = \\frac{\\text{Opp}}{\\text{Adj}}',
    description: 'Fundamental definitions connecting acute angles of a right triangle to ratios of its side lengths.',
    keyTakeaway: 'Hypotenuse is always opposite the 90° angle. Opposite and Adjacent depend strictly on which angle θ you are standing at.',
    officialReference: false,
    visualizationType: 'trig-ratios',
    diagramLabels: [
      { symbol: 'Opp', label: 'Side opposite to angle θ' },
      { symbol: 'Adj', label: 'Side adjacent (next to) angle θ' },
      { symbol: 'Hyp', label: 'Hypotenuse opposite 90°' }
    ],
    practiceQuestions: [
      {
        stem: 'In a right triangle, the side opposite angle θ has length 5 and the adjacent side has length 12. What is the value of sin θ?',
        options: [
          { label: 'A', text: '5/12' },
          { label: 'B', text: '5/13' },
          { label: 'C', text: '12/13' },
          { label: 'D', text: '13/5' }
        ],
        correctAnswer: 'B',
        explanation: 'Use 5-12-13 triple to find Hypotenuse: c = √(5² + 12²) = 13. sin θ = Opposite / Hypotenuse = 5 / 13.',
        tip: 'Find the hypotenuse first before calculating sin or cos.'
      },
      {
        stem: 'In right triangle DEF, angle E is 90°, DE = 9, and EF = 12. What is the value of tan(D)?',
        options: [
          { label: 'A', text: '3/5' },
          { label: 'B', text: '3/4' },
          { label: 'C', text: '4/3' },
          { label: 'D', text: '4/5' }
        ],
        correctAnswer: 'C',
        explanation: 'From angle D, opposite side is EF = 12, adjacent side is DE = 9. tan(D) = 12 / 9 = 4/3.',
        tip: 'tan = Opposite / Adjacent.'
      },
      {
        stem: 'In right triangle ABC with right angle C, cos(A) = 24/25. What is the value of sin(A)?',
        options: [
          { label: 'A', text: '7/25' },
          { label: 'B', text: '7/24' },
          { label: 'C', text: '24/7' },
          { label: 'D', text: '25/24' }
        ],
        correctAnswer: 'A',
        explanation: 'Recognize the 7-24-25 triple. Opposite = √(25² - 24²) = 7. sin(A) = 7/25.',
        tip: '7-24-25 right triangle has cos = 24/25 and sin = 7/25.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-trig-cofunction',
    name: 'Cofunction Identity',
    category: 'trigonometry',
    subcategory: 'Trig Identities',
    latex: '\\sin(x) = \\cos(90^\\circ - x) \\iff \\sin(A) = \\cos(B) \\implies A + B = 90^\\circ',
    description: 'The sine of an acute angle equals the cosine of its complementary angle.',
    keyTakeaway: 'Top 3 highest-frequency SAT trig concept! Whenever you see sin(something) = cos(something), set their sum equal to 90°!',
    officialReference: false,
    visualizationType: 'cofunction-identity',
    diagramLabels: [
      { symbol: 'A + B = 90°', label: 'Complementary acute angles in right triangle' }
    ],
    practiceQuestions: [
      {
        stem: 'If sin(3x - 10)° = cos(2x + 15)°, where both angles are acute, what is the value of x?',
        options: [
          { label: 'A', text: '13' },
          { label: 'B', text: '17' },
          { label: 'C', text: '21' },
          { label: 'D', text: '25' }
        ],
        correctAnswer: 'B',
        explanation: 'Because sin(A) = cos(B), the angles are complementary: (3x - 10) + (2x + 15) = 90 ⟹ 5x + 5 = 90 ⟹ 5x = 85 ⟹ x = 17.',
        tip: 'Instant SAT reflex: Whenever sin(A) = cos(B), write A + B = 90 immediately.'
      },
      {
        stem: 'If sin(a°) = cos(b°) where a and b are acute angles, which equation must be true?',
        options: [
          { label: 'A', text: 'a = b' },
          { label: 'B', text: 'a - b = 90' },
          { label: 'C', text: 'a + b = 90' },
          { label: 'D', text: 'a + b = 180' }
        ],
        correctAnswer: 'C',
        explanation: 'By the cofunction identity, sin(a°) = cos(90° - a°), meaning b = 90 - a ⟹ a + b = 90.',
        tip: 'Sine and cosine of acute angles are equal only when the angles add up to 90°.'
      },
      {
        stem: 'For what value of k is sin(40°) = cos(2k°)?',
        options: [
          { label: 'A', text: '20' },
          { label: 'B', text: '25' },
          { label: 'C', text: '40' },
          { label: 'D', text: '50' }
        ],
        correctAnswer: 'B',
        explanation: '40 + 2k = 90 ⟹ 2k = 50 ⟹ k = 25.',
        tip: 'Add angles and set to 90: 40 + 2k = 90.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-trig-pythagorean',
    name: 'Pythagorean Trigonometric Identity',
    category: 'trigonometry',
    subcategory: 'Trig Identities',
    latex: '\\sin^2 \\theta + \\cos^2 \\theta = 1',
    description: 'Fundamental identity derived directly from the unit circle equation x² + y² = 1.',
    keyTakeaway: 'Rearrangements: sin² θ = 1 - cos² θ and cos² θ = 1 - sin² θ.',
    officialReference: false,
    visualizationType: 'trig-pythagorean',
    diagramLabels: [
      { symbol: 'sin²θ + cos²θ = 1', label: 'Unit circle fundamental property' }
    ],
    practiceQuestions: [
      {
        stem: 'If sin(x) = 3/5 and x is an acute angle, what is the value of cos(x)?',
        options: [
          { label: 'A', text: '2/5' },
          { label: 'B', text: '4/5' },
          { label: 'C', text: '3/4' },
          { label: 'D', text: '4/3' }
        ],
        correctAnswer: 'B',
        explanation: 'cos²(x) = 1 - sin²(x) = 1 - (3/5)² = 1 - 9/25 = 16/25 ⟹ cos(x) = √(16/25) = 4/5.',
        tip: 'Notice the 3-4-5 right triangle: if sin is 3/5, cos is 4/5.'
      },
      {
        stem: 'If sin(θ) = 5/13 and θ is an acute angle, what is the value of tan(θ)?',
        options: [
          { label: 'A', text: '5/12' },
          { label: 'B', text: '12/13' },
          { label: 'C', text: '12/5' },
          { label: 'D', text: '13/12' }
        ],
        correctAnswer: 'A',
        explanation: 'cos(θ) = √(1 - (5/13)²) = √(144/169) = 12/13. tan(θ) = sin(θ) / cos(θ) = (5/13) / (12/13) = 5/12.',
        tip: 'tan = sin / cos.'
      },
      {
        stem: 'Which of the following expressions is equivalent to 1 - cos²(θ)?',
        options: [
          { label: 'A', text: '-sin²(θ)' },
          { label: 'B', text: 'sin²(θ)' },
          { label: 'C', text: 'tan²(θ)' },
          { label: 'D', text: 'sec²(θ)' }
        ],
        correctAnswer: 'B',
        explanation: 'Directly from sin²(θ) + cos²(θ) = 1, subtracting cos²(θ) gives sin²(θ) = 1 - cos²(θ).',
        tip: 'Commit the rearranged forms to memory.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },

  // ─── SECTION 5: STATISTICS & DATA ANALYSIS ───
  {
    id: 'f-percent-change',
    name: 'Percent Change Formula',
    category: 'statistics',
    subcategory: 'Percentages',
    latex: '\\text{Percent Change} = \\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100\\%',
    description: 'Calculates the relative increase or decrease compared strictly against the original starting base.',
    keyTakeaway: 'The denominator MUST ALWAYS BE THE ORIGINAL (OLD) VALUE, never the new value!',
    officialReference: false,
    visualizationType: 'percent-change',
    diagramLabels: [
      { symbol: '(New - Old)/Old', label: 'Always divide difference by original starting value' }
    ],
    practiceQuestions: [
      {
        stem: 'The price of a calculator increased from $80 to $104. What was the percent increase in the price of the calculator?',
        options: [
          { label: 'A', text: '23%' },
          { label: 'B', text: '24%' },
          { label: 'C', text: '30%' },
          { label: 'D', text: '130%' }
        ],
        correctAnswer: 'C',
        explanation: 'Change = 104 - 80 = 24. Percent Increase = (24 / 80) × 100% = 0.30 × 100% = 30%.',
        tip: 'Divide by original 80: 24 / 80 = 3 / 10 = 30%.'
      },
      {
        stem: 'A coat originally priced at $150 is placed on sale for $105. What is the percent discount?',
        options: [
          { label: 'A', text: '30%' },
          { label: 'B', text: '35%' },
          { label: 'C', text: '40%' },
          { label: 'D', text: '45%' }
        ],
        correctAnswer: 'A',
        explanation: 'Discount amount = 150 - 105 = 45. Percent = (45 / 150) × 100% = 0.30 × 100% = 30%.',
        tip: 'Divide discount by original price $150.'
      },
      {
        stem: 'A store marks up an item by 50%, and then discounts the new price by 20%. What is the net percent increase from original price?',
        options: [
          { label: 'A', text: '20%' },
          { label: 'B', text: '30%' },
          { label: 'C', text: '35%' },
          { label: 'D', text: '40%' }
        ],
        correctAnswer: 'A',
        explanation: 'Multiply factors: 1.50 × 0.80 = 1.20. That is a 20% net increase.',
        tip: 'Never simply subtract percentages (50% - 20% ≠ 30%). Multiply multipliers instead!'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-mean-average',
    name: 'Arithmetic Mean (Average) Formula',
    category: 'statistics',
    subcategory: 'Central Tendency',
    latex: '\\bar{x} = \\frac{\\sum x}{n} \\iff \\text{Sum} = \\text{Mean} \\times n',
    description: 'The sum of all values divided by count of values n.',
    keyTakeaway: 'SAT Secret Weapon: When doing average problems, focus on SUM! Sum = (Average) × (Number of items).',
    officialReference: false,
    visualizationType: 'mean-average',
    diagramLabels: [
      { symbol: 'Sum = Mean × n', label: 'Total sum equal to average times quantity' }
    ],
    practiceQuestions: [
      {
        stem: 'A student scored 82, 88, 91, and 79 on four exams. What score must the student receive on the fifth exam to achieve an overall mean score of 86?',
        options: [
          { label: 'A', text: '86' },
          { label: 'B', text: '88' },
          { label: 'C', text: '90' },
          { label: 'D', text: '92' }
        ],
        correctAnswer: 'C',
        explanation: 'Required Total Sum for 5 exams = 5 × 86 = 430. Current Sum = 82 + 88 + 91 + 79 = 340. Required 5th score = 430 - 340 = 90.',
        tip: 'Always find the target sum first: 5 × 86 = 430.'
      },
      {
        stem: 'The mean of 6 numbers is 14. If a seventh number, 28, is added to the set, what is the new mean of the 7 numbers?',
        options: [
          { label: 'A', text: '14' },
          { label: 'B', text: '16' },
          { label: 'C', text: '18' },
          { label: 'D', text: '21' }
        ],
        correctAnswer: 'B',
        explanation: 'Original sum = 6 × 14 = 84. New sum = 84 + 28 = 112. New mean = 112 / 7 = 16.',
        tip: 'Calculate total sum 84, add 28 to get 112, divide by 7.'
      },
      {
        stem: 'In a group of 20 boys and 10 girls, the boys scored an average of 80 and the girls scored an average of 92. What was the average score for the whole group?',
        options: [
          { label: 'A', text: '84' },
          { label: 'B', text: '85' },
          { label: 'C', text: '86' },
          { label: 'D', text: '88' }
        ],
        correctAnswer: 'A',
        explanation: 'Total sum = 20(80) + 10(92) = 1600 + 920 = 2520. Total students = 30. Weighted average = 2520 / 30 = 84.',
        tip: 'Use weighted sum, do not take average of 80 and 92 (which is 86).'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-standard-deviation',
    name: 'Standard Deviation & Spread',
    category: 'statistics',
    subcategory: 'Data Spread',
    latex: '\\sigma = \\sqrt{\\frac{\\sum (x - \\bar{x})^2}{n}}',
    description: 'Quantifies how spread out values are around the arithmetic mean.',
    keyTakeaway: 'The SAT does NOT require calculating σ by hand! You only need to know: more spread out from center = greater σ. Adding a constant to all data DOES NOT change σ.',
    officialReference: false,
    visualizationType: 'standard-deviation',
    diagramLabels: [
      { symbol: 'σ (Spread)', label: 'Greater spread away from mean = larger σ' }
    ],
    practiceQuestions: [
      {
        stem: 'Dataset X consists of 50 values with a mean of 40 and standard deviation of 6. If 10 is added to every value in Dataset X to create Dataset Y, what are the mean and standard deviation of Dataset Y?',
        options: [
          { label: 'A', text: 'Mean 40, Standard Deviation 6' },
          { label: 'B', text: 'Mean 50, Standard Deviation 16' },
          { label: 'C', text: 'Mean 50, Standard Deviation 6' },
          { label: 'D', text: 'Mean 40, Standard Deviation 16' }
        ],
        correctAnswer: 'C',
        explanation: 'Adding a constant shifts all data points together. The mean increases by 10 (40 + 10 = 50), but the spread between values remains unchanged, so standard deviation remains 6.',
        tip: 'Golden SAT Rule: Adding or subtracting a constant shifts the mean but leaves standard deviation completely unchanged.'
      },
      {
        stem: 'Dataset A has values clustered between 48 and 52 with mean 50. Dataset B has values spread between 20 and 80 with mean 50. Which dataset has the greater standard deviation?',
        options: [
          { label: 'A', text: 'Dataset A' },
          { label: 'B', text: 'Dataset B' },
          { label: 'C', text: 'Both datasets have the same standard deviation' },
          { label: 'D', text: 'Cannot be determined' }
        ],
        correctAnswer: 'B',
        explanation: 'Standard deviation measures spread around the mean. Dataset B has much greater variability and distance from the mean, so its standard deviation is greater.',
        tip: 'More spread out data = greater standard deviation.'
      },
      {
        stem: 'Every number in a dataset is multiplied by 3. If the original standard deviation was 4, what is the new standard deviation?',
        options: [
          { label: 'A', text: '4' },
          { label: 'B', text: '7' },
          { label: 'C', text: '12' },
          { label: 'D', text: '36' }
        ],
        correctAnswer: 'C',
        explanation: 'Multiplying all numbers by a factor c multiplies the standard deviation by |c|: 4 × 3 = 12.',
        tip: 'Multiplication scales both the mean and the standard deviation.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  },
  {
    id: 'f-probability',
    name: 'Probability of an Event',
    category: 'statistics',
    subcategory: 'Probability',
    latex: 'P(E) = \\frac{\\text{Favorable Outcomes}}{\\text{Total Possible Outcomes}}',
    description: 'Likelihood of an event occurring, bounded strictly between 0 (impossible) and 1 (certain).',
    keyTakeaway: 'For conditional probability ("Given that..."), restrict the total denominator ONLY to the given group condition.',
    officialReference: false,
    visualizationType: 'probability',
    diagramLabels: [
      { symbol: 'P(E)', label: 'Favorable count divided by total sample space' }
    ],
    practiceQuestions: [
      {
        stem: 'A jar contains 8 red marbles, 12 blue marbles, and 5 green marbles. If one marble is selected at random, what is the probability that the marble selected is blue?',
        options: [
          { label: 'A', text: '0.32' },
          { label: 'B', text: '0.48' },
          { label: 'C', text: '0.50' },
          { label: 'D', text: '0.60' }
        ],
        correctAnswer: 'B',
        explanation: 'Total marbles = 8 + 12 + 5 = 25. Favorable (blue) = 12. P(blue) = 12 / 25 = 48 / 100 = 0.48.',
        tip: 'Multiply numerator and denominator by 4 to convert /25 directly to decimal percentage: 12 × 4 = 48 ⟹ 0.48.'
      },
      {
        stem: 'A box contains 4 red cards, 6 green cards, and 10 yellow cards. If one card is drawn at random, what is the probability that the card is NOT red?',
        options: [
          { label: 'A', text: '1/5' },
          { label: 'B', text: '3/10' },
          { label: 'C', text: '4/5' },
          { label: 'D', text: '5/6' }
        ],
        correctAnswer: 'C',
        explanation: 'Total cards = 4 + 6 + 10 = 20. Non-red cards = 6 + 10 = 16. P(not red) = 16 / 20 = 4 / 5.',
        tip: 'P(not red) = 1 - P(red) = 1 - (4/20) = 16/20 = 4/5.'
      },
      {
        stem: 'In a group of 30 students, 18 are juniors (12 taking art, 6 taking music) and 12 are seniors (4 taking art, 8 taking music). Given that a randomly selected student is a junior, what is the probability that the student is taking art?',
        options: [
          { label: 'A', text: '12/30' },
          { label: 'B', text: '12/18' },
          { label: 'C', text: '18/30' },
          { label: 'D', text: '16/30' }
        ],
        correctAnswer: 'B',
        explanation: 'Condition is "Given that the student is a junior". Restrict total denominator to 18 juniors. Favorable is 12 art students among juniors. Probability = 12/18 = 2/3.',
        tip: '"Given that..." shrinks the denominator sample space to that specific group only.'
      }
    ],
    get practiceQuestion() { return this.practiceQuestions[0]; }
  }
];

export interface GrammarRule {
  title: string;
  rule: string;
  example: string;
}

export const SAT_GRAMMAR_RULES: GrammarRule[] = [
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

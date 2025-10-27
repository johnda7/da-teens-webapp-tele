const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RealWorldScenario.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Button compact styling (py-4 → py-3, leading-relaxed → leading-tight)
content = content.replace(
  /className="w-full h-auto py-4 px-4 text-left justify-start hover:border-purple-400 hover:bg-purple-50 transition-all"/g,
  'className="w-full h-auto py-3 px-4 text-left justify-start hover:border-[#007AFF] hover:bg-blue-50 transition-all duration-300"'
);

content = content.replace(
  /<span className="text-sm leading-relaxed">/g,
  '<span className="text-sm leading-tight">'
);

// Fix 2: Button number badge (purple → blue)
content = content.replace(
  /className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex-shrink-0"/g,
  'className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[#007AFF] font-semibold flex-shrink-0"'
);

// Fix 3: Path icon (purple → blue)
content = content.replace(
  /className="w-5 h-5 text-purple-600" weight="fill"/g,
  'className="w-5 h-5 text-[#007AFF]" weight="fill"'
);

// Fix 4: Header gradient (indigo/purple → blue/cyan)
content = content.replace(
  /className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"/g,
  'className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"'
);

// Fix 5: Skills card (purple → blue)
content = content.replace(
  /className="bg-purple-50 border-purple-200"/g,
  'className="bg-blue-50 border-blue-200"'
);

content = content.replace(
  /className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" weight="fill"/g,
  'className="w-5 h-5 text-[#007AFF] flex-shrink-0 mt-0.5" weight="fill"'
);

content = content.replace(
  /className="font-semibold text-purple-900 mb-2"/g,
  'className="font-semibold text-blue-900 mb-2"'
);

content = content.replace(
  /className="bg-purple-100 text-purple-700"/g,
  'className="bg-blue-100 text-[#007AFF]"'
);

// Fix 6: Continue button (gradient → solid blue)
content = content.replace(
  /className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"/g,
  'className="w-full bg-[#007AFF] hover:bg-[#0051D5] transition-colors duration-300"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ RealWorldScenario.tsx fixed: compact buttons, blue colors, 300ms transitions');

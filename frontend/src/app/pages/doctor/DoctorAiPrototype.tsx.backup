import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Edit2, 
  ArrowRight, 
  Brain, 
  ShieldCheck, 
  Stethoscope,
  Sparkles,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  List,
  AlertTriangle,
  Type,
  Check,
  RefreshCw,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Mock Data ---

interface Document {
  id: string;
  patientName: string;
  mrn: string;
  type: string;
  date: string;
  content: string;
  history: HistoryEntry[];
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  details?: string;
}

interface CodeSuggestion {
  id: string;
  code: string;
  description: string;
  confidence: number;
  status: 'suggested' | 'confirmed' | 'removed';
  reason: string;
  isEditing?: boolean;
}

interface CodeGroup {
  id: string;
  title: string;
  suggestions: CodeSuggestion[];
  isOpen: boolean;
}

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  range: [number, number]; 
  suggestion?: string;
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    patientName: 'Sarah Jenkins',
    mrn: 'MRN-88231',
    type: 'H&P Assessment',
    date: 'Oct 12, 2024',
    content: `CHIEF COMPLAINT: Persistent headaches.

HISTORY OF PRESENT ILLNESS:
Ms. Jenkins is a 42-year-old female who presents today with a 3-week history of bilateral frontal headaches. Pain is 6/10. ECG performed showing STEMI of inferior wall.`,
    history: [
        { id: 'h1', timestamp: '10:15 AM', author: 'Dr. Smith', action: 'Created draft' }
    ]
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    mrn: 'MRN-99102',
    type: 'Progress Note',
    date: 'Oct 12, 2024',
    content: `S: Patient reports pain is improving.
O: Incision clean.
A: Recovery well.
P: Follow up.`,
    history: [
        { id: 'h1', timestamp: '09:00 AM', author: 'Dr. Smith', action: 'Created note' }
    ]
  }
];

// --- Helper Functions ---

const getConfidenceColor = (score: number) => {
  if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
  if (score >= 75) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
};

const getSmartSuggestion = (text: string): string | null => {
    const lastWord = text.split(/\s+/).pop()?.toLowerCase();
    if (!lastWord) return null;
    
    const suggestions: Record<string, string> = {
        'head': 'headaches associated with photophobia',
        'bilat': 'bilateral frontal region',
        'hyper': 'hypertension, benign essential',
        'diab': 'diabetes mellitus type 2 without complications',
        'sob': 'shortness of breath on exertion',
        'nkda': 'no known drug allergies',
        'wml': 'well-nourished, well-developed male',
        'ecg': 'electrocardiogram showing normal sinus rhythm'
    };
    
    for (const [key, value] of Object.entries(suggestions)) {
        if (value.startsWith(lastWord) && value !== lastWord && value.length > lastWord.length) {
            return value.slice(lastWord.length);
        }
    }
    return null;
};

// Validation Logic
const validateInput = (text: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    const invalidCharsRegex = /[@#$%^*{}|~]/g;
    let match;
    while ((match = invalidCharsRegex.exec(text)) !== null) {
        issues.push({
            id: `char-${match.index}`,
            type: 'error',
            message: 'Unsupported character detected',
            range: [match.index, match.index + 1],
            suggestion: match[0] === '@' ? 'at' : '' 
        });
    }

    const mixedLangRegex = /([a-zA-Z])([\u0E00-\u0E7F])|([\u0E00-\u0E7F])([a-zA-Z])/g;
    while ((match = mixedLangRegex.exec(text)) !== null) {
        issues.push({
            id: `mixed-${match.index}`,
            type: 'warning',
            message: 'Mixed language without spacing',
            range: [match.index, match.index + 2],
            suggestion: text.slice(match.index, match.index + 1) + ' ' + text.slice(match.index + 1, match.index + 2)
        });
    }

    return issues;
};

// Mock grouped code generation
const generateCodeGroups = (text: string): CodeGroup[] => {
    const groups: CodeGroup[] = [];
    const lower = text.toLowerCase();

    // 1. Primary Diagnosis
    if (lower.includes('stemi') || lower.includes('infarction')) {
        groups.push({
            id: 'g1',
            title: 'Condition 1: Primary Diagnosis',
            isOpen: true,
            suggestions: [
                {
                    id: 'c1',
                    code: 'I21.9',
                    description: 'Acute myocardial infarction, unspecified',
                    confidence: 92,
                    status: 'suggested',
                    reason: 'Suggested based on "infarction" keyword'
                },
                {
                    id: 'c2',
                    code: 'I21.3',
                    description: 'STEMI of inferior wall',
                    confidence: 87,
                    status: 'suggested',
                    reason: 'High correlation with "STEMI of inferior wall" in HPI'
                }
            ]
        });
    } else if (lower.includes('headache')) {
         groups.push({
            id: 'g1',
            title: 'Condition 1: Primary Diagnosis',
            isOpen: true,
            suggestions: [
                {
                    id: 'c1',
                    code: 'R51.9',
                    description: 'Headache, unspecified',
                    confidence: 95,
                    status: 'suggested',
                    reason: 'Direct match with "headache"'
                },
                {
                    id: 'c2',
                    code: 'G44.209',
                    description: 'Tension-type headache, unspecified',
                    confidence: 65,
                    status: 'suggested',
                    reason: 'Possible match based on "bilateral frontal" description'
                }
            ]
        });
    }

    // 2. Secondary Diagnosis / Comorbidities
    if (lower.includes('pain') || lower.includes('hypertension')) {
        const secondary: CodeSuggestion[] = [];
        if (lower.includes('pain')) {
             secondary.push({
                id: 'c3',
                code: 'R07.9',
                description: 'Chest pain, unspecified',
                confidence: 85,
                status: 'suggested',
                reason: 'Patient reported pain level 6/10'
            });
        }
        if (lower.includes('hypertension')) {
            secondary.push({
                id: 'c4',
                code: 'I10',
                description: 'Essential (primary) hypertension',
                confidence: 72,
                status: 'suggested',
                reason: 'Mentioned in history'
            });
        }
        if (secondary.length > 0) {
            groups.push({
                id: 'g2',
                title: 'Condition 2: Secondary Diagnosis / Comorbidities',
                isOpen: true,
                suggestions: secondary
            });
        }
    }

    // 3. Procedures
    if (lower.includes('ecg') || lower.includes('electrocardiogram')) {
        groups.push({
            id: 'g3',
            title: 'Condition 3: Procedures',
            isOpen: true,
            suggestions: [
                {
                    id: 'c5',
                    code: '93000',
                    description: 'Electrocardiogram, routine ECG',
                    confidence: 90,
                    status: 'suggested',
                    reason: 'Procedure "ECG" detected in text'
                }
            ]
        });
    }

    return groups;
};

export const DoctorAiPrototype = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>(MOCK_DOCUMENTS[0].id);
  const [activeDoc, setActiveDoc] = useState<Document>(MOCK_DOCUMENTS[0]);
  const [editorContent, setEditorContent] = useState(activeDoc.content);
  const [aiTextSuggestions, setAiTextSuggestions] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState<string | null>(null);
  
  // Dynamic AI State
  const [codeGroups, setCodeGroups] = useState<CodeGroup[]>([]);

  // Validation State
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [inputStatus, setInputStatus] = useState<'safe' | 'warning' | 'error'>('safe');
  
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load Doc
  useEffect(() => {
    const doc = MOCK_DOCUMENTS.find(d => d.id === selectedDocId) || MOCK_DOCUMENTS[0];
    setActiveDoc(doc);
    setEditorContent(doc.content);
  }, [selectedDocId]);

  // AI Simulation & Validation Effect
  useEffect(() => {
    // 1. Text Suggestions
    if (aiTextSuggestions) {
        setCurrentSuggestion(getSmartSuggestion(editorContent));
    } else {
        setCurrentSuggestion(null);
    }

    // 2. Generate Code Groups
    const generatedGroups = generateCodeGroups(editorContent);
    setCodeGroups(prev => {
        return generatedGroups.map(newGroup => {
            const existingGroup = prev.find(p => p.id === newGroup.id);
            if (!existingGroup) return newGroup;

            const mergedSuggestions = newGroup.suggestions.map(newCode => {
                const existingCode = existingGroup.suggestions.find(c => c.id === newCode.id);
                return existingCode ? { 
                    ...newCode, 
                    status: existingCode.status, 
                    isEditing: existingCode.isEditing 
                } : newCode;
            });

            return {
                ...newGroup,
                isOpen: existingGroup.isOpen,
                suggestions: mergedSuggestions
            };
        });
    });

    // 3. Validation Logic
    const issues = validateInput(editorContent);
    setValidationIssues(issues);
    
    if (issues.some(i => i.type === 'error')) {
        setInputStatus('error');
    } else if (issues.some(i => i.type === 'warning')) {
        setInputStatus('warning');
    } else {
        setInputStatus('safe');
    }

  }, [editorContent, aiTextSuggestions]);

  // Scroll Sync
  const handleScroll = () => {
      if (textareaRef.current && backdropRef.current) {
          backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && currentSuggestion && aiTextSuggestions) {
          e.preventDefault();
          setEditorContent(prev => prev + currentSuggestion);
          toast.success("AI suggestion accepted");
      }
  };

  // Render Highlighted Text for Backdrop
  const renderHighlights = () => {
      let lastIndex = 0;
      const fragments = [];
      const sortedIssues = [...validationIssues].sort((a, b) => a.range[0] - b.range[0]);

      sortedIssues.forEach((issue) => {
          if (issue.range[0] >= lastIndex) {
              fragments.push(editorContent.slice(lastIndex, issue.range[0]));
              const issueText = editorContent.slice(issue.range[0], issue.range[1]);
              fragments.push(
                  <span 
                    key={issue.id} 
                    className={clsx(
                        "relative inline-block border-b-2",
                        issue.type === 'error' ? "border-red-500 bg-red-500/20" : "border-amber-500 bg-amber-500/20"
                    )}
                  >
                      {issueText}
                  </span>
              );
              lastIndex = issue.range[1];
          }
      });
      fragments.push(editorContent.slice(lastIndex));
      return fragments;
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 animate-fade-in font-sans">
      
      {/* CENTER: Editor & Intelligence */}
      <div className="flex-1 flex gap-4 min-w-0">
        
        {/* Editor Pane (65%) */}
        <div className="flex-[2] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative group">
           {/* Ambient Glow */}
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

           {/* Toolbar */}
           <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setAiTextSuggestions(!aiTextSuggestions)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm",
                        aiTextSuggestions 
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]" 
                            : "bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600"
                    )}
                 >
                    <Sparkles size={12} className={aiTextSuggestions ? "fill-current" : ""} />
                    AI Autocomplete
                 </button>
                 
                 <div className="h-4 w-px bg-slate-800" />

                 <div className="flex items-center gap-2">
                    {inputStatus === 'safe' && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={10} /> Clinical Safety Checks Passed</span>}
                    {inputStatus === 'warning' && <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1"><AlertTriangle size={10} /> Formatting Checks</span>}
                    {inputStatus === 'error' && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><X size={10} /> Safety Blocker</span>}
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700/50">
                    <User size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">{activeDoc.patientName}</span>
                 </div>
              </div>
           </div>

           {/* Editor Area */}
           <div className="flex-1 relative overflow-hidden bg-slate-900">
                {/* Backdrop for Highlights */}
                <div 
                    ref={backdropRef}
                    className="absolute inset-0 p-8 text-lg leading-relaxed font-mono whitespace-pre-wrap break-words overflow-y-auto pointer-events-none text-transparent z-0 scrollbar-thin scrollbar-thumb-slate-700"
                    aria-hidden="true"
                >
                    {renderHighlights()}
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    className="absolute inset-0 w-full h-full p-8 resize-none border-none outline-none text-slate-300 text-lg leading-relaxed font-mono bg-transparent z-10 focus:ring-0 placeholder-slate-600 scrollbar-thin scrollbar-thumb-slate-700"
                    placeholder="Start typing clinical notes..."
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    spellCheck={false}
                />
                
                {/* Inline Suggestion Overlay */}
                {aiTextSuggestions && currentSuggestion && (
                        <div className="absolute top-8 left-8 pointer-events-none whitespace-pre-wrap font-mono text-lg leading-relaxed text-transparent z-20 pl-0.5 pt-0.5">
                        {editorContent}
                        <span className="text-teal-500/70 bg-teal-500/10 rounded px-1 -ml-1 border-b border-teal-500/30 inline-flex items-center shadow-[0_0_10px_rgba(20,184,166,0.1)] backdrop-blur-sm">
                            {currentSuggestion}
                            <span className="ml-2 text-[8px] bg-teal-900 text-teal-300 px-1 py-0.5 rounded border border-teal-700 not-italic font-sans font-bold tracking-wide no-underline">TAB</span>
                        </span>
                    </div>
                )}
           </div>

           {/* Footer */}
           <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
               <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5">
                       <Activity size={12} className="text-teal-500" />
                       <span>NLP Engine Active</span>
                   </div>
                   <span>•</span>
                   <span>{editorContent.length} chars</span>
               </div>
               <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                   <Maximize2 size={12} /> Expand
               </button>
           </div>
        </div>

        {/* Intelligence Panel (35%) */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white tracking-wide">
                    <Brain size={18} className="text-teal-400" />
                    <span>Real-time Intelligence</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                <AnimatePresence>
                    {codeGroups.length > 0 ? (
                        codeGroups.map((group, groupIdx) => (
                            <motion.div 
                                key={group.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: groupIdx * 0.1 }}
                                className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
                            >
                                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700/50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{group.title}</span>
                                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">{group.suggestions.length}</span>
                                </div>
                                
                                <div className="divide-y divide-slate-700/30">
                                    {group.suggestions.map((code) => (
                                        <motion.div 
                                            layout
                                            key={code.id}
                                            className="p-4 hover:bg-slate-700/20 transition-colors group relative"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-teal-400 font-bold text-sm bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 shadow-[0_0_8px_rgba(20,184,166,0.1)]">
                                                        {code.code}
                                                    </span>
                                                </div>
                                                <div className={clsx(
                                                    "text-[10px] px-1.5 py-0.5 rounded border font-bold",
                                                    getConfidenceColor(code.confidence)
                                                )}>
                                                    {code.confidence}%
                                                </div>
                                            </div>
                                            
                                            <p className="text-slate-300 text-sm font-medium mb-1">{code.description}</p>
                                            <p className="text-slate-500 text-xs italic flex items-center gap-1">
                                                <Zap size={10} className="text-amber-400" />
                                                {code.reason}
                                            </p>
                                            
                                            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors" title="Edit">
                                                    <Edit2 size={12} />
                                                </button>
                                                <button className="p-1.5 bg-teal-600 hover:bg-teal-500 rounded text-white shadow-lg shadow-teal-900/50 transition-colors" title="Confirm">
                                                    <Check size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center opacity-50">
                             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                <Sparkles size={24} className="text-slate-600" />
                             </div>
                             <p className="text-sm font-medium">Listening for clinical data...</p>
                             <p className="text-xs mt-2">Start typing to activate NLP analysis</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Action Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2 group">
                    <span>Submit to Billing</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

      </div>
      
    </div>
  );
};

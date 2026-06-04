import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Info, 
  Award, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Unlock,
  Trash2
} from 'lucide-react';

// Kategorierna med färgkoder och ikoner
const CATEGORIES = {
  Djur: { name: "Djur & natur", icon: "🐻", color: "bg-amber-100 text-amber-800 border-amber-200" },
  Historia: { name: "Historia", icon: "🏚", color: "bg-blue-100 text-blue-800 border-blue-200" },
  Samhalle: { name: "Samhälle", icon: "⚒", color: "bg-stone-100 text-stone-800 border-stone-200" },
  Intervju: { name: "Intervju", icon: "🎤", color: "bg-purple-100 text-purple-800 border-purple-200" },
  Resonemang: { name: "Resonemang (Super)", icon: "🧠", color: "bg-red-100 text-red-800 border-red-200" }
};

// Det pedagogiska Skansenjakt-formuläret
const SKANSEN_FORM = {
  title: "Skansenjakten 🦊🌲",
  description: "Jobba i par eller liten grupp. Ni får göra uppdragen i precis vilken ordning ni vill för att undvika trängsel! Målet är att samla ihop minst 20 poäng. För att klara jakten måste ni göra minst ett uppdrag från varje kategori.",
  questions: [
    {
      id: "q1",
      category: "Djur",
      type: "paragraph",
      title: "🐻 Uppdrag 1: Rovdjursjakten (3p)",
      description: "Hitta ett nordiskt rovdjur. Svara på följande tre frågor: \n1) Vad heter djuret? (1p) \n2) Vad äter det? (2p) \n3) Hur tror ni att människor förr i tiden påverkades av att leva nära detta djur? (3p)",
      points: 3,
      required: true
    },
    {
      id: "q2",
      category: "Djur",
      type: "paragraph",
      title: "🐻 Uppdrag 2: Djurspaning (2p)",
      description: "Hitta ett djur som verkar vila. \n1) Hur ser ni det (beteende/kroppsspråk)? \n2) Tror ni djur på Skansen beter sig annorlunda än vilda djur gör i naturen?",
      points: 2,
      required: false
    },
    {
      id: "q3",
      category: "Historia",
      type: "paragraph",
      title: "🏚 Uppdrag 3: Det gamla huset (3p)",
      description: "Hitta och besök ett historiskt bostadshus. Svara på: \n1) Vad verkar huset ha använts till? (1p) \n2) Nämn en sak i eller utanför huset som verkar ha varit mycket jobbigare förr än idag. (2p) \n3) Vad har blivit bättre i våra hem idag? (3p)",
      points: 3,
      required: true
    },
    {
      id: "q4",
      category: "Historia",
      type: "paragraph",
      title: "🏚 Uppdrag 4: Tidsmaskinen (2p)",
      description: "Gå in i en historisk miljö. \n1) Hitta ett föremål som inte längre används i moderna hem idag. Vad är det? \n2) Förklara vad vi använder istället för det föremålet i nutiden.",
      points: 2,
      required: false
    },
    {
      id: "q5",
      category: "Samhalle",
      type: "paragraph",
      title: "⚒ Uppdrag 5: Det gamla yrket (3p)",
      description: "Hitta en gammal arbetsplats (t.ex. smedja, bageri, gård, skomakeri). \n1) Vilket problem i samhället löste detta yrke förr? (1p) \n2) Finns det här jobbet kvar på samma sätt idag? (2p) \n3) Hur har tekniken förändrat hur vi gör samma arbete idag? (3p)",
      points: 3,
      required: true
    },
    {
      id: "q6",
      category: "Samhalle",
      type: "paragraph",
      title: "⚒ Uppdrag 6: Handelsboden (2p)",
      description: "Hitta en handelsmiljö, butik, bod eller plats där man kan se hur människor förr köpte, sålde eller förvarade varor. \n1) Vad kan ni se att människor handlade eller förvarade där? \n2) Vad verkar svårare jämfört med att handla mat eller saker idag?",
      points: 2,
      required: false
    },
    {
      id: "q7",
      category: "Intervju",
      type: "paragraph",
      title: "🎤 Uppdrag 7: Våga fråga personalen (2p)",
      description: "Hitta en av Skansens guider eller djurvårdare. Gå fram, hälsa artigt och fråga: ”Vad brukar människor bli mest förvånade över här på Skansen?” Skriv ner deras svar här!",
      points: 2,
      required: true
    },
    {
      id: "q8",
      category: "Intervju",
      type: "paragraph",
      title: "🎤 Uppdrag 8: Spörsmål i stugan (2p)",
      description: "Fråga en person i tidsenliga kläder i något av husen: ”Hur såg en vanlig dag ut för ett barn i er ålder som bodde här förr?” Sammanfatta svaret.",
      points: 2,
      required: false
    },
    {
      id: "q9",
      category: "Resonemang",
      type: "paragraph",
      title: "🧠 Uppdrag 9: Superuppdraget (3p)",
      description: "Hitta något på Skansen som tydligt visar att vårt samhälle har förändrats (t.ex. transportsätt, verktyg, skola, bostad). Förklara: \n1) Hur såg det ut förr? \n2) Hur gör vi idag? \n3) Varför tror ni att det förändrades?",
      points: 3,
      required: true
    },
    {
      id: "q10",
      category: "Resonemang",
      type: "paragraph",
      title: "🧠 Uppdrag 10: Skansens syfte (2p)",
      description: "Varför tror ni att Skansen skapades en gång i tiden? Varför är det viktigt att vi har kvar sådana här platser även i framtiden?",
      points: 2,
      required: false
    }
  ]
};

export default function App() {
  // Läs in lagrat tillstånd vid start så att eleverna inte tappar framsteg
  const [groupName, setGroupName] = useState(() => {
    return localStorage.getItem('skansen_group_name') || "";
  });
  
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('skansen_answers');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('skansen_submitted') === 'true';
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [modalError, setModalError] = useState(null);
  
  // Tillstånd för att rensa ett enskilt svar
  const [clearingQuestionId, setClearingQuestionId] = useState(null);

  // Spara löpande i localStorage för stabilitet
  useEffect(() => {
    localStorage.setItem('skansen_group_name', groupName);
  }, [groupName]);

  useEffect(() => {
    localStorage.setItem('skansen_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('skansen_submitted', String(isSubmitted));
  }, [isSubmitted]);

  // Visa tillfällig toast
  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hantera textändring för ett uppdrag
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  // Bekräfta och rensa ett enskilt svar (Uppdaterar direkt poängmätaren)
  const confirmClearAnswer = () => {
    if (!clearingQuestionId) return;
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[clearingQuestionId];
      return updated;
    });
    setClearingQuestionId(null);
    triggerToast("Svaret har rensats.");
  };

  // Kolla vilka kategorier som har besvarats
  const getCompletedCategories = () => {
    const completed = { Djur: false, Historia: false, Samhalle: false, Intervju: false, Resonemang: false };
    SKANSEN_FORM.questions.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.trim() !== '') {
        completed[q.category] = true;
      }
    });
    return completed;
  };

  const completedCategories = getCompletedCategories();
  const allCategoriesMet = Object.values(completedCategories).every(val => val === true);

  // Räkna ut preliminära poäng
  const calculatePoints = () => {
    let score = 0;
    SKANSEN_FORM.questions.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.trim() !== '') {
        score += Number(q.points || 0);
      }
    });
    return score;
  };

  const currentPoints = calculatePoints();
  const maxPoints = SKANSEN_FORM.questions.reduce((sum, q) => sum + Number(q.points || 0), 0);

  // Skicka in (Lås appen och visa lärarskärmen)
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // 1. Gruppnamn krävs
    if (!groupName.trim()) {
      errors.groupName = "Ni måste fylla i ert gruppnamn / era namn först!";
    }

    // 2. Obligatoriska uppdrag krävs
    SKANSEN_FORM.questions.forEach(q => {
      if (q.required) {
        const ans = answers[q.id];
        if (!ans || ans.trim() === '') {
          errors[q.id] = "Det här uppdraget måste ni svara på!";
        }
      }
    });

    // Kontrollera vanliga valideringsfel först (som gruppnamn och obligatoriska frågor)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scrolla till första felmeddelandet
      const firstErrorId = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorId === 'groupName' ? 'group-name-box' : `card-${firstErrorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Kontrollera kategorikravet ("minst ett uppdrag från varje kategori") först efter att de obligatoriska fälten är ifyllda
    if (!allCategoriesMet) {
      setModalError("Ni har inte gjort något uppdrag från alla 5 kategorier än! Kolla i spårningspanelen högst upp vilka symboler som är mörka och leta upp ett sådant uppdrag.");
      return;
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast("Jakten sparad! Visa skärmen för din lärare.");
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-stone-800 font-sans pb-16 px-4 animate-fadeIn">
      
      {/* Toast-notifikation */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-stone-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 className="text-emerald-400" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal för enskild svarsrensning */}
      {clearingQuestionId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-stone-900">Rensa detta svar?</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Vill ni rensa bara detta svar? Detta kommer att tömma texten för detta specifika uppdrag.
            </p>
            <div className="flex gap-3 text-xs sm:text-sm pt-2">
              <button
                type="button"
                onClick={confirmClearAnswer}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all"
              >
                Ja, rensa
              </button>
              <button
                type="button"
                onClick={() => setClearingQuestionId(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal för kategori-kravsfel */}
      {modalError && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <AlertTriangle className="text-amber-500 mx-auto mb-3 animate-pulse" size={40} />
            <h4 className="text-lg font-bold text-stone-900">Kategorikrav ej uppfyllt</h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">{modalError}</p>
            <button
              onClick={() => setModalError(null)}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all"
            >
              Okej, vi letar vidare!
            </button>
          </div>
        </div>
      )}

      <header className="max-w-xl mx-auto pt-6 pb-4 flex items-center justify-between border-b border-emerald-100 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="font-black text-base text-stone-900 leading-none">Skansenjakten</h1>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
              SO: historia, samhälle och människans livsvillkor
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto space-y-4">
        
        {isSubmitted ? (
          /* ======================================= */
          /* 1. GRANSKNINGSLÄGE (Visa för läraren)   */
          /* ======================================= */
          <div className="space-y-4">
            
            {/* Välkomst- / Granskningskort */}
            <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl text-center space-y-4 border border-emerald-950">
              <div className="w-14 h-14 bg-emerald-800 text-yellow-300 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <Award size={32} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Skansenjakten slutförd</span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">Snyggt jobbat, {groupName}!</h2>
              </div>

              <div className="bg-emerald-950/80 rounded-2xl p-4 max-w-xs mx-auto border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">Ert resultat</div>
                <div className="text-3xl font-black text-yellow-300 mt-1">{currentPoints} / {maxPoints} p</div>
              </div>

              <div className="text-xs text-emerald-100 font-medium bg-emerald-950/40 p-3 rounded-xl max-w-md mx-auto space-y-1">
                <p>📢 <strong>Visa denna sida för din lärare vid dagens slut.</strong></p>
                <p className="text-[10px] text-emerald-200">Läraren kommer ögna igenom era svar nedan och registrera ert resultat i sitt eget block.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-1 text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-2 rounded-xl transition-all font-semibold shadow-sm"
              >
                <Unlock size={12} />
                Lås upp och ändra svar
              </button>
            </div>

            {/* Sammanställning av alla svar för läraren */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-stone-900 text-base border-b border-stone-100 pb-2">
                Elevsvar: {groupName}
              </h3>

              <div className="space-y-4">
                {SKANSEN_FORM.questions.map((q, idx) => {
                  const ans = answers[q.id];
                  return (
                    <div key={q.id} className="text-xs space-y-1">
                      <div className="flex justify-between font-bold text-stone-500">
                        <span>Uppdrag {idx + 1} ({CATEGORIES[q.category]?.icon} {q.category})</span>
                        <span className="text-stone-700 font-extrabold">
                          {ans && ans.trim() !== "" ? `+${q.points}p` : "0p"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-stone-900">{q.title}</h4>
                      {ans && ans.trim() !== "" ? (
                        <p className="bg-stone-50 text-stone-700 p-2.5 rounded-lg border border-stone-100 font-medium leading-relaxed whitespace-pre-wrap">
                          {ans}
                        </p>
                      ) : (
                        <p className="text-stone-400 italic">Ej besvarat (valfritt uppdrag)</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* ======================================= */
          /* 2. LIVE-FORMULÄR (Fylls i av elever)     */
          /* ======================================= */
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            
            {/* LIVE KATEGORI- & POÄNGMÄTARE (Supermobil-optimerad) */}
            <div className="sticky top-2 sm:top-4 bg-stone-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl z-20 space-y-2 border border-stone-800">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">🏆</div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm">Poängjakt: Minst 20p</div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-300 flex items-center gap-1 font-semibold leading-tight">
                      <Info size={10} className="shrink-0 text-emerald-400" />
                      <span>Stavfel gör inget!</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-sm sm:text-base text-yellow-300">{currentPoints} / {maxPoints} p</span>
                </div>
              </div>

              {/* Tydligt meddelande om att poängen är preliminära */}
              <div className="text-[9px] sm:text-[10px] text-emerald-300 italic font-medium pt-1 border-t border-stone-800 leading-tight">
                ⚠️ Poängen är preliminära och kan justeras av läraren efter genomläsning.
              </div>

              {/* Spårningsikoner per kategori */}
              <div className="pt-1.5 border-t border-stone-800">
                <div className="text-[8px] sm:text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Krav: Minst ett svar per kategori ({Object.values(completedCategories).filter(Boolean).length}/5):
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(CATEGORIES).map(([key, cat]) => {
                    const isMet = completedCategories[key];
                    return (
                      <div 
                        key={key} 
                        className={`flex flex-col items-center p-1 sm:p-1.5 rounded-xl border text-center transition-all ${
                          isMet 
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
                            : 'bg-stone-950 border-stone-850 text-stone-600'
                        }`}
                        title={cat.name}
                      >
                        <span className="text-xs sm:text-sm">{cat.icon}</span>
                        <span className="text-[7px] sm:text-[9px] font-black uppercase mt-0.5 truncate w-full">{key}</span>
                        <div className="mt-0.5 flex items-center justify-center">
                          {isMet ? (
                            <Check size={8} className="text-emerald-400 stroke-[4]" />
                          ) : (
                            <div className="w-1 h-1 rounded-full bg-stone-700" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Info-kort om Skansenjakten */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-5 space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-stone-950">{SKANSEN_FORM.title}</h2>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap">{SKANSEN_FORM.description}</p>
            </div>

            {/* GRUPP-NAMN BOX */}
            <div 
              id="group-name-box"
              className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-5 space-y-2 transition-all ${
                validationErrors.groupName ? 'ring-2 ring-red-500 border-transparent bg-red-50/5' : 'border-stone-200'
              }`}
            >
              <label className="block text-stone-900 font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                <Users size={16} className="text-emerald-600 shrink-0" />
                Vilka är ni i gruppen? <span className="text-red-500">*</span>
              </label>
              <p className="text-[10px] sm:text-[11px] text-stone-500 leading-tight">Skriv lagnamn och era förnamn (t.ex. Lag Järven: Albin & Elsa, 6B)</p>
              <input
                type="text"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (validationErrors.groupName) {
                    setValidationErrors(prev => {
                      const copy = { ...prev };
                      delete copy.groupName;
                      return copy;
                    });
                  }
                }}
                className="w-full border-b-2 border-stone-200 focus:border-emerald-600 focus:outline-none pb-1 text-xs sm:text-sm font-semibold pt-1 bg-transparent"
                placeholder="Lagnamn: Namn1 & Namn2..."
              />
              {validationErrors.groupName && (
                <div className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} className="shrink-0" />
                  {validationErrors.groupName}
                </div>
              )}
            </div>

            {/* ALLA UPPDRAGSKORT */}
            {SKANSEN_FORM.questions.map((q, idx) => {
              const hasError = !!validationErrors[q.id];
              const answer = answers[q.id];
              const hasAnswer = answer && answer.trim() !== '';
              const catInfo = CATEGORIES[q.category] || { icon: "📝", name: "Allmänt", color: "bg-gray-100" };

              return (
                <div
                  key={q.id}
                  id={`card-${q.id}`}
                  className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-5 transition-all space-y-2.5 relative ${
                    hasError 
                      ? 'ring-2 ring-red-500 border-transparent bg-red-50/5' 
                      : hasAnswer 
                        ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-50/5' 
                        : 'border-stone-200'
                  }`}
                >
                  
                  {/* Uppdragstitel med poäng */}
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border ${catInfo.color}`}>
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.name}</span>
                    </span>
                    {q.points > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        hasAnswer ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        +{q.points} poäng
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-900 font-extrabold text-sm sm:text-base leading-snug">
                      {q.title}
                      {q.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>

                  {q.description && (
                    <p className="text-[11px] sm:text-xs text-stone-600 whitespace-pre-wrap leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      {q.description}
                    </p>
                  )}

                  {/* Liten pedagogisk hjälpruta vid varje uppdrag (Optimerad höjd) */}
                  <div className="bg-blue-50/80 border border-blue-100 p-2 sm:p-2.5 rounded-xl text-[10px] sm:text-xs text-blue-800 flex items-start gap-1 sm:gap-1.5 leading-snug">
                    <Info size={13} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>
                      <strong>För full poäng:</strong> skriv vad ni såg, beskriv det, och koppla till förr/idag/samhälle/natur.
                    </span>
                  </div>

                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full border border-stone-200 focus:border-emerald-600 rounded-xl p-2.5 sm:p-3 focus:outline-none text-xs sm:text-sm leading-relaxed bg-transparent"
                    placeholder="Svara och beskriv vad ni upptäckt här..."
                    rows={3}
                  />

                  {/* Rensa enskilt svar (Visas bara om det finns text inmatat) */}
                  {hasAnswer && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setClearingQuestionId(q.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                        Rensa detta svar
                      </button>
                    </div>
                  )}

                  {hasError && (
                    <div className="text-red-500 text-[11px] font-bold flex items-center gap-1 pt-1">
                      <AlertTriangle size={12} className="shrink-0" />
                      {validationErrors[q.id]}
                    </div>
                  )}

                </div>
              );
            })}

            {/* Inlämningsknapp */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg transition-all"
              >
                Lämna in svar (Slutför jakten) 🏁
              </button>
              {!allCategoriesMet && (
                <p className="text-center text-[10px] sm:text-xs font-bold text-amber-600 mt-2">
                  ⚠️ Ni måste besvara minst ett uppdrag från varje kategori innan ni kan spara och visa läraren.
                </p>
              )}
            </div>

          </form>
        )}

      </main>
    </div>
  );
}

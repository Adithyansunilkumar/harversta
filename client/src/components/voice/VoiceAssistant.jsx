import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Volume2 } from 'lucide-react';

const VoiceAssistant = ({ onProductData, isVisible, onClose }) => {
    const { t, i18n } = useTranslation();
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [step, setStep] = useState('IDLE');
    const [tempData, setTempData] = useState({});

    // Refs to avoid stale closures in event handlers
    const stepRef = useRef(step);
    const tempDataRef = useRef(tempData);
    const synthesisRef = useRef(window.speechSynthesis);
    const recognitionRef = useRef(null);

    // Sync refs with state
    useEffect(() => {
        stepRef.current = step;
    }, [step]);

    useEffect(() => {
        tempDataRef.current = tempData;
    }, [tempData]);

    // Helpers need to be refs or stable to be used in event handlers if we don't re-bind
    // But we can just define them in valid scope. 
    // The issue is handleSpeechResult is bound once. 

    const getLanguageCode = (lang) => {
        switch (lang) {
            case 'hi': return 'hi-IN';
            case 'ml': return 'ml-IN';
            case 'ta': return 'ta-IN';
            default: return 'en-US';
        }
    };

    const startListening = () => {
        if (recognitionRef.current && !listening) {
            try {
                recognitionRef.current.start();
            } catch {
                // Ignore if already started
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    const speak = (text) => {
        return new Promise((resolve) => {
            if (synthesisRef.current.speaking) synthesisRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = getLanguageCode(i18n.language);

            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => {
                setSpeaking(false);
                resolve();
            };
            utterance.onerror = () => {
                setSpeaking(false);
                resolve();
            };

            synthesisRef.current.speak(utterance);
        });
    };

    const speakAndListen = async (text) => {
        await speak(text);
        startListening();
    };

    // Input processing logic - uses Refs for current state
    const processInput = (text) => {
        const currentStep = stepRef.current;
        const currentData = tempDataRef.current; // Read from ref, update via state accumulator + ref logic if needed
        // For updates, we can use setTempData(prev => ...) which is safe.
        // But for reading 'currentData' for confirmation message, we need ref.

        const isAffirmative = (txt) => {
            const yesWords = ['yes', 'start', 'ok', 'ha', 'haan', 'ji', 'athe', 'uvvu', 'ama', 'am', 'sari', 'confirm', 'save'];
            return yesWords.some(word => txt.includes(word));
        };

        const isNegative = (txt) => {
            const noWords = ['no', 'stop', 'cancel', 'wait', 'illa', 'venda', 'nahin'];
            return noWords.some(word => txt.includes(word));
        };

        if (isNegative(text)) {
            speak(t('voicePrompt_cancel'));
            onClose();
            setStep('IDLE');
            setTempData({});
            return;
        }

        switch (currentStep) {
            case 'INTRO':
                if (isAffirmative(text)) {
                    setStep('NAME');
                } else {
                    speakAndListen(t('voicePrompt_error'));
                }
                break;
            case 'NAME':
                if (text.length > 1) {
                    setTempData(prev => ({ ...prev, cropName: text }));
                    setStep('QUANTITY');
                } else {
                    speakAndListen(t('voicePrompt_error'));
                }
                break;
            case 'QUANTITY': {
                const qty = text.match(/\d+/);
                if (qty) {
                    setTempData(prev => ({ ...prev, quantityKg: parseInt(qty[0]) }));
                    setStep('PRICE');
                } else {
                    speakAndListen(t('voicePrompt_error'));
                }
                break;
            }
            case 'PRICE': {
                const price = text.match(/\d+/);
                if (price) {
                    setTempData(prev => ({ ...prev, pricePerKg: parseInt(price[0]) }));
                    setStep('DATE');
                } else {
                    speakAndListen(t('voicePrompt_error'));
                }
                break;
            }
            case 'DATE': {
                let dateVal = new Date();
                if (text.includes('tomorrow') || text.includes('naale') || text.includes('kal')) {
                    dateVal.setDate(dateVal.getDate() + 1);
                }
                setTempData(prev => ({ ...prev, harvestDate: dateVal.toISOString().split('T')[0] }));
                setStep('LOCATION');
                break;
            }
            case 'LOCATION':
                if (text.length > 1) {
                    setTempData(prev => ({ ...prev, location: text }));
                    setStep('CONFIRM');
                } else {
                    speakAndListen(t('voicePrompt_error'));
                }
                break;
            case 'CONFIRM':
                if (isAffirmative(text)) {
                    setStep('SUCCESS');
                } else {
                    // Retry or Restart?
                    speak(t('voicePrompt_cancel')).then(() => {
                        setStep('IDLE');
                        setTempData({});
                        onClose();
                    });
                }
                break;
            default:
                break;
        }
    };

    const handleSpeechResult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim().toLowerCase();
        setTranscript(text);
        processInput(text);
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = getLanguageCode(i18n.language);

            recognitionRef.current.onstart = () => setListening(true);
            recognitionRef.current.onend = () => setListening(false);
            recognitionRef.current.onresult = handleSpeechResult;
            recognitionRef.current.onerror = (event) => {
                console.error("Voice error:", event.error);
                setListening(false);
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    // Use safe internal method or ignore
                    // Cannot call speakAndListen directly easily if it depends on scope
                    // But processInput handles logical errors. 
                    // System errors: assume silence/retry.
                }
            };
        }
    }, [i18n.language]);


    // Main Flow Control
    useEffect(() => {
        if (!isVisible) return;

        const runStep = async () => {
            // Provide a small delay to ensure previous steps settled
            await new Promise(r => setTimeout(r, 500));

            if (step === 'IDLE') {
                setStep('INTRO');
            } else if (step === 'INTRO') {
                await speakAndListen(t('voicePrompt_intro'));
            } else if (step === 'NAME') {
                await speakAndListen(t('voicePrompt_cropName'));
            } else if (step === 'QUANTITY') {
                await speakAndListen(t('voicePrompt_quantityKg'));
            } else if (step === 'PRICE') {
                await speakAndListen(t('voicePrompt_pricePerKg'));
            } else if (step === 'DATE') {
                await speakAndListen(t('voicePrompt_harvestDate'));
            } else if (step === 'LOCATION') {
                await speakAndListen(t('voicePrompt_location'));
            } else if (step === 'CONFIRM') {
                // Need current data from ref to ensure up to date
                const d = tempDataRef.current;
                const msg = t('voicePrompt_confirm')
                    .replace('{cropName}', d.cropName)
                    .replace('{quantity}', d.quantityKg)
                    .replace('{price}', d.pricePerKg)
                    .replace('{date}', d.harvestDate)
                    .replace('{location}', d.location);
                await speakAndListen(msg);
            } else if (step === 'SUCCESS') {
                await speak(t('voicePrompt_success'));
                if (onProductData) {
                    onProductData(tempDataRef.current);
                }
                setTimeout(() => {
                    onClose();
                    setStep('IDLE');
                    setTempData({});
                }, 2000);
            }
        };

        runStep();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, isVisible]); // We intentionally leave out helpers to avoid recreation loops

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
                    {listening ? <Mic size={40} /> : <Volume2 size={40} />}
                </div>

                <h3 className="text-xl font-bold mb-2 text-center text-gray-800">
                    {step === 'INTRO' ? t('startVoice') :
                        step === 'SUCCESS' ? t('productAdded') :
                            speaking ? t('processing') : t('listening')}
                </h3>

                <p className="text-center text-gray-500 mb-6 italic min-h-[1.5em] break-words w-full">
                    "{transcript || '...'}"
                </p>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                            width: `${step === 'INTRO' ? 10 :
                                    step === 'NAME' ? 25 :
                                        step === 'QUANTITY' ? 40 :
                                            step === 'PRICE' ? 55 :
                                                step === 'DATE' ? 70 :
                                                    step === 'LOCATION' ? 85 :
                                                        step === 'CONFIRM' ? 95 : 100
                                }%`
                        }}
                    />
                </div>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => {
                            stopListening();
                            onClose();
                            setStep('IDLE');
                        }}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistant;

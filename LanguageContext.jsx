import { createContext, useContext, useState } from 'react';
import { translations } from '../utils/i18n';

// Global Hindi translation fallback for dynamic/hardcoded strings
const hiTranslations = {
  // Results - Soil Quality & Home Remedies
  'Excellent conditions for high-yield agriculture.': 'उच्च उपज कृषि के लिए उत्कृष्ट स्थिति।',
  'Soil requires targeted amendments for optimal output.': 'इष्टतम उत्पादन के लिए मिट्टी में विशिष्ट सुधार की आवश्यकता है।',
  'Critical deficiencies detected. Immediate action needed.': 'गंभीर कमियां पाई गई हैं। तत्काल कार्रवाई की आवश्यकता है।',
  'Low Nitrogen: Add Nitrogen-rich fertilizers like Urea. Home Remedy: Mix coffee grounds, composted manure, or blood meal into the soil.': 'कम नाइट्रोजन: यूरिया जैसे उर्वरक डालें। घरेलू उपाय: मिट्टी में कॉफी के बीज, खाद या ब्लड मील मिलाएं।',
  'High Nitrogen: Reduce N-fertilizers; consider nitrogen-absorbing catch crops. Home Remedy: Add sawdust or wood chips to bind excess nitrogen.': 'अधिक नाइट्रोजन: नाइट्रोजन उर्वरक कम करें। घरेलू उपाय: अतिरिक्त नाइट्रोजन को बांधने के लिए लकड़ी का बुरादा डालें।',
  'Low Phosphorus: Add phosphorus-rich fertilizers like Bone Meal. Home Remedy: Bury banana peels or use homemade bone meal.': 'कम फास्फोरस: बोन मील जैसे फास्फोरस युक्त उर्वरक डालें। घरेलू उपाय: केले के छिलके गाड़ें या घर का बना बोन मील इस्तेमाल करें।',
  'High Phosphorus: Avoid adding P-fertilizers. Home Remedy: Plant nitrogen-fixing legumes to naturally balance the soil.': 'अधिक फास्फोरस: फास्फोरस उर्वरक न डालें। घरेलू उपाय: मिट्टी को संतुलित करने के लिए फलियां (legumes) उगाएं।',
  'Low Potassium: Add Potash to improve root growth. Home Remedy: Use wood ash (in moderation) or seaweed extract/kelp meal.': 'कम पोटेशियम: जड़ों के विकास के लिए पोटाश डालें। घरेलू उपाय: लकड़ी की राख (सीमित मात्रा में) या समुद्री शैवाल का अर्क इस्तेमाल करें।',
  'Acidic Soil: Apply agricultural lime. Home Remedy: Mix crushed eggshells or wood ash into the topsoil to naturally raise pH.': 'अम्लीय मिट्टी: चूना (agricultural lime) डालें। घरेलू उपाय: pH बढ़ाने के लिए कुचले हुए अंडे के छिलके या लकड़ी की राख मिलाएं।',
  'Alkaline Soil: Add elemental sulfur. Home Remedy: Add pine needles, peat moss, or coffee grounds to slowly lower the pH.': 'क्षारीय मिट्टी: सल्फर डालें। घरेलू उपाय: pH कम करने के लिए पाइन नीडल्स या कॉफी के बीज डालें।',
  'Dry Soil: Increase irrigation frequency. Home Remedy: Use organic mulch (straw, dry leaves) to retain moisture and reduce evaporation.': 'सूखी मिट्टी: सिंचाई बढ़ाएं। घरेलू उपाय: नमी बनाए रखने के लिए जैविक मल्च (सूखी घास, पत्ते) का इस्तेमाल करें।',
  'Waterlogged Soil: Improve drainage systems. Home Remedy: Mix sand or organic compost into the soil to improve aeration and prevent root rot.': 'जलभराव वाली मिट्टी: जल निकासी में सुधार करें। घरेलू उपाय: हवा के संचार के लिए रेत या जैविक खाद मिलाएं।',
  'Maintain current organic compost routines.': 'वर्तमान जैविक खाद दिनचर्या बनाए रखें।',
  'Prediction Confidence': 'भविष्यवाणी का विश्वास',
  'Parameter Profile': 'पैरामीटर प्रोफाइल',
  'Your Soil': 'आपकी मिट्टी',
  'Best match for your soil profile': 'आपकी मिट्टी के लिए सबसे उपयुक्त',
  'Alternative crop recommendation': 'वैकल्पिक फसल सिफारिश',
  'New Analysis': 'नया विश्लेषण',
  'Print / Save PDF': 'प्रिंट / पीडीएफ सहेजें',
  'Analyze Again': 'फिर से विश्लेषण करें',
  'SMS to Farmer': 'किसान को SMS करें',
  'View Insights': 'रिपोर्ट देखें',
  'Good': 'उत्तम',
  'Moderate': 'मध्यम',
  'Poor': 'खराब',

  // Common
  'Score': 'स्कोर',
  'confidence': 'सटीकता',
  // Insights
  'Print / Download PDF': 'प्रिंट / पीडीएफ डाउनलोड करें',
  'Model Accuracy': 'मॉडल की सटीकता',
  'VotingClassifier (XGBoost + RF)': 'वोटिंग क्लासिफायर (XGBoost + RF)',
  'How Accuracy is Calculated': 'सटीकता की गणना कैसे होती है',
  'Total Samples': 'कुल नमूने',
  'Total Crops': 'कुल फसलें',
  'Train Set (80%)': 'ट्रेन सेट (80%)',
  'Test Set (20%)': 'टेस्ट सेट (20%)',
  'Formula:': 'सूत्र:',
  'Accuracy = Correct Predictions / Total Test Samples': 'सटीकता = सही भविष्यवाणियां / कुल टेस्ट नमूने',
  'Data Split:': 'डेटा विभाजन:',
  '4800 rows → 80% train (3840) + 20% test (960)': '4800 पंक्तियाँ → 80% ट्रेन (3840) + 20% टेस्ट (960)',
  'Feature Scaling:': 'फीचर स्केलिंग:',
  'StandardScaler normalizes N, P, K, temp, humidity, pH, rainfall': 'StandardScaler एन, पी, के, तापमान, आर्द्रता, पीएच, वर्षा को सामान्य करता है',
  'Ensemble Training:': 'एन्सेम्बल ट्रेनिंग:',
  'XGBoost (200 trees) + Random Forest (200 trees) combined via soft-voting': 'XGBoost (200 पेड़) + रैंडम फॉरेस्ट (200 पेड़) सॉफ्ट-वोटिंग द्वारा संयुक्त',
  'Evaluation:': 'मूल्यांकन:',
  'Model predicts on the unseen 960 test samples; correct predictions ÷ total = accuracy': 'मॉडल 960 अनदेखे टेस्ट नमूनों पर भविष्यवाणी करता है; सही भविष्यवाणियां ÷ कुल = सटीकता',
  'Feature Radar': 'फीचर रडार',
  'Importance': 'महत्व',
  'Feature Importance': 'फीचर महत्व',
  'Soil Quality Distribution': 'मिट्टी की गुणवत्ता का वितरण',
  'Run analyses to populate this chart': 'इस चार्ट को भरने के लिए विश्लेषण चलाएं',
  'NPK & pH Trend Across Analyses': 'विश्लेषणों में एनपीके और पीएच का रुझान',
  'Top Recommended Crops': 'शीर्ष अनुशंसित फसलें',
  'Predictable Crop Classes': 'अनुमानित फसल श्रेणियां',
  'unique crop types supported by the model.': 'मॉडल द्वारा समर्थित अद्वितीय फसल प्रकार।',
  'The VotingClassifier combines XGBoost and Random Forest predictions using soft voting for maximum robustness.': 'वोटिंग क्लासिफायर अधिकतम मजबूती के लिए सॉफ्ट वोटिंग का उपयोग करके XGBoost और रैंडम फॉरेस्ट भविष्यवाणियों को मिलाता है।',
  // Analyze page labels
  'Nitrogen': 'नाइट्रोजन',
  'Phosphorus': 'फॉस्फोरस',
  'Potassium': 'पोटैशियम',
  'pH': 'पीएच',
  'Moisture': 'नमी',
  'Temperature': 'तापमान',
  'Humidity': 'आर्द्रता',
  'Rainfall': 'वर्षा',
  'ML-Powered Analysis': 'एमएल-संचालित विश्लेषण',
  'Quick Fill — Region Presets': 'क्विक फिल — क्षेत्रीय प्रीसेट',
  'Select your Indian region to auto-fill local soil & climate conditions': 'स्थानीय मिट्टी और जलवायु परिस्थितियों को स्वतः भरने के लिए अपना भारतीय क्षेत्र चुनें',
  'Best Crops:': 'सर्वोत्तम फसलें:',
  'Quick Fill — Crop Presets': 'क्विक फिल — फसल प्रीसेट',
  'Select a crop to auto-fill average soil & climate values': 'औसत मिट्टी और जलवायु मानों को स्वतः भरने के लिए एक फसल चुनें',
  'Error fetching prediction. Ensure the backend is running.': 'भविष्यवाणी प्राप्त करने में त्रुटि। सुनिश्चित करें कि बैकएंड चल रहा है।',
  // Communication
  'Use Last Analysis Data': 'अंतिम विश्लेषण डेटा का उपयोग करें',
  'Wait, extracting number...': 'प्रतीक्षा करें, नंबर निकाला जा रहा है...',
  'Message required.': 'संदेश आवश्यक है।',
  'Enter a valid 10-digit number.': 'एक वैध 10-अंकीय नंबर दर्ज करें।',
  'No analysis data found.': 'कोई विश्लेषण डेटा नहीं मिला।',
  'Testing Expense Tracker REST APIs': 'व्यय ट्रैकर REST API का परीक्षण'
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('soilai_lang') || 'en');

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('soilai_lang', newLang);
  };

  const t = translations[lang] || translations['en'];

  const tLocal = (str) => {
    if (lang === 'hi') {
      if (hiTranslations[str]) return hiTranslations[str];
      if (str.startsWith("Values loaded for")) return str.replace("Values loaded for", "मान इसके लिए लोड किए गए: ");
      if (str.includes("Ideal conditions for high-yield")) return str.replace("Ideal conditions for high-yield", "उच्च उपज के लिए आदर्श स्थिति: ");
      if (str.includes("Consider growing soil-restoring crops alongside")) return str.replace("Consider growing soil-restoring crops alongside", "इसके साथ मिट्टी को ठीक करने वाली फसलें उगाने पर विचार करें: ");
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, tLocal }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

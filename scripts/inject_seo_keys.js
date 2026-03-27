/**
 * Injects SEO translation keys (subcategoryTitle, subcategoryDescription,
 * courseTitle, courseDescription) into each non-English translation file's
 * existing `seo: { ... }` block.
 */
const fs = require("fs");
const path = require("path");

const SEO_KEYS = {
  ar: {
    subcategoryTitle: "أفضل تدريب {{name}} في {{city}} | دورات عبر الإنترنت وحضورية | AIM Technologies",
    subcategoryDescription: "★ تدريب {{name}} الأعلى تقييماً في {{city}}! مدربون خبراء، مختبرات عملية، إعداد للشهادات، مساعدة في التوظيف. سجل الآن!",
    courseTitle: "دورة {{name}} في {{city}} | تدريب بقيادة خبراء | AIM Technologies",
    courseDescription: "سجل في تدريب {{name}} في {{city}}. تدريب بإشراف مدرب، مشاريع عملية، شهادة. انضم إلى أكثر من 10,000 خريج. سجل الآن!",
  },
  de: {
    subcategoryTitle: "Beste {{name}}-Schulung in {{city}} | Online- & Präsenzkurse | AIM Technologies",
    subcategoryDescription: "★ Bestbewertete {{name}}-Schulung in {{city}}! Experten-Trainer, Praxis-Labs, Zertifizierungsvorbereitung. Jetzt anmelden!",
    courseTitle: "{{name}}-Kurs in {{city}} | Experten-geführte Schulung | AIM Technologies",
    courseDescription: "Melden Sie sich für {{name}}-Schulung in {{city}} an. Von Dozenten geleitet, praxisorientierte Projekte, Zertifizierung. Jetzt anmelden!",
  },
  es: {
    subcategoryTitle: "Mejor capacitación en {{name}} en {{city}} | Cursos en línea y presenciales | AIM Technologies",
    subcategoryDescription: "★ ¡Capacitación en {{name}} mejor valorada en {{city}}! Instructores expertos, laboratorios prácticos, preparación para certificación. ¡Inscríbete!",
    courseTitle: "Curso de {{name}} en {{city}} | Formación dirigida por expertos | AIM Technologies",
    courseDescription: "Inscríbete en capacitación de {{name}} en {{city}}. Dirigido por instructor, proyectos prácticos, certificación. ¡Inscríbete ahora!",
  },
  fr: {
    subcategoryTitle: "Meilleure formation {{name}} à {{city}} | Cours en ligne et en présentiel | AIM Technologies",
    subcategoryDescription: "★ Formation {{name}} la mieux notée à {{city}} ! Formateurs experts, labs pratiques, préparation certification. Inscrivez-vous !",
    courseTitle: "Cours {{name}} à {{city}} | Formation dirigée par des experts | AIM Technologies",
    courseDescription: "Inscrivez-vous à la formation {{name}} à {{city}}. Dirigée par un formateur, projets pratiques, certification. Inscrivez-vous !",
  },
  ja: {
    subcategoryTitle: "{{city}}のベスト{{name}}トレーニング | オンライン＆対面コース | AIM Technologies",
    subcategoryDescription: "★ {{city}}で最高評価の{{name}}トレーニング！専門講師、実践ラボ、資格準備。今すぐ登録！",
    courseTitle: "{{city}}の{{name}}コース | 専門家主導のトレーニング | AIM Technologies",
    courseDescription: "{{city}}の{{name}}トレーニングに登録。講師主導、実践プロジェクト、認定資格。10,000人以上の卒業生。今すぐ登録！",
  },
  ko: {
    subcategoryTitle: "{{city}} 최고의 {{name}} 교육 | 온라인 & 오프라인 과정 | AIM Technologies",
    subcategoryDescription: "★ {{city}}에서 최고 평점 {{name}} 교육! 전문 강사, 실습 랩, 자격증 준비. 지금 등록!",
    courseTitle: "{{city}} {{name}} 과정 | 전문가 주도 교육 | AIM Technologies",
    courseDescription: "{{city}}에서 {{name}} 교육 등록. 강사 주도, 실습 프로젝트, 인증. 10,000명 이상 졸업생. 지금 등록!",
  },
  pt: {
    subcategoryTitle: "Melhor formação em {{name}} em {{city}} | Cursos online e presenciais | AIM Technologies",
    subcategoryDescription: "★ Formação em {{name}} mais bem avaliada em {{city}}! Instrutores especialistas, labs práticos, preparação para certificação. Inscreva-se!",
    courseTitle: "Curso de {{name}} em {{city}} | Formação liderada por especialistas | AIM Technologies",
    courseDescription: "Inscreva-se na formação de {{name}} em {{city}}. Liderada por instrutor, projetos práticos, certificação. Inscreva-se agora!",
  },
  tr: {
    subcategoryTitle: "{{city}} En İyi {{name}} Eğitimi | Online ve Yüz Yüze Kurslar | AIM Technologies",
    subcategoryDescription: "★ {{city}} en yüksek puanlı {{name}} eğitimi! Uzman eğitmenler, uygulamalı laboratuvarlar, sertifika hazırlığı. Hemen kaydolun!",
    courseTitle: "{{city}} {{name}} Kursu | Uzman Liderliğinde Eğitim | AIM Technologies",
    courseDescription: "{{city}} {{name}} eğitimine kaydolun. Eğitmen liderliğinde, uygulamalı projeler, sertifika. 10.000+ mezun. Hemen kaydolun!",
  },
  zh: {
    subcategoryTitle: "{{city}}最佳{{name}}培训 | 在线及线下课程 | AIM Technologies",
    subcategoryDescription: "★ {{city}}最高评价的{{name}}培训！专家讲师、实践实验室、认证准备。立即注册！",
    courseTitle: "{{city}}{{name}}课程 | 专家主导培训 | AIM Technologies",
    courseDescription: "报名{{city}}{{name}}培训。讲师主导，实践项目，认证。加入10,000+毕业生。立即注册！",
  },
};

const transDir = path.join(__dirname, "..", "src", "translations");

for (const [lang, keys] of Object.entries(SEO_KEYS)) {
  const filePath = path.join(transDir, `${lang}.ts`);
  let content = fs.readFileSync(filePath, "utf-8");

  // Find the trainingDescription line inside the seo block and append the new keys after it
  const trainingDescLine = /trainingDescription:\s*"[^"]*"\s*}/;
  if (trainingDescLine.test(content)) {
    const newKeys = `, subcategoryTitle: "${keys.subcategoryTitle}", subcategoryDescription: "${keys.subcategoryDescription}", courseTitle: "${keys.courseTitle}", courseDescription: "${keys.courseDescription}" }`;
    content = content.replace(trainingDescLine, (match) => {
      // Remove the trailing } and add our keys before it
      return match.slice(0, -1) + newKeys;
    });
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ ${lang}.ts — SEO keys injected`);
  } else {
    console.log(`⚠️ ${lang}.ts — Could not find trainingDescription pattern`);
  }
}

console.log("DONE");

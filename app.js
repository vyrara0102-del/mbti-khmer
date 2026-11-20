let currentType = 'INTP';
let customTheme = 'auto';
let radarChartInstance = null;

// PWA App Manifest
try {
    const manifestBlob = new Blob([JSON.stringify({
        name: "MBTI ខ្មែរ",
        short_name: "MBTI ខ្មែរ",
        start_url: ".",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#7c3aed",
        icons: [{
            src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%237c3aed'/><text x='50' y='68' font-size='55' text-anchor='middle'>🧠</text></svg>",
            sizes: "512x512",
            type: "image/svg+xml"
        }]
    })], { type: 'application/json' });
    const linkEl = document.createElement('link');
    linkEl.rel = 'manifest';
    linkEl.href = URL.createObjectURL(manifestBlob);
    document.head.appendChild(linkEl);
} catch (e) {}

const themes = {
    NT: { group: "ក្រុមអ្នកវិភាគ (Analysts)", badge: "bg-purple-100 text-purple-700", gradient: "from-purple-600 to-indigo-700", btn: "bg-purple-600 text-white", text: "text-purple-600" },
    NF: { group: "ក្រុមអ្នកការទូត (Diplomats)", badge: "bg-emerald-100 text-emerald-700", gradient: "from-emerald-600 to-teal-700", btn: "bg-emerald-600 text-white", text: "text-emerald-600" },
    SJ: { group: "ក្រុមអ្នកអភិរក្ស (Sentinels)", badge: "bg-sky-100 text-sky-700", gradient: "from-sky-600 to-blue-700", btn: "bg-sky-600 text-white", text: "text-sky-600" },
    SP: { group: "ក្រុមអ្នកផ្សងព្រេង (Explorers)", badge: "bg-amber-100 text-amber-700", gradient: "from-amber-500 to-orange-600", btn: "bg-amber-500 text-white", text: "text-amber-600" }
};

const customThemes = {
    ocean: "from-slate-800 to-cyan-900",
    sunset: "from-rose-600 to-orange-500",
    forest: "from-emerald-700 to-teal-600",
    royal: "from-violet-700 to-amber-600"
};

// [0:theme, 1:icon, 2:title, 3:desc, 4:tags, 5:fn1, 6:fn2, 7:strength, 8:weakness, 9:logic, 10:compat, 11:jobs, 12:tip, 13:radar]
const rawDB = {
    INTJ: ["NT","♟️","អ្នករៀបចំយុទ្ធសាស្ត្រ (The Architect)","មានចក្ខុវិស័យវែងឆ្ងាយ ពូកែរៀបចំប្រព័ន្ធការងារ និងគិតគូរពីលទ្ធផលរយៈពេលវែងដោយហេតុផល។",["យុទ្ធសាស្ត្រ","ឯករាជ្យ","ម៉ឺងម៉ាត់"],["Ni (មុខងារចម្បង)","មើលឃើញរូបភាពរួម និងទស្សន៍ទាយទិសដៅអនាគត"],["Te (មុខងារជំនួយ)","រៀបចំផែនការ និងអនុវត្តការងារមានប្រសិទ្ធភាព"],"ពូកែរៀបចំយុទ្ធសាស្ត្រស្មុគស្មាញ មានភាពម៉ឺងម៉ាត់ និងឯករាជ្យ។","ងាយតឹងរ៉ឹងពេក ពិបាកបង្ហាញអារម្មណ៍ និងឆាប់ស្ត្រេសពេលខុសផែនការ។","ប្រើប្រព័ន្ធតក្កវិជ្ជាកសាងផែនការរយៈពេលវែង ដើម្បីរកវិធីដំណើរការល្អបំផុត។","ស៊ីចង្វាក់បំផុតជាមួយ ENFP និង ENTP ដែលនាំមកនូវគំនិតថ្មីៗ និងភាពរស់រវើក។",["អ្នករៀបចំយុទ្ធសាស្ត្រ","វិស្វករប្រព័ន្ធ","អ្នកវិទ្យាសាស្ត្រ","នាយកប្រតិបត្តិ"],"ហ្វឹកហាត់ស្តាប់គំនិតអ្នកដទៃ និងបង្ហាញការកោតសរសើរផ្នែកអារម្មណ៍ឱ្យបានច្រើន។",[95,85,40,90,45]],
    INTP: ["NT","🧠","អ្នកគិតវិភាគ (The Logician)","ស្ងប់ស្ងាត់ ចូលចិត្តគិតស៊ីជម្រៅ មានគំនិតច្នៃប្រឌិតខ្ពស់ និងស្វែងរកហេតុផលពិតប្រាកដ។",["ឯករាជ្យ","ពូកែវិភាគ","ស្រឡាញ់សេរីភាព"],["Ti (មុខងារចម្បង)","វិភាគរកភាពត្រឹមត្រូវ និងចំណុចខ្វះខាតនៃទ្រឹស្តី"],["Ne (មុខងារជំនួយ)","បង្កើតគំនិតច្នៃប្រឌិតថ្មីៗ និងមើលឃើញលទ្ធភាពច្រើន"],"ពូកែដោះស្រាយបញ្ហាស្មុគស្មាញ គិតបែបវិទ្យាសាស្ត្រ និងបើកចិត្តទូលាយ។","គិតច្រើនហួសហេតុ (Overthinking) ពន្យារពេលអនុវត្ត និងមិនចូលចិត្តច្បាប់តឹងរ៉ឹង។","បំបែកបញ្ហាធំទៅជាផ្នែកតូចៗ ដើម្បីរកមើលឫសគល់ពិតប្រាកដមុនសម្រេចចិត្ត។","ស៊ីចង្វាក់បំផុតជាមួយ ENTJ និង INFJ ដែលជួយជំរុញគំនិតឱ្យចេញជាសកម្មភាព។",["អ្នកសរសេរកម្មវិធី","អ្នកវិភាគទិន្នន័យ","អ្នកស្រាវជ្រាវ","ស្ថាបត្យករ"],"កំណត់ពេលវេលាជាក់លាក់ដើម្បីបញ្ចប់គម្រោង កុំរវល់តែគិតរហូតខកខានឱកាស។",[98,92,45,40,85]],
    ENTJ: ["NT","👑","អ្នកដឹកនាំ (The Commander)","ក្លាហាន ម៉ឺងម៉ាត់ មានទំនុកចិត្តខ្ពស់ និងពូកែដឹកនាំក្រុមឱ្យសម្រេចគោលដៅធំៗ។",["ភាពជាអ្នកដឹកនាំ","ម៉ឺងម៉ាត់","មហិច្ឆតា"],["Te (មុខងារចម្បង)","ចាត់ចែងធនធាន និងដឹកនាំមនុស្សឆ្ពោះទៅរកលទ្ធផល"],["Ni (មុខងារជំនួយ)","មើលឃើញឱកាស និងរៀបចំយុទ្ធសាស្ត្ររយៈពេលវែង"],"មានភាពជាអ្នកដឹកនាំពីកំណើត សម្រេចចិត្តរហ័ស និងពូកែជំរុញក្រុម។","អាចមើលទៅរាងផ្តាច់ការ មិនសូវអត់ធ្មត់ និងងាយភ្លេចគិតពីអារម្មណ៍អ្នកដទៃ។","វាយតម្លៃអ្វីៗដោយផ្អែកលើប្រសិទ្ធភាព និងលទ្ធផលជាក់ស្តែង។","ស៊ីចង្វាក់បំផុតជាមួយ INTP និង INFP ដែលផ្តល់គំនិតវិភាគ និងបន្ទន់ចិត្ត។",["នាយកគ្រប់គ្រង","សហគ្រិន","មេធាវី","ទីប្រឹក្សាអាជីវកម្ម"],"ទុកពេលស្តាប់អារម្មណ៍ និងមតិរបស់សមាជិកក្រុមមុនសម្រេចចិត្តផ្លាស់ប្តូរ។",[92,75,45,95,60]],
    ENTP: ["NT","⚡","អ្នកបង្កើតគំនិតថ្មី (The Debater)","ឆ្លាតវៃ ពូកែវែកញែក រហ័សរហួន និងចូលចិត្តសាកល្បងអ្វីដែលថ្មីៗជានិច្ច។",["ច្នៃប្រឌិត","ពូកែវែកញែក","ស្វាហាប់"],["Ne (មុខងារចម្បង)","បង្កើតគំនិតថ្មីៗឥតឈប់ឈរ និងភ្ជាប់ទំនាក់ទំនងរឿងផ្សេងៗ"],["Ti (មុខងារជំនួយ)","វិភាគរកហេតុផល និងភាពចន្លោះប្រហោងនៃគំនិត"],"គំនិតច្នៃប្រឌិតខ្ពស់ ពូកែនិយាយបញ្ចុះបញ្ចូល និងបត់បែនរហ័ស។","ឆាប់ធុញនឹងការងារដដែលៗ ពិបាកផ្តោតលើរឿងតែមួយឱ្យចប់ចុងចប់ដើម។","សាកល្បងគំនិតតាមរយៈការជជែកវែកញែកគ្រប់ជ្រុងជ្រោយ។","ស៊ីចង្វាក់បំផុតជាមួយ INFJ និង INTJ ដែលជួយតម្រង់ទិសឱ្យមានរបៀបរៀបរយ។",["សហគ្រិន","អ្នកទីផ្សារច្នៃប្រឌិត","អ្នកសារព័ត៌មាន","ទីប្រឹក្សា"],"ជ្រើសរើសគំនិតល្អបំផុតត្រឹម ១ ឬ ២ រួចផ្តោតអនុវត្តឱ្យចេញជាលទ្ធផលពិត។",[88,96,55,40,92]],
    INFJ: ["NF","🌿","អ្នកផ្តល់យោបល់ (The Advocate)","ស្ងប់ស្ងាត់ យល់ចិត្តមនុស្សជ្រាលជ្រៅ មានឧត្តមគតិខ្ពស់ និងចង់ជួយអ្នកដទៃ។",["យល់ចិត្តគេ","មានគោលការណ៍","ទន់ភ្លន់"],["Ni (មុខងារចម្បង)","មើលធ្លុះពីអត្ថន័យជ្រាលជ្រៅ និងចិត្តគំនិតមនុស្ស"],["Fe (មុខងារជំនួយ)","យល់ចិត្ត និងបង្កើតភាពសុខដុមរមនាជាមួយអ្នកជុំវិញ"],"យល់ចិត្តអ្នកដទៃបានជ្រៅ មានគោលការណ៍សីលធម៌ និងពូកែផ្តល់ដំបូន្មាន។","ងាយបាក់ទឹកចិត្តពេលជួបភាពអយុត្តិធម៌ និងច្រើនតែលាក់ទុក្ខម្នាក់ឯង។","ប្រើការយល់ចិត្តរួមផ្សំនឹងវិចារណញ្ញាណ ដើម្បីរកដំណោះស្រាយល្អសម្រាប់គ្រប់ភាគី។","ស៊ីចង្វាក់បំផុតជាមួយ ENFP និង ENTP ដែលនាំមកនូវថាមពលវិជ្ជមាន។",["អ្នកប្រឹក្សាចិត្តសាស្ត្រ","អ្នកនិពន្ធ","គ្រូបង្រៀន","អ្នកគ្រប់គ្រង HR"],"រៀនបដិសេធខ្លះដើម្បីការពារថាមពលផ្ទាល់ខ្លួន និងកុំរែកពុនបញ្ហាជំនួសគេពេក។",[65,85,96,80,55]],
    INFP: ["NF","🎨","អ្នកស្រមើស្រមៃ (The Mediator)","ទន់ភ្លន់ ស្មោះត្រង់ មានចិត្តមេត្តា ស្រឡាញ់សិល្បៈ និងរស់នៅតាមឧត្តមគតិ។",["ចិត្តល្អ","ស្រឡាញ់សិល្បៈ","ស្មោះត្រង់"],["Fi (មុខងារចម្បង)","រស់នៅតាមតម្លៃសីលធម៌ និងអារម្មណ៍ពិតខាងក្នុងចិត្ត"],["Ne (មុខងារជំនួយ)","ស្រមើស្រមៃបង្កើតគំនិតសិល្បៈ និងក្តីសុបិនថ្មីៗ"],"មានចិត្តមេត្តាខ្ពស់ ស្មោះត្រង់ គំនិតច្នៃប្រឌិតសិល្បៈ និងពូកែលើកទឹកចិត្ត។","ងាយរងផលប៉ះពាល់ផ្លូវចិត្តពីពាក្យរិះគន់ និងពិបាកសម្រេចចិត្តរឿងជាក់ស្តែង។","សម្រេចចិត្តដោយសួរខ្លួនឯងថា តើរឿងនេះស្របនឹងឧត្តមគតិ និងបេះដូងឬទេ។","ស៊ីចង្វាក់បំផុតជាមួយ ENFJ និង ENTJ ដែលផ្តល់ការគាំទ្រ និងរៀបចំគោលដៅ។",["អ្នកនិពន្ធ","អ្នករចនាក្រាហ្វិក","អ្នកចិត្តសាស្ត្រ","សិល្បករ"],"ទទួលយកពាក្យរិះគន់ក្នុងន័យស្ថាបនា និងបំបែកក្តីស្រមៃទៅជាជំហានតូចៗ។",[55,95,95,40,85]],
    ENFJ: ["NF","☀️","អ្នកផ្តល់ភាពកក់ក្តៅ (The Protagonist)","រួសរាយ ពូកែលើកទឹកចិត្ត មានមន្តស្នេហ៍ និងចូលចិត្តមើលថែអ្នកជុំវិញខ្លួន។",["ពូកែលើកទឹកចិត្ត","រួសរាយ","យកចិត្តទុកដាក់"],["Fe (មុខងារចម្បង)","យល់ពីតម្រូវការផ្លូវចិត្ត និងបង្រួបបង្រួមមនុស្សក្នុងក្រុម"],["Ni (មុខងារជំនួយ)","មើលឃើញសក្តានុពលល្អៗដែលលាក់កំបាំងក្នុងខ្លួនអ្នកដទៃ"],"ពូកែទំនាក់ទំនង លើកទឹកចិត្តមនុស្ស មានទំនួលខុសត្រូវ និងបង្កើតភាពកក់ក្តៅ។","បារម្ភពីការវាយតម្លៃរបស់អ្នកដទៃពេក និងងាយភ្លេចមើលថែសេចក្តីសុខផ្ទាល់ខ្លួន។","ផ្តោតលើការអភិវឌ្ឍមនុស្ស ដោយជឿជាក់ថាពេលមនុស្សរីកចម្រើន ការងារក៏ជោគជ័យ។","ស៊ីចង្វាក់បំផុតជាមួយ INFP និង ISFP ដែលផ្តល់តម្លៃដល់ភាពស្មោះត្រង់។",["គ្រូបង្រៀន","អ្នកដឹកនាំសហគមន៍","អ្នកគ្រប់គ្រងផ្នែកលក់","ពិធីករ"],"កុំព្យាយាមផ្គាប់ចិត្តមនុស្សគ្រប់គ្នាពេក ហើយត្រូវផ្តល់ពេលសម្រាកឱ្យខ្លួនឯង។",[60,80,98,85,65]],
    ENFP: ["NF","✨","អ្នកនាំភាពរីករាយ (The Campaigner)","ពោរពេញដោយថាមពល គំនិតច្នៃប្រឌិត រួសរាយ និងនាំមកនូវបរិយាកាសរីករាយ។",["រួសរាយ","ច្នៃប្រឌិត","ស្រឡាញ់សេរីភាព"],["Ne (មុខងារចម្បង)","ស្វែងរកគំនិតថ្មីៗ និងឱកាសគួរឱ្យរំភើបជុំវិញខ្លួន"],["Fi (មុខងារជំនួយ)","រស់នៅដោយភាពស្មោះត្រង់ និងផ្តល់តម្លៃលើសេរីភាពផ្ទាល់ខ្លួន"],"ថាមពលវិជ្ជមានខ្ពស់ រួសរាយ ពូកែបង្កើតគំនិតថ្មីៗ និងងាយសម្របខ្លួន។","ងាយបែកអារម្មណ៍ ពិបាកធ្វើការងារដែលមានវិន័យតឹងរ៉ឹង និងឆាប់ធុញរឿងដដែលៗ។","សម្រេចចិត្តដោយផ្អែកលើចំណង់ចំណូលចិត្ត អត្ថន័យផ្លូវចិត្ត និងភាពរំភើប។","ស៊ីចង្វាក់បំផុតជាមួយ INTJ និង INFJ ដែលជួយរៀបចំគំនិតឱ្យមានរបៀប។",["អ្នកទីផ្សារ","អ្នកបង្កើតមាតិកា","អ្នករៀបចំកម្មវិធី","អ្នកសារព័ត៌មាន"],"ប្រើបញ្ជីការងារប្រចាំថ្ងៃ (To-do list) ដើម្បីរក្សាការផ្តោតអារម្មណ៍ឱ្យចប់គម្រោង។",[55,96,90,38,95]],
    ISTJ: ["SJ","🛡️","អ្នកប្រាកដនិយម (The Logistician)","ម៉ត់ចត់ ស្មោះត្រង់ គោរពពេលវេលា និងធ្វើការងារតាមលំដាប់លំដោយប្រកបដោយទំនួលខុសត្រូវ។",["ពឹងពាក់បាន","មានវិន័យ","ប្រាកដនិយម"],["Si (មុខងារចម្បង)","ចងចាំព័ត៌មានលម្អិត និងប្រើបទពិសោធន៍ពិតប្រាកដជាមូលដ្ឋាន"],["Te (មុខងារជំនួយ)","រៀបចំការងារតាមច្បាប់ទម្លាប់ និងលំដាប់លំដោយច្បាស់លាស់"],"ទំនួលខុសត្រូវខ្ពស់ អាចពឹងពាក់បាន ម៉ត់ចត់គ្រប់ចំណុច និងគោរពពេលវេលា។","មិនសូវចូលចិត្តការផ្លាស់ប្តូរភ្លាមៗ និងងាយបន្ទោសខ្លួនឯងពេលមានកំហុស។","ជឿជាក់លើទិន្នន័យជាក់ស្តែង និងវិធីសាស្ត្រដែលធ្លាប់ទទួលបានជោគជ័យពីមុន។","ស៊ីចង្វាក់បំផុតជាមួយ ESFP និង ESTP ដែលជួយនាំមកនូវភាពរីករាយ និងភាពបត់បែន។",["គណនេយ្យករ","អ្នកគ្រប់គ្រងគម្រោង","មន្ត្រីច្បាប់","វិស្វករ"],"បើកចិត្តសាកល្បងវិធីសាស្ត្រថ្មីៗខ្លះ ទោះបីជាវាមិនទាន់មានបទពិសោធន៍ពីមុនក៏ដោយ។",[88,45,50,98,40]],
    ISFJ: ["SJ","🤝","អ្នកថែរក្សា (The Defender)","កក់ក្តៅ ចិត្តល្អ អត់ធ្មត់ និងតែងតែលះបង់ដើម្បីការពារគ្រួសារ ឬមិត្តភក្តិ។",["ចិត្តល្អ","អត់ធ្មត់","ស្មោះត្រង់"],["Si (មុខងារចម្បង)","ចងចាំចំណង់ចំណូលចិត្ត និងព័ត៌មានលម្អិតរបស់មនុស្សជាទីស្រឡាញ់"],["Fe (មុខងារជំនួយ)","មើលថែ ជួយយកអាសា និងរក្សាភាពកក់ក្តៅក្នុងក្រុម"],"ចិត្តល្អ អត់ធ្មត់ ស្មោះត្រង់ យកចិត្តទុកដាក់ខ្ពស់ និងពូកែមើលថែអ្នកជុំវិញ។","ពិបាកនិយាយពាក្យបដិសេធ ច្រើនតែលាក់អារម្មណ៍ឈឺចាប់ និងខ្លាចការផ្លាស់ប្តូរ។","វាយតម្លៃស្ថានភាពដោយផ្អែកលើសុវត្ថិភាព ទំនៀមទម្លាប់ល្អ និងសេចក្តីសុខគ្រួសារ។","ស៊ីចង្វាក់បំផុតជាមួយ ESTP និង ESFP ដែលជួយឱ្យហ៊ានសាកល្បងអ្វីថ្មីៗ។",["គិលានុបដ្ឋាយិកា","គ្រូបង្រៀន","បុគ្គលិករដ្ឋបាល","អ្នករចនាផ្ទៃខាងក្នុង"],"រៀននិយាយពីតម្រូវការផ្ទាល់ខ្លួនឱ្យអ្នកដទៃដឹង កុំចាំតែលះបង់រហូតហត់នឿយ។",[60,55,94,92,45]],
    ESTJ: ["SJ","📋","អ្នកគ្រប់គ្រង (The Executive)","មានរបៀបរៀបរយ និយាយត្រង់ទៅត្រង់មក និងពូកែចាត់ចែងការងារឱ្យមានប្រសិទ្ធភាព។",["ចាត់ចែងពូកែ","ម៉ឺងម៉ាត់","ទំនួលខុសត្រូវ"],["Te (មុខងារចម្បង)","រៀបចំប្រព័ន្ធ ច្បាប់ទម្លាប់ និងចាត់ចែងការងារឱ្យដើរទៅមុខ"],["Si (មុខងារជំនួយ)","ប្រកាន់ខ្ជាប់នូវស្តង់ដារ បទពិសោធន៍ និងភាពច្បាស់លាស់"],"ពូកែគ្រប់គ្រង និងចាត់ចែង និយាយត្រង់ៗ មានវិន័យខ្ពស់ និងទំនួលខុសត្រូវ។","អាចមើលទៅរាងតឹងរ៉ឹង និងងាយប៉ះទង្គិចពាក្យសម្តីដោយអចេតនា។","ផ្តោតលើច្បាប់ទម្លាប់ ភាពច្បាស់លាស់ និងលទ្ធផលជាក់ស្តែងដែលអាចវាស់វែងបាន។","ស៊ីចង្វាក់បំផុតជាមួយ ISFP និង INFP ដែលជួយបន្ថែមភាពទន់ភ្លន់ក្នុងជីវិត។",["អ្នកគ្រប់គ្រងទូទៅ","មន្ត្រីហិរញ្ញវត្ថុ","អ្នកគ្រប់គ្រងសំណង់","មន្ត្រីរាជការ"],"បន្ទន់ពាក្យសម្តីបន្តិចនៅពេលផ្តល់មតិកែលម្អ និងផ្តល់ឱកាសឱ្យគេសាកល្បងវិធីថ្មី។",[86,50,48,96,45]],
    ESFJ: ["SJ","🏡","អ្នកយកចិត្តទុកដាក់ (The Consul)","ចូលចិត្តជួយសង្គម រួសរាយរាក់ទាក់ និងចង់ឱ្យគ្រប់គ្នានៅជុំវិញខ្លួនមានសុភមង្គល។",["រួសរាយ","ចូលចិត្តជួយគេ","ទំនួលខុសត្រូវ"],["Fe (មុខងារចម្បង)","បង្កើតភាពស្និទ្ធស្នាល និងយកចិត្តទុកដាក់លើសុខទុក្ខអ្នកជុំវិញ"],["Si (មុខងារជំនួយ)","រក្សាទំនៀមទម្លាប់ល្អ និងការចងចាំជាមួយមនុស្សជិតស្និទ្ធ"],"រួសរាយរាក់ទាក់ ចិត្តទូលាយ ពូកែសម្របសម្រួលសង្គម និងមានទំនួលខុសត្រូវ។","ងាយបាក់ទឹកចិត្តពេលត្រូវគេរិះគន់ និងបារម្ភពីការយល់ឃើញរបស់សង្គមច្រើនពេក។","សម្រេចចិត្តដោយផ្អែកលើទំនៀមទម្លាប់សង្គម និងការរក្សាទំនាក់ទំនងល្អ។","ស៊ីចង្វាក់បំផុតជាមួយ ISFP និង ISTP ដែលជួយឱ្យចេះរស់នៅដោយឯករាជ្យ។",["អ្នកទំនាក់ទំនងសាធារណៈ","អ្នកគ្រប់គ្រងព្រឹត្តិការណ៍","បុគ្គលិកសង្គមកិច្ច","គ្រូពេទ្យ"],"កុំយកពាក្យសម្តីរិះគន់របស់អ្នកដទៃមកគិតច្រើនពេក ហើយផ្តល់តម្លៃដល់សេចក្តីសុខខ្លួនឯង។",[58,60,95,90,55]],
    ISTP: ["SP","🛠️","អ្នកជំនាញបច្ចេកទេស (The Virtuoso)","ស្ងប់ស្ងាត់ ពូកែសង្កេត ដោះស្រាយបញ្ហាភ្លាមៗបានល្អ និងចូលចិត្តរៀនតាមការអនុវត្ត។",["ពូកែអនុវត្ត","ស្ងប់ស្ងាត់","បត់បែន"],["Ti (មុខងារចម្បង)","វិភាគពីរបៀបដំណើរការនៃឧបករណ៍ ឬប្រព័ន្ធនីមួយៗយ៉ាងច្បាស់"],["Se (មុខងារជំនួយ)","សង្កេតស្ថានភាពជាក់ស្តែង និងឆ្លើយតបភ្លាមៗបានយ៉ាងរហ័ស"],"ស្ងប់ស្ងាត់ពេលមានអាសន្ន ពូកែដោះស្រាយបញ្ហាបច្ចេកទេស និងឯករាជ្យ។","ពិបាកបង្ហាញអារម្មណ៍ ឆាប់ធុញនឹងការសន្យារយៈពេលវែង និងមិនចូលចិត្តការរឹតត្បិត។","ប្រើតក្កវិជ្ជាជាក់ស្តែងដោះស្រាយបញ្ហានៅចំពោះមុខ ដោយសាកល្បងអនុវត្តផ្ទាល់។","ស៊ីចង្វាក់បំផុតជាមួយ ESFJ និង ESTJ ដែលជួយរៀបចំសណ្តាប់ធ្នាប់ជីវិត។",["វិស្វករមេកានិច","អ្នកជំនាញ IT","អ្នកបើកយន្តហោះ","អ្នកថតរូប"],"ហ្វឹកហាត់បង្ហាញអារម្មណ៍តាមរយៈពាក្យសម្តីឱ្យបានច្រើនជាងមុនទៅកាន់មនុស្សជិតស្និទ្ធ។",[90,72,42,45,94]],
    ISFP: ["SP","🎸","អ្នកសិល្បៈ (The Adventurer)","ទន់ភ្លន់ ស្រឡាញ់ភាពស្រស់ស្អាត មានភាពបត់បែន និងរស់នៅតាមអារម្មណ៍ពិតរបស់ខ្លួន។",["ស្រឡាញ់សិល្បៈ","ទន់ភ្លន់","ស្រឡាញ់សេរីភាព"],["Fi (មុខងារចម្បង)","រស់នៅដោយស្មោះត្រង់នឹងអារម្មណ៍ និងតម្លៃសិល្បៈផ្ទាល់ខ្លួន"],["Se (មុខងារជំនួយ)","ទទួលយកភាពស្រស់ស្អាត និងបទពិសោធន៍ពិតនៅបច្ចុប្បន្នកាល"],"ចិត្តទន់ភ្លន់ ពូកែខាងសិល្បៈ និងការច្នៃប្រឌិត បើកចិត្តទូលាយ និងមិនវិនិច្ឆ័យគេ។","ពិបាករៀបចំផែនការរយៈពេលវែង ងាយរងសម្ពាធផ្លូវចិត្ត និងច្រើនគេចវេះពីជម្លោះ។","សម្រេចចិត្តដោយផ្អែកលើអារម្មណ៍ពិត និងភាពស៊ីចង្វាក់ជាមួយបច្ចុប្បន្ន។","ស៊ីចង្វាក់បំផុតជាមួយ ENFJ និង ESFJ ដែលផ្តល់ភាពកក់ក្តៅ និងការលើកទឹកចិត្ត។",["អ្នករចនាម៉ូដ","ជាងថតរូប","ចុងភៅ","តន្ត្រីករ"],"ហ្វឹកហាត់រៀបចំផែនការហិរញ្ញវត្ថុ និងគោលដៅរយៈពេលវែងដើម្បីស្ថិរភាពអនាគត។",[52,92,88,40,92]],
    ESTP: ["SP","🚀","អ្នកធ្វើសកម្មភាព (The Entrepreneur)","ស្វាហាប់ ឆ្លាតវៃក្នុងការចរចា ហ៊ានប្រថុយ និងចូលចិត្តការប្រកួតប្រជែងជាក់ស្តែង។",["ស្វាហាប់","ពូកែចរចា","ហ៊ានប្រថុយ"],["Se (មុខងារចម្បង)","ចាប់យកឱកាសជាក់ស្តែង និងធ្វើសកម្មភាពភ្លាមៗយ៉ាងរហ័ស"],["Ti (មុខងារជំនួយ)","វិភាគស្ថានភាពចរចា និងរកចំណុចចំណេញបានយ៉ាងឆ្លាតវៃ"],"រហ័សរហួន ពូកែចរចា ហ៊ានប្រឈមមុខនឹងបញ្ហា និងពូកែដោះស្រាយស្ថានការណ៍ភ្លាមៗ។","ឆាប់ធុញទ្រាន់ មិនសូវគិតពីផលវិបាករយៈពេលវែង និងងាយធ្វើអ្វីដោយតក់ក្រហល់។","ផ្តោតលើសកម្មភាពជាក់ស្តែង និងលទ្ធផលដែលអាចមើលឃើញភ្លាមៗ។","ស៊ីចង្វាក់បំផុតជាមួយ ISFJ និង ISTJ ដែលជួយផ្តល់ភាពហ្មត់ចត់ និងការគិតវែងឆ្ងាយ។",["អ្នកលក់ និងចរចា","សហគ្រិន","អ្នកវិនិយោគ","គ្រូបង្វឹកកីឡា"],"ឈប់គិតបន្តិចមុននឹងសម្រេចចិត្តរឿងធំៗ ដើម្បីថ្លឹងថ្លែងពីផលប៉ះពាល់រយៈពេលវែង។",[82,75,50,45,98]],
    ESFP: ["SP","🎉","អ្នកបង្កើតបរិយាកាស (The Entertainer)","រីករាយ កំប្លែង រួសរាយ និងចូលចិត្តភាពអ៊ូអរសប្បាយរីករាយជាមួយមិត្តភក្តិ។",["កំប្លែង","រួសរាយ","រស់រវើក"],["Se (មុខងារចម្បង)","រីករាយនឹងបទពិសោធន៍ថ្មីៗ និងបង្កើតភាពរស់រវើកជុំវិញខ្លួន"],["Fi (មុខងារជំនួយ)","មានចិត្តល្អ ស្មោះត្រង់ និងយល់ពីអារម្មណ៍មនុស្សជិតស្និទ្ធ"],"រួសរាយ ពូកែបង្កើតបរិយាកាសរីករាយ មានទំនាក់ទំនងសង្គមល្អ និងរស់រវើក។","ពិបាកផ្តោតលើការងារឯកសារ ឬផែនការវែងឆ្ងាយ និងងាយគេចវេះពីបញ្ហាស្មុគស្មាញ។","សម្រេចចិត្តដោយផ្អែកលើភាពរីករាយ បទពិសោធន៍ជាក់ស្តែង និងសេចក្តីសុខជុំវិញ។","ស៊ីចង្វាក់បំផុតជាមួយ ISTJ និង ISFJ ដែលជួយរៀបចំសណ្តាប់ធ្នាប់ជីវិតប្រចាំថ្ងៃ។",["តារាសម្តែង","អ្នករៀបចំកម្មវិធី","មគ្គុទ្ទេសក៍ទេសចរណ៍","អ្នកលក់"],"រៀនរៀបចំផែនការសន្សំ និងកំណត់គោលដៅរយៈពេលវែងដើម្បីធានាស្ថិរភាពអនាគត។",[50,85,86,38,96]]
};

const groupDeepInfo = {
    NT: { love: "គាំទ្រផ្នែកគំនិត ជួយដោះស្រាយបញ្ហា និងផ្តល់សេរីភាពឱ្យគ្នា។", partner: "ឆ្លាតវៃ ឯករាជ្យ មានគោលដៅច្បាស់លាស់។", fear: "ខ្លាចបាត់បង់ការគ្រប់គ្រង និងការគិតច្រើនហួសហេតុ។", react: "ដកខ្លួនទៅគិត និងវិភាគរកមូលហេតុដោយស្ងៀមស្ងាត់។" },
    NF: { love: "ស្រឡាញ់ដោយបេះដូង និងការយល់ចិត្ត ចង់បានស្នេហាមានអត្ថន័យ។", partner: "យល់ចិត្ត កក់ក្តៅ ស្មោះត្រង់ និងទទួលយកភាពជាខ្លួនឯង។", fear: "ខ្លាចមិនត្រូវបានគេយល់ចិត្ត និងរំពឹងទុកផ្លូវចិត្តខ្ពស់ពេក។", react: "ស្ងៀមស្ងាត់ ហើយគិតពិចារណាពីអារម្មណ៍ដែលបានកើតឡើង។" },
    SJ: { love: "បង្ហាញស្នេហាតាមការថែរក្សា ទំនួលខុសត្រូវ និងរក្សាពាក្យសន្យា។", partner: "មានទំនួលខុសត្រូវ ស្មោះត្រង់ និងផ្តល់ស្ថិរភាព។", fear: "ខ្លាចបាត់បង់ស្ថិរភាព សុវត្ថិភាព និងការផ្លាស់ប្តូរភ្លាមៗ។", react: "ចង់និយាយដោះស្រាយគ្នាឱ្យមានភាពច្បាស់លាស់។" },
    SP: { love: "បង្ហាញស្នេហាតាមការផ្តល់ពេលវេលា និងបទពិសោធន៍រីករាយរួមគ្នា។", partner: "រស់នៅបែបធម្មជាតិ សប្បាយរីករាយ និងមិនរឹតត្បិតសេរីភាព។", fear: "ខ្លាចបាត់បង់សេរីភាព និងធុញទ្រាន់នឹងការរឹតត្បិតពេក។", react: "ចង់នៅម្នាក់ឯងមួយរយៈ ឬធ្វើអ្វីផ្សេងដើម្បីបន្ធូរអារម្មណ៍។" }
};

const radarColors = {
    NT: { bg: 'rgba(124, 58, 237, 0.25)', border: 'rgb(124, 58, 237)' },
    NF: { bg: 'rgba(16, 185, 129, 0.25)', border: 'rgb(16, 185, 129)' },
    SJ: { bg: 'rgba(2, 132, 199, 0.25)', border: 'rgb(2, 132, 199)' },
    SP: { bg: 'rgba(245, 158, 11, 0.25)', border: 'rgb(245, 158, 11)' }
};

const quizList = [
    ["១. ពេលមានកម្មវិធីជួបជុំមនុស្សច្រើន តើអ្នកមានអារម្មណ៍បែបណា?", "I", "ឆាប់អស់កម្លាំង ចង់ត្រឡប់មកនៅស្ងាត់ៗវិញ", "E", "កាន់តែមានថាមពល និងរីករាយពេលជជែក"],
    ["២. ពេលមានគំនិតថ្មី ឬបញ្ហា តើអ្នកចូលចិត្តធ្វើបែបណាមុន?", "I", "គិតពិចារណាក្នុងចិត្តឱ្យច្បាស់សិន មុននិយាយ", "E", "និយាយពិភាក្សាជាមួយអ្នកដទៃភ្លាមៗ"],
    ["៣. ពេលរៀនអ្វីមួយថ្មី តើអ្នកចាប់អារម្មណ៍លើអ្វីជាង?", "N", "ទ្រឹស្តីរួម អត្ថន័យបង្កប់ និងអនាគត", "S", "របៀបអនុវត្តជាក់ស្តែង និងជំហានលម្អិត"],
    ["៤. តើអ្នកជឿជាក់លើអ្វីច្រើនជាងគេ?", "N", "វិចារណញ្ញាណ និងការមើលឃើញលទ្ធភាពថ្មីៗ", "S", "បទពិសោធន៍ផ្ទាល់ និងភស្តុតាងជាក់ស្តែង"],
    ["៥. ពេលមិត្តភក្តិមកត្អូញត្អែរពីបញ្ហា តើអ្នកតែងធ្វើអ្វីមុនគេ?", "T", "វិភាគរកមូលហេតុ និងផ្តល់ដំណោះស្រាយ", "F", "ស្តាប់ដោយយល់ចិត្ត និងលួងលោមអារម្មណ៍"],
    ["៦. ក្នុងការសម្រេចចិត្តសំខាន់ តើអ្វីជាអាទិភាពខ្ពស់បំផុត?", "T", "ភាពត្រឹមត្រូវ យុត្តិធម៌ និងហេតុផល", "F", "ភាពសុខដុមរមនា និងចិត្តមនុស្សជុំវិញ"],
    ["៧. នៅពេលធ្វើដំណើរកម្សាន្ត តើអ្នកចូលចិត្តរបៀបណា?", "P", "ដើរតាមចំណង់ចំណូលចិត្តភ្លាមៗ មិនតឹងរ៉ឹង", "J", "រៀបចំកាលវិភាគ និងកន្លែងស្នាក់នៅទុកជាមុន"],
    ["៨. របៀបធ្វើការងារប្រចាំថ្ងៃរបស់អ្នកបែបណា?", "P", "បត់បែនតាមកាលៈទេសៈ និងបើកចិត្តផ្លាស់ប្តូរ", "J", "ធ្វើតាមផែនការ និងបញ្ចប់មុនពេលកំណត់"]
];

const quizContainer = document.getElementById('quiz-questions');
if (quizContainer) {
    quizContainer.innerHTML = quizList.map((q, idx) => `
        <div class="p-3.5 rounded-2xl bg-slate-50">
            <p class="font-semibold text-slate-800 mb-2">${q[0]}</p>
            <label class="flex items-center gap-2 py-1 cursor-pointer">
                <input type="radio" name="q${idx + 1}" value="${q[1]}" ${idx % 2 === 0 ? 'checked' : ''} class="accent-purple-600">
                <span>${q[2]}</span>
            </label>
            <label class="flex items-center gap-2 py-1 cursor-pointer">
                <input type="radio" name="q${idx + 1}" value="${q[3]}" class="accent-purple-600">
                <span>${q[4]}</span>
            </label>
        </div>
    `).join('');
}

function selectMBTI(type) {
    currentType = type;
    const d = rawDB[type];
    if (!d) return;
    const theme = themes[d[0]];

    document.querySelectorAll('.mbti-btn').forEach((b) => {
        b.className = "mbti-btn py-1.5 rounded-lg text-xs font-bold bg-white/80 text-slate-600 hover:bg-white";
    });
    const activeBtn = document.getElementById(`btn-${type}`);
    if (activeBtn) {
        activeBtn.className = `mbti-btn py-1.5 rounded-lg text-xs font-bold shadow-sm ${theme.btn}`;
    }

    const badge = document.getElementById('group-badge');
    badge.textContent = theme.group;
    badge.className = `px-3 py-0.5 text-xs font-semibold rounded-full ${theme.badge}`;

    const grad = customTheme === 'auto' ? theme.gradient : customThemes[customTheme];
    document.getElementById('main-card').className = `bento-card md:col-span-2 md:row-span-2 bg-gradient-to-br ${grad} text-white rounded-3xl p-6 flex flex-col justify-between`;

    document.getElementById('mbti-code').textContent = type;
    document.getElementById('mbti-icon').textContent = d[1];
    document.getElementById('mbti-title').textContent = d[2];
    document.getElementById('mbti-desc').textContent = d[3];

    document.getElementById('mbti-tags').innerHTML = d[4]
        .map((t) => `<span class="px-3 py-1 bg-white/15 rounded-full text-xs">${t}</span>`)
        .join('');

    document.getElementById('mbti-functions').innerHTML = [d[5], d[6]]
        .map((fn) => `<div class="p-3 bg-slate-50 rounded-xl border border-slate-100"><strong class="${theme.text} block mb-0.5">${fn[0]}</strong><span class="text-slate-600">${fn[1]}</span></div>`)
        .join('');

    document.getElementById('mbti-strength').textContent = d[7];
    document.getElementById('mbti-weakness').textContent = d[8];
    document.getElementById('mbti-logic').textContent = d[9];
    document.getElementById('mbti-compatibility').textContent = d[10];

    document.getElementById('mbti-jobs').innerHTML = d[11]
        .map((j) => `<span class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium">${j}</span>`)
        .join('');

    document.getElementById('mbti-tip-title').textContent = `គន្លឹះអភិវឌ្ឍខ្លួនសម្រាប់ ${type}`;
    document.getElementById('mbti-tip').textContent = d[12];

    updateRadarChart(type, d[0], d[13]);
}

function updateRadarChart(type, themeKey, scores) {
    const ctx = document.getElementById('mbtiRadarChart');
    const color = radarColors[themeKey] || radarColors.NT;
    document.getElementById('radar-badge').textContent = type;

    if (radarChartInstance) {
        radarChartInstance.data.datasets[0].label = type;
        radarChartInstance.data.datasets[0].data = scores;
        radarChartInstance.data.datasets[0].backgroundColor = color.bg;
        radarChartInstance.data.datasets[0].borderColor = color.border;
        radarChartInstance.data.datasets[0].pointBackgroundColor = color.border;
        radarChartInstance.update();
    } else if (ctx && typeof Chart !== 'undefined') {
        radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['តក្កវិជ្ជា', 'ច្នៃប្រឌិត', 'យល់ចិត្ត', 'ផែនការ', 'បត់បែន'],
                datasets: [{
                    label: type,
                    data: scores,
                    fill: true,
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    pointBackgroundColor: color.border,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { display: false, stepSize: 25 },
                        pointLabels: {
                            font: { family: "'Kantumruy Pro', sans-serif", size: 11, weight: '600' },
                            color: '#334155'
                        }
                    }
                }
            }
        });
    }
}

function toggleMenu(id, event) {
    if (event) event.stopPropagation();
    const el = document.getElementById(id);
    const isHidden = el.classList.contains('hidden');
    closeAllMenus();
    if (isHidden) el.classList.remove('hidden');
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-menu').forEach((m) => m.classList.add('hidden'));
}

window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) closeAllMenus();
});

function setTheme(name) {
    customTheme = name;
    selectMBTI(currentType);
}

function toggleSection(contentId, arrowId) {
    document.getElementById(contentId).classList.toggle('hidden');
    document.getElementById(arrowId).classList.toggle('rotate-180');
}

function switchLoveTab(n) {
    document.querySelectorAll('.love-panel').forEach((p) => p.classList.add('hidden'));
    document.querySelectorAll('.love-tab').forEach((t) => {
        t.className = "love-tab px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600";
    });
    document.getElementById(`lpanel-${n}`).classList.remove('hidden');
    document.getElementById(`ltab-${n}`).className = "love-tab px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white";
}

function toggleQuizModal() {
    const m = document.getElementById('quiz-modal');
    m.classList.toggle('hidden');
    m.classList.toggle('flex');
}

function submitQuiz() {
    const c = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };
    for (let i = 1; i <= 8; i++) {
        const checked = document.querySelector(`input[name="q${i}"]:checked`);
        if (checked) c[checked.value]++;
    }
    const result =
        (c.I >= c.E ? 'I' : 'E') +
        (c.N >= c.S ? 'N' : 'S') +
        (c.T >= c.F ? 'T' : 'F') +
        (c.P >= c.J ? 'P' : 'J');
    selectMBTI(result);
    toggleQuizModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyResult() {
    const d = rawDB[currentType];
    const txt = `🧠 លទ្ធផល MBTI៖ ${currentType} - ${d[2]}\n✨ ${d[3]}\n🚀 ចំណុចខ្លាំង៖ ${d[7]}`;
    navigator.clipboard.writeText(txt).then(() => alert("បានចម្លងលទ្ធផលរួចរាល់!"));
}

function saveAsPNG() {
    html2canvas(document.getElementById('bento-capture-area'), { scale: 2, backgroundColor: '#f8fafc' }).then((canvas) => {
        const a = document.createElement('a');
        a.download = `MBTI-${currentType}.png`;
        a.href = canvas.toDataURL();
        a.click();
    });
}

function saveAsPDF() {
    const d = rawDB[currentType];
    const deep = groupDeepInfo[d[0]];
    const radarImg = radarChartInstance ? radarChartInstance.toBase64Image() : '';
    const el = document.createElement('div');
    el.style.cssText = "font-family:'Kantumruy Pro',sans-serif;padding:20px;color:#1e293b;background:#fff;line-height:1.6;";
    el.innerHTML = `
        <div style="border-bottom:2px solid #7c3aed;padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
            <div>
                <span style="background:#f3e8ff;color:#6b21a8;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:bold;">${themes[d[0]].group}</span>
                <h1 style="font-size:22px;font-weight:bold;margin:4px 0;">របាយការណ៍វិភាគ MBTI៖ ${currentType}</h1>
                <p style="font-size:13px;color:#475569;margin:0;">${d[1]} ${d[2]}</p>
            </div>
            ${radarImg ? `<img src="${radarImg}" style="width:120px;height:120px;object-fit:contain;" />` : ''}
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:10px;font-size:12px;">
            <strong>១. សេចក្តីសង្ខេប៖</strong> ${d[3]}<br>
            <strong>២. ខួរក្បាល (Cognitive Functions)៖</strong> ${d[5][0]}: ${d[5][1]} | ${d[6][0]}: ${d[6][1]}
        </div>
        <div style="display:flex;gap:10px;margin-bottom:10px;font-size:11.5px;">
            <div style="flex:1;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:10px;"><strong>🚀 ចំណុចខ្លាំង៖</strong> ${d[7]}</div>
            <div style="flex:1;background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:10px;"><strong>⚠️ ចំណុចខ្សោយ៖</strong> ${d[8]}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:10px;font-size:12px;">
            <strong>៣. តក្កវិជ្ជាដោះស្រាយបញ្ហា៖</strong> ${d[9]}
        </div>
        <div style="background:#fff1f2;border:1px solid #ffe4e6;border-radius:12px;padding:12px;margin-bottom:10px;font-size:12px;">
            <strong style="color:#be123c;display:block;margin-bottom:4px;">៤. ការវិភាគស៊ីជម្រៅផ្នែកស្នេហា និងអារម្មណ៍លាក់កំបាំង៖</strong>
            • <strong>របៀបស្រឡាញ់៖</strong> ${deep.love}<br>
            • <strong>ដៃគូដែលចង់បាន៖</strong> ${deep.partner} (${d[10]})<br>
            • <strong>អារម្មណ៍លាក់កំបាំង៖</strong> ${deep.fear}<br>
            • <strong>ពេលមានបញ្ហាស្នេហា៖</strong> ${deep.react}
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px;font-size:12px;">
            <strong>៥. អាជីពស័ក្តិសម៖</strong> ${d[11].join(', ')}<br>
            <strong>💡 គន្លឹះអភិវឌ្ឍខ្លួន៖</strong> ${d[12]}
        </div>
    `;
    html2pdf()
        .set({
            margin: 8,
            filename: `MBTI-${currentType}-Report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(el)
        .save();
}

selectMBTI('INTP');
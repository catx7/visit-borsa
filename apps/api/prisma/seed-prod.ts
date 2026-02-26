import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- Admin User (upsert — safe for re-runs) ---
  const adminPassword = await hash('V1s1tB0rs@2025!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@visitborsa.ro' },
    update: {},
    create: {
      email: 'admin@visitborsa.ro',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailConfirmed: true,
      firstName: 'Admin',
      lastName: 'VisitBorsa',
    },
  });

  console.log('Admin user upserted: admin@visitborsa.ro');

  // --- Tourist Attractions (14) ---
  await prisma.touristAttraction.createMany({
    skipDuplicates: true,
    data: [
      {
        titleRo: 'Cascada Cailor',
        titleEn: 'Horses Waterfall',
        descriptionRo:
          'Cascada Cailor este cea mai inalta cascada din Romania, cu o cadere de apa de 95 de metri, situata la altitudinea de 1300 m in Muntii Rodnei. Accesibila printr-un traseu montan spectaculos din statiunea Borsa, cascada impresioneza prin debitul puternic si peisajul salbatic inconjurator.',
        descriptionEn:
          'Horses Waterfall is the tallest waterfall in Romania, with a 95-meter drop located at 1,300 m altitude in the Rodna Mountains. Accessible via a spectacular mountain trail from the Borsa resort, the waterfall impresses with its powerful flow and the surrounding wild landscape.',
        latitude: 47.6019,
        longitude: 24.8022,
        displayOrder: 1,
        images: [
          'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b63?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop',
        ],
        isLocationOfMonth: true,
      },
      {
        titleRo: 'Parcul National Muntii Rodnei',
        titleEn: 'Rodna Mountains National Park',
        descriptionRo:
          'Parcul National Muntii Rodnei este o arie protejata de importanta internationala, desemnata Rezervatie a Biosferei de catre UNESCO. Cu o suprafata de peste 46.000 de hectare, parcul adaposteste o biodiversitate remarcabila.',
        descriptionEn:
          'Rodna Mountains National Park is an internationally important protected area, designated a UNESCO Biosphere Reserve. Spanning over 46,000 hectares, the park harbors remarkable biodiversity.',
        latitude: 47.5833,
        longitude: 24.8167,
        displayOrder: 2,
        images: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Varful Pietrosul Rodnei',
        titleEn: 'Pietrosul Rodnei Peak',
        descriptionRo:
          'Varful Pietrosul Rodnei, cu o altitudine de 2303 m, este cel mai inalt punct din Carpatii Orientali si punctul culminant al Muntilor Rodnei.',
        descriptionEn:
          'Pietrosul Rodnei Peak, at 2,303 m altitude, is the highest point in the Eastern Carpathians and the culminating summit of the Rodna Mountains.',
        latitude: 47.593,
        longitude: 24.63,
        displayOrder: 3,
        images: [
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Lacul Iezer',
        titleEn: 'Iezer Glacial Lake',
        descriptionRo:
          'Lacul Iezer este un lac glaciar situat la altitudinea de 1786 m in Muntii Rodnei, renumit pentru forma sa care aminteste de harta Romaniei.',
        descriptionEn:
          'Iezer Glacial Lake is a glacial lake situated at 1,786 m altitude in the Rodna Mountains, renowned for its shape resembling the map of Romania.',
        latitude: 47.586,
        longitude: 24.62,
        displayOrder: 4,
        images: [
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Lacul Stiol',
        titleEn: 'Stiol Glacial Lake',
        descriptionRo:
          'Lacul Stiol este un lac glaciar pitoresc aflat la poalele Varfului Gargalau, fiind considerat izvorul raului Bistrita Aurii.',
        descriptionEn:
          'Stiol Glacial Lake is a picturesque glacial lake located at the foothills of Gargalau Peak, considered the source of the Bistrita Aurii River.',
        latitude: 47.58,
        longitude: 24.64,
        displayOrder: 5,
        images: [
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Complexul de Schi Borsa',
        titleEn: 'Borsa Ski Complex',
        descriptionRo:
          'Complexul de Schi Borsa, cunoscut si ca Partia Olimpica, este cel mai mare domeniu schiabil din Maramures, cu o telecabina de 2.6 km.',
        descriptionEn:
          'The Borsa Ski Complex, also known as the Olympic Slope, is the largest ski area in Maramures, with a 2.6 km gondola.',
        latitude: 47.651,
        longitude: 24.672,
        displayOrder: 6,
        images: [
          'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Pestera Haiducului Buftiuc',
        titleEn: 'Buftiuc Outlaw Cave',
        descriptionRo:
          'Pestera Haiducului Buftiuc este o formatie carstice situata in apropierea Cascadei Cailor, invaluita in legende locale despre haiduci si comori ascunse.',
        descriptionEn:
          'Buftiuc Outlaw Cave is a karst formation located near Horses Waterfall, shrouded in local legends about outlaws and hidden treasures.',
        latitude: 47.605,
        longitude: 24.795,
        displayOrder: 7,
        images: [
          'https://images.unsplash.com/photo-1504699931874-e08a394733b1?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Muzeul Radacinilor',
        titleEn: 'Roots Museum',
        descriptionRo:
          'Muzeul Radacinilor este un muzeu unic in Romania, creat de artistul local Stefan Grec, care a adunat peste 100 de radacini cu forme neobisnuite.',
        descriptionEn:
          'The Roots Museum is a unique museum in Romania, created by local artist Stefan Grec, who collected over 100 roots with unusual shapes.',
        latitude: 47.652,
        longitude: 24.664,
        displayOrder: 8,
        images: [
          'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Biserica de Lemn "Sf. Arhangheli Mihail si Gavril"',
        titleEn: 'Wooden Church "Holy Archangels Michael and Gabriel"',
        descriptionRo:
          'Biserica de Lemn din Borsa, construita in jurul anului 1700, este un monument istoric reprezentativ pentru arhitectura traditionala maramureseana.',
        descriptionEn:
          'The Wooden Church in Borsa, built around 1700, is a historical monument representative of traditional Maramures architecture.',
        latitude: 47.652,
        longitude: 24.6635,
        displayOrder: 9,
        images: [
          'https://images.unsplash.com/photo-1555424681-b0ecf4fe11fa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Manastirea Moisei',
        titleEn: 'Moisei Monastery',
        descriptionRo:
          'Manastirea Moisei, infiintata in anul 1599, este una dintre cele mai vechi asezari monastice din Maramures.',
        descriptionEn:
          'Moisei Monastery, established in 1599, is one of the oldest monastic settlements in Maramures.',
        latitude: 47.658,
        longitude: 24.538,
        displayOrder: 10,
        images: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555424681-b0ecf4fe11fa?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Monumentul Eroilor Moisei',
        titleEn: 'Moisei Heroes Monument',
        descriptionRo:
          'Monumentul Eroilor din Moisei este un memorial dedicat celor 29 de victime ale masacrului din octombrie 1944.',
        descriptionEn:
          'The Moisei Heroes Monument is a memorial dedicated to the 29 victims of the October 1944 massacre.',
        latitude: 47.6565,
        longitude: 24.535,
        displayOrder: 11,
        images: [
          'https://images.unsplash.com/photo-1564429238961-bf8b8d024ee8?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Izvoarele Minerale',
        titleEn: 'Mineral Springs',
        descriptionRo:
          'Izvoarele minerale din Borsa sunt documentate inca din anul 1906 si sunt renumite pentru proprietatile lor terapeutice.',
        descriptionEn:
          'The mineral springs of Borsa have been documented since 1906 and are renowned for their therapeutic properties.',
        latitude: 47.6585,
        longitude: 24.6655,
        displayOrder: 12,
        images: [
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Pasul Prislop',
        titleEn: 'Prislop Pass',
        descriptionRo:
          'Pasul Prislop, la altitudinea de 1416 m, este unul dintre cele mai spectaculoase pasuri montane din Romania.',
        descriptionEn:
          'Prislop Pass, at 1,416 m altitude, is one of the most spectacular mountain passes in Romania.',
        latitude: 47.5847,
        longitude: 24.8125,
        displayOrder: 13,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        ],
      },
      {
        titleRo: 'Schitul Pietroasa',
        titleEn: 'Pietroasa Hermitage',
        descriptionRo:
          'Schitul Pietroasa este un lacas de cult izolat, asezat la altitudinea de aproximativ 1000 m, intr-un cadru natural de o frumusete rara.',
        descriptionEn:
          'Pietroasa Hermitage is an isolated place of worship, set at approximately 1,000 m altitude in a naturally beautiful setting.',
        latitude: 47.62,
        longitude: 24.75,
        displayOrder: 14,
        images: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
        ],
      },
    ],
  });
  console.log('Created 14 tourist attractions');

  // --- Demo Client User ---
  const clientPassword = await hash('DemoClient2025!', 12);
  const demoClient = await prisma.user.upsert({
    where: { email: 'demo@visitborsa.ro' },
    update: {},
    create: {
      email: 'demo@visitborsa.ro',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Maria',
      lastName: 'Popescu',
      phone: '+40 745 123 456',
    },
  });
  console.log('Demo client upserted: demo@visitborsa.ro');

  // --- 10 Demo Properties (APPROVED) ---
  const properties = [
    {
      type: 'PENSIUNE' as const,
      titleRo: 'Pensiunea Rodnei',
      titleEn: 'Rodnei Guesthouse',
      descriptionRo:
        'Pensiune tradițională în inima Borșei, cu vedere la munți și acces ușor la pârtiile de schi. Camere confortabile, mic dejun inclus și parcare gratuită.',
      descriptionEn:
        'Traditional guesthouse in the heart of Borsa, with mountain views and easy access to ski slopes. Comfortable rooms, breakfast included and free parking.',
      address: 'Str. Principală nr. 10, Borșa',
      latitude: 47.652,
      longitude: 24.664,
      pricePerNight: 250,
      rooms: 8,
      maxGuests: 16,
      amenities: [
        'wifi',
        'parking',
        'breakfast',
        'mountain-view',
        'traditional-style',
      ],
      mealPolicy: 'INCLUDED' as const,
      paymentMethods: ['CASH', 'BANK_TRANSFER'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'CABANA' as const,
      titleRo: 'Cabana Prislop',
      titleEn: 'Prislop Cabin',
      descriptionRo:
        'Cabană rustică la poalele Munților Rodnei, ideală pentru drumeții și relaxare în natură. Șemineu funcțional și grătar în curte.',
      descriptionEn:
        'Rustic cabin at the foot of the Rodna Mountains, ideal for hiking and relaxation in nature. Working fireplace and BBQ in the yard.',
      address: 'Zona Prislop, Borșa',
      latitude: 47.585,
      longitude: 24.81,
      pricePerNight: 350,
      priceWholeUnit: 600,
      rooms: 4,
      maxGuests: 10,
      amenities: [
        'wifi',
        'parking',
        'fireplace',
        'bbq',
        'mountain-view',
        'garden',
      ],
      mealPolicy: 'NONE' as const,
      paymentMethods: ['CASH', 'CARD'],
      images: [
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'HOTEL' as const,
      titleRo: 'Hotel Borșa Resort',
      titleEn: 'Borsa Resort Hotel',
      descriptionRo:
        'Hotel modern cu spa și piscină, situat lângă telecabina Borșa. Camere spațioase cu balcon și toate facilitățile necesare.',
      descriptionEn:
        'Modern hotel with spa and pool, located near the Borsa gondola. Spacious rooms with balconies and all necessary amenities.',
      address: 'Str. Telecabinei nr. 5, Borșa',
      latitude: 47.651,
      longitude: 24.672,
      pricePerNight: 450,
      rooms: 30,
      maxGuests: 60,
      amenities: [
        'wifi',
        'parking',
        'pool',
        'spa',
        'restaurant',
        'gym',
        'bar',
        'ski-access',
      ],
      mealPolicy: 'INCLUDED' as const,
      paymentMethods: ['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE'],
      paidExtras: ['spa', 'massage', 'sauna'],
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'VILA' as const,
      titleRo: 'Vila Cascada',
      titleEn: 'Waterfall Villa',
      descriptionRo:
        'Vilă elegantă pe drumul spre Cascada Cailor. Ideală pentru familii sau grupuri, cu grădină mare și loc de joacă pentru copii.',
      descriptionEn:
        'Elegant villa on the road to Horses Waterfall. Ideal for families or groups, with large garden and playground for children.',
      address: 'Drumul Cascadei, Borșa',
      latitude: 47.61,
      longitude: 24.79,
      pricePerNight: 300,
      priceWholeUnit: 800,
      rooms: 6,
      maxGuests: 14,
      amenities: [
        'wifi',
        'parking',
        'garden',
        'bbq',
        'mountain-view',
        'terrace',
      ],
      mealPolicy: 'EXTRA_COST' as const,
      paymentMethods: ['CASH', 'BANK_TRANSFER'],
      depositRequired: true,
      depositPolicyRo: '30% avans la confirmare, restul la cazare',
      depositPolicyEn: '30% deposit on confirmation, balance at check-in',
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'APARTAMENT' as const,
      titleRo: 'Apartament Central',
      titleEn: 'Central Apartment',
      descriptionRo:
        'Apartament modern în centrul Borșei, complet mobilat și utilat. Aproape de magazine, restaurante și transport public.',
      descriptionEn:
        'Modern apartment in the center of Borsa, fully furnished and equipped. Close to shops, restaurants and public transport.',
      address: 'Str. Libertății nr. 22, Borșa',
      latitude: 47.653,
      longitude: 24.665,
      pricePerNight: 200,
      rooms: 2,
      maxGuests: 4,
      amenities: ['wifi', 'parking', 'air-conditioning'],
      mealPolicy: 'NONE' as const,
      paymentMethods: ['CASH', 'CARD'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'PENSIUNE' as const,
      titleRo: 'Pensiunea Floare de Colț',
      titleEn: 'Edelweiss Guesthouse',
      descriptionRo:
        'Pensiune cochetă cu specific tradițional maramureșean, situată într-o zonă liniștită. Bucătărie cu produse locale și grădină cu flori.',
      descriptionEn:
        'Charming guesthouse with traditional Maramures style, located in a quiet area. Kitchen with local products and flower garden.',
      address: 'Str. Florilor nr. 3, Borșa',
      latitude: 47.6545,
      longitude: 24.6625,
      pricePerNight: 220,
      rooms: 6,
      maxGuests: 12,
      amenities: [
        'wifi',
        'parking',
        'breakfast',
        'garden',
        'traditional-style',
        'mountain-view',
      ],
      mealPolicy: 'INCLUDED' as const,
      paymentMethods: ['CASH', 'BANK_TRANSFER'],
      images: [
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'CABANA' as const,
      titleRo: 'Cabana Ursului',
      titleEn: 'Bear Cabin',
      descriptionRo:
        'Cabană izolată în pădure, perfectă pentru escapade romantice sau retrageri în natură. Cadă cu hidromasaj pe terasă, șemineu și liniște totală.',
      descriptionEn:
        'Secluded cabin in the forest, perfect for romantic getaways or nature retreats. Hot tub on the terrace, fireplace and complete tranquility.',
      address: 'Zona Pădure, Borșa',
      latitude: 47.645,
      longitude: 24.685,
      pricePerNight: 400,
      priceWholeUnit: 400,
      rooms: 2,
      maxGuests: 4,
      amenities: ['wifi', 'parking', 'fireplace', 'terrace', 'mountain-view'],
      mealPolicy: 'NONE' as const,
      paymentMethods: ['CASH', 'CARD', 'ONLINE'],
      paidExtras: ['hot_tub', 'sauna'],
      images: [
        'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'CASA_VACANTA' as const,
      titleRo: 'Casa de Vacanță Munții Rodnei',
      titleEn: 'Rodna Mountains Holiday House',
      descriptionRo:
        'Casă de vacanță spațioasă, cu grădină mare, ideală pentru familii sau grupuri mari. Complet echipată, cu loc de joacă și zonă de grătar.',
      descriptionEn:
        'Spacious holiday house with large garden, ideal for families or large groups. Fully equipped, with playground and barbecue area.',
      address: 'Str. Munților nr. 45, Borșa',
      latitude: 47.648,
      longitude: 24.668,
      pricePerNight: 500,
      priceWholeUnit: 500,
      rooms: 5,
      maxGuests: 12,
      amenities: [
        'wifi',
        'parking',
        'garden',
        'bbq',
        'terrace',
        'mountain-view',
      ],
      mealPolicy: 'NONE' as const,
      paymentMethods: ['CASH', 'BANK_TRANSFER', 'CARD'],
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'CAMERA' as const,
      titleRo: 'Cameră la Familia Ionescu',
      titleEn: 'Room at Ionescu Family',
      descriptionRo:
        'Cameră curată și confortabilă în casa unei familii locale. Acces la bucătărie și grădină. Experiență autentică de cazare la localnici.',
      descriptionEn:
        'Clean and comfortable room in a local family house. Access to kitchen and garden. Authentic local accommodation experience.',
      address: 'Str. Livezilor nr. 8, Borșa',
      latitude: 47.6555,
      longitude: 24.663,
      pricePerNight: 120,
      rooms: 1,
      maxGuests: 2,
      amenities: ['wifi', 'parking', 'garden'],
      mealPolicy: 'EXTRA_COST' as const,
      paymentMethods: ['CASH'],
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
      ],
    },
    {
      type: 'HOTEL' as const,
      titleRo: 'Hotel Maramureș',
      titleEn: 'Maramures Hotel',
      descriptionRo:
        'Hotel cu tradiție în Borșa, renovat recent. Restaurant cu bucătărie locală și internațională, sală de conferințe și parcare subterană.',
      descriptionEn:
        'Established hotel in Borsa, recently renovated. Restaurant with local and international cuisine, conference room and underground parking.',
      address: 'Bd. Republicii nr. 12, Borșa',
      latitude: 47.6515,
      longitude: 24.666,
      pricePerNight: 380,
      rooms: 20,
      maxGuests: 40,
      amenities: [
        'wifi',
        'parking',
        'restaurant',
        'bar',
        'air-conditioning',
        'room-service',
      ],
      mealPolicy: 'INCLUDED' as const,
      paymentMethods: ['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE'],
      images: [
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
      ],
    },
  ];

  for (const prop of properties) {
    await prisma.property.create({
      data: {
        ...prop,
        ownerId: demoClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 10 demo properties (APPROVED)');

  // --- 10 Demo Services (APPROVED) ---
  const services = [
    {
      category: 'ATV' as const,
      titleRo: 'Ture ATV Borșa',
      titleEn: 'Borsa ATV Tours',
      descriptionRo:
        'Explorează munții din Borșa cu ATV-ul! Ture ghidate pe trasee montane spectaculoase, pentru începători și avansați.',
      descriptionEn:
        'Explore the mountains of Borsa by ATV! Guided tours on spectacular mountain trails, for beginners and advanced riders.',
      phone: '+40 740 111 111',
      address: 'Zona Telecabina, Borșa',
      priceInfo: 'De la 150 RON / oră',
      latitude: 47.651,
      longitude: 24.67,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'HIKING' as const,
      titleRo: 'Ghid Montan Rodnei',
      titleEn: 'Rodnei Mountain Guide',
      descriptionRo:
        'Ghid montan autorizat pentru trasee în Munții Rodnei. Trasee către Cascada Cailor, Lacul Iezer, Vf. Pietrosul.',
      descriptionEn:
        'Authorized mountain guide for trails in the Rodna Mountains. Routes to Horses Waterfall, Iezer Lake, Pietrosul Peak.',
      phone: '+40 740 222 222',
      email: 'ghid@visitborsa.ro',
      priceInfo: 'De la 200 RON / zi',
      latitude: 47.652,
      longitude: 24.664,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'SKIING' as const,
      titleRo: 'Instructor Schi Pârtia Olimpică',
      titleEn: 'Olympic Slope Ski Instructor',
      descriptionRo:
        'Lecții de schi pentru toate nivelurile pe Pârtia Olimpică din Borșa. Echipament inclus la cerere.',
      descriptionEn:
        'Ski lessons for all levels on the Olympic Slope in Borsa. Equipment included upon request.',
      phone: '+40 740 333 333',
      address: 'Pârtia Olimpică, Borșa',
      priceInfo: 'De la 120 RON / oră',
      latitude: 47.651,
      longitude: 24.672,
      images: [
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'TAXI_LOCAL' as const,
      titleRo: 'Taxi Rapid Borșa',
      titleEn: 'Borsa Quick Taxi',
      descriptionRo:
        'Serviciu de taxi local în Borșa și împrejurimi. Transport la aeroport, gară și obiective turistice.',
      descriptionEn:
        'Local taxi service in Borsa and surroundings. Transport to airport, train station and tourist attractions.',
      phone: '+40 740 444 444',
      priceInfo: 'De la 5 RON / km',
      latitude: 47.653,
      longitude: 24.665,
      images: [
        'https://images.unsplash.com/photo-1449965408869-ebd3fee7710d?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'SNOWMOBILE' as const,
      titleRo: 'Aventuri pe Zăpadă',
      titleEn: 'Snow Adventures',
      descriptionRo:
        'Aventură pe zăpadă cu snowmobilul! Ture ghidate prin păduri și pe creste montane, iarna perfectă în Borșa.',
      descriptionEn:
        'Snow adventure by snowmobile! Guided tours through forests and mountain ridges, the perfect winter in Borsa.',
      phone: '+40 740 555 555',
      address: 'Zona Telecabina, Borșa',
      priceInfo: 'De la 200 RON / 30 min',
      latitude: 47.65,
      longitude: 24.671,
      images: [
        'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'HORSEBACK_RIDING' as const,
      titleRo: 'Plimbări Călare pe Munte',
      titleEn: 'Mountain Horseback Riding',
      descriptionRo:
        'Plimbări călare pe trasee montane din jurul Borșei. Cai blânzi, potriviți și pentru începători. Experiență unică în natură.',
      descriptionEn:
        'Horseback riding on mountain trails around Borsa. Gentle horses suitable for beginners. Unique nature experience.',
      phone: '+40 741 111 111',
      address: 'Zona Prislop, Borșa',
      priceInfo: 'De la 100 RON / oră',
      latitude: 47.588,
      longitude: 24.808,
      images: [
        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'ATV' as const,
      titleRo: 'Off-Road Extreme Borșa',
      titleEn: 'Borsa Off-Road Extreme',
      descriptionRo:
        'Ture ATV extreme pe trasee off-road dificile pentru cei cu experiență. Echipament de protecție inclus.',
      descriptionEn:
        'Extreme ATV tours on difficult off-road trails for experienced riders. Protective equipment included.',
      phone: '+40 741 222 222',
      address: 'Zona Cascada Cailor, Borșa',
      priceInfo: 'De la 250 RON / 2 ore',
      latitude: 47.608,
      longitude: 24.795,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'HIKING' as const,
      titleRo: 'Trasee Nordic Walking',
      titleEn: 'Nordic Walking Trails',
      descriptionRo:
        'Sesiuni ghidate de nordic walking pe trasee ușoare din zona Borșei. Ideal pentru seniori și familii. Bețe furnizate.',
      descriptionEn:
        'Guided nordic walking sessions on easy trails around Borsa. Ideal for seniors and families. Poles provided.',
      phone: '+40 741 333 333',
      priceInfo: 'De la 80 RON / persoană',
      latitude: 47.654,
      longitude: 24.663,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'SKIING' as const,
      titleRo: 'Închirieri Echipament Schi',
      titleEn: 'Ski Equipment Rental',
      descriptionRo:
        'Închiriere echipament de schi complet — skiuri, clăpari, bețe, cască. Echipament pentru adulți și copii.',
      descriptionEn:
        'Full ski equipment rental — skis, boots, poles, helmet. Equipment for adults and children.',
      phone: '+40 741 444 444',
      address: 'Baza Pârtiei Olimpice, Borșa',
      priceInfo: 'De la 60 RON / zi',
      latitude: 47.6505,
      longitude: 24.673,
      images: [
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'SNOWMOBILE' as const,
      titleRo: 'Snowmobile Night Ride',
      titleEn: 'Snowmobile Night Ride',
      descriptionRo:
        'Experiență unică de snowmobile pe timp de noapte! Ture ghidate cu iluminare LED, ceai cald la sosire.',
      descriptionEn:
        'Unique nighttime snowmobile experience! Guided tours with LED lighting, hot tea on arrival.',
      phone: '+40 741 555 555',
      address: 'Zona Telecabina, Borșa',
      priceInfo: 'De la 300 RON / persoană',
      latitude: 47.651,
      longitude: 24.6715,
      images: [
        'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop',
      ],
    },
  ];

  for (const svc of services) {
    await prisma.service.create({
      data: {
        ...svc,
        ownerId: demoClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 10 demo services (APPROVED)');

  // --- 10 Demo Restaurants (APPROVED) ---
  const restaurants = [
    {
      titleRo: 'Restaurant La Conac',
      titleEn: 'The Manor Restaurant',
      descriptionRo:
        'Restaurant tradițional cu specific maramureșean. Preparate din ingrediente locale, atmosferă autentică cu muzică live în weekend.',
      descriptionEn:
        'Traditional restaurant with Maramures cuisine. Dishes from local ingredients, authentic atmosphere with live music on weekends.',
      cuisineRo: 'Bucătărie tradițională maramureșeană',
      cuisineEn: 'Traditional Maramures cuisine',
      phone: '+40 740 666 666',
      address: 'Str. Principală nr. 15, Borșa',
      openingHours: 'Luni-Duminică: 10:00 - 22:00',
      latitude: 47.6525,
      longitude: 24.6645,
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Pizzeria Bella Vista',
      titleEn: 'Bella Vista Pizzeria',
      descriptionRo:
        'Pizza artizanală coaptă în cuptor cu lemne, paste proaspete și salate. Vedere panoramică la munți de pe terasă.',
      descriptionEn:
        'Artisan pizza baked in a wood-fired oven, fresh pasta and salads. Panoramic mountain views from the terrace.',
      cuisineRo: 'Italiană',
      cuisineEn: 'Italian',
      phone: '+40 740 777 777',
      address: 'Str. Telecabinei nr. 3, Borșa',
      openingHours: 'Luni-Duminică: 11:00 - 23:00',
      latitude: 47.651,
      longitude: 24.6715,
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Cabana Muntelui',
      titleEn: 'Mountain Cabin Restaurant',
      descriptionRo:
        'Restaurant de munte cu preparate la grătar și specialități locale. Terasă cu vedere la pârtia de schi.',
      descriptionEn:
        'Mountain restaurant with grilled dishes and local specialties. Terrace overlooking the ski slope.',
      cuisineRo: 'Grill și specialități locale',
      cuisineEn: 'Grill and local specialties',
      phone: '+40 740 888 888',
      address: 'Zona Pârtia Olimpică, Borșa',
      openingHours: 'Luni-Duminică: 09:00 - 21:00',
      latitude: 47.6505,
      longitude: 24.6725,
      images: [
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Bistro Central',
      titleEn: 'Central Bistro',
      descriptionRo:
        'Bistro modern în centrul Borșei. Meniu diversificat cu opțiuni internaționale și locale, cafea de specialitate.',
      descriptionEn:
        'Modern bistro in the center of Borsa. Diverse menu with international and local options, specialty coffee.',
      cuisineRo: 'Internațională',
      cuisineEn: 'International',
      phone: '+40 740 999 999',
      address: 'Str. Libertății nr. 5, Borșa',
      openingHours: 'Luni-Sâmbătă: 08:00 - 22:00',
      latitude: 47.6535,
      longitude: 24.6655,
      images: [
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Terasa Cascadei',
      titleEn: 'Waterfall Terrace',
      descriptionRo:
        'Terasă în aer liber pe drumul spre Cascada Cailor. Mici, cârnați și ciorbă de burtă, într-un cadru natural superb.',
      descriptionEn:
        'Open-air terrace on the road to Horses Waterfall. Grilled sausages and tripe soup in a gorgeous natural setting.',
      cuisineRo: 'Românească tradițională',
      cuisineEn: 'Traditional Romanian',
      phone: '+40 741 000 000',
      address: 'Drumul Cascadei, Borșa',
      openingHours: 'Luni-Duminică: 10:00 - 20:00 (sezon)',
      latitude: 47.61,
      longitude: 24.79,
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Pensiunea-Restaurant Maramureșul',
      titleEn: 'Maramuresul Inn-Restaurant',
      descriptionRo:
        'Restaurant cu specific maramureșean autentic, cu sarmale, bulz și balmoș preparat după rețete tradiționale din Borșa.',
      descriptionEn:
        'Restaurant with authentic Maramures specialties, with traditional cabbage rolls, polenta dishes prepared from Borsa recipes.',
      cuisineRo: 'Maramureșeană autentică',
      cuisineEn: 'Authentic Maramures',
      phone: '+40 741 666 666',
      address: 'Str. Tineretului nr. 7, Borșa',
      openingHours: 'Luni-Duminică: 11:00 - 21:00',
      latitude: 47.654,
      longitude: 24.6635,
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Fast Food La Telegondolă',
      titleEn: 'Gondola Fast Food',
      descriptionRo:
        'Fast food la baza telegondolei. Shaorma, burgeri, cartofi prăjiți și băuturi calde. Rapid și accesibil.',
      descriptionEn:
        'Fast food at the base of the gondola. Shawarma, burgers, fries and hot drinks. Quick and affordable.',
      cuisineRo: 'Fast food',
      cuisineEn: 'Fast food',
      phone: '+40 741 777 777',
      address: 'Baza Telecabinei, Borșa',
      openingHours: 'Luni-Duminică: 09:00 - 20:00',
      latitude: 47.6508,
      longitude: 24.672,
      images: [
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Cofetăria Dulce Borșa',
      titleEn: 'Sweet Borsa Pastry Shop',
      descriptionRo:
        'Cofetărie artizanală cu prăjituri tradiționale și moderne. Tort la comandă, înghețată de casă și cafea de specialitate.',
      descriptionEn:
        'Artisan pastry shop with traditional and modern cakes. Custom cakes, homemade ice cream and specialty coffee.',
      cuisineRo: 'Cofetărie și patiserie',
      cuisineEn: 'Pastry and confectionery',
      phone: '+40 741 888 888',
      address: 'Str. Principală nr. 20, Borșa',
      openingHours: 'Luni-Sâmbătă: 08:00 - 20:00',
      latitude: 47.6528,
      longitude: 24.665,
      images: [
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Pub & Grill Mountain Spirit',
      titleEn: 'Mountain Spirit Pub & Grill',
      descriptionRo:
        'Pub cu atmosferă relaxată, bere artizanală locală și grătar premium. Muzică live vineri și sâmbătă.',
      descriptionEn:
        'Pub with relaxed atmosphere, local craft beer and premium grill. Live music on Fridays and Saturdays.',
      cuisineRo: 'Pub food & grill',
      cuisineEn: 'Pub food & grill',
      phone: '+40 741 999 999',
      address: 'Str. Libertății nr. 10, Borșa',
      openingHours: 'Luni-Duminică: 16:00 - 01:00',
      latitude: 47.6532,
      longitude: 24.6648,
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      ],
    },
    {
      titleRo: 'Sushi Bar Zen',
      titleEn: 'Zen Sushi Bar',
      descriptionRo:
        'Primul sushi bar din Borșa! Sushi proaspăt preparat zilnic, ramen și specialități asiatice într-un ambient modern.',
      descriptionEn:
        'The first sushi bar in Borsa! Fresh sushi prepared daily, ramen and Asian specialties in a modern setting.',
      cuisineRo: 'Japoneză și asiatică',
      cuisineEn: 'Japanese and Asian',
      phone: '+40 742 000 000',
      address: 'Str. Telecabinei nr. 8, Borșa',
      openingHours: 'Marți-Duminică: 12:00 - 22:00',
      latitude: 47.6512,
      longitude: 24.671,
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      ],
    },
  ];

  for (const rest of restaurants) {
    await prisma.restaurant.create({
      data: {
        ...rest,
        ownerId: demoClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 10 demo restaurants (APPROVED)');

  console.log('\n=== Production seed completed ===');
  console.log('Admin: admin@visitborsa.ro / V1s1tB0rs@2025!');
  console.log('Demo client: demo@visitborsa.ro / DemoClient2025!');
  console.log(
    'Created: 14 attractions, 10 properties, 10 services, 10 restaurants',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

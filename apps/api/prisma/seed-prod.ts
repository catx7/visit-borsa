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
        images: [
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
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
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
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
        images: [
          'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop',
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
        images: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
        ],
      },
    ],
  });

  // --- Test Client User ---
  const clientPassword = await hash('TestClient2025!', 12);
  const testClient = await prisma.user.upsert({
    where: { email: 'test@visitborsa.ro' },
    update: {},
    create: {
      email: 'test@visitborsa.ro',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Test',
      lastName: 'Client',
      phone: '+40 700 000 000',
    },
  });
  console.log('Test client upserted: test@visitborsa.ro');

  // --- 5 Test Properties (APPROVED) ---
  const properties = [
    {
      type: 'PENSIUNE' as const,
      titleRo: 'TEST Pensiunea Rodnei',
      titleEn: 'TEST Rodnei Guesthouse',
      descriptionRo:
        'Pensiune tradițională în inima Borșei, cu vedere la munți și acces ușor la pârtiile de schi. Camere confortabile, mic dejun inclus.',
      descriptionEn:
        'Traditional guesthouse in the heart of Borsa, with mountain views and easy access to ski slopes. Comfortable rooms, breakfast included.',
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
      titleRo: 'TEST Cabana Prislop',
      titleEn: 'TEST Prislop Cabin',
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
      titleRo: 'TEST Hotel Borșa Resort',
      titleEn: 'TEST Borsa Resort Hotel',
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
      titleRo: 'TEST Vila Cascada',
      titleEn: 'TEST Waterfall Villa',
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
      titleRo: 'TEST Apartament Central',
      titleEn: 'TEST Central Apartment',
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
  ];

  for (const prop of properties) {
    await prisma.property.create({
      data: {
        ...prop,
        ownerId: testClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 5 test properties (APPROVED)');

  // --- 5 Test Services (APPROVED) ---
  const services = [
    {
      category: 'ATV' as const,
      titleRo: 'TEST Ture ATV Borșa',
      titleEn: 'TEST Borsa ATV Tours',
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
      titleRo: 'TEST Ghid Montan Borșa',
      titleEn: 'TEST Borsa Mountain Guide',
      descriptionRo:
        'Ghid montan autorizat pentru trasee în Munții Rodnei. Trasee către Cascada Cailor, Lacul Iezer, Vf. Pietrosul.',
      descriptionEn:
        'Authorized mountain guide for trails in the Rodna Mountains. Routes to Horses Waterfall, Iezer Lake, Pietrosul Peak.',
      phone: '+40 740 222 222',
      email: 'ghid@test.ro',
      priceInfo: 'De la 200 RON / zi',
      latitude: 47.652,
      longitude: 24.664,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      ],
    },
    {
      category: 'SKIING' as const,
      titleRo: 'TEST Instructor Schi Borșa',
      titleEn: 'TEST Borsa Ski Instructor',
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
      titleRo: 'TEST Taxi Borșa',
      titleEn: 'TEST Borsa Taxi',
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
      titleRo: 'TEST Snowmobile Borșa',
      titleEn: 'TEST Borsa Snowmobile',
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
  ];

  for (const svc of services) {
    await prisma.service.create({
      data: {
        ...svc,
        ownerId: testClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 5 test services (APPROVED)');

  // --- 5 Test Restaurants (APPROVED) ---
  const restaurants = [
    {
      titleRo: 'TEST Restaurant La Conac',
      titleEn: 'TEST The Manor Restaurant',
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
      titleRo: 'TEST Pizzeria Bella Vista',
      titleEn: 'TEST Bella Vista Pizzeria',
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
      titleRo: 'TEST Cabana Muntelui',
      titleEn: 'TEST Mountain Cabin Restaurant',
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
      titleRo: 'TEST Bistro Central',
      titleEn: 'TEST Central Bistro',
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
      titleRo: 'TEST Terasa Cascadei',
      titleEn: 'TEST Waterfall Terrace',
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
  ];

  for (const rest of restaurants) {
    await prisma.restaurant.create({
      data: {
        ...rest,
        ownerId: testClient.id,
        status: 'APPROVED',
      },
    });
  }
  console.log('Created 5 test restaurants (APPROVED)');

  console.log('Production seed completed successfully!');
  console.log(
    'Created: 1 admin user, 1 test client, 14 attractions, 5 properties, 5 services, 5 restaurants',
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

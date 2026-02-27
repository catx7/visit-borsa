import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.service.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.property.deleteMany();
  await prisma.touristAttraction.deleteMany();
  await prisma.user.deleteMany();

  // --- Users (8: 1 admin + 7 clients) ---
  const adminPassword = await hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'changeme',
    12,
  );
  const clientPassword = await hash(
    process.env.SEED_CLIENT_PASSWORD ?? 'changeme',
    12,
  );

  const admin = await prisma.user.create({
    data: {
      email: 'admin@visitborsa.ro',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailConfirmed: true,
      firstName: 'Admin',
      lastName: 'VisitBorsa',
    },
  });

  const ion = await prisma.user.create({
    data: {
      email: 'ion@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Ion',
      lastName: 'Popescu',
      phone: '+40712345678',
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Maria',
      lastName: 'Ionescu',
      phone: '+40723456789',
    },
  });

  const gheorghe = await prisma.user.create({
    data: {
      email: 'gheorghe@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Gheorghe',
      lastName: 'Moldovan',
      phone: '+40734567890',
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: 'elena@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Elena',
      lastName: 'Rus',
      phone: '+40745678901',
    },
  });

  const vasile = await prisma.user.create({
    data: {
      email: 'vasile@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Vasile',
      lastName: 'Bud',
      phone: '+40756789012',
    },
  });

  const ana = await prisma.user.create({
    data: {
      email: 'ana@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Ana',
      lastName: 'Grec',
      phone: '+40767890123',
    },
  });

  const mihai = await prisma.user.create({
    data: {
      email: 'mihai@example.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      emailConfirmed: true,
      firstName: 'Mihai',
      lastName: 'Ticusan',
      phone: '+40778901234',
    },
  });

  // --- Tourist Attractions (14) ---
  await prisma.touristAttraction.createMany({
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

  // --- Properties (10 — covering all 7 PropertyTypes) ---
  await prisma.property.createMany({
    data: [
      // HOTEL
      {
        type: 'HOTEL',
        titleRo: 'Hotel Paltinis',
        titleEn: 'Paltinis Hotel',
        descriptionRo: 'Hotel de 3 stele in centrul Borsei, cu restaurant, bar, sala de conferinte si parcare. Camere moderne cu balcon si vedere la munti.',
        descriptionEn: '3-star hotel in the center of Borsa, with restaurant, bar, conference room, and parking. Modern rooms with balcony and mountain views.',
        address: 'Strada Principala 100, Borsa',
        latitude: 47.654,
        longitude: 24.666,
        pricePerNight: 280,
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        ],
        ownerId: ion.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'restaurant', 'bar', 'mountain-view', 'balcony'],
        maxGuests: 3,
        rooms: 1,
        promotionOrder: 1,
      },
      // HOTEL 2
      {
        type: 'HOTEL',
        titleRo: 'Hotel Rodna',
        titleEn: 'Rodna Hotel',
        descriptionRo: 'Hotel modern cu spa si piscina interioara, la 2 minute de telegondola. Ideal pentru familii si grupuri organizate.',
        descriptionEn: 'Modern hotel with spa and indoor pool, 2 minutes from the gondola. Ideal for families and organized groups.',
        address: 'Strada Telecabinei 5, Borsa',
        latitude: 47.6532,
        longitude: 24.6685,
        pricePerNight: 350,
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        ],
        ownerId: gheorghe.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'spa', 'pool', 'restaurant', 'bar', 'mountain-view'],
        maxGuests: 4,
        rooms: 2,
      },
      // VILA
      {
        type: 'VILA',
        titleRo: 'Vila Alpina',
        titleEn: 'Alpine Villa',
        descriptionRo: 'Vila de lux din lemn la poalele Muntilor Rodnei. 4 dormitoare, jacuzzi, sauna, gratar si terasa panoramica. Ideala pentru grupuri.',
        descriptionEn: 'Luxury wooden villa at the foot of the Rodna Mountains. 4 bedrooms, jacuzzi, sauna, barbecue, and panoramic terrace. Ideal for groups.',
        address: 'Drumul Muntelui 12, Borsa',
        latitude: 47.6529,
        longitude: 24.6639,
        pricePerNight: 450,
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
        ],
        ownerId: ion.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'spa', 'bbq', 'mountain-view', 'fireplace', 'terrace'],
        maxGuests: 10,
        rooms: 4,
        promotionOrder: 2,
      },
      // PENSIUNE
      {
        type: 'PENSIUNE',
        titleRo: 'Pensiunea Floare de Colt',
        titleEn: 'Edelweiss Guesthouse',
        descriptionRo: 'Pensiune traditionala maramureseana cu 8 camere, situata la 5 minute de telecabina. Mic dejun traditional inclus.',
        descriptionEn: 'Traditional Maramures guesthouse with 8 rooms, located 5 minutes from the gondola. Traditional breakfast included.',
        address: 'Strada Libertatii 45, Borsa',
        latitude: 47.6535,
        longitude: 24.6645,
        pricePerNight: 180,
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        ],
        ownerId: maria.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'breakfast', 'garden', 'mountain-view'],
        maxGuests: 4,
        rooms: 2,
        promotionOrder: 3,
      },
      // PENSIUNE 2
      {
        type: 'PENSIUNE',
        titleRo: 'Pensiunea La Bunica',
        titleEn: 'At Grandma Guesthouse',
        descriptionRo: 'Pensiune calda si primitoare cu mancare traditionala maramureseana. Camerele sunt decorate in stil traditional cu tesaturi locale.',
        descriptionEn: 'Warm and welcoming guesthouse with traditional Maramures food. Rooms decorated in traditional style with local textiles.',
        address: 'Strada Cascadei 33, Borsa',
        latitude: 47.6525,
        longitude: 24.667,
        pricePerNight: 160,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        ],
        ownerId: elena.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'breakfast', 'traditional-style'],
        maxGuests: 3,
        rooms: 1,
      },
      // CABANA
      {
        type: 'CABANA',
        titleRo: 'Cabana Muntelui',
        titleEn: 'Mountain Cabin',
        descriptionRo: 'Cabana rustica pe malul paraului, la 10 minute de partia olimpica. Semineu, 2 dormitoare, bucatarie complet utilata.',
        descriptionEn: 'Rustic cabin by the stream, 10 minutes from the Olympic slope. Fireplace, 2 bedrooms, fully equipped kitchen.',
        address: 'Zona Partia Olimpica, Borsa',
        latitude: 47.6515,
        longitude: 24.67,
        pricePerNight: 220,
        images: [
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop',
        ],
        ownerId: vasile.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'fireplace', 'mountain-view', 'kitchen'],
        maxGuests: 6,
        rooms: 2,
      },
      // APARTAMENT
      {
        type: 'APARTAMENT',
        titleRo: 'Apartament Central Borsa',
        titleEn: 'Central Borsa Apartment',
        descriptionRo: 'Apartament modern cu 2 camere in centrul Borsei. Complet mobilat, internet rapid, aproape de magazine si restaurante.',
        descriptionEn: 'Modern 2-room apartment in the center of Borsa. Fully furnished, fast internet, close to shops and restaurants.',
        address: 'Strada Victoriei 22, Borsa',
        latitude: 47.6545,
        longitude: 24.665,
        pricePerNight: 150,
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        ],
        ownerId: ana.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'kitchen', 'air-conditioning'],
        maxGuests: 4,
        rooms: 2,
      },
      // CAMERA
      {
        type: 'CAMERA',
        titleRo: 'Camera de Oaspeti la Familie',
        titleEn: 'Family Guest Room',
        descriptionRo: 'Camera confortabila la o familie prietenoasa din Borsa. Baie proprie, mic dejun traditional optional, atmosfera autentica.',
        descriptionEn: 'Comfortable room with a friendly family in Borsa. Private bathroom, optional traditional breakfast, authentic atmosphere.',
        address: 'Strada Izvorului 8, Borsa',
        latitude: 47.655,
        longitude: 24.664,
        pricePerNight: 80,
        images: [
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
        ],
        ownerId: mihai.id,
        status: 'APPROVED',
        amenities: ['wifi', 'breakfast', 'garden'],
        maxGuests: 2,
        rooms: 1,
      },
      // CASA_VACANTA
      {
        type: 'CASA_VACANTA',
        titleRo: 'Casa Traditionala Maramureseana',
        titleEn: 'Traditional Maramures Vacation House',
        descriptionRo: 'Casa traditionala din lemn, restaurata cu grija. 3 dormitoare, curte mare cu livada, gratar, loc de joaca pentru copii.',
        descriptionEn: 'Traditional wooden house, carefully restored. 3 bedrooms, large yard with orchard, barbecue, playground for children.',
        address: 'Strada Mocanilor 15, Borsa',
        latitude: 47.656,
        longitude: 24.662,
        pricePerNight: 350,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&h=600&fit=crop',
        ],
        ownerId: gheorghe.id,
        status: 'APPROVED',
        amenities: ['wifi', 'parking', 'garden', 'bbq', 'playground', 'traditional-style'],
        maxGuests: 8,
        rooms: 3,
      },
      // CAMERA (PENDING)
      {
        type: 'CAMERA',
        titleRo: 'Camera cu Vedere la Munte',
        titleEn: 'Mountain View Room',
        descriptionRo: 'Camera luminoasa cu vedere panoramica la Muntii Rodnei. Mobilier din lemn natural, baie proprie.',
        descriptionEn: 'Bright room with panoramic view of the Rodna Mountains. Natural wood furniture, private bathroom.',
        address: 'Strada Panoramei 3, Borsa',
        latitude: 47.6555,
        longitude: 24.6635,
        pricePerNight: 100,
        images: [
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
        ],
        ownerId: mihai.id,
        status: 'PENDING',
        amenities: ['wifi', 'mountain-view'],
        maxGuests: 2,
        rooms: 1,
      },
    ],
  });

  // --- Services (20 — all ServiceCategory values) ---
  await prisma.service.createMany({
    data: [
      // ATV
      {
        category: 'ATV',
        titleRo: 'Inchiriere ATV Borsa Adventure',
        titleEn: 'Borsa Adventure ATV Rental',
        descriptionRo: 'Inchiriere ATV-uri pentru trasee montane in Borsa si imprejurimi. Ghid inclus, echipament de protectie furnizat. Trasee de 2-6 ore.',
        descriptionEn: 'ATV rental for mountain trails in Borsa and surroundings. Guide included, protective equipment provided. 2-6 hour trails.',
        phone: '+40741111222',
        address: 'Strada Muntelui 5, Borsa',
        priceInfo: 'De la 150 RON/ora',
        ownerId: ion.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&h=600&fit=crop',
        ],
        latitude: 47.653,
        longitude: 24.665,
        promotionOrder: 1,
      },
      // SNOWMOBILE
      {
        category: 'SNOWMOBILE',
        titleRo: 'Snowmobile Borsa Extreme',
        titleEn: 'Borsa Extreme Snowmobile',
        descriptionRo: 'Plimbari cu snowmobilul pe traseele montane din jurul Borsei. Disponibil in sezonul de iarna, noiembrie-aprilie.',
        descriptionEn: 'Snowmobile rides on mountain trails around Borsa. Available in winter season, November-April.',
        phone: '+40741222333',
        address: 'Zona Partia Olimpica, Borsa',
        priceInfo: 'De la 200 RON/ora',
        ownerId: maria.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1517783999520-f068d7431d60?w=800&h=600&fit=crop',
        ],
        latitude: 47.652,
        longitude: 24.671,
        promotionOrder: 2,
      },
      // HORSEBACK_RIDING
      {
        category: 'HORSEBACK_RIDING',
        titleRo: 'Calarie la Ferma Rodnei',
        titleEn: 'Horseback Riding at Rodnei Farm',
        descriptionRo: 'Plimbari calare prin padurile si pajistile din jurul Borsei. Lectii pentru incepatori si trasee ghidate pentru experimentati.',
        descriptionEn: 'Horse rides through forests and meadows around Borsa. Lessons for beginners and guided trails for experienced riders.',
        phone: '+40741333444',
        address: 'Drumul Rodnei, Borsa',
        priceInfo: 'De la 100 RON/ora',
        ownerId: gheorghe.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=600&fit=crop',
        ],
        latitude: 47.655,
        longitude: 24.66,
        promotionOrder: 3,
      },
      // HIKING
      {
        category: 'HIKING',
        titleRo: 'Ghid Montan Borsa Trek',
        titleEn: 'Borsa Trek Mountain Guide',
        descriptionRo: 'Drumetii ghidate in Muntii Rodnei: Cascada Cailor, Vf. Pietrosul, Pasul Prislop. Trasee de toate nivelurile de dificultate.',
        descriptionEn: 'Guided hikes in the Rodna Mountains: Horses Waterfall, Pietrosul Peak, Prislop Pass. Trails for all difficulty levels.',
        phone: '+40741444555',
        priceInfo: 'De la 200 RON/grup',
        ownerId: vasile.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=800&h=600&fit=crop',
        ],
        latitude: 47.6019,
        longitude: 24.8022,
      },
      // SKIING
      {
        category: 'SKIING',
        titleRo: 'Scoala de Schi Borsa',
        titleEn: 'Borsa Ski School',
        descriptionRo: 'Lectii de schi si snowboard pe Partia Olimpica. Instructori certificati, echipament de inchiriat disponibil.',
        descriptionEn: 'Ski and snowboard lessons on the Olympic Slope. Certified instructors, rental equipment available.',
        phone: '+40741555666',
        address: 'Partia Olimpica, Borsa',
        priceInfo: 'De la 150 RON/lectie',
        ownerId: ion.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop',
        ],
        latitude: 47.651,
        longitude: 24.672,
      },
      // BICYCLE_RENTAL
      {
        category: 'BICYCLE_RENTAL',
        titleRo: 'Bike Rental Borsa',
        titleEn: 'Borsa Bike Rental',
        descriptionRo: 'Inchiriere biciclete de munte si electrice. Trasee recomandate pe Valea Bistritei Aurii si spre Pasul Prislop.',
        descriptionEn: 'Mountain and electric bike rentals. Recommended trails along the Bistrita Aurii Valley and towards Prislop Pass.',
        phone: '+40741666111',
        address: 'Strada Principala 78, Borsa',
        priceInfo: 'De la 50 RON/zi',
        ownerId: elena.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.665,
      },
      // TAXI_LOCAL
      {
        category: 'TAXI_LOCAL',
        titleRo: 'Taxi Borsa Rapid',
        titleEn: 'Borsa Rapid Taxi',
        descriptionRo: 'Serviciu de taxi local in Borsa si transferuri la/de la aeroport Baia Mare. Masini confortabile, preturi fixe.',
        descriptionEn: 'Local taxi service in Borsa and transfers to/from Baia Mare airport. Comfortable cars, fixed prices.',
        phone: '+40741666333',
        address: 'Strada Garii 2, Borsa',
        priceInfo: 'De la 5 RON/km',
        ownerId: mihai.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.666,
      },
      // RENT_A_CAR
      {
        category: 'RENT_A_CAR',
        titleRo: 'AutoRent Borsa',
        titleEn: 'Borsa AutoRent',
        descriptionRo: 'Inchiriere autoturisme pentru excursii in Maramures. SUV-uri si berlini, km nelimitati, asigurare completa inclusa.',
        descriptionEn: 'Car rental for Maramures excursions. SUVs and sedans, unlimited km, full insurance included.',
        phone: '+40741666444',
        address: 'Strada Principala 120, Borsa',
        priceInfo: 'De la 150 RON/zi',
        ownerId: gheorghe.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
        ],
        latitude: 47.6545,
        longitude: 24.667,
      },
      // FOTOGRAF
      {
        category: 'FOTOGRAF',
        titleRo: 'Foto Studio Montania',
        titleEn: 'Montania Photo Studio',
        descriptionRo: 'Fotograf profesionist pentru sedinte foto in natura, nunti si evenimente. Sedinte in cele mai frumoase locatii din Borsa.',
        descriptionEn: 'Professional photographer for nature shoots, weddings and events. Sessions in the most beautiful locations in Borsa.',
        phone: '+40741666555',
        address: 'Strada Victoriei 10, Borsa',
        priceInfo: 'De la 300 RON/sedinta',
        ownerId: ana.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&h=600&fit=crop',
        ],
        latitude: 47.6548,
        longitude: 24.6648,
      },
      // INSTALATOR
      {
        category: 'INSTALATOR',
        titleRo: 'Instalatii Borsa - Vasile Plumber',
        titleEn: 'Borsa Plumbing - Vasile Plumber',
        descriptionRo: 'Servicii de instalatii sanitare si termice. Interventii rapide, reparatii si montaj. Disponibil si in weekend.',
        descriptionEn: 'Plumbing and heating services. Quick interventions, repairs and installation. Available on weekends.',
        phone: '+40741666666',
        address: 'Strada Mestecanisului 7, Borsa',
        priceInfo: 'De la 100 RON/interventie',
        ownerId: vasile.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
        ],
        latitude: 47.655,
        longitude: 24.663,
      },
      // ELECTRICIAN
      {
        category: 'ELECTRICIAN',
        titleRo: 'ElectroBorsa - Servicii Electrice',
        titleEn: 'ElectroBorsa - Electrical Services',
        descriptionRo: 'Electrician autorizat ANRE. Instalatii electrice, tablouri, reparatii, verificari. Urgente 24/7.',
        descriptionEn: 'ANRE certified electrician. Electrical installations, panels, repairs, inspections. 24/7 emergencies.',
        phone: '+40741666777',
        address: 'Strada Energiei 14, Borsa',
        priceInfo: 'De la 80 RON/ora',
        ownerId: mihai.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
        ],
        latitude: 47.6538,
        longitude: 24.6655,
      },
      // TRANSPORT_MARFA
      {
        category: 'TRANSPORT_MARFA',
        titleRo: 'Transport Marfa Maramures',
        titleEn: 'Maramures Freight Transport',
        descriptionRo: 'Transport marfa si mutari in Borsa si Maramures. Camion cu prelata, manipulanti disponibili la cerere.',
        descriptionEn: 'Freight transport and moving in Borsa and Maramures. Tarpaulin truck, handlers available on request.',
        phone: '+40741666888',
        address: 'Zona Industriala, Borsa',
        priceInfo: 'De la 200 RON/cursa',
        ownerId: gheorghe.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop',
        ],
        latitude: 47.656,
        longitude: 24.661,
      },
      // DESZAPEZIRE
      {
        category: 'DESZAPEZIRE',
        titleRo: 'Deszapezire Borsa Snow Clear',
        titleEn: 'Borsa Snow Clear Service',
        descriptionRo: 'Servicii de deszapezire pentru curti, parcari si drumuri de acces. Disponibil non-stop in sezonul de iarna.',
        descriptionEn: 'Snow clearing services for yards, parking lots and access roads. Available non-stop during winter season.',
        phone: '+40741666999',
        address: 'Strada Muntelui 30, Borsa',
        priceInfo: 'De la 150 RON/interventie',
        ownerId: vasile.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&h=600&fit=crop',
        ],
        latitude: 47.6525,
        longitude: 24.669,
      },
      // MASAJ
      {
        category: 'MASAJ',
        titleRo: 'Masaj Terapeutic & Relaxare',
        titleEn: 'Therapeutic & Relaxation Massage',
        descriptionRo: 'Masaj terapeutic, de relaxare si sportiv. Terapeut certificat cu 10 ani experienta. Deplasare la hotel/pensiune.',
        descriptionEn: 'Therapeutic, relaxation and sports massage. Certified therapist with 10 years experience. Travel to hotel/guesthouse.',
        phone: '+40741777111',
        address: 'Strada Sanatatii 5, Borsa',
        priceInfo: 'De la 120 RON/sedinta',
        ownerId: elena.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
        ],
        latitude: 47.6542,
        longitude: 24.6645,
      },
      // INSTRUCTOR_FITNESS
      {
        category: 'INSTRUCTOR_FITNESS',
        titleRo: 'FitBorsa - Antrenor Personal',
        titleEn: 'FitBorsa - Personal Trainer',
        descriptionRo: 'Antrenor personal certificat. Antrenamente in aer liber, yoga de munte, fitness si recuperare sportiva.',
        descriptionEn: 'Certified personal trainer. Outdoor training, mountain yoga, fitness and sports recovery.',
        phone: '+40741777222',
        address: 'Parcul Central, Borsa',
        priceInfo: 'De la 80 RON/sedinta',
        ownerId: ana.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.6658,
      },
      // DJ
      {
        category: 'DJ',
        titleRo: 'DJ Events Maramures',
        titleEn: 'DJ Events Maramures',
        descriptionRo: 'DJ profesionist pentru nunti, botezuri, petreceri private si corporate. Echipament audio-video complet.',
        descriptionEn: 'Professional DJ for weddings, christenings, private and corporate parties. Complete audio-video equipment.',
        phone: '+40741777333',
        address: 'Borsa, Maramures',
        priceInfo: 'De la 800 RON/eveniment',
        ownerId: mihai.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.666,
      },
      // MUZICA_LIVE
      {
        category: 'MUZICA_LIVE',
        titleRo: 'Taraful Maramuresean',
        titleEn: 'Maramures Folk Band',
        descriptionRo: 'Formatie de muzica populara maramureseana pentru nunti, botezuri si evenimente traditionale. Repertoriu autentic.',
        descriptionEn: 'Traditional Maramures folk band for weddings, christenings and traditional events. Authentic repertoire.',
        phone: '+40741777444',
        address: 'Borsa, Maramures',
        priceInfo: 'De la 1500 RON/eveniment',
        ownerId: ion.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.666,
      },
      // CATERING
      {
        category: 'CATERING',
        titleRo: 'Catering Casa Borsanului',
        titleEn: 'Borsa House Catering',
        descriptionRo: 'Servicii de catering pentru evenimente, cu specific traditional maramuresean. De la 20 la 500 persoane.',
        descriptionEn: 'Catering services for events, with traditional Maramures specialties. From 20 to 500 guests.',
        phone: '+40741777555',
        address: 'Strada Principala 88, Borsa',
        priceInfo: 'De la 80 RON/persoana',
        ownerId: maria.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.666,
      },
      // OTHER
      {
        category: 'OTHER',
        titleRo: 'Ghid Turistic Local Borsa',
        titleEn: 'Borsa Local Tourist Guide',
        descriptionRo: 'Ghid turistic autorizat, vorbitor de romana, engleza si germana. Tururi personalizate in Borsa si Maramures.',
        descriptionEn: 'Licensed tourist guide, Romanian, English and German speaker. Personalized tours in Borsa and Maramures.',
        phone: '+40741777666',
        address: 'Centrul Civic, Borsa',
        priceInfo: 'De la 250 RON/tur',
        ownerId: elena.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.666,
      },
    ],
  });

  // --- Restaurants (9 — covering all PriceRange values) ---
  await prisma.restaurant.createMany({
    data: [
      // BUDGET
      {
        titleRo: 'Pizzeria Muntele',
        titleEn: 'Mountain Pizzeria',
        descriptionRo: 'Pizza artizanala cu ingrediente proaspete, paste si salate. Livrare la domiciliu disponibila in Borsa.',
        descriptionEn: 'Artisan pizza with fresh ingredients, pasta, and salads. Home delivery available in Borsa.',
        cuisineRo: 'Italiana / Pizza',
        cuisineEn: 'Italian / Pizza',
        phone: '+40741777888',
        address: 'Strada Victoriei 18, Borsa',
        priceRange: 'BUDGET',
        openingHours: 'Lun-Dum: 11:00-23:00',
        ownerId: ion.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
        ],
        latitude: 47.6548,
        longitude: 24.6645,
        promotionOrder: 2,
      },
      {
        titleRo: 'Fast Food Borsa Central',
        titleEn: 'Borsa Central Fast Food',
        descriptionRo: 'Shaorma, burgeri si meniuri rapide. Ingrediente proaspete, portii generoase, preturi pentru buzunarul studentului.',
        descriptionEn: 'Shawarma, burgers and quick meals. Fresh ingredients, generous portions, student-friendly prices.',
        cuisineRo: 'Fast food',
        cuisineEn: 'Fast food',
        phone: '+40741888111',
        address: 'Strada Garii 10, Borsa',
        priceRange: 'BUDGET',
        openingHours: 'Lun-Dum: 09:00-24:00',
        ownerId: mihai.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        ],
        latitude: 47.6552,
        longitude: 24.666,
      },
      {
        titleRo: 'Covrigaria La Munte',
        titleEn: 'Mountain Bakery',
        descriptionRo: 'Covrigarie si patiserie artizanala. Covrigi calzi, placinte cu branza, strudel cu mere, cafea proaspata. Ideal pentru mic dejun.',
        descriptionEn: 'Artisan bakery. Warm pretzels, cheese pies, apple strudel, fresh coffee. Ideal for breakfast.',
        cuisineRo: 'Patiserie / Cafenea',
        cuisineEn: 'Bakery / Coffee',
        phone: '+40741888222',
        address: 'Strada Principala 62, Borsa',
        priceRange: 'BUDGET',
        openingHours: 'Lun-Sam: 06:00-18:00',
        ownerId: elena.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
        ],
        latitude: 47.6535,
        longitude: 24.665,
      },
      // MODERATE
      {
        titleRo: 'Restaurant La Calin',
        titleEn: 'La Calin Restaurant',
        descriptionRo: 'Restaurant traditional maramuresean cu specific local. Sarmale, bulz, ciorba de burta, placinte din ingrediente proaspete, locale.',
        descriptionEn: 'Traditional Maramures restaurant with local specialties. Stuffed cabbage, polenta with cheese, tripe soup from fresh, local ingredients.',
        cuisineRo: 'Traditionala maramureseana',
        cuisineEn: 'Traditional Maramures',
        phone: '+40741666777',
        address: 'Strada Principala 55, Borsa',
        priceRange: 'MODERATE',
        openingHours: 'Lun-Dum: 10:00-22:00',
        ownerId: maria.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        ],
        latitude: 47.654,
        longitude: 24.6655,
        promotionOrder: 1,
      },
      {
        titleRo: 'Terasa Cascada',
        titleEn: 'Waterfall Terrace',
        descriptionRo: 'Restaurant cu terasa si vedere la munti. Meniu variat: gratare, friptura, peste de pastrav, deserturi de casa.',
        descriptionEn: 'Restaurant with terrace and mountain views. Varied menu: grills, steaks, trout, homemade desserts.',
        cuisineRo: 'Romaneasca / Internationala',
        cuisineEn: 'Romanian / International',
        phone: '+40741888999',
        address: 'Drumul spre Cascada 2, Borsa',
        priceRange: 'MODERATE',
        openingHours: 'Lun-Dum: 09:00-22:00',
        ownerId: gheorghe.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&h=600&fit=crop',
        ],
        latitude: 47.6525,
        longitude: 24.668,
        promotionOrder: 3,
      },
      {
        titleRo: 'Gratar la Borsean',
        titleEn: 'Borsa Grill House',
        descriptionRo: 'Specialitati la gratar: mici, ceafa, coaste, carnaciori. Bere artizanala locala si muzica populara vineri-duminica.',
        descriptionEn: 'Grilled specialties: mici, pork neck, ribs, sausages. Local craft beer and folk music Friday-Sunday.',
        cuisineRo: 'Gratar / Romaneasca',
        cuisineEn: 'Grill / Romanian',
        phone: '+40741888333',
        address: 'Strada Parcului 4, Borsa',
        priceRange: 'MODERATE',
        openingHours: 'Mar-Dum: 12:00-23:00',
        ownerId: vasile.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop',
        ],
        latitude: 47.6538,
        longitude: 24.6642,
      },
      // PREMIUM
      {
        titleRo: 'Restaurant Regal',
        titleEn: 'Regal Restaurant',
        descriptionRo: 'Restaurant premium cu bucatarie rafinata. Meniu de degustare, vinuri selecte, atmosfera eleganta. Ideal pentru ocazii speciale.',
        descriptionEn: 'Premium restaurant with refined cuisine. Tasting menu, selected wines, elegant atmosphere. Ideal for special occasions.',
        cuisineRo: 'Fine dining',
        cuisineEn: 'Fine dining',
        phone: '+40741999000',
        address: 'Hotel Paltinis, Borsa',
        priceRange: 'PREMIUM',
        openingHours: 'Mar-Dum: 18:00-23:00',
        ownerId: ion.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        ],
        latitude: 47.6542,
        longitude: 24.6662,
      },
      {
        titleRo: 'Casa Veche Wine & Dine',
        titleEn: 'Old House Wine & Dine',
        descriptionRo: 'Restaurant boutique intr-o casa traditionala restaurata. Meniu sezonier cu ingrediente locale, selectie de vinuri romanesti premium.',
        descriptionEn: 'Boutique restaurant in a restored traditional house. Seasonal menu with local ingredients, premium Romanian wine selection.',
        cuisineRo: 'Gastronomie romaneasca moderna',
        cuisineEn: 'Modern Romanian gastronomy',
        phone: '+40741888444',
        address: 'Strada Veche 20, Borsa',
        priceRange: 'PREMIUM',
        openingHours: 'Mie-Dum: 17:00-23:00',
        ownerId: ana.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        ],
        latitude: 47.6544,
        longitude: 24.6638,
      },
      {
        titleRo: 'Pastravaria Valea Rodnei',
        titleEn: 'Rodna Valley Trout House',
        descriptionRo: 'Restaurant specializat in preparate din pastrav proaspat din crescatoriile locale. Terasa pe malul paraului, atmosfera rustică.',
        descriptionEn: 'Restaurant specializing in fresh trout dishes from local fish farms. Riverside terrace, rustic atmosphere.',
        cuisineRo: 'Peste / Romaneasca',
        cuisineEn: 'Fish / Romanian',
        phone: '+40741888555',
        address: 'Valea Rodnei, Borsa',
        priceRange: 'MODERATE',
        openingHours: 'Lun-Dum: 10:00-21:00',
        ownerId: vasile.id,
        status: 'APPROVED',
        images: [
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        ],
        latitude: 47.6518,
        longitude: 24.669,
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('Created: 8 users, 14 attractions, 10 properties, 20 services, 9 restaurants');
  console.log('All 7 property types covered: HOTEL, VILA, PENSIUNE, CABANA, APARTAMENT, CAMERA, CASA_VACANTA');
  console.log('All 20 service categories covered');
  console.log('All 3 price ranges covered: BUDGET, MODERATE, PREMIUM');
  console.log('Admin: admin@visitborsa.ro');
  console.log(
    'Clients: ion/maria/gheorghe/elena/vasile/ana/mihai @example.com',
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

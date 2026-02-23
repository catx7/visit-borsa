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

  console.log('Production seed completed successfully!');
  console.log('Created: 1 admin user, 14 tourist attractions');
  console.log('Admin: admin@visitborsa.ro / V1s1tB0rs@2025!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

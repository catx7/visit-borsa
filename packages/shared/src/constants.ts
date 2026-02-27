export const PROPERTY_TYPE_LABELS = {
  ro: {
    HOTEL: 'Hotel',
    VILA: 'Vilă',
    PENSIUNE: 'Pensiune',
    CABANA: 'Cabană',
    APARTAMENT: 'Apartament',
    CAMERA: 'Cameră',
    CASA_VACANTA: 'Casă de vacanță',
  },
  en: {
    HOTEL: 'Hotel',
    VILA: 'Villa',
    PENSIUNE: 'Guesthouse',
    CABANA: 'Cabin',
    APARTAMENT: 'Apartment',
    CAMERA: 'Room',
    CASA_VACANTA: 'Vacation House',
  },
} as const;

export const PROPERTY_STATUS_LABELS = {
  ro: {
    DRAFT: 'Ciornă',
    PENDING: 'În așteptare',
    APPROVED: 'Aprobat',
  },
  en: {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    APPROVED: 'Approved',
  },
} as const;

export const SERVICE_CATEGORY_LABELS = {
  ro: {
    ATV: 'Închiriere ATV',
    SNOWMOBILE: 'Snowmobile',
    HORSEBACK_RIDING: 'Călărie',
    HIKING: 'Drumeții',
    SKIING: 'Schi',
    BICYCLE_RENTAL: 'Închiriere biciclete',
    OTHER: 'Altele',
  },
  en: {
    ATV: 'ATV Rental',
    SNOWMOBILE: 'Snowmobile',
    HORSEBACK_RIDING: 'Horseback Riding',
    HIKING: 'Hiking',
    SKIING: 'Skiing',
    BICYCLE_RENTAL: 'Bicycle Rental',
    OTHER: 'Other',
  },
} as const;

export const PRICE_RANGE_LABELS = {
  ro: {
    BUDGET: 'Economic',
    MODERATE: 'Moderat',
    PREMIUM: 'Premium',
  },
  en: {
    BUDGET: 'Budget',
    MODERATE: 'Moderate',
    PREMIUM: 'Premium',
  },
} as const;

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_IMAGES_PER_PROPERTY = 10;
export const MAX_IMAGE_SIZE_MB = 5;

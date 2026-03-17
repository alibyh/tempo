export interface RussianAddress {
  id: string;
  label: string;
  coords: [number, number]; // [latitude, longitude]
}

export const RUSSIAN_ADDRESSES: RussianAddress[] = [
  { id: "moscow-red-square", label: "Красная площадь, Москва", coords: [55.7539, 37.6208] },
  { id: "moscow-kremlin", label: "Московский Кремль, Москва", coords: [55.752, 37.6175] },
  { id: "spb-palace", label: "Дворцовая площадь, Санкт-Петербург", coords: [59.9386, 30.3141] },
  { id: "spb-neva", label: "Невский проспект, Санкт-Петербург", coords: [59.9343, 30.3351] },
  { id: "kazan-kremlin", label: "Казанский Кремль, Казань", coords: [55.7964, 49.1089] },
  { id: "sochi-park", label: "Олимпийский парк, Сочи", coords: [43.4028, 39.9581] },
  { id: "yekaterinburg", label: "Плотинка, Екатеринбург", coords: [56.8389, 60.6057] },
  { id: "novosibirsk", label: "Площадь Ленина, Новосибирск", coords: [55.0302, 82.9204] },
  { id: "nizhny", label: "Чкаловская лестница, Нижний Новгород", coords: [56.3287, 44.002] },
  { id: "samara", label: "Набережная Волги, Самара", coords: [53.1959, 50.1002] },
  { id: "volgograd", label: "Мамаев курган, Волгоград", coords: [48.7425, 44.5371] },
  { id: "rostov", label: "Театральная площадь, Ростов-на-Дону", coords: [47.2313, 39.7233] },
  { id: "ufa", label: "Памятник Салавату Юлаеву, Уфа", coords: [54.7205, 55.9306] },
  { id: "krasnodar", label: "Театральная площадь, Краснодар", coords: [45.0239, 38.9702] },
  { id: "voronezh", label: "Площадь Победы, Воронеж", coords: [51.6605, 39.2005] },
];

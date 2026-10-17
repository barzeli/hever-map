import { toXML, type XmlElement } from "jstoxml";

interface FoodPlace {
  img: string;
  name: string;
  desc: string;
  area: string;
  city: string;
  address: string;
  phone: string;
  category: string;
  type: string;
  hours: string;
  kosher: string;
  handicap: string;
  website: string;
  delivery: string;
  internal_link: string;
  is_new: string;
  search_words: string;
  latitude: string;
  longitude: string;
}

interface GiftPlace {
  name: string;
  region: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

type APIFoodResponse = {
  branch: FoodPlace[];
};

type APIGiftResponse = Record<string, GiftPlace[]>;

const foodResponse = (await (
  await fetch("https://www.hvr.co.il/bs2/datasets/teamimcard_branches.json")
).json()) as APIFoodResponse;

const giftResponse = (await (
  await fetch("https://www.hvr.co.il/bs2/datasets/giftcard_branches.json")
).json()) as APIGiftResponse;

const kmlObject: XmlElement = {
  kml: {
    _attrs: {
      xmlns: "http://www.opengis.net/kml/2.2",
    },
    Document: [
      { name: "כרטיסי חבר" },
      {
        Folder: [
          { name: "חבר של קבע" },
          ...Object.entries(giftResponse)
            .flatMap(([businessName, places]) =>
              places.map((place) => ({ ...place, businessName })),
            )
            .map((place) => ({
              Placemark: {
                name: place.businessName,
                description: `${place.address}`,
                Style: {
                  IconStyle: {
                    color: "ff3bb5fc",
                    Icon: {
                      href: "https://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png",
                    },
                  },
                },
                Point: {
                  coordinates: `${place.longitude},${place.latitude},0`,
                },
              },
            })),
        ],
      },
      {
        Folder: [
          { name: "חבר טעמים" },
          ...foodResponse.branch.map((place) => ({
            Placemark: {
              name: place.name,
              description: `${place.desc}\n${place.category} - ${place.type}\n${place.hours}\n${place.address}, ${place.city}`,
              Style: {
                IconStyle: {
                  color: "ff6a3a00",
                  Icon: {
                    href: "https://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png",
                  },
                },
              },
              Point: {
                coordinates: `${place.longitude},${place.latitude},0`,
              },
            },
          })),
        ],
      },
    ],
  },
};

const xml = toXML(kmlObject, { header: true, indent: "  " });
await Bun.write("./places.kml", xml);

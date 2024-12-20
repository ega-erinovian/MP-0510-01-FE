type CityType = {
  id: number;
  name: string;
  countryId: number;
  country: {
    id: number;
    name: string;
  };
};

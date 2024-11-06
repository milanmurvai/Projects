// import React, {useEffect, useState} from "react";
// import {AsyncPaginate} from "react-select-async-paginate";
// import {CityService} from "@/apis/city/CityService.tsx";
// import {City} from "@/utils/types.tsx";
// import {StylesConfig} from "react-select";
//
// interface SearchProps {
//     onSelect: (selectedOption: City) => void;
//     selectedCity: City|null;
// }
//
// interface CityOption {
//     value: string;
//     label: string;
//     latitude: number;
//     longitude: number;
//     name: string;
//     country: string;
// }
//
// const Search: React.FC<SearchProps> = ({onSelect, selectedCity}) => {
//     const [search, setSearch] = useState<CityOption | null>(null);
//
//     const loadOptions = async (inputValue: string) => {
//         try {
//             const data = await CityService.getCity(inputValue);
//             const uniqueCities = new Map(); // Create a Map to track uniqueness
//
//             data.forEach((city: City) => {
//                 // Use a combination of name and country as the key for uniqueness
//                 const uniqueKey = `${city.name}-${city.country}`;
//                 if (!uniqueCities.has(uniqueKey)) {
//                     uniqueCities.set(uniqueKey, {
//                         value: `${city.latitude} ${city.longitude}`,
//                         label: `${city.name}, ${city.country}`,
//                         latitude: city.latitude,
//                         longitude: city.longitude,
//                         name: city.name,
//                         country: city.country
//                     });
//                 }
//             });
//
//             // Convert the unique map values back into an array for react-select
//             return {
//                 options: Array.from(uniqueCities.values())
//             };
//         } catch (error) {
//             console.error("Error fetching cities:", error);
//             return {options: []};
//         }
//     };
//
//     useEffect(() => {
//         if (selectedCity) {
//             setSearch({
//                 value: `${selectedCity.latitude} ${selectedCity.longitude}`,
//                 label: `${selectedCity.name}, ${selectedCity.country}`,
//                 ...selectedCity
//             });
//         } else {
//             setSearch(null);
//         }
//     }, [selectedCity]);
//
//
//     const handleOnChange = async (selectedOption: CityOption | null) => {
//         if (selectedOption) {
//             setSearch(selectedOption);
//             onSelect({
//                 latitude: selectedOption.latitude,
//                 longitude: selectedOption.longitude,
//                 name: selectedOption.name,
//                 country: selectedOption.country
//             });
//         }
//     };
//
//     const customStyles: StylesConfig<CityOption, false> = {
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: 'lightgrey',
//             backgroundOpacity: '0.9',
//             borderColor: '#3cacae',
//             // borderRadius: '50px',
//             borderWidth: '2px',
//             padding: '5px',
//             width: '800px',
//             margin: 'auto',
//             opacity: '0.8',
//         }),
//     };
//
//     return (
//         <AsyncPaginate
//             placeholder="Search for city"
//             debounceTimeout={600}
//             value={search}
//             onChange={handleOnChange}
//             loadOptions={loadOptions}
//             styles={customStyles}
//         />
//     );
// };
//
// export default Search;
//
